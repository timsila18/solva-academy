import { z } from "zod";

export const createCourseSchema = z.object({
  owningWorkspaceId: z.string().uuid(),
  academyId: z.string().uuid().optional().or(z.literal("")),
  title: z.string().min(3),
  slug: z.string().min(3),
  subtitle: z.string().optional(),
  shortDescription: z.string().min(20),
  fullDescription: z.string().optional(),
  schoolId: z.string().uuid().optional().or(z.literal("")),
  primaryCategoryId: z.string().uuid().optional().or(z.literal("")),
  courseTypeId: z.string().uuid().optional().or(z.literal("")),
  levelId: z.string().uuid().optional().or(z.literal("")),
  language: z.string().min(2),
  targetLearner: z.string().optional(),
  prerequisites: z.string().optional(),
  estimatedDurationMinutes: z.coerce.number().int().min(0),
  deliveryFormat: z.string().min(2),
  visibility: z.enum(["private", "unlisted", "public"]).default("private"),
});

export const moduleSchema = z.object({
  courseId: z.string().uuid(),
  versionId: z.string().uuid().optional().or(z.literal("")),
  title: z.string().min(3),
  description: z.string().optional(),
  learningObjectives: z.string().optional(),
  estimatedDurationMinutes: z.coerce.number().int().min(0),
  displayOrder: z.coerce.number().int().min(1),
  required: z.enum(["on"]).optional(),
});

export const lessonSchema = z.object({
  courseId: z.string().uuid(),
  moduleId: z.string().uuid(),
  versionId: z.string().uuid().optional().or(z.literal("")),
  title: z.string().min(3),
  slug: z.string().min(3),
  lessonType: z.string().min(2),
  shortSummary: z.string().optional(),
  learningObjective: z.string().optional(),
  estimatedDurationMinutes: z.coerce.number().int().min(0),
  displayOrder: z.coerce.number().int().min(1),
  previewAvailable: z.enum(["on"]).optional(),
});

export const outcomeSchema = z.object({
  courseId: z.string().uuid(),
  statement: z.string().min(10),
  skillId: z.string().uuid().optional().or(z.literal("")),
  competencyLevel: z.string().optional(),
  displayOrder: z.coerce.number().int().min(1),
});

export const resourceSchema = z.object({
  courseId: z.string().uuid(),
  moduleId: z.string().uuid().optional().or(z.literal("")),
  lessonId: z.string().uuid().optional().or(z.literal("")),
  title: z.string().min(3),
  description: z.string().optional(),
  resourceType: z.string().min(2),
  filePath: z.string().optional(),
  externalUrl: z.string().url().optional().or(z.literal("")),
  copyrightDeclaration: z.enum([
    "created_by_me",
    "academy_owned",
    "permission_granted",
    "licensed_for_use",
    "official_public_resource",
    "exception_requires_review",
  ]),
  attribution: z.string().optional(),
  license: z.string().optional(),
});

export const assessmentSchema = z.object({
  courseId: z.string().uuid(),
  moduleId: z.string().uuid().optional().or(z.literal("")),
  lessonId: z.string().uuid().optional().or(z.literal("")),
  assessmentType: z.enum(["quiz", "assignment", "practical", "project", "final"]),
  title: z.string().min(3),
  stakes: z.enum(["practice", "formative", "summative", "final", "high_stakes"]),
  reviewMethod: z.enum(["automated", "manual"]),
  required: z.enum(["on"]).optional(),
});

export const reviewSubmissionSchema = z.object({
  courseId: z.string().uuid(),
  changeSummary: z.string().min(10),
});

export const publishCourseSchema = z.object({
  courseId: z.string().uuid(),
  versionId: z.string().uuid(),
  reason: z.string().optional(),
});
