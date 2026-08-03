export type AttendanceSegment = {
  joinedAt: Date;
  leftAt: Date;
};

export function mergeAttendanceSegments(segments: AttendanceSegment[], mergeGapSeconds = 120) {
  const sorted = segments
    .filter((segment) => segment.leftAt > segment.joinedAt)
    .sort((a, b) => a.joinedAt.getTime() - b.joinedAt.getTime());
  const merged: AttendanceSegment[] = [];
  for (const segment of sorted) {
    const last = merged.at(-1);
    if (!last || segment.joinedAt.getTime() - last.leftAt.getTime() > mergeGapSeconds * 1000) {
      merged.push({ ...segment });
    } else if (segment.leftAt > last.leftAt) {
      last.leftAt = segment.leftAt;
    }
  }
  return merged;
}

export function calculateAttendedSeconds(segments: AttendanceSegment[]) {
  return mergeAttendanceSegments(segments).reduce((sum, segment) => sum + Math.round((segment.leftAt.getTime() - segment.joinedAt.getTime()) / 1000), 0);
}

export function calculateAttendanceStatus({
  attendedSeconds,
  scheduledSeconds,
  minimumPercentage = 75,
  hostConfirmed = false,
}: {
  attendedSeconds: number;
  scheduledSeconds: number;
  minimumPercentage?: number;
  hostConfirmed?: boolean;
}) {
  if (hostConfirmed) return "manually_confirmed";
  if (scheduledSeconds <= 0 || attendedSeconds <= 0) return "absent";
  const percentage = (attendedSeconds / scheduledSeconds) * 100;
  if (percentage >= minimumPercentage) return "present";
  if (percentage > 0) return "partially_present";
  return "absent";
}

export function calculateLearningHours(attendedSeconds: number, maxEligibleSeconds: number) {
  const eligibleSeconds = Math.max(0, Math.min(attendedSeconds, maxEligibleSeconds));
  return Math.round((eligibleSeconds / 3600) * 100) / 100;
}
