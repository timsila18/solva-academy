export type Money = {
  amountMinor: number;
  currency: string;
};

export type Coupon = {
  code: string;
  discountType: "percentage" | "fixed_amount" | "free_access";
  percentageOff?: number | null;
  amountMinor?: number | null;
  currency?: string | null;
  minimumOrderMinor?: number | null;
  maximumDiscountMinor?: number | null;
  active: boolean;
  startsAt?: Date | null;
  endsAt?: Date | null;
};

export type MpesaCallbackResult = {
  merchantRequestId?: string;
  checkoutRequestId?: string;
  resultCode: string;
  resultDescription: string;
  receiptNumber?: string;
  amountMinor?: number;
  phone?: string;
};
