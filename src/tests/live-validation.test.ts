import { describe, expect, it } from "vitest";
import { liveIncidentSchema, liveRegistrationSchema, liveSessionSchema } from "@/lib/validation/live";

const uuid = "00000000-0000-4000-8000-000000000001";

describe("live validation", () => {
  it("validates session creation", () => {
    const parsed = liveSessionSchema.parse({
      ownerWorkspaceId: uuid,
      title: "Saturday HR Live Class",
      startsAt: "2026-07-25T19:00",
      durationMinutes: "90",
      timezone: "Africa/Nairobi",
    });

    expect(parsed.durationMinutes).toBe(90);
  });

  it("validates registration", () => {
    expect(liveRegistrationSchema.parse({ sessionId: uuid, email: "learner@example.com", termsAccepted: "true" }).termsAccepted).toBe(true);
  });

  it("requires meaningful incident descriptions", () => {
    expect(() => liveIncidentSchema.parse({ sessionId: uuid, incidentType: "other", description: "short" })).toThrow();
  });
});
