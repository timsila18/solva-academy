import { describe, expect, it } from "vitest";
import { createIcsEvent, getJoinWindowState } from "@/lib/live/calendar";

describe("live calendar", () => {
  it("creates Outlook and Apple compatible ICS content", () => {
    const ics = createIcsEvent({
      uid: "session-1",
      title: "Payroll Webinar",
      description: "PAYE, NSSF, and SHIF",
      startsAt: new Date("2026-07-25T16:00:00Z"),
      endsAt: new Date("2026-07-25T17:00:00Z"),
      url: "https://academy.solvaone.co.ke/live/payroll-webinar",
    });

    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("SUMMARY:Payroll Webinar");
    expect(ics).toContain("DTSTART:20260725T160000Z");
  });

  it("calculates join window states", () => {
    const startsAt = new Date("2026-07-25T16:00:00Z");
    const endsAt = new Date("2026-07-25T17:00:00Z");
    expect(getJoinWindowState({ now: new Date("2026-07-25T15:40:00Z"), startsAt, endsAt, earlyAccessMinutes: 10, lateJoinMinutes: 15 })).toBe("too_early");
    expect(getJoinWindowState({ now: new Date("2026-07-25T15:55:00Z"), startsAt, endsAt, earlyAccessMinutes: 10, lateJoinMinutes: 15 })).toBe("open");
    expect(getJoinWindowState({ now: new Date("2026-07-25T16:20:00Z"), startsAt, endsAt, earlyAccessMinutes: 10, lateJoinMinutes: 15 })).toBe("locked");
    expect(getJoinWindowState({ now: new Date("2026-07-25T17:10:00Z"), startsAt, endsAt, earlyAccessMinutes: 10, lateJoinMinutes: 15 })).toBe("ended");
  });
});
