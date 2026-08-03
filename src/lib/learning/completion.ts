export function calculateCompletionPercentage(requiredLessons: number, completedRequiredLessons: number) {
  if (requiredLessons <= 0) return 0;
  const percentage = Math.floor((Math.max(0, completedRequiredLessons) / requiredLessons) * 100);
  return Math.max(0, Math.min(100, percentage));
}

export function isEntitlementActive({
  status,
  startsAt,
  endsAt,
  now = new Date(),
}: {
  status: string;
  startsAt?: Date | null;
  endsAt?: Date | null;
  now?: Date;
}) {
  if (status !== "active") return false;
  if (startsAt && startsAt > now) return false;
  if (endsAt && endsAt < now) return false;
  return true;
}
