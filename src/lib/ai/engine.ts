import { writeAuditEvent } from "@/lib/audit/audit";
import { getAiProvider } from "@/lib/ai/provider";
import { detectPromptInjection, estimateCostMinor, retrieveContext, type SearchableAiIndex } from "@/lib/ai/rag";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

export type AiCapabilitySlug =
  | "ai_tutor"
  | "study_assistant"
  | "course_creator"
  | "quiz_generator"
  | "assignment_assistant"
  | "rubric_assistant"
  | "feedback_assistant"
  | "semantic_search"
  | "recommendations"
  | "translation"
  | "accessibility_assistant"
  | "enterprise_insights"
  | "instructor_assistant";

export type RunAiCapabilityInput = {
  userId: string;
  capability: AiCapabilitySlug;
  prompt: string;
  workspaceId?: string | null;
  academyId?: string | null;
  organizationId?: string | null;
  courseId?: string | null;
  enrollmentId?: string | null;
  conversationId?: string | null;
  language?: string;
  childSafetyMode?: boolean;
  responseFormat?: "text" | "json";
};

export type RunAiCapabilityResult = {
  ok: boolean;
  blocked?: boolean;
  requestId?: string;
  responseId?: string;
  conversationId?: string;
  content: string;
  citations: Array<{ indexId: string; title: string; score: number }>;
  safetyDecision: string;
};

export function buildCapabilityPrompt(input: Pick<RunAiCapabilityInput, "capability" | "prompt" | "language" | "childSafetyMode">) {
  return [
    `Capability: ${input.capability}`,
    `Language: ${input.language ?? "en"}`,
    input.childSafetyMode ? "Child-safety mode: enabled. Keep wording age-appropriate and restrict unsafe communication guidance." : "Child-safety mode: standard.",
    "User request:",
    input.prompt,
  ].join("\n");
}

async function loadAuthorizedIndexes(input: RunAiCapabilityInput): Promise<SearchableAiIndex[]> {
  const supabase = createServiceSupabaseClient();
  let query = supabase.from("ai_indexes").select("id,title,body,visibility,metadata").eq("status", "active").limit(50);
  if (input.organizationId) query = query.eq("organization_id", input.organizationId);
  else if (input.academyId) query = query.eq("academy_id", input.academyId);
  else if (input.workspaceId) query = query.eq("workspace_id", input.workspaceId);
  else query = query.eq("visibility", "public");
  const { data } = await query;
  return (data ?? []) as SearchableAiIndex[];
}

export async function runAiCapability(input: RunAiCapabilityInput): Promise<RunAiCapabilityResult> {
  const provider = getAiProvider();
  const supabase = createServiceSupabaseClient();
  const startedAt = Date.now();
  const injection = detectPromptInjection(input.prompt);
  const preModeration = await provider.moderate(input.prompt);
  const blocked = injection.detected || preModeration.decision === "block";

  const { data: capability } = await supabase.from("ai_capabilities").select("id,requires_citations,risk_level").eq("slug", input.capability).maybeSingle();
  const { data: model } = await supabase.from("ai_models").select("id,cost_per_1k_input_minor,cost_per_1k_output_minor").eq("slug", provider.modelSlug).maybeSingle();
  const { data: conversation } = input.conversationId
    ? await supabase.from("ai_conversations").select("id").eq("id", input.conversationId).maybeSingle()
    : await supabase
        .from("ai_conversations")
        .insert({
          user_id: input.userId,
          workspace_id: input.workspaceId,
          academy_id: input.academyId,
          organization_id: input.organizationId,
          course_id: input.courseId,
          enrollment_id: input.enrollmentId,
          capability_id: capability?.id,
          title: input.prompt.slice(0, 90) || "AI conversation",
          language: input.language ?? "en",
          child_safety_mode: input.childSafetyMode ?? false,
        })
        .select("id")
        .single();

  const { data: request } = await supabase
    .from("ai_requests")
    .insert({
      user_id: input.userId,
      workspace_id: input.workspaceId,
      academy_id: input.academyId,
      organization_id: input.organizationId,
      conversation_id: conversation?.id,
      capability_id: capability?.id,
      model_id: model?.id,
      request_type: input.capability,
      input_summary: input.prompt.slice(0, 500),
      safety_status: blocked ? "blocked" : preModeration.decision === "review" ? "review_required" : "passed",
      status: blocked ? "blocked" : "running",
      metadata: { provider: provider.provider, injection },
    })
    .select("id")
    .single();

  if (conversation?.id) {
    await supabase.from("ai_conversation_messages").insert({
      conversation_id: conversation.id,
      sender_type: "user",
      sender_id: input.userId,
      content: input.prompt,
      safety_labels: { preModeration, injection },
    });
  }

  await supabase.from("ai_moderation_events").insert({
    request_id: request?.id,
    user_id: input.userId,
    subject_type: "prompt",
    event_type: "pre_prompt",
    risk_level: injection.detected ? "high" : preModeration.riskLevel,
    categories: injection.detected ? injection.matches : preModeration.categories,
    decision: blocked ? "block" : preModeration.decision,
    notes: preModeration.notes,
  });

  if (blocked || !request?.id) {
    await writeAuditEvent({ actorId: input.userId, action: "ai_request_blocked", resourceType: "ai_request", resourceId: request?.id, workspaceId: input.workspaceId, success: false });
    return { ok: false, blocked: true, requestId: request?.id, conversationId: conversation?.id, content: "This request was blocked because it appears unsafe or attempts to override platform safeguards.", citations: [], safetyDecision: "block" };
  }

  const indexes = await loadAuthorizedIndexes(input);
  const retrievalHits = retrieveContext(input.prompt, indexes, 5);
  const generation = await provider.generate({
    system: "You are Solco Intelligence for Solva Academy. Use only authorized context. Provide safe, practical help and mark drafts for review.",
    prompt: buildCapabilityPrompt(input),
    context: retrievalHits.map((hit) => `${hit.title}: ${hit.excerpt}`),
    responseFormat: input.responseFormat,
  });
  const postModeration = await provider.moderate(generation.content);
  const safetyLabels = { preModeration, postModeration, injection };

  const { data: response } = await supabase
    .from("ai_responses")
    .insert({
      request_id: request.id,
      response_type: input.responseFormat ?? "text",
      content: generation.content,
      structured_output: generation.structured ?? {},
      citations: retrievalHits.map((hit) => ({ indexId: hit.indexId, title: hit.title, score: hit.score })),
      safety_labels: safetyLabels,
      quality_flags: { requiresHumanReview: capability?.risk_level === "high" || capability?.risk_level === "critical" },
    })
    .select("id")
    .single();

  if (conversation?.id) {
    await supabase.from("ai_conversation_messages").insert({
      conversation_id: conversation.id,
      sender_type: "assistant",
      content: generation.content,
      citations: retrievalHits.map((hit) => ({ indexId: hit.indexId, title: hit.title, score: hit.score })),
      safety_labels: safetyLabels,
    });
  }

  const postWrites = [
    supabase.from("ai_usage").insert({
      request_id: request.id,
      user_id: input.userId,
      workspace_id: input.workspaceId,
      organization_id: input.organizationId,
      model_id: model?.id,
      input_tokens: generation.inputTokens,
      output_tokens: generation.outputTokens,
      total_tokens: generation.inputTokens + generation.outputTokens,
      billable_units: generation.inputTokens + generation.outputTokens,
    }),
    supabase.from("ai_costs").insert({
      request_id: request.id,
      workspace_id: input.workspaceId,
      organization_id: input.organizationId,
      estimated_cost_minor: estimateCostMinor(generation.inputTokens, generation.outputTokens, Number(model?.cost_per_1k_input_minor ?? 0), Number(model?.cost_per_1k_output_minor ?? 0)),
    }),
    supabase.from("ai_moderation_events").insert({
      request_id: request.id,
      user_id: input.userId,
      subject_type: "response",
      subject_id: response?.id,
      event_type: "post_response",
      risk_level: postModeration.riskLevel,
      categories: postModeration.categories,
      decision: postModeration.decision,
      notes: postModeration.notes,
    }),
    supabase.from("ai_requests").update({ status: "completed", latency_ms: Date.now() - startedAt, completed_at: new Date().toISOString() }).eq("id", request.id),
  ];
  if (retrievalHits.length) {
    postWrites.push(supabase.from("ai_retrieval_hits").insert(retrievalHits.map((hit) => ({ request_id: request.id, index_id: hit.indexId, score: hit.score, reason: hit.reason }))));
  }
  await Promise.all(postWrites);

  return {
    ok: true,
    requestId: request.id,
    responseId: response?.id,
    conversationId: conversation?.id,
    content: generation.content,
    citations: retrievalHits.map((hit) => ({ indexId: hit.indexId, title: hit.title, score: hit.score })),
    safetyDecision: postModeration.decision,
  };
}
