import { describe, expect, it } from "vitest";
import { calculateCouponDiscount, calculateOrderTotals } from "@/lib/payments/money";
import type { Coupon } from "@/types/commerce";

const activePercentageCoupon: Coupon = {
  code: "SAVE25",
  active: true,
  discountType: "percentage",
  percentageOff: 25,
};

describe("commerce totals", () => {
  it("calculates percentage discounts without exceeding the subtotal", () => {
    const totals = calculateOrderTotals({ unitPriceMinor: 200000, coupon: activePercentageCoupon });

    expect(totals.subtotalMinor).toBe(200000);
    expect(totals.discountMinor).toBe(50000);
    expect(totals.grandTotalMinor).toBe(150000);
  });

  it("caps fixed discounts at the subtotal", () => {
    const discount = calculateCouponDiscount({
      subtotalMinor: 100000,
      coupon: { code: "BIG", active: true, discountType: "fixed_amount", amountMinor: 500000 },
    });

    expect(discount).toBe(100000);
  });

  it("ignores expired coupons", () => {
    const discount = calculateCouponDiscount({
      subtotalMinor: 100000,
      coupon: { code: "OLD", active: true, discountType: "percentage", percentageOff: 90, endsAt: new Date("2024-01-01") },
    });

    expect(discount).toBe(0);
  });
});
