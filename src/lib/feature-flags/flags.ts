export const initialFeatureFlags = [
  "academy_applications",
  "instructor_applications",
  "course_builder",
  "solco_live_classes",
  "ai_tutor",
  "ai_course_creator",
  "marketplace",
  "enterprise_learning",
  "scholarships",
  "affiliate_program",
  "custom_domains",
] as const;

export type FeatureFlagKey = (typeof initialFeatureFlags)[number];

export function isKnownFeatureFlag(value: string): value is FeatureFlagKey {
  return initialFeatureFlags.includes(value as FeatureFlagKey);
}
