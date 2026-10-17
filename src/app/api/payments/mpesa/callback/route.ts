import { NextResponse, type NextRequest } from "next/server";
import { parseMpesaCallback } from "@/lib/payments/mpesa";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { timingSafeEqual } from "node:crypto";

export async function POST(request: NextRequest) {
  const expected = process.env.MPESA_CALLBACK_TOKEN;
  const supplied = request.nextUrl.searchParams.get("token");
  if (!expected || !supplied || Buffer.byteLength(supplied) !== Buffer.byteLength(expected) || !timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))) {
    return NextResponse.json({ error: "Unauthorized callback." }, { status: 401 });
  }
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

  if (!attempt) {
    return NextResponse.json({ ok: true, duplicate: Boolean(existing) });
  }

  if (parsed.resultCode === "0") {
    if (attempt.status === "successful") return NextResponse.json({ ok: true, duplicate: true });
    if (parsed.amountMinor !== attempt.amount_minor || parsed.phone !== attempt.phone || !parsed.receiptNumber || parsed.merchantRequestId !== attempt.merchant_request_id) {
      return NextResponse.json({ error: "Payment does not match the order." }, { status: 400 });
    }
    const { data: order } = await supabase.from("orders").select("customer_id").eq("id", attempt.order_id).single();
    const { error: accessError } = await supabase.rpc("complete_order_access", { target_order_id: attempt.order_id, actor: order?.customer_id });
    if (accessError) return NextResponse.json({ error: "Access could not be granted." }, { status: 503 });
    const { error: updateError } = await supabase
      .from("payment_attempts")
      .update({
        status: "successful",
        provider_reference: parsed.receiptNumber,
        callback_received: true,
        completed_at: new Date().toISOString(),
        reconciliation_status: "matched",
      })
      .eq("id", attempt.id);
    if (updateError) return NextResponse.json({ error: "Payment could not be recorded." }, { status: 503 });
  } else {
    if (attempt.status === "successful") return NextResponse.json({ ok: true });
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
