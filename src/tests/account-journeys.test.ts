import { describe, expect, it } from "vitest";
import { accountJourneys, journeyDestination, safeReturnPath } from "@/lib/auth/journeys";
import { signUpSchema } from "@/lib/validation/auth";

describe("account journeys", () => {
  it("routes self-service choices to the appropriate next step", () => {
    expect(journeyDestination("academy")).toBe("/academies/start");
    expect(journeyDestination("instructor")).toBe("/instructors/apply");
    expect(journeyDestination("organization")).toBe("/organizations/create");
    expect(journeyDestination("learner")).toBe("/learner");
    expect(accountJourneys.some((journey) => String(journey.id).includes("admin"))).toBe(false);
  });
  it("keeps the requested academy application after sign-in", () => {
    expect(safeReturnPath("/academies/start")).toBe("/academies/start");
    expect(safeReturnPath("/learn/123?lesson=456")).toBe("/learn/123?lesson=456");
  });
  it.each(["https://evil.example", "//evil.example", "/\\evil.example", "/auth/sign-out", "/%2f%2fevil.example", "/unknown", "javascript:alert(1)"])("rejects an unsafe return destination: %s", (path) => {
    expect(safeReturnPath(path)).toBe("/welcome");
  });
  it("rejects administrator as a signup choice", () => {
    const result = signUpSchema.safeParse({ fullName: "Test User", email: "test@example.com", password: "TestPassword123!", confirmPassword: "TestPassword123!", country: "KE", preferredLanguage: "en", ageBracket: "adult", termsAccepted: "on", privacyAcknowledged: "on", intent: "super-admin" });
    expect(result.success).toBe(false);
  });
});
