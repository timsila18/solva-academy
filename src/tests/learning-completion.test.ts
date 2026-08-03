import { describe, expect, it } from "vitest";
import { calculateCompletionPercentage, isEntitlementActive } from "@/lib/learning/completion";

describe("learning completion rules", () => {
  it("calculates bounded completion percentages", () => {
    expect(calculateCompletionPercentage(10, 4)).toBe(40);
    expect(calculateCompletionPercentage(10, 12)).toBe(100);
    expect(calculateCompletionPercentage(0, 1)).toBe(0);
  });

  it("honors entitlement status and access window", () => {
    const now = new Date("2026-07-25T12:00:00Z");

    expect(isEntitlementActive({ status: "active", now })).toBe(true);
    expect(isEntitlementActive({ status: "expired", now })).toBe(false);
    expect(isEntitlementActive({ status: "active", startsAt: new Date("2026-08-01T00:00:00Z"), now })).toBe(false);
    expect(isEntitlementActive({ status: "active", endsAt: new Date("2026-07-01T00:00:00Z"), now })).toBe(false);
  });
});
