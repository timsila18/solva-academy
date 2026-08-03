import { NextResponse, type NextRequest } from "next/server";
import { requireApiKey, recordApiUsage } from "@/lib/api/auth";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

const allowedEvents = new Set(["enrollment.created", "course.completed", "certificate.issued", "assignment.completed", "payment.completed", "subscription.changed", "live_attendance.completed", "payout.updated", "organization_user.added"]);

export async function POST(request: NextRequest) {
  const startedAt = Date.now();
  const auth = await requireApiKey(request, ["webhooks:write"]);
  if ("response" in auth) return auth.response;
  const idempotencyKey = request.headers.get("idempotency-key");
  if (!idempotencyKey) return NextResponse.json({ error: { code: "missing_idempotency_key", message: "Idempotency-Key header is required." } }, { status: 400 });
  const body = await request.json().catch(() => null);
  if (!body?.eventType || !allowedEvents.has(body.eventType)) {
    return NextResponse.json({ error: { code: "invalid_event_type", message: "Unsupported webhook event type." } }, { status: 400 });
  }
  const supabase = createServiceSupabaseClient();
  const { data: endpoints } = await supabase.from("webhook_endpoints").select("id,event_types,status").eq("status", "active").limit(50);
  const rows = (endpoints ?? [])
    .filter((endpoint) => endpoint.event_types?.includes(body.eventType))
    .map((endpoint) => ({
      endpoint_id: endpoint.id,
      event_type: body.eventType,
      event_id: idempotencyKey,
      payload: { eventType: body.eventType, resourceId: body.resourceId ?? null },
      status: "pending",
    }));
  if (rows.length) await supabase.from("webhook_deliveries").upsert(rows, { onConflict: "endpoint_id,event_id" });
  await recordApiUsage(auth.context, request, 202, Date.now() - startedAt);
  return NextResponse.json({ accepted: true, deliveriesQueued: rows.length }, { status: 202 });
}
