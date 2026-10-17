import { describe, expect, it } from "vitest";
import { normalizeKenyanPhone, parseMpesaCallback, initiateMpesaStkPush } from "@/lib/payments/mpesa";

describe("M-Pesa helpers", () => {
  it("never simulates a payment when credentials are missing", async () => {
    await expect(initiateMpesaStkPush({ amountMinor: 10000, phone: "0712345678", accountReference: "test", description: "test" })).rejects.toThrow();
  });
  it("normalizes Kenyan mobile numbers for STK push", () => {
    expect(normalizeKenyanPhone("0712 345 678")).toBe("254712345678");
    expect(normalizeKenyanPhone("+254 112 345 678")).toBe("254112345678");
    expect(normalizeKenyanPhone("254712345678")).toBe("254712345678");
  });

  it("rejects unsupported phone numbers", () => {
    expect(normalizeKenyanPhone("0612345678")).toBeNull();
    expect(normalizeKenyanPhone("+15551234567")).toBeNull();
  });

  it("parses successful STK callbacks", () => {
    const parsed = parseMpesaCallback({
      Body: {
        stkCallback: {
          MerchantRequestID: "mr-1",
          CheckoutRequestID: "co-1",
          ResultCode: 0,
          ResultDesc: "The service request is processed successfully.",
          CallbackMetadata: {
            Item: [
              { Name: "Amount", Value: 1200 },
              { Name: "MpesaReceiptNumber", Value: "RGT123" },
              { Name: "PhoneNumber", Value: 254712345678 },
            ],
          },
        },
      },
    });

    expect(parsed.resultCode).toBe("0");
    expect(parsed.receiptNumber).toBe("RGT123");
    expect(parsed.amountMinor).toBe(120000);
    expect(parsed.phone).toBe("254712345678");
  });
});
