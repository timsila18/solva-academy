import { describe, expect, it } from "vitest";
import { addBillingPeriod, calculateBillingTotals, calculateTrialEnd, generateInvoiceNumber } from "@/lib/billing/engine";

describe("billing engine", () => {
  it("calculates invoice totals server-side", () => {
    const totals = calculateBillingTotals([
      { description: "Academy Growth", unitAmountMinor: 10000, quantity: 2, discountMinor: 1000, taxRate: 16 },
    ]);
    expect(totals.subtotalMinor).toBe(20000);
    expect(totals.discountMinor).toBe(1000);
    expect(totals.taxMinor).toBe(3040);
    expect(totals.totalMinor).toBe(22040);
  });

  it("generates stable invoice number format", () => {
    expect(generateInvoiceNumber(new Date("2026-07-25T00:00:00Z"), 12)).toBe("SA-INV-20260725-00012");
  });

  it("computes billing period and trials", () => {
    expect(addBillingPeriod(new Date("2026-01-01T00:00:00Z"), "monthly").getUTCMonth()).toBe(1);
    expect(calculateTrialEnd(new Date("2026-01-01T00:00:00Z"), 14)?.toISOString().slice(0, 10)).toBe("2026-01-15");
  });
});
