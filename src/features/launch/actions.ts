"use server";

import { redirect } from "next/navigation";
import { generateApiSecret, getApiKeyPrefix, hashApiSecret } from "@/lib/api/keys";
import { writeAuditEvent } from "@/lib/audit/audit";
import { requireUser } from "@/lib/authorization/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { generateWebhookSecret, hashWebhookSecret } from "@/lib/webhooks/signing";
import { apiKeySchema, feedbackSchema, webhookEndpointSchema } from "@/lib/validation/launch";

function optional(value?: string | null) {
  return value || null;
}

export async function createApiKeyAction(formData: FormData) {
  const user = await requireUser();
  const parsed = apiKeySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/admin/api?error=validation");
  const secret = generateApiSecret();
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("api_keys").insert({
    workspace_id: optional(parsed.data.workspaceId),
    academy_id: optional(parsed.data.academyId),
    organization_id: optional(parsed.data.organizationId),
    name: parsed.data.name,
    key_prefix: getApiKeyPrefix(secret),
    key_hash: hashApiSecret(secret),
    scopes: parsed.data.scopes.split(",").map((scope) => scope.trim()),
    environment: parsed.data.environment,
    expires_at: optional(parsed.data.expiresAt),
    created_by: user.id,
  }).select("id").single();
  await writeAuditEvent({ actorId: user.id, action: "api_key_created", resourceType: "api_key", resourceId: data?.id, success: !error });
  redirect(error ? "/admin/api?error=create" : `/admin/api?created=true&secret=${encodeURIComponent(secret)}`);
}

export async function createWebhookEndpointAction(formData: FormData) {
  const user = await requireUser();
  const parsed = webhookEndpointSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/admin/webhooks?error=validation");
  const secret = generateWebhookSecret();
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("webhook_endpoints").insert({
    workspace_id: optional(parsed.data.workspaceId),
    academy_id: optional(parsed.data.academyId),
    organization_id: optional(parsed.data.organizationId),
    name: parsed.data.name,
    url: parsed.data.url,
    event_types: parsed.data.eventTypes.split(",").map((event) => event.trim()),
    secret_hash: hashWebhookSecret(secret),
    created_by: user.id,
  }).select("id").single();
  await writeAuditEvent({ actorId: user.id, action: "webhook_endpoint_created", resourceType: "webhook_endpoint", resourceId: data?.id, success: !error });
  redirect(error ? "/admin/webhooks?error=create" : `/admin/webhooks?created=true&secret=${encodeURIComponent(secret)}`);
}

export async function createProductFeedbackAction(formData: FormData) {
  const user = await requireUser();
  const parsed = feedbackSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/feedback?error=validation");
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("product_feedback").insert({
    user_id: user.id,
    workspace_id: optional(parsed.data.workspaceId),
    feedback_type: parsed.data.feedbackType,
    rating: parsed.data.rating,
    comment: parsed.data.comment,
    consent_to_contact: parsed.data.consentToContact,
  }).select("id").single();
  await writeAuditEvent({ actorId: user.id, action: "product_feedback_created", resourceType: "product_feedback", resourceId: data?.id, success: !error });
  redirect(error ? "/feedback?error=create" : "/feedback?submitted=true");
}
