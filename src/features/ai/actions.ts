"use server";

import { redirect } from "next/navigation";
import { runAiCapability, type AiCapabilitySlug } from "@/lib/ai/engine";
import { writeAuditEvent } from "@/lib/audit/audit";
import { requireUser } from "@/lib/authorization/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  accessibilityAssistSchema,
  aiIndexSchema,
  aiTutorSchema,
  assessmentDraftSchema,
  courseCreatorSchema,
  enterpriseInsightSchema,
  feedbackDraftSchema,
  semanticSearchSchema,
  translationSchema,
} from "@/lib/validation/ai";

function cleanOptional(value?: string | null) {
  return value || null;
}

async function runFromForm(formData: FormData, capability: AiCapabilitySlug, prompt: string, options?: { redirectTo?: string; workspaceId?: string | null; academyId?: string | null; organizationId?: string | null; courseId?: string | null; enrollmentId?: string | null; language?: string; childSafetyMode?: boolean; responseFormat?: "text" | "json" }) {
  const user = await requireUser();
  const result = await runAiCapability({
    userId: user.id,
    capability,
    prompt,
    workspaceId: options?.workspaceId ?? cleanOptional(String(formData.get("workspaceId") ?? "")),
    academyId: options?.academyId ?? cleanOptional(String(formData.get("academyId") ?? "")),
    organizationId: options?.organizationId ?? cleanOptional(String(formData.get("organizationId") ?? "")),
    courseId: options?.courseId ?? cleanOptional(String(formData.get("courseId") ?? "")),
    enrollmentId: options?.enrollmentId ?? cleanOptional(String(formData.get("enrollmentId") ?? "")),
    language: options?.language ?? String(formData.get("language") || "en"),
    childSafetyMode: options?.childSafetyMode,
    responseFormat: options?.responseFormat,
  });
  redirect(`${options?.redirectTo ?? "/ai"}?request=${result.requestId ?? "blocked"}&generated=${result.ok ? "true" : "blocked"}`);
}

export async function askAiTutorAction(formData: FormData) {
  const parsed = aiTutorSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/ai/tutor?error=validation");
  await runFromForm(formData, "ai_tutor", parsed.data.question, {
    redirectTo: "/ai/tutor",
    workspaceId: cleanOptional(parsed.data.workspaceId),
    academyId: cleanOptional(parsed.data.academyId),
    organizationId: cleanOptional(parsed.data.organizationId),
    courseId: cleanOptional(parsed.data.courseId),
    enrollmentId: cleanOptional(parsed.data.enrollmentId),
    language: parsed.data.language,
    childSafetyMode: parsed.data.childSafetyMode,
  });
}

export async function createCourseDraftAction(formData: FormData) {
  const parsed = courseCreatorSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/instructor/ai/course-creator?error=validation");
  await runFromForm(formData, "course_creator", `Create a course draft for ${parsed.data.topic}. Audience: ${parsed.data.audience}. Level: ${parsed.data.level}. Outcomes: ${parsed.data.learningOutcomes ?? "not supplied"}. Constraints: ${parsed.data.constraints ?? "none"}.`, {
    redirectTo: "/instructor/ai/course-creator",
    responseFormat: "json",
    workspaceId: cleanOptional(parsed.data.workspaceId),
    academyId: cleanOptional(parsed.data.academyId),
    courseId: cleanOptional(parsed.data.courseId),
    language: parsed.data.language,
  });
}

export async function createAssessmentDraftAction(formData: FormData) {
  const parsed = assessmentDraftSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/instructor/ai/assessments?error=validation");
  const capability = parsed.data.assessmentType === "quiz" ? "quiz_generator" : parsed.data.assessmentType === "assignment" ? "assignment_assistant" : "rubric_assistant";
  await runFromForm(formData, capability, `Draft a ${parsed.data.assessmentType} for ${parsed.data.topic}. Outcomes: ${parsed.data.outcomes}. Difficulty: ${parsed.data.difficulty}. Items: ${parsed.data.itemCount}.`, {
    redirectTo: "/instructor/ai/assessments",
    responseFormat: "json",
    workspaceId: cleanOptional(parsed.data.workspaceId),
    academyId: cleanOptional(parsed.data.academyId),
    courseId: cleanOptional(parsed.data.courseId),
    language: parsed.data.language,
  });
}

export async function draftFeedbackAction(formData: FormData) {
  const parsed = feedbackDraftSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/instructor/ai/feedback?error=validation");
  await runFromForm(formData, "feedback_assistant", `Draft ${parsed.data.tone} feedback for this learner work. Rubric: ${parsed.data.rubric ?? "none supplied"}\n\nLearner work:\n${parsed.data.learnerWork}`, {
    redirectTo: "/instructor/ai/feedback",
    workspaceId: cleanOptional(parsed.data.workspaceId),
    academyId: cleanOptional(parsed.data.academyId),
    courseId: cleanOptional(parsed.data.courseId),
    language: parsed.data.language,
  });
}

export async function translateContentAction(formData: FormData) {
  const user = await requireUser();
  const parsed = translationSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/ai/study?error=validation");
  const supabase = await createServerSupabaseClient();
  const result = await runAiCapability({
    userId: user.id,
    capability: "translation",
    prompt: `Translate from ${parsed.data.sourceLanguage} to ${parsed.data.targetLanguage}:\n${parsed.data.text}`,
    workspaceId: cleanOptional(parsed.data.workspaceId),
    courseId: cleanOptional(parsed.data.courseId),
    language: parsed.data.targetLanguage,
  });
  await supabase.from("ai_translation_jobs").insert({
    user_id: user.id,
    workspace_id: cleanOptional(parsed.data.workspaceId),
    source_language: parsed.data.sourceLanguage,
    target_language: parsed.data.targetLanguage,
    source_type: parsed.data.sourceType,
    source_id: cleanOptional(parsed.data.sourceId),
    original_text: parsed.data.text,
    translated_text: result.content,
    status: result.ok ? "completed" : "review_required",
    completed_at: result.ok ? new Date().toISOString() : null,
  });
  redirect(`/ai/study?request=${result.requestId ?? "blocked"}&translated=${result.ok ? "true" : "blocked"}`);
}

export async function accessibilityAssistAction(formData: FormData) {
  const parsed = accessibilityAssistSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/ai/study?error=validation");
  await runFromForm(formData, "accessibility_assistant", `Task: ${parsed.data.task}. Learner need: ${parsed.data.learnerNeed ?? "not supplied"}\n\nContent:\n${parsed.data.content}`, {
    redirectTo: "/ai/study",
    workspaceId: cleanOptional(parsed.data.workspaceId),
    courseId: cleanOptional(parsed.data.courseId),
    language: parsed.data.language,
  });
}

export async function semanticSearchAction(formData: FormData) {
  const parsed = semanticSearchSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/ai/search?error=validation");
  await runFromForm(formData, "semantic_search", parsed.data.query, {
    redirectTo: "/ai/search",
    workspaceId: cleanOptional(parsed.data.workspaceId),
    academyId: cleanOptional(parsed.data.academyId),
    organizationId: cleanOptional(parsed.data.organizationId),
    courseId: cleanOptional(parsed.data.courseId),
    language: parsed.data.language,
  });
}

export async function enterpriseInsightAction(formData: FormData) {
  const parsed = enterpriseInsightSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/organization/ai?error=validation");
  await runFromForm(formData, "enterprise_insights", `Metric focus: ${parsed.data.metricFocus}. Question: ${parsed.data.question}`, {
    redirectTo: "/organization/ai",
    organizationId: parsed.data.organizationId,
    workspaceId: cleanOptional(parsed.data.workspaceId),
    language: parsed.data.language,
  });
}

export async function createAiIndexAction(formData: FormData) {
  const user = await requireUser();
  const parsed = aiIndexSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/admin/ai?error=validation");
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("ai_indexes").insert({
    name: parsed.data.name,
    source_type: parsed.data.sourceType,
    source_id: cleanOptional(parsed.data.sourceId),
    workspace_id: cleanOptional(parsed.data.workspaceId),
    academy_id: cleanOptional(parsed.data.academyId),
    organization_id: cleanOptional(parsed.data.organizationId),
    course_id: cleanOptional(parsed.data.courseId),
    language: parsed.data.language,
    title: parsed.data.title,
    body: parsed.data.body,
    visibility: parsed.data.visibility,
  }).select("id").single();
  await writeAuditEvent({ actorId: user.id, action: "ai_index_created", resourceType: "ai_index", resourceId: data?.id, success: !error });
  redirect(error ? "/admin/ai?error=create" : "/admin/ai?indexed=true");
}
