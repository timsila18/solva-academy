import type { CourseReadinessInput, CourseStatus, CourseTransition } from "@/types/course";

export const allowedCourseTransitions: CourseTransition[] = [
  { from: "draft", to: "in_development", permission: "course.edit.assigned" },
  { from: "in_development", to: "ready_internal_review", permission: "course.submit_review.assigned" },
  { from: "ready_internal_review", to: "submitted_review", permission: "course.submit_review.assigned" },
  { from: "submitted_review", to: "under_review", permission: "course.review.assigned" },
  { from: "under_review", to: "changes_requested", permission: "course.review.assigned" },
  { from: "changes_requested", to: "resubmitted", permission: "course.submit_review.assigned" },
  { from: "resubmitted", to: "under_review", permission: "course.review.assigned" },
  { from: "under_review", to: "approved", permission: "course.approve.assigned" },
  { from: "approved", to: "published", permission: "course.publish.assigned" },
  { from: "published", to: "unpublished", permission: "course.publish.assigned" },
  { from: "published", to: "suspended", permission: "course.publish.assigned" },
  { from: "published", to: "archived", permission: "course.archive.assigned" },
  { from: "rejected", to: "archived", permission: "course.archive.assigned" },
];

export function canTransitionCourse({
  from,
  to,
  permissions,
}: {
  from: CourseStatus;
  to: CourseStatus;
  permissions: string[];
}) {
  const transition = allowedCourseTransitions.find((item) => item.from === from && item.to === to);
  if (!transition) return false;
  return permissions.includes(transition.permission) || permissions.includes("settings.manage.platform");
}

export function getReadinessErrors(input: CourseReadinessInput) {
  const errors: string[] = [];
  if (!input.title || input.title.trim().length < 3) errors.push("Course title is missing.");
  if (!input.shortDescription || input.shortDescription.trim().length < 20) {
    errors.push("Short description must explain the course clearly.");
  }
  if (!input.schoolId) errors.push("A school is required.");
  if (!input.courseTypeId) errors.push("A course type is required.");
  if (!input.levelId) errors.push("A course level is required.");
  if (input.learningOutcomes < 1) errors.push("At least one measurable learning outcome is required.");
  if (input.modules < 1) errors.push("At least one module is required.");
  if (input.lessons < 1) errors.push("At least one lesson is required.");
  return errors;
}

export function detectCircularLessonPrerequisite(edges: Array<{ lessonId: string; prerequisiteLessonId: string }>) {
  const graph = new Map<string, string[]>();
  for (const edge of edges) {
    graph.set(edge.lessonId, [...(graph.get(edge.lessonId) ?? []), edge.prerequisiteLessonId]);
  }

  const visiting = new Set<string>();
  const visited = new Set<string>();

  function visit(node: string): boolean {
    if (visiting.has(node)) return true;
    if (visited.has(node)) return false;
    visiting.add(node);
    for (const next of graph.get(node) ?? []) {
      if (visit(next)) return true;
    }
    visiting.delete(node);
    visited.add(node);
    return false;
  }

  return [...graph.keys()].some(visit);
}
