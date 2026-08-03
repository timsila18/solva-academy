import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getAiResponseByRequest(requestId?: string | null) {
  if (!requestId || requestId === "blocked") return null;
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("ai_responses")
    .select("id,content,citations,safety_labels,created_at,ai_requests(request_type,status,safety_status)")
    .eq("request_id", requestId)
    .maybeSingle();
  return data;
}

export async function getAiDashboardStats(userId: string) {
  const supabase = await createServerSupabaseClient();
  const [requests, conversations, recommendations, usage] = await Promise.all([
    supabase.from("ai_requests").select("id,status,safety_status,request_type,created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(20),
    supabase.from("ai_conversations").select("id,status").eq("user_id", userId),
    supabase.from("ai_recommendations").select("id,status,score").eq("user_id", userId),
    supabase.from("ai_usage").select("total_tokens").eq("user_id", userId).limit(100),
  ]);

  return {
    requests: requests.data ?? [],
    conversationCount: conversations.data?.length ?? 0,
    recommendationCount: recommendations.data?.filter((item) => item.status === "active").length ?? 0,
    totalTokens: usage.data?.reduce((sum, item) => sum + Number(item.total_tokens ?? 0), 0) ?? 0,
  };
}

export async function getAdminAiStats() {
  const supabase = await createServerSupabaseClient();
  const [models, capabilities, requests, moderation, indexes] = await Promise.all([
    supabase.from("ai_models").select("id,status,provider,display_name").order("provider"),
    supabase.from("ai_capabilities").select("id,slug,enabled,risk_level").order("slug"),
    supabase.from("ai_requests").select("id,status,safety_status,request_type,created_at").order("created_at", { ascending: false }).limit(25),
    supabase.from("ai_moderation_events").select("id,decision,risk_level,event_type,created_at").order("created_at", { ascending: false }).limit(25),
    supabase.from("ai_indexes").select("id,title,visibility,status,indexed_at").order("indexed_at", { ascending: false }).limit(25),
  ]);

  return {
    models: models.data ?? [],
    capabilities: capabilities.data ?? [],
    requests: requests.data ?? [],
    moderation: moderation.data ?? [],
    indexes: indexes.data ?? [],
  };
}
