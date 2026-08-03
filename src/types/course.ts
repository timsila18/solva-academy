export type CourseStatus =
  | "draft"
  | "in_development"
  | "ready_internal_review"
  | "submitted_review"
  | "under_review"
  | "changes_requested"
  | "resubmitted"
  | "approved"
  | "scheduled"
  | "published"
  | "unpublished"
  | "suspended"
  | "archived"
  | "rejected";

export type QuestionType =
  | "single_choice"
  | "multiple_choice"
  | "true_false"
  | "matching"
  | "ordering"
  | "short_answer"
  | "long_answer"
  | "numeric";

export type CourseReadinessInput = {
  title?: string;
  shortDescription?: string;
  schoolId?: string | null;
  courseTypeId?: string | null;
  levelId?: string | null;
  learningOutcomes: number;
  modules: number;
  lessons: number;
};

export type CourseTransition = {
  from: CourseStatus;
  to: CourseStatus;
  permission: string;
};
