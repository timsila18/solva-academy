"use server";

import { redirect } from "next/navigation";
import { calculateBillingTotals, calculateTrialEnd, generateInvoiceNumber } from "@/lib/billing/engine";
import { writeAuditEvent } from "@/lib/audit/audit";
import { requirePlatformAdmin, requireUser } from "@/lib/authorization/server";
import { notifyUser } from "@/lib/notifications/notifications";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import {
  complianceRequestSchema,
  featureFlagSchema,
  healthCheckSchema,
  invoiceSchema,
  subscriptionPlanSchema,
  subscriptionSchema,
  supportMessageSchema,
  supportTicketSchema,
} from "@/lib/validation/operations-platform";

function optional(value?: string | null) {
  return value || null;
}

export async function createSubscriptionPlanAction(formData: FormData) {
  const user = await requirePlatformAdmin();
  const parsed = subscriptionPlanSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/admin/subscriptions?error=validation");
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("subscription_plans").insert({
    slug: slugify(parsed.data.slug),
    name: parsed.data.name,
    audience: parsed.data.audience,
    description: parsed.data.description || null,
    price_minor: parsed.data.priceMinor,
    currency: parsed.data.currency,
    billing_interval: parsed.data.billingInterval,
    trial_days: parsed.data.trialDays,
    status: "active",
    created_by: user.id,
  }).select("id").single();
  await writeAuditEvent({ actorId: user.id, action: "subscription_plan_created", resourceType: "subscription_plan", resourceId: data?.id, success: !error });
  redirect(error ? "/admin/subscriptions?error=create_plan" : "/admin/subscriptions?plan_created=true");
}

export async function createSubscriptionAction(formData: FormData) {
  const user = await requirePlatformAdmin();
  const parsed = subscriptionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/admin/subscriptions?error=validation");
  const supabase = await createServerSupabaseClient();
  const { data: plan } = await supabase.from("subscription_plans").select("price_minor,currency,billing_interval,trial_days").eq("id", parsed.data.planId).single();
  const now = new Date();
  const { data, error } = await supabase.from("subscriptions").insert({
    plan_id: parsed.data.planId,
    subscriber_user_id: optional(parsed.data.subscriberUserId),
    workspace_id: optional(parsed.data.workspaceId),
    academy_id: optional(parsed.data.academyId),
    organization_id: optional(parsed.data.organizationId),
    customer_name: parsed.data.customerName,
    customer_email: optional(parsed.data.customerEmail),
    currency: plan?.currency ?? "KES",
    billing_interval: plan?.billing_interval ?? "monthly",
    price_minor: plan?.price_minor ?? 0,
    status: parsed.data.status,
    trial_ends_at: calculateTrialEnd(now, plan?.trial_days ?? 0)?.toISOString() ?? null,
    current_period_start: now.toISOString(),
    created_by: user.id,
  }).select("id").single();
  await writeAuditEvent({ actorId: user.id, action: "subscription_created", resourceType: "subscription", resourceId: data?.id, success: !error });
  redirect(error ? "/admin/subscriptions?error=create_subscription" : "/admin/subscriptions?subscription_created=true");
}

export async function generateInvoiceAction(formData: FormData) {
  const user = await requirePlatformAdmin();
  const parsed = invoiceSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/admin/billing?error=validation");
  const supabase = await createServerSupabaseClient();
  const totals = calculateBillingTotals([{ description: parsed.data.description, unitAmountMinor: parsed.data.unitAmountMinor, quantity: parsed.data.quantity, taxRate: parsed.data.taxRate }]);
  const invoiceNumber = generateInvoiceNumber(new Date(), Date.now() % 100000);
  const { data: invoice, error } = await supabase.from("invoices").insert({
    invoice_number: invoiceNumber,
    subscription_id: optional(parsed.data.subscriptionId),
    customer_name: parsed.data.customerName,
    customer_email: optional(parsed.data.customerEmail),
    currency: "KES",
    subtotal_minor: totals.subtotalMinor,
    discount_minor: totals.discountMinor,
    tax_minor: totals.taxMinor,
    total_minor: totals.totalMinor,
    balance_minor: totals.totalMinor,
    status: "issued",
    issued_at: new Date().toISOString(),
    due_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    snapshot: { generatedBy: "solva-academy", totals },
  }).select("id").single();
  if (!error && invoice) {
    await supabase.from("invoice_items").insert({
      invoice_id: invoice.id,
      description: parsed.data.description,
      quantity: parsed.data.quantity,
      unit_amount_minor: parsed.data.unitAmountMinor,
      tax_minor: totals.taxMinor,
      total_minor: totals.totalMinor,
    });
  }
  await writeAuditEvent({ actorId: user.id, action: "invoice_generated", resourceType: "invoice", resourceId: invoice?.id, success: !error });
  redirect(error ? "/admin/billing?error=invoice" : "/admin/billing?invoice_generated=true");
}

export async function createSupportTicketAction(formData: FormData) {
  const user = await requireUser();
  const parsed = supportTicketSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/support?error=validation");
  const supabase = await createServerSupabaseClient();
  const ticketNumber = `SA-SUP-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${String(Date.now() % 100000).padStart(5, "0")}`;
  const { data, error } = await supabase.from("support_tickets").insert({
    ticket_number: ticketNumber,
    requester_id: user.id,
    workspace_id: optional(parsed.data.workspaceId),
    category: parsed.data.category,
    priority: parsed.data.priority,
    subject: parsed.data.subject,
    description: parsed.data.description,
  }).select("id").single();
  if (!error && data) {
    await notifyUser({ userId: user.id, type: "support_ticket_created", title: "Support ticket created", body: parsed.data.subject, resourceType: "support_ticket", resourceId: data.id });
  }
  await writeAuditEvent({ actorId: user.id, action: "support_ticket_created", resourceType: "support_ticket", resourceId: data?.id, success: !error });
  redirect(error ? "/support?error=create" : "/support?ticket_created=true");
}

export async function addSupportMessageAction(formData: FormData) {
  const user = await requireUser();
  const parsed = supportMessageSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/support?error=validation");
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("support_messages").insert({
    ticket_id: parsed.data.ticketId,
    sender_id: user.id,
    message_type: parsed.data.messageType,
    body: parsed.data.body,
    visibility: parsed.data.messageType === "internal_note" ? "internal" : "customer",
  });
  await writeAuditEvent({ actorId: user.id, action: "support_message_added", resourceType: "support_ticket", resourceId: parsed.data.ticketId, success: !error });
  redirect(error ? "/support?error=message" : "/support?message_added=true");
}

export async function saveFeatureFlagAction(formData: FormData) {
  const user = await requirePlatformAdmin();
  const parsed = featureFlagSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/admin/feature-flags?error=validation");
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("feature_flags").upsert({
    key: parsed.data.flagKey,
    description: parsed.data.description || null,
    enabled: parsed.data.enabled,
    scope: parsed.data.scope,
    workspace_allowlist: optional(parsed.data.workspaceId) ? [parsed.data.workspaceId] : [],
    user_allowlist: optional(parsed.data.userId) ? [parsed.data.userId] : [],
    beta_group: parsed.data.betaGroup || null,
    updated_by: user.id,
    updated_at: new Date().toISOString(),
  }, { onConflict: "key" }).select("key").single();
  await writeAuditEvent({ actorId: user.id, action: "feature_flag_saved", resourceType: "feature_flag", resourceId: data?.key, success: !error });
  redirect(error ? "/admin/feature-flags?error=save" : "/admin/feature-flags?saved=true");
}

export async function createComplianceRequestAction(formData: FormData) {
  const user = await requireUser();
  const parsed = complianceRequestSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/settings/privacy?error=validation");
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("compliance_requests").insert({
    requester_id: user.id,
    request_type: parsed.data.requestType,
    jurisdiction: parsed.data.jurisdiction,
    description: parsed.data.description,
    due_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  }).select("id").single();
  await writeAuditEvent({ actorId: user.id, action: "compliance_request_created", resourceType: "compliance_request", resourceId: data?.id, success: !error });
  redirect(error ? "/settings/privacy?error=create" : "/settings/privacy?request_created=true");
}

export async function recordHealthCheckAction(formData: FormData) {
  const user = await requirePlatformAdmin();
  const parsed = healthCheckSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/admin/monitoring?error=validation");
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("system_health_checks").insert({
    service: parsed.data.service,
    check_name: parsed.data.checkName,
    status: parsed.data.status,
    latency_ms: parsed.data.latencyMs,
  });
  await writeAuditEvent({ actorId: user.id, action: "health_check_recorded", resourceType: "system_health_check", success: !error });
  redirect(error ? "/admin/monitoring?error=health" : "/admin/monitoring?recorded=true");
}
