import { describe, expect, it } from "vitest";
import { generateWebhookSecret, hashWebhookSecret, signWebhookPayload, verifyWebhookSignature } from "@/lib/webhooks/signing";

describe("webhook signing", () => {
  it("signs and verifies payloads", () => {
    const secret = generateWebhookSecret();
    const payload = JSON.stringify({ eventType: "course.completed" });
    const header = signWebhookPayload(secret, payload, 1785000000);
    expect(hashWebhookSecret(secret)).toHaveLength(64);
    expect(verifyWebhookSignature(secret, payload, header, 60 * 60 * 24 * 365)).toBe(true);
    expect(verifyWebhookSignature(secret, `${payload}x`, header, 60 * 60 * 24 * 365)).toBe(false);
  });
});
