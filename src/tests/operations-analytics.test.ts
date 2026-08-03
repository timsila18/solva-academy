import { describe, expect, it } from "vitest";
import { calculateGradingTurnaroundHours, calculateNetEarnings, getObjectiveRiskFlags, summarizeRevenue } from "@/lib/analytics/operations";

describe("operations analytics", () => {
  it("calculates net earnings after fees, tax, and refund adjustments", () => {
    expect(calculateNetEarnings({
      grossAmountMinor: 100000,
      platformFeeMinor: 10000,
      taxMinor: 5000,
      refundAdjustmentMinor: 20000,
      status: "eligible",
    })).toBe(65000);
  });

  it("summarizes revenue by payout state", () => {
    const summary = summarizeRevenue([
      { grossAmountMinor: 100000, platformFeeMinor: 10000, status: "eligible" },
      { grossAmountMinor: 50000, refundAdjustmentMinor: 10000, status: "pending" },
      { grossAmountMinor: 25000, status: "paid" },
    ]);

    expect(summary.grossSalesMinor).toBe(175000);
    expect(summary.eligiblePayoutMinor).toBe(90000);
    expect(summary.pendingEarningsMinor).toBe(40000);
    expect(summary.paidPayoutMinor).toBe(25000);
    expect(summary.refundDeductionsMinor).toBe(10000);
  });

  it("calculates objective grading turnaround", () => {
    expect(calculateGradingTurnaroundHours(new Date("2026-07-25T08:00:00Z"), new Date("2026-07-25T20:30:00Z"))).toBe(12.5);
    expect(calculateGradingTurnaroundHours(new Date("2026-07-25T20:30:00Z"), new Date("2026-07-25T08:00:00Z"))).toBeNull();
  });

  it("creates learner risk flags from objective rules only", () => {
    expect(getObjectiveRiskFlags({ progressPercentage: 30, daysSinceActivity: 15, accessDaysRemaining: 5, pendingAssignments: 1 })).toEqual([
      "inactive_low_progress",
      "assessment_backlog",
      "access_expiring",
    ]);
  });
});
