import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";

export function isPaystackConfigured() {
  const key = process.env.PAYSTACK_SECRET_KEY;
  return Boolean(key && (process.env.SITE_ENV !== "production" || key.startsWith("sk_live_")));
}

export function validPaystackSignature(body: string, signature: string | null, key: string) {
  if (!signature || !/^[a-f0-9]{128}$/i.test(signature)) return false;
  const expected = createHmac("sha512", key).update(body).digest();
  return timingSafeEqual(expected, Buffer.from(signature, "hex"));
}

export async function initializePaystack(input: { email: string; amount: number; currency: string; reference: string; callbackUrl: string }) {
  if (!isPaystackConfigured()) throw new Error("Payments are unavailable.");
  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST", headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ email: input.email, amount: input.amount, currency: input.currency, reference: input.reference, callback_url: input.callbackUrl, channels: ["card", "mobile_money"] }),
    signal: AbortSignal.timeout(20000),
  });
  const parsed = z.object({ status: z.literal(true), data: z.object({ authorization_url: z.url(), reference: z.string() }) }).safeParse(await response.json());
  if (!response.ok || !parsed.success || new URL(parsed.data.data.authorization_url).hostname !== "checkout.paystack.com") throw new Error("Unable to open checkout.");
  return parsed.data.data;
}

export async function verifyPaystack(reference: string) {
  if (!isPaystackConfigured()) throw new Error("Payments are unavailable.");
  const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }, cache: "no-store", signal: AbortSignal.timeout(20000) });
  const parsed = z.object({ status: z.literal(true), data: z.object({ status: z.string(), reference: z.string(), amount: z.number().int(), currency: z.string(), customer: z.object({ email: z.email() }) }) }).safeParse(await response.json());
  if (!response.ok || !parsed.success) throw new Error("Payment verification failed.");
  return parsed.data.data;
}
