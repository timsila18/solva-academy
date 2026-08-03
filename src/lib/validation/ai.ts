import { z } from "zod";

const optionalUuid = z.string().uuid().optional().or(z.literal(""));

export const aiContextSchema = z.object({
  workspaceId: optionalUuid,
  academyId: optionalUuid,
  organizationId: optionalUuid,
  courseId: optionalUuid,
  enrollmentId: optionalUuid,
  language: z.string().min(2).max(12).default("en"),
});

export const aiTutorSchema = aiContextSchema.extend({
  conversationId: optionalUuid,
  question: z.string().min(3).max(4000),
  learnerLevel: z.string().max(120).optional(),
  childSafetyMode: z.coerce.boolean().default(false),
});

export const courseCreatorSchema = aiContextSchema.extend({
  topic: z.string().min(3).max(240),
  audience: z.string().min(2).max(240),
  level: z.string().min(2).max(120),
  learningOutcomes: z.string().max(2000).optional(),
  constraints: z.string().max(2000).optional(),
});

export const assessmentDraftSchema = aiContextSchema.extend({
  assessmentType: z.enum(["quiz", "assignment", "rubric"]),
  topic: z.string().min(3).max(240),
  outcomes: z.string().min(3).max(2000),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
  itemCount: z.coerce.number().int().min(1).max(20).default(5),
});

export const feedbackDraftSchema = aiContextSchema.extend({
  learnerWork: z.string().min(10).max(6000),
  rubric: z.string().max(3000).optional(),
  tone: z.enum(["encouraging", "direct", "formal", "child_safe"]).default("encouraging"),
});

export const translationSchema = aiContextSchema.extend({
  sourceLanguage: z.string().min(2).max(30),
  targetLanguage: z.string().min(2).max(30),
  sourceType: z.enum(["message", "lesson", "course", "resource", "manual"]).default("manual"),
  sourceId: optionalUuid,
  text: z.string().min(1).max(10000),
});

export const accessibilityAssistSchema = aiContextSchema.extend({
  task: z.enum(["simplify", "summarize", "caption", "reading_level", "screen_reader", "plain_language"]),
  content: z.string().min(1).max(10000),
  learnerNeed: z.string().max(500).optional(),
});

export const semanticSearchSchema = aiContextSchema.extend({
  query: z.string().min(2).max(500),
  visibility: z.enum(["private", "workspace", "academy", "organization", "public"]).optional(),
});

export const enterpriseInsightSchema = aiContextSchema.extend({
  organizationId: z.string().uuid(),
  question: z.string().min(3).max(2000),
  metricFocus: z.enum(["completion", "compliance", "skills", "assignments", "certificates", "campaigns"]).default("completion"),
});

export const aiIndexSchema = aiContextSchema.extend({
  name: z.string().min(2).max(160),
  sourceType: z.enum(["course", "lesson", "resource", "academy", "organization", "enterprise", "public_page", "manual"]),
  sourceId: optionalUuid,
  title: z.string().min(2).max(240),
  body: z.string().min(10).max(20000),
  visibility: z.enum(["private", "workspace", "academy", "organization", "public"]).default("private"),
});

export type AiTutorInput = z.infer<typeof aiTutorSchema>;
export type CourseCreatorInput = z.infer<typeof courseCreatorSchema>;
export type AssessmentDraftInput = z.infer<typeof assessmentDraftSchema>;
export type FeedbackDraftInput = z.infer<typeof feedbackDraftSchema>;
export type TranslationInput = z.infer<typeof translationSchema>;
export type AccessibilityAssistInput = z.infer<typeof accessibilityAssistSchema>;
export type SemanticSearchInput = z.infer<typeof semanticSearchSchema>;
export type EnterpriseInsightInput = z.infer<typeof enterpriseInsightSchema>;
export type AiIndexInput = z.infer<typeof aiIndexSchema>;
