"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { initializePaystack, isPaystackConfigured } from "@/lib/payments/paystack";
import { getEnv } from "@/lib/config/env";
import { writeAuditEvent } from "@/lib/audit/audit";

export async function payWithPaystackAction(formData: FormData) {
  const user = await requireUserOrRedirect();
  const orderId = z.uuid().parse(formData.get("orderId"));
  if (!isPaystackConfigured() || !user.email) redirect(`/checkout/${orderId}?error=unavailable`);
  const db = createServiceSupabaseClient();
  const { data: order } = await db.from("orders").select("*").eq("id", orderId).eq("customer_id", user.id).single();
  if (!order || order.grand_total_minor <= 0) redirect("/courses");
  if (order.payment_status === "paid") redirect(`/checkout/${orderId}/status`);
  const reference = `SA-${crypto.randomUUID()}`;
  const { error } = await db.from("payment_attempts").insert({ order_id: orderId, provider: "paystack", method: "hosted", amount_minor: order.grand_total_minor, currency: order.currency, status: "created", provider_reference: reference, idempotency_key: reference });
  if (error) redirect(`/checkout/${orderId}?error=recording`);
  let url: string;
  try {
    const payment = await initializePaystack({ email: user.email, amount: order.grand_total_minor, currency: order.currency, reference, callbackUrl: `${getEnv().NEXT_PUBLIC_APP_URL}/checkout/${orderId}/status` });
    url = payment.authorization_url;
    const { error: updateError } = await db.from("payment_attempts").update({ status: "initiated", initiated_at: new Date().toISOString() }).eq("provider_reference", reference);
    if (updateError) throw updateError;
  } catch { redirect(`/checkout/${orderId}?error=provider`); }
  await writeAuditEvent({ actorId: user.id, action: "hosted_checkout_started", resourceType: "order", resourceId: orderId });
  redirect(url);
}
