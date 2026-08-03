import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getBillingDashboard() {
  const supabase = await createServerSupabaseClient();
  const [plans, subscriptions, invoices, earnings, payouts] = await Promise.all([
    supabase.from("subscription_plans").select("id,name,audience,price_minor,billing_interval,status").order("created_at", { ascending: false }).limit(50),
    supabase.from("subscriptions").select("id,customer_name,status,price_minor,currency,created_at").order("created_at", { ascending: false }).limit(50),
    supabase.from("invoices").select("id,invoice_number,customer_name,status,total_minor,balance_minor,currency,created_at").order("created_at", { ascending: false }).limit(50),
    supabase.from("earnings").select("id,status,net_minor,currency,beneficiary_type").limit(100),
    supabase.from("payout_transactions").select("id,status,amount_minor,currency,method").limit(100),
  ]);
  return { plans: plans.data ?? [], subscriptions: subscriptions.data ?? [], invoices: invoices.data ?? [], earnings: earnings.data ?? [], payouts: payouts.data ?? [] };
}

export async function getSupportDashboard(userId?: string) {
  const supabase = await createServerSupabaseClient();
  const [tickets, articles] = await Promise.all([
    userId
      ? supabase.from("support_tickets").select("id,ticket_number,subject,status,priority,created_at").eq("requester_id", userId).order("created_at", { ascending: false }).limit(25)
      : supabase.from("support_tickets").select("id,ticket_number,subject,status,priority,created_at").order("created_at", { ascending: false }).limit(50),
    supabase.from("knowledge_base_articles").select("id,title,category,status,visibility,updated_at").order("updated_at", { ascending: false }).limit(25),
  ]);
  return { tickets: tickets.data ?? [], articles: articles.data ?? [] };
}

export async function getSecurityDashboard(userId: string) {
  const supabase = await createServerSupabaseClient();
  const [events, factors, sessions] = await Promise.all([
    supabase.from("security_events").select("id,event_type,severity,status,created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(25),
    supabase.from("mfa_factors").select("id,factor_type,label,status,last_used_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(25),
    supabase.from("user_sessions").select("id,session_fingerprint,last_seen_at,revoked_at,device").eq("user_id", userId).order("last_seen_at", { ascending: false }).limit(25),
  ]);
  return { events: events.data ?? [], factors: factors.data ?? [], sessions: sessions.data ?? [] };
}

export async function getMonitoringDashboard() {
  const supabase = await createServerSupabaseClient();
  const [health, monitoring, backups, retention] = await Promise.all([
    supabase.from("system_health_checks").select("id,service,check_name,status,latency_ms,checked_at").order("checked_at", { ascending: false }).limit(25),
    supabase.from("monitoring_events").select("id,service,metric_name,metric_value,unit,severity,status,observed_at").order("observed_at", { ascending: false }).limit(25),
    supabase.from("backup_jobs").select("id,job_type,provider,status,restore_tested,created_at,completed_at").order("created_at", { ascending: false }).limit(25),
    supabase.from("data_retention_policies").select("resource_type,minimum_retention_days,workspace_override_allowed,status").order("resource_type"),
  ]);
  return { health: health.data ?? [], monitoring: monitoring.data ?? [], backups: backups.data ?? [], retention: retention.data ?? [] };
}

export async function getFeatureFlags() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("feature_flags").select("key,description,enabled,scope,beta_group,environment,percentage_rollout,updated_at").order("key");
  return data ?? [];
}

export async function getComplianceDashboard(userId?: string) {
  const supabase = await createServerSupabaseClient();
  const [requests, consents] = await Promise.all([
    userId
      ? supabase.from("compliance_requests").select("id,request_type,status,jurisdiction,due_at,created_at").eq("requester_id", userId).order("created_at", { ascending: false }).limit(25)
      : supabase.from("compliance_requests").select("id,request_type,status,jurisdiction,due_at,created_at").order("created_at", { ascending: false }).limit(50),
    userId
      ? supabase.from("consent_records").select("id,consent_type,version,granted,recorded_at").eq("user_id", userId).order("recorded_at", { ascending: false }).limit(25)
      : supabase.from("consent_records").select("id,consent_type,version,granted,recorded_at").order("recorded_at", { ascending: false }).limit(50),
  ]);
  return { requests: requests.data ?? [], consents: consents.data ?? [] };
}
