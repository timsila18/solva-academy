import { z } from "zod";
import { getEnv } from "@/lib/config/env";

export function normalizeKenyanPhone(input: string) {
  const compact = input.replace(/[\s()-]/g, "");
  if (/^07\d{8}$/.test(compact) || /^01\d{8}$/.test(compact)) return `254${compact.slice(1)}`;
  if (/^\+254[71]\d{8}$/.test(compact)) return compact.slice(1);
  if (/^254[71]\d{8}$/.test(compact)) return compact;
  return null;
}

export const mpesaCallbackSchema = z.object({
  Body: z.object({
    stkCallback: z.object({
      MerchantRequestID: z.string().optional(),
      CheckoutRequestID: z.string(),
      ResultCode: z.number(),
      ResultDesc: z.string(),
      CallbackMetadata: z
        .object({
          Item: z.array(z.object({ Name: z.string(), Value: z.union([z.string(), z.number()]).optional() })),
        })
        .optional(),
    }),
  }),
});

export function parseMpesaCallback(payload: unknown) {
  const parsed = mpesaCallbackSchema.parse(payload);
  const callback = parsed.Body.stkCallback;
  const items = callback.CallbackMetadata?.Item ?? [];
  const findValue = (name: string) => items.find((item) => item.Name === name)?.Value;
  const amount = findValue("Amount");

  return {
    merchantRequestId: callback.MerchantRequestID,
    checkoutRequestId: callback.CheckoutRequestID,
    resultCode: String(callback.ResultCode),
    resultDescription: callback.ResultDesc,
    receiptNumber: findValue("MpesaReceiptNumber")?.toString(),
    amountMinor: typeof amount === "number" ? Math.round(amount * 100) : undefined,
    phone: findValue("PhoneNumber")?.toString(),
  };
}

export async function initiateMpesaStkPush({
  amountMinor,
  phone,
  accountReference,
  description,
}: {
  amountMinor: number;
  phone: string;
  accountReference: string;
  description: string;
}) {
  const env = getEnv();
  const normalizedPhone = normalizeKenyanPhone(phone);
  if (!normalizedPhone) throw new Error("Enter a valid Kenyan M-Pesa phone number.");

  if (!process.env.MPESA_CONSUMER_KEY || !process.env.MPESA_CONSUMER_SECRET || !process.env.MPESA_SHORTCODE || !process.env.MPESA_PASSKEY) {
    return {
      simulated: true,
      MerchantRequestID: `SIM-${accountReference}`,
      CheckoutRequestID: `SIM-${Date.now()}`,
      ResponseCode: "0",
      ResponseDescription: "Simulated STK initiation. Configure Daraja credentials for live STK.",
      CustomerMessage: "Simulated request accepted.",
    };
  }

  const baseUrl = process.env.MPESA_ENV === "production" ? "https://api.safaricom.co.ke" : "https://sandbox.safaricom.co.ke";
  const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString("base64");
  const tokenResponse = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` },
  });
  if (!tokenResponse.ok) throw new Error("Unable to authenticate with M-Pesa.");
  const token = (await tokenResponse.json()) as { access_token: string };
  const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
  const password = Buffer.from(`${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`).toString("base64");

  const response = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.ceil(amountMinor / 100),
      PartyA: normalizedPhone,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: normalizedPhone,
      CallBackURL: process.env.MPESA_CALLBACK_URL ?? `${env.NEXT_PUBLIC_APP_URL}/api/payments/mpesa/callback`,
      AccountReference: accountReference,
      TransactionDesc: description,
    }),
  });

  if (!response.ok) throw new Error("M-Pesa STK initiation failed.");
  return response.json();
}
