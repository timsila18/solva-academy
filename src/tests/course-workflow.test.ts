import { describe, expect, it } from "vitest";
import { canTransitionCourse, detectCircularLessonPrerequisite, getReadinessErrors } from "@/lib/courses/workflow";

describe("course workflow foundation", () => {
  it("blocks review submission when readiness requirements are missing", () => {
    const errors = getReadinessErrors({
      title: "HR",
      shortDescription: "Too short",
      schoolId: null,
      courseTypeId: null,
      levelId: null,
      learningOutcomes: 0,
      modules: 0,
      lessons: 0,
    });

    expect(errors.length).toBeGreaterThan(5);
  });

  it("passes readiness for a minimally complete course", () => {
    const errors = getReadinessErrors({
      title: "Payroll Foundations",
      shortDescription: "A practical introduction to Kenyan payroll foundations.",
      schoolId: "school-a",
      courseTypeId: "type-a",
      levelId: "level-a",
      learningOutcomes: 2,
      modules: 1,
      lessons: 3,
    });

    expect(errors).toEqual([]);
  });

  it("requires publishing permission for approved to published transition", () => {
    expect(canTransitionCourse({ from: "approved", to: "published", permissions: ["course.publish.assigned"] })).toBe(true);
    expect(canTransitionCourse({ from: "approved", to: "published", permissions: ["course.edit.assigned"] })).toBe(false);
  });

  it("detects circular lesson prerequisites", () => {
    expect(detectCircularLessonPrerequisite([
      { lessonId: "a", prerequisiteLessonId: "b" },
      { lessonId: "b", prerequisiteLessonId: "c" },
      { lessonId: "c", prerequisiteLessonId: "a" },
    ])).toBe(true);
  });
});
