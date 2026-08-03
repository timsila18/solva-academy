export type RevenueEntry = {
  grossAmountMinor: number;
  platformFeeMinor?: number;
  taxMinor?: number;
  refundAdjustmentMinor?: number;
  status: "pending" | "eligible" | "on_hold" | "paid" | "reversed" | "cancelled";
};

export function calculateNetEarnings(entry: RevenueEntry) {
  if (entry.status === "cancelled") return 0;
  const deductions = (entry.platformFeeMinor ?? 0) + (entry.taxMinor ?? 0) + (entry.refundAdjustmentMinor ?? 0);
  return Math.max(0, entry.grossAmountMinor - deductions);
}

export function summarizeRevenue(entries: RevenueEntry[]) {
  return entries.reduce(
    (summary, entry) => {
      const net = calculateNetEarnings(entry);
      summary.grossSalesMinor += entry.status === "cancelled" ? 0 : entry.grossAmountMinor;
      summary.netEarningsMinor += net;
      if (entry.status === "pending" || entry.status === "on_hold") summary.pendingEarningsMinor += net;
      if (entry.status === "eligible") summary.eligiblePayoutMinor += net;
      if (entry.status === "paid") summary.paidPayoutMinor += net;
      if ((entry.refundAdjustmentMinor ?? 0) > 0) summary.refundDeductionsMinor += entry.refundAdjustmentMinor ?? 0;
      return summary;
    },
    {
      grossSalesMinor: 0,
      netEarningsMinor: 0,
      pendingEarningsMinor: 0,
      eligiblePayoutMinor: 0,
      paidPayoutMinor: 0,
      refundDeductionsMinor: 0,
    },
  );
}

export function calculateGradingTurnaroundHours(submittedAt?: Date | null, gradedAt?: Date | null) {
  if (!submittedAt || !gradedAt || gradedAt < submittedAt) return null;
  return Math.round(((gradedAt.getTime() - submittedAt.getTime()) / 3_600_000) * 10) / 10;
}

export function getObjectiveRiskFlags({
  progressPercentage,
  daysSinceActivity,
  accessDaysRemaining,
  pendingAssignments,
}: {
  progressPercentage: number;
  daysSinceActivity: number;
  accessDaysRemaining?: number | null;
  pendingAssignments: number;
}) {
  const flags: string[] = [];
  if (daysSinceActivity >= 14 && progressPercentage < 50) flags.push("inactive_low_progress");
  if (pendingAssignments > 0) flags.push("assessment_backlog");
  if (accessDaysRemaining !== null && accessDaysRemaining !== undefined && accessDaysRemaining <= 7 && progressPercentage < 80) flags.push("access_expiring");
  return flags;
}
