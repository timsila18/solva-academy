import { z } from "zod";

export const payoutRequestSchema = z.object({
  academyId: z.string().uuid().optional().or(z.literal("")),
  workspaceId: z.string().uuid().optional().or(z.literal("")),
  amountMinor: z.coerce.number().int().positive(),
  currency: z.string().min(3).max(3).default("KES"),
  destinationLabel: z.string().min(3).max(120),
  method: z.string().min(3).max(60).default("manual"),
  notes: z.string().max(1000).optional(),
});

export const payoutDecisionSchema = z.object({
  payoutRequestId: z.string().uuid(),
  status: z.enum(["under_review", "clarification_requested", "approved", "rejected", "paid", "cancelled"]),
  decisionReason: z.string().max(1000).optional(),
  paymentReference: z.string().max(120).optional(),
});

export const academyPolicySchema = z.object({
  academyId: z.string().uuid(),
  internalReviewRequired: z.coerce.boolean().default(true),
  courseBrandingRules: z.string().max(2000).optional(),
  assessmentRules: z.string().max(2000).optional(),
  refundGuidance: z.string().max(2000).optional(),
  communicationPreferences: z.string().max(2000).optional(),
  learnerConduct: z.string().max(2000).optional(),
  instructorExpectations: z.string().max(2000).optional(),
  visibility: z.enum(["internal", "public"]).default("internal"),
});

export const storefrontSettingsSchema = z.object({
  academyId: z.string().uuid(),
  headline: z.string().max(140).optional(),
  description: z.string().max(2000).optional(),
  publicVisibility: z.enum(["private", "public", "unlisted"]).default("public"),
  showInstructors: z.coerce.boolean().default(true),
  showCertificates: z.coerce.boolean().default(true),
});

export const gradingActivitySchema = z.object({
  courseId: z.string().uuid().optional().or(z.literal("")),
  enrollmentId: z.string().uuid().optional().or(z.literal("")),
  assignmentSubmissionId: z.string().uuid().optional().or(z.literal("")),
  quizAttemptAnswerId: z.string().uuid().optional().or(z.literal("")),
  activityType: z.enum(["assignment_feedback_drafted", "assignment_grade_published", "assignment_returned", "quiz_score_drafted", "quiz_score_published", "private_note_added"]),
  score: z.coerce.number().optional(),
  maxScore: z.coerce.number().optional(),
  learnerFeedback: z.string().max(4000).optional(),
  privateNote: z.string().max(4000).optional(),
  status: z.enum(["draft", "published", "returned"]).default("draft"),
});
