import { NextResponse, type NextRequest } from "next/server";
import { parseMpesaCallback } from "@/lib/payments/mpesa";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const parsed = parseMpesaCallback(payload);
  const supabase = createServiceSupabaseClient();

  const { data: attempt } = await supabase
    .from("payment_attempts")
    .select("*")
    .eq("checkout_request_id", parsed.checkoutRequestId)
    .maybeSingle();

  const { data: existing } = await supabase
    .from("payment_callbacks")
    .select("id")
    .eq("provider", "mpesa")
    .eq("checkout_request_id", parsed.checkoutRequestId)
    .eq("result_code", parsed.resultCode)
    .maybeSingle();

  await supabase.from("payment_callbacks").insert({
    payment_attempt_id: attempt?.id,
    provider: "mpesa",
    checkout_request_id: parsed.checkoutRequestId,
    merchant_request_id: parsed.merchantRequestId,
    result_code: parsed.resultCode,
    result_description: parsed.resultDescription,
    raw_payload: payload,
    processed: Boolean(existing),
    duplicate: Boolean(existing),
  });

  if (!attempt || existing) {
    return NextResponse.json({ ok: true, duplicate: Boolean(existing) });
  }

  if (parsed.resultCode === "0") {
    const { data: order } = await supabase.from("orders").select("customer_id").eq("id", attempt.order_id).single();
    await supabase
      .from("payment_attempts")
      .update({
        status: "successful",
        provider_reference: parsed.receiptNumber,
        callback_received: true,
        completed_at: new Date().toISOString(),
        reconciliation_status: "matched",
      })
      .eq("id", attempt.id);
    await supabase.rpc("complete_order_access", { target_order_id: attempt.order_id, actor: order?.customer_id });
  } else {
    await supabase
      .from("payment_attempts")
      .update({
        status: parsed.resultCode === "1032" ? "cancelled" : "failed",
        failure_code: parsed.resultCode,
        failure_message: parsed.resultDescription,
        callback_received: true,
        completed_at: new Date().toISOString(),
      })
      .eq("id", attempt.id);
    await supabase.from("orders").update({ payment_status: "failed", status: "failed" }).eq("id", attempt.order_id);
  }

  return NextResponse.json({ ok: true });
}
