import { z } from "zod";

export const liveSessionSchema = z.object({
  ownerWorkspaceId: z.string().uuid(),
  sessionTypeId: z.string().uuid().optional().or(z.literal("")),
  title: z.string().min(3).max(180),
  shortDescription: z.string().max(500).optional(),
  fullDescription: z.string().max(5000).optional(),
  courseId: z.string().uuid().optional().or(z.literal("")),
  academyId: z.string().uuid().optional().or(z.literal("")),
  organizationId: z.string().uuid().optional().or(z.literal("")),
  campaignId: z.string().uuid().optional().or(z.literal("")),
  learningAssignmentId: z.string().uuid().optional().or(z.literal("")),
  startsAt: z.string().min(1),
  durationMinutes: z.coerce.number().int().positive().max(1440),
  timezone: z.string().min(2).default("Africa/Nairobi"),
  capacity: z.coerce.number().int().positive().optional(),
  language: z.string().min(2).default("en"),
  visibility: z.enum(["private", "workspace", "course", "academy", "organization", "public", "unlisted"]).default("private"),
  registrationMode: z.enum(["course_enrollment", "manual", "invitation_only", "organization_assigned", "academy_assigned", "public", "approval_required", "paid_placeholder", "private_link", "closed_group"]).default("invitation_only"),
  recordingPolicy: z.enum(["disabled", "host_controlled", "automatic", "explicit_authorization_required"]).default("host_controlled"),
  childSafetyEnabled: z.coerce.boolean().default(false),
});

export const liveRegistrationSchema = z.object({
  sessionId: z.string().uuid(),
  name: z.string().min(2).max(160).optional(),
  email: z.email().optional(),
  termsAccepted: z.coerce.boolean().default(true),
  guardianConsent: z.coerce.boolean().default(false),
});

export const liveChatSchema = z.object({
  sessionId: z.string().uuid(),
  occurrenceId: z.string().uuid().optional().or(z.literal("")),
  message: z.string().min(1).max(2000),
});

export const livePollSchema = z.object({
  sessionId: z.string().uuid(),
  question: z.string().min(3).max(500),
  pollType: z.enum(["single_choice", "multiple_choice", "true_false", "rating", "word_cloud_placeholder", "open_response"]).default("single_choice"),
  options: z.string().optional(),
});

export const livePollResponseSchema = z.object({
  pollId: z.string().uuid(),
  response: z.string().min(1).max(2000),
});

export const liveIncidentSchema = z.object({
  sessionId: z.string().uuid(),
  occurrenceId: z.string().uuid().optional().or(z.literal("")),
  incidentType: z.enum(["harassment", "inappropriate_content", "unauthorized_recording", "disruption", "impersonation", "child_safety_concern", "threat", "spam", "privacy_breach", "technical_abuse", "other"]),
  description: z.string().min(10).max(4000),
  severity: z.enum(["low", "normal", "high", "critical"]).default("normal"),
});

export const attendanceCorrectionSchema = z.object({
  attendanceId: z.string().uuid(),
  originalStatus: z.string().min(2),
  newStatus: z.enum(["present", "partially_present", "late", "excused", "absent", "no_show", "removed", "technical_issue", "manually_confirmed"]),
  reason: z.string().min(5).max(1000),
});
