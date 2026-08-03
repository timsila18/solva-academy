import { describe, expect, it } from "vitest";
import { apiKeySchema, feedbackSchema, webhookEndpointSchema } from "@/lib/validation/launch";

describe("launch validation", () => {
  it("accepts known API scopes only", () => {
    expect(apiKeySchema.safeParse({ name: "Reports", scopes: "courses:read,reports:read", environment: "staging" }).success).toBe(true);
    expect(apiKeySchema.safeParse({ name: "Bad", scopes: "database:read", environment: "production" }).success).toBe(false);
  });

  it("validates webhook endpoints", () => {
    expect(webhookEndpointSchema.safeParse({ name: "CRM", url: "https://example.com/webhook", eventTypes: "enrollment.created" }).success).toBe(true);
  });

  it("validates controlled feedback", () => {
    expect(feedbackSchema.safeParse({ feedbackType: "ai_assistance", rating: 5, comment: "Helpful" }).success).toBe(true);
    expect(feedbackSchema.safeParse({ feedbackType: "ai_assistance", rating: 8 }).success).toBe(false);
  });
});
