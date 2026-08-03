import { z } from "zod";
import { apiScopes } from "@/lib/api/keys";

export const apiKeySchema = z.object({
  workspaceId: z.string().uuid().optional().or(z.literal("")),
  academyId: z.string().uuid().optional().or(z.literal("")),
  organizationId: z.string().uuid().optional().or(z.literal("")),
  name: z.string().min(2).max(160),
  scopes: z.string().min(1),
  environment: z.enum(["development", "staging", "production"]).default("production"),
  expiresAt: z.string().optional().or(z.literal("")),
}).refine((value) => value.scopes.split(",").every((scope) => apiScopes.includes(scope.trim() as never)), "Unknown API scope.");

export const webhookEndpointSchema = z.object({
  workspaceId: z.string().uuid().optional().or(z.literal("")),
  academyId: z.string().uuid().optional().or(z.literal("")),
  organizationId: z.string().uuid().optional().or(z.literal("")),
  name: z.string().min(2).max(160),
  url: z.url(),
  eventTypes: z.string().min(1),
});

export const feedbackSchema = z.object({
  workspaceId: z.string().uuid().optional().or(z.literal("")),
  feedbackType: z.enum(["platform_usability", "course_experience", "live_session", "ai_assistance", "support_experience", "enterprise_admin"]),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  comment: z.string().max(4000).optional(),
  consentToContact: z.coerce.boolean().default(false),
});
