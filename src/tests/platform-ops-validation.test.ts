import { describe, expect, it } from "vitest";
import { featureFlagSchema, invoiceSchema, supportTicketSchema } from "@/lib/validation/operations-platform";

describe("platform operations validation", () => {
  it("validates invoice input", () => {
    expect(invoiceSchema.safeParse({ customerName: "Timothy", description: "Plan", unitAmountMinor: 1000 }).success).toBe(true);
    expect(invoiceSchema.safeParse({ customerName: "T", description: "P", unitAmountMinor: -1 }).success).toBe(false);
  });

  it("validates support tickets", () => {
    expect(supportTicketSchema.safeParse({ category: "billing", priority: "urgent", subject: "Invoice help", description: "Please help me review this invoice." }).success).toBe(true);
  });

  it("validates feature flag scope", () => {
    expect(featureFlagSchema.safeParse({ flagKey: "marketplace", enabled: true, scope: "beta_group", betaGroup: "founders" }).success).toBe(true);
  });
});
