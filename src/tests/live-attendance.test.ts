import { describe, expect, it } from "vitest";
import { calculateAttendanceStatus, calculateAttendedSeconds, calculateLearningHours, mergeAttendanceSegments } from "@/lib/live/attendance";

describe("live attendance", () => {
  it("merges reconnects inside the grace window", () => {
    const merged = mergeAttendanceSegments([
      { joinedAt: new Date("2026-07-25T10:00:00Z"), leftAt: new Date("2026-07-25T10:10:00Z") },
      { joinedAt: new Date("2026-07-25T10:11:00Z"), leftAt: new Date("2026-07-25T10:20:00Z") },
    ]);

    expect(merged).toHaveLength(1);
    expect(calculateAttendedSeconds(merged)).toBe(1200);
  });

  it("calculates attendance status using thresholds", () => {
    expect(calculateAttendanceStatus({ attendedSeconds: 45 * 60, scheduledSeconds: 60 * 60, minimumPercentage: 75 })).toBe("present");
    expect(calculateAttendanceStatus({ attendedSeconds: 20 * 60, scheduledSeconds: 60 * 60, minimumPercentage: 75 })).toBe("partially_present");
    expect(calculateAttendanceStatus({ attendedSeconds: 0, scheduledSeconds: 60 * 60 })).toBe("absent");
    expect(calculateAttendanceStatus({ attendedSeconds: 0, scheduledSeconds: 60 * 60, hostConfirmed: true })).toBe("manually_confirmed");
  });

  it("caps learning hours at eligible duration", () => {
    expect(calculateLearningHours(7200, 3600)).toBe(1);
  });
});
