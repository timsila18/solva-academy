import { describe, expect, it } from "vitest";
import { coreSkills, findSchoolBySlug, solvaSchools } from "@/lib/catalog/learning-structure";

describe("Solva learning structure catalogue", () => {
  it("keeps school slugs unique and populated with skills and paths", () => {
    const slugs = new Set(solvaSchools.map((school) => school.slug));

    expect(slugs.size).toBe(solvaSchools.length);
    expect(solvaSchools.length).toBeGreaterThanOrEqual(6);
    expect(solvaSchools.every((school) => school.categories.length > 0)).toBe(true);
    expect(solvaSchools.every((school) => school.skills.length > 0)).toBe(true);
    expect(solvaSchools.every((school) => school.paths.length > 0)).toBe(true);
  });

  it("supports school detail lookup by slug", () => {
    expect(findSchoolBySlug("human-resources")?.skills).toContain("Payroll Processing");
    expect(findSchoolBySlug("missing-school")).toBeUndefined();
  });

  it("builds a reusable skills catalogue across schools", () => {
    expect(coreSkills).toContain("Excel");
    expect(coreSkills).toContain("Payroll Processing");
    expect(coreSkills).toEqual([...coreSkills].sort());
  });
});
