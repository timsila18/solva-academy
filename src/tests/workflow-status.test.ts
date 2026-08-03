import { describe, expect, it } from "vitest";
import { academyApplicationSchema, instructorApplicationSchema, organizationSchema } from "@/lib/validation/tenant";

describe("application workflow validation", () => {
  it("accepts a complete academy application", () => {
    const result = academyApplicationSchema.safeParse({
      academyName: "Timothy Sila HR Academy",
      slug: "timothy-sila-hr",
      shortDescription: "Practical HR learning for Kenyan professionals.",
      schoolId: "",
      website: "",
      experience: "HR and payroll training.",
      country: "KE",
      county: "Nairobi",
      whyTeach: "To help professionals learn practical HR skills.",
      expectedAudience: "HR officers, founders, managers.",
      termsAccepted: "on",
    });

    expect(result.success).toBe(true);
  });

  it("requires substantive instructor biography", () => {
    const result = instructorApplicationSchema.safeParse({
      biography: "Too short",
      expertise: "Payroll",
      schoolId: "",
      languages: "English",
      sampleLessonUrl: "",
      identityConfirmation: "on",
      childTeachingPreference: "not_requested",
    });

    expect(result.success).toBe(false);
  });

  it("accepts organization creation foundation fields", () => {
    const result = organizationSchema.safeParse({
      name: "Solva Business Group",
      slug: "solva-business-group",
      type: "Company",
      industry: "Technology",
      country: "KE",
      county: "Nairobi",
      description: "Internal learning workspace for employees.",
      website: "",
      primaryContact: "Timothy Sila",
      employeeSize: "11-50",
    });

    expect(result.success).toBe(true);
  });
});
