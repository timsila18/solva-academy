import { describe, expect, it } from "vitest";
import { calculateEarningsLedger, calculateRevenueShares } from "@/lib/billing/revenue";

describe("revenue engine", () => {
  it("calculates reproducible revenue shares without hardcoded commission assumptions", () => {
    const shares = calculateRevenueShares(100000, [
      { beneficiaryType: "platform", percentage: 20, minimumPayoutMinor: 0 },
      { beneficiaryType: "instructor", percentage: 60, minimumPayoutMinor: 1000 },
      { beneficiaryType: "academy", percentage: 20, fixedAmountMinor: 500 },
    ]);
    expect(shares.map((share) => share.amountMinor)).toEqual([20000, 60000, 20500]);
    expect(shares.every((share) => share.eligibleForPayout)).toBe(true);
  });

  it("creates earnings ledger snapshots", () => {
    const ledger = calculateEarningsLedger({
      grossMinor: 100000,
      taxMinor: 16000,
      platformShareMinor: 20000,
      instructorShareMinor: 50000,
      academyShareMinor: 14000,
    });
    expect(ledger.netMinor).toBe(84000);
    expect(ledger.unallocatedMinor).toBe(0);
  });
});
