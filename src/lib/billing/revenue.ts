export type RevenueRuleInput = {
  beneficiaryType: "platform" | "instructor" | "academy" | "enterprise" | "affiliate";
  percentage: number;
  fixedAmountMinor?: number;
  minimumPayoutMinor?: number;
};

export type RevenueShare = {
  beneficiaryType: RevenueRuleInput["beneficiaryType"];
  amountMinor: number;
  eligibleForPayout: boolean;
};

export function calculateRevenueShares(grossMinor: number, rules: RevenueRuleInput[]): RevenueShare[] {
  return rules.map((rule) => {
    const percentageAmount = Math.floor((grossMinor * rule.percentage) / 100);
    const amountMinor = Math.max(0, percentageAmount + (rule.fixedAmountMinor ?? 0));
    return {
      beneficiaryType: rule.beneficiaryType,
      amountMinor,
      eligibleForPayout: amountMinor >= (rule.minimumPayoutMinor ?? 0),
    };
  });
}

export function calculateEarningsLedger({
  grossMinor,
  taxMinor = 0,
  refundAdjustmentMinor = 0,
  platformShareMinor = 0,
  instructorShareMinor = 0,
  academyShareMinor = 0,
}: {
  grossMinor: number;
  taxMinor?: number;
  refundAdjustmentMinor?: number;
  platformShareMinor?: number;
  instructorShareMinor?: number;
  academyShareMinor?: number;
}) {
  const netMinor = Math.max(0, grossMinor - taxMinor - refundAdjustmentMinor);
  return {
    grossMinor,
    platformShareMinor,
    instructorShareMinor,
    academyShareMinor,
    taxMinor,
    refundAdjustmentMinor,
    netMinor,
    unallocatedMinor: Math.max(0, netMinor - platformShareMinor - instructorShareMinor - academyShareMinor),
  };
}
