import { describe, expect, it } from "vitest";
import { gradingActivitySchema, payoutDecisionSchema, payoutRequestSchema } from "@/lib/validation/operations";

describe("operations validation", () => {
  it("accepts valid payout requests", () => {
    const parsed = payoutRequestSchema.parse({
      amountMinor: "100000",
      currency: "KES",
      destinationLabel: "M-Pesa 254712345678",
      method: "manual",
    });

    expect(parsed.amountMinor).toBe(100000);
  });

  it("rejects payout requests without a positive amount", () => {
    expect(() => payoutRequestSchema.parse({ amountMinor: "0", currency: "KES", destinationLabel: "M-Pesa", method: "manual" })).toThrow();
  });

  it("limits finance decisions to governed statuses", () => {
    expect(payoutDecisionSchema.parse({ payoutRequestId: "00000000-0000-4000-8000-000000000001", status: "approved" }).status).toBe("approved");
    expect(() => payoutDecisionSchema.parse({ payoutRequestId: "00000000-0000-4000-8000-000000000001", status: "wired" })).toThrow();
  });

  it("validates grading activity types", () => {
    const parsed = gradingActivitySchema.parse({
      activityType: "assignment_grade_published",
      score: "80",
      maxScore: "100",
      status: "published",
    });

    expect(parsed.score).toBe(80);
  });
});
