import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getApiDashboard() {
  const supabase = await createServerSupabaseClient();
  const [keys, usage] = await Promise.all([
    supabase.from("api_keys").select("id,name,key_prefix,scopes,environment,status,last_used_at,expires_at,created_at").order("created_at", { ascending: false }).limit(50),
    supabase.from("api_key_usage").select("id,route,method,status_code,latency_ms,created_at").order("created_at", { ascending: false }).limit(50),
  ]);
  return { keys: keys.data ?? [], usage: usage.data ?? [] };
}

export async function getWebhookDashboard() {
  const supabase = await createServerSupabaseClient();
  const [endpoints, deliveries] = await Promise.all([
    supabase.from("webhook_endpoints").select("id,name,url,event_types,status,created_at").order("created_at", { ascending: false }).limit(50),
    supabase.from("webhook_deliveries").select("id,event_type,event_id,status,attempt_count,response_status,created_at").order("created_at", { ascending: false }).limit(50),
  ]);
  return { endpoints: endpoints.data ?? [], deliveries: deliveries.data ?? [] };
}

export async function getIntegrationDirectory() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("integration_connections").select("id,provider,category,display_name,status,error_message,updated_at").order("category").order("display_name");
  return data ?? [];
}
