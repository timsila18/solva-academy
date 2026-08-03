import { NextResponse, type NextRequest } from "next/server";
import { getLiveProviderAdapter } from "@/lib/live/provider";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const raw = await request.text();
  const adapter = getLiveProviderAdapter();
  if (!adapter.verifyWebhookSignature(raw, request.headers.get("x-solco-signature"))) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const payload = raw ? JSON.parse(raw) : {};
  const event = adapter.normalizeWebhook(payload);
  const supabase = createServiceSupabaseClient();
  const { data: existing } = await supabase.from("live_session_provider_events").select("id").eq("provider", adapter.provider).eq("event_id", event.eventId).maybeSingle();
  if (existing) return NextResponse.json({ ok: true, duplicate: true });
  await supabase.from("live_session_provider_events").insert({ provider: adapter.provider, event_id: event.eventId, event_type: event.eventType, session_id: event.sessionId, occurrence_id: event.occurrenceId, raw_payload: event.raw, processed: true });
  return NextResponse.json({ ok: true });
}
