import type { Coupon } from "@/types/commerce";

export function formatMoney(amountMinor: number, currency = "KES") {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amountMinor / 100);
}

export function calculateCouponDiscount({
  subtotalMinor,
  coupon,
  currency = "KES",
}: {
  subtotalMinor: number;
  coupon?: Coupon | null;
  currency?: string;
}) {
  if (!coupon) return 0;
  const now = new Date();
  if (!coupon.active) return 0;
  if (coupon.startsAt && coupon.startsAt > now) return 0;
  if (coupon.endsAt && coupon.endsAt < now) return 0;
  if (coupon.currency && coupon.currency !== currency && coupon.discountType !== "percentage") return 0;
  if (subtotalMinor < (coupon.minimumOrderMinor ?? 0)) return 0;

  let discount = 0;
  if (coupon.discountType === "free_access") discount = subtotalMinor;
  if (coupon.discountType === "fixed_amount") discount = coupon.amountMinor ?? 0;
  if (coupon.discountType === "percentage") {
    discount = Math.floor((subtotalMinor * (coupon.percentageOff ?? 0)) / 100);
  }

  if (coupon.maximumDiscountMinor !== null && coupon.maximumDiscountMinor !== undefined) {
    discount = Math.min(discount, coupon.maximumDiscountMinor);
  }

  return Math.max(0, Math.min(discount, subtotalMinor));
}

export function calculateOrderTotals({
  unitPriceMinor,
  quantity = 1,
  coupon,
  currency = "KES",
}: {
  unitPriceMinor: number;
  quantity?: number;
  coupon?: Coupon | null;
  currency?: string;
}) {
  const subtotalMinor = unitPriceMinor * quantity;
  const discountMinor = calculateCouponDiscount({ subtotalMinor, coupon, currency });
  const taxMinor = 0;
  const providerFeeMinor = 0;
  const grandTotalMinor = Math.max(0, subtotalMinor - discountMinor + taxMinor + providerFeeMinor);

  return {
    subtotalMinor,
    discountMinor,
    taxMinor,
    providerFeeMinor,
    grandTotalMinor,
    currency,
  };
}
