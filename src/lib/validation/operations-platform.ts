import { z } from "zod";

const optionalUuid = z.string().uuid().optional().or(z.literal(""));

export const subscriptionPlanSchema = z.object({
  name: z.string().min(2).max(160),
  slug: z.string().min(2).max(120),
  audience: z.enum(["individual", "instructor", "academy", "organization", "government", "university", "custom_enterprise"]),
  description: z.string().max(1000).optional(),
  priceMinor: z.coerce.number().int().min(0),
  currency: z.string().min(3).max(3).default("KES"),
  billingInterval: z.enum(["free", "monthly", "annual", "custom"]),
  trialDays: z.coerce.number().int().min(0).max(365).default(0),
});

export const subscriptionSchema = z.object({
  planId: z.string().uuid(),
  subscriberUserId: optionalUuid,
  workspaceId: optionalUuid,
  academyId: optionalUuid,
  organizationId: optionalUuid,
  customerName: z.string().min(2).max(180),
  customerEmail: z.email().optional().or(z.literal("")),
  status: z.enum(["draft", "trial", "active", "grace_period", "past_due", "suspended", "cancelled", "expired", "upgraded", "downgraded", "renewed"]).default("draft"),
});

export const invoiceSchema = z.object({
  subscriptionId: optionalUuid,
  customerName: z.string().min(2).max(180),
  customerEmail: z.email().optional().or(z.literal("")),
  description: z.string().min(2).max(240),
  unitAmountMinor: z.coerce.number().int().min(0),
  quantity: z.coerce.number().min(1).max(1000).default(1),
  taxRate: z.coerce.number().min(0).max(100).default(0),
});

export const revenueRuleSchema = z.object({
  name: z.string().min(2).max(160),
  scope: z.enum(["platform", "academy", "course", "instructor", "organization", "marketplace"]),
  beneficiaryType: z.enum(["platform", "instructor", "academy", "enterprise", "affiliate"]),
  percentage: z.coerce.number().min(0).max(100),
  fixedAmountMinor: z.coerce.number().int().min(0).default(0),
  minimumPayoutMinor: z.coerce.number().int().min(0).default(0),
});

export const supportTicketSchema = z.object({
  workspaceId: optionalUuid,
  category: z.string().min(2).max(80),
  priority: z.enum(["low", "normal", "high", "urgent"]).default("normal"),
  subject: z.string().min(3).max(180),
  description: z.string().min(10).max(5000),
});

export const supportMessageSchema = z.object({
  ticketId: z.string().uuid(),
  body: z.string().min(1).max(5000),
  messageType: z.enum(["customer_reply", "support_reply", "internal_note"]).default("customer_reply"),
});

export const featureFlagSchema = z.object({
  flagKey: z.string().min(2).max(120),
  description: z.string().max(500).optional(),
  enabled: z.coerce.boolean().default(false),
  scope: z.enum(["global", "workspace", "user", "beta_group"]).default("global"),
  workspaceId: optionalUuid,
  userId: optionalUuid,
  betaGroup: z.string().max(120).optional(),
});

export const complianceRequestSchema = z.object({
  requestType: z.enum(["data_export", "data_deletion", "privacy_question", "consent_review", "correction", "objection"]),
  jurisdiction: z.string().min(2).max(20).default("KE"),
  description: z.string().min(10).max(5000),
});

export const healthCheckSchema = z.object({
  service: z.string().min(2).max(120),
  checkName: z.string().min(2).max(120),
  status: z.enum(["healthy", "degraded", "down", "unknown"]),
  latencyMs: z.coerce.number().int().min(0).optional(),
});
