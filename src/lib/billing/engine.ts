export type BillingInterval = "free" | "monthly" | "annual" | "custom";

export type BillingLineInput = {
  description: string;
  quantity?: number;
  unitAmountMinor: number;
  discountMinor?: number;
  taxRate?: number;
};

export type BillingTotals = {
  subtotalMinor: number;
  discountMinor: number;
  taxMinor: number;
  totalMinor: number;
};

export function addBillingPeriod(start: Date, interval: BillingInterval) {
  const end = new Date(start);
  if (interval === "annual") end.setFullYear(end.getFullYear() + 1);
  else if (interval === "monthly") end.setMonth(end.getMonth() + 1);
  else end.setDate(end.getDate());
  return end;
}

export function calculateBillingTotals(lines: BillingLineInput[]): BillingTotals {
  return lines.reduce(
    (totals, line) => {
      const quantity = line.quantity ?? 1;
      const gross = Math.max(0, Math.round(line.unitAmountMinor * quantity));
      const discount = Math.max(0, Math.min(line.discountMinor ?? 0, gross));
      const taxable = gross - discount;
      const tax = Math.max(0, Math.round(taxable * ((line.taxRate ?? 0) / 100)));
      return {
        subtotalMinor: totals.subtotalMinor + gross,
        discountMinor: totals.discountMinor + discount,
        taxMinor: totals.taxMinor + tax,
        totalMinor: totals.totalMinor + taxable + tax,
      };
    },
    { subtotalMinor: 0, discountMinor: 0, taxMinor: 0, totalMinor: 0 },
  );
}

export function generateInvoiceNumber(date = new Date(), sequence = 1) {
  const ymd = date.toISOString().slice(0, 10).replace(/-/g, "");
  return `SA-INV-${ymd}-${String(sequence).padStart(5, "0")}`;
}

export function calculateTrialEnd(start: Date, trialDays: number) {
  if (trialDays <= 0) return null;
  const end = new Date(start);
  end.setDate(end.getDate() + trialDays);
  return end;
}
