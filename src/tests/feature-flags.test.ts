import { describe, expect, it } from "vitest";
import { initialFeatureFlags, isKnownFeatureFlag } from "@/lib/feature-flags/flags";

describe("feature flag foundation", () => {
  it("includes future extension flags without enabling fake features", () => {
    expect(initialFeatureFlags).toContain("ai_tutor");
    expect(initialFeatureFlags).toContain("solco_live_classes");
    expect(initialFeatureFlags).toContain("enterprise_learning");
  });

  it("recognizes only seeded feature flags", () => {
    expect(isKnownFeatureFlag("course_builder")).toBe(true);
    expect(isKnownFeatureFlag("fake_feature")).toBe(false);
  });
});
