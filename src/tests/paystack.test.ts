import { afterEach, describe, expect, it, vi } from "vitest";
import { createHmac } from "node:crypto";
import { initializePaystack, isPaystackConfigured, validPaystackSignature, verifyPaystack } from "@/lib/payments/paystack";

afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });
describe("hosted payments", () => {
  it("rejects forged and modified webhook bodies", () => {
    const body = JSON.stringify({ event: "charge.success" });
    const signature = createHmac("sha512", "test-secret").update(body).digest("hex");
    expect(validPaystackSignature(body, signature, "test-secret")).toBe(true);
    expect(validPaystackSignature(body + " ", signature, "test-secret")).toBe(false);
    expect(validPaystackSignature(body, null, "test-secret")).toBe(false);
    expect(validPaystackSignature(body, "z".repeat(128), "test-secret")).toBe(false);
  });
  it("does not enable test keys in production", () => {
    vi.stubEnv("SITE_ENV", "production"); vi.stubEnv("PAYSTACK_SECRET_KEY", "sk_test_example");
    expect(isPaystackConfigured()).toBe(false);
  });
  it("requests hosted cards and mobile money with the exact minor-unit price", async () => {
    vi.stubEnv("SITE_ENV", "local"); vi.stubEnv("PAYSTACK_SECRET_KEY", "sk_test_example");
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ status: true, data: { authorization_url: "https://checkout.paystack.com/test", reference: "r1" } })));
    vi.stubGlobal("fetch", fetchMock);
    await initializePaystack({ email: "learner@example.com", amount: 120000, currency: "KES", reference: "r1", callbackUrl: "https://academy.solvaone.co.ke/checkout/status" });
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sent.amount).toBe(120000); expect(sent.channels).toEqual(["card", "mobile_money"]);
  });
  it("rejects provider redirects to another site", async () => {
    vi.stubEnv("SITE_ENV", "local"); vi.stubEnv("PAYSTACK_SECRET_KEY", "sk_test_example");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ status: true, data: { authorization_url: "https://evil.example/test", reference: "r1" } }))));
    await expect(initializePaystack({ email: "learner@example.com", amount: 120000, currency: "KES", reference: "r1", callbackUrl: "https://example.com" })).rejects.toThrow();
  });
  it("fails closed if verification response is invalid", async () => {
    vi.stubEnv("SITE_ENV", "local"); vi.stubEnv("PAYSTACK_SECRET_KEY", "sk_test_example");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ status: false }))));
    await expect(verifyPaystack("r1")).rejects.toThrow("Payment verification failed");
  });
});
