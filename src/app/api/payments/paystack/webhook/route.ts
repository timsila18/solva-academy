import { NextResponse } from "next/server";
import { z } from "zod";
import { validPaystackSignature, verifyPaystack, isPaystackConfigured } from "@/lib/payments/paystack";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { writeAuditEvent } from "@/lib/audit/audit";

export async function POST(request: Request) {
  if (!isPaystackConfigured()) return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  const body = await request.text();
  if (!validPaystackSignature(body, request.headers.get("x-paystack-signature"), process.env.PAYSTACK_SECRET_KEY!)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let payload: unknown;
  try { payload = JSON.parse(body); } catch { return NextResponse.json({ error: "Invalid payload" }, { status: 400 }); }
  const parsed = z.object({ event: z.string(), data: z.object({ reference: z.string() }) }).safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  if (parsed.data.event !== "charge.success") return NextResponse.json({ ok: true });
  try {
    const verified = await verifyPaystack(parsed.data.data.reference);
    const db = createServiceSupabaseClient();
    const { data: attempt } = await db.from("payment_attempts").select("*").eq("provider", "paystack").eq("provider_reference", verified.reference).single();
    if (!attempt || verified.status !== "success" || verified.amount !== attempt.amount_minor || verified.currency !== attempt.currency) return NextResponse.json({ error: "Payment mismatch" }, { status: 400 });
    const { data: order } = await db.from("orders").select("customer_id,grand_total_minor,currency").eq("id", attempt.order_id).single();
    if (!order || order.grand_total_minor !== verified.amount || order.currency !== verified.currency) return NextResponse.json({ error: "Order mismatch" }, { status: 400 });
    const { data: owner } = await db.auth.admin.getUserById(order.customer_id);
    if (owner.user?.email?.toLowerCase() !== verified.customer.email.toLowerCase()) return NextResponse.json({ error: "Customer mismatch" }, { status: 400 });
    const { error: accessError } = await db.rpc("complete_order_access", { target_order_id: attempt.order_id, actor: order.customer_id });
    if (accessError) throw accessError;
    const { error } = await db.from("payment_attempts").update({ status: "successful", callback_received: true, completed_at: new Date().toISOString(), reconciliation_status: "matched" }).eq("id", attempt.id);
    if (error) throw error;
    await writeAuditEvent({ actorId: order.customer_id, action: "payment_verified", resourceType: "order", resourceId: attempt.order_id });
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "Verification unavailable" }, { status: 503 }); }
}
