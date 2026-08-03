import { z } from "zod";

export const employeeSchema = z.object({
  organizationId: z.string().uuid(),
  departmentId: z.string().uuid().optional().or(z.literal("")),
  managerEmployeeId: z.string().uuid().optional().or(z.literal("")),
  employeeNumber: z.string().max(80).optional(),
  fullName: z.string().min(2).max(160),
  email: z.email(),
  roleTitle: z.string().max(160).optional(),
  location: z.string().max(160).optional(),
  employmentType: z.enum(["employee", "contractor", "intern", "volunteer", "student", "external_trainee"]).default("employee"),
});

export const departmentSchema = z.object({
  organizationId: z.string().uuid(),
  parentId: z.string().uuid().optional().or(z.literal("")),
  managerId: z.string().uuid().optional().or(z.literal("")),
  learningCoordinatorId: z.string().uuid().optional().or(z.literal("")),
  name: z.string().min(2).max(120),
  description: z.string().max(1000).optional(),
  costCenter: z.string().max(80).optional(),
  status: z.enum(["active", "archived"]).default("active"),
});

export const teamSchema = z.object({
  organizationId: z.string().uuid(),
  departmentId: z.string().uuid().optional().or(z.literal("")),
  managerEmployeeId: z.string().uuid().optional().or(z.literal("")),
  name: z.string().min(2).max(120),
  description: z.string().max(1000).optional(),
  teamType: z.enum(["team", "project", "committee", "taskforce"]).default("team"),
});

export const learningAssignmentSchema = z.object({
  organizationId: z.string().uuid(),
  courseId: z.string().uuid().optional().or(z.literal("")),
  learningPathId: z.string().uuid().optional().or(z.literal("")),
  campaignId: z.string().uuid().optional().or(z.literal("")),
  title: z.string().min(2).max(160),
  targetType: z.enum(["employee", "department", "team", "role", "organization"]),
  targetEmployeeId: z.string().uuid().optional().or(z.literal("")),
  targetDepartmentId: z.string().uuid().optional().or(z.literal("")),
  targetTeamId: z.string().uuid().optional().or(z.literal("")),
  targetRole: z.string().max(120).optional(),
  mandatory: z.coerce.boolean().default(true),
  priority: z.enum(["low", "normal", "high", "urgent"]).default("normal"),
  reason: z.string().max(1000).optional(),
  dueAt: z.string().optional(),
  certificateRequired: z.coerce.boolean().default(false),
});

export const campaignSchema = z.object({
  organizationId: z.string().uuid(),
  name: z.string().min(2).max(160),
  description: z.string().max(1200).optional(),
  campaignType: z.enum(["learning", "onboarding", "compliance", "skills", "renewal"]).default("learning"),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
});

export const skillSchema = z.object({
  organizationId: z.string().uuid(),
  name: z.string().min(2).max(120),
  description: z.string().max(1000).optional(),
  category: z.string().max(120).optional(),
});

export const announcementSchema = z.object({
  organizationId: z.string().uuid(),
  title: z.string().min(2).max(160),
  body: z.string().min(2).max(4000),
  targetType: z.enum(["organization", "department", "team", "employee"]).default("organization"),
  departmentId: z.string().uuid().optional().or(z.literal("")),
  teamId: z.string().uuid().optional().or(z.literal("")),
  employeeId: z.string().uuid().optional().or(z.literal("")),
  priority: z.enum(["low", "normal", "high", "urgent"]).default("normal"),
  publishNow: z.coerce.boolean().default(true),
});

export const importPreviewSchema = z.object({
  organizationId: z.string().uuid(),
  sourceType: z.enum(["csv", "excel", "api", "hr_integration"]).default("csv"),
  totalRows: z.coerce.number().int().nonnegative(),
  validRows: z.coerce.number().int().nonnegative(),
  invalidRows: z.coerce.number().int().nonnegative(),
  duplicateEmails: z.coerce.number().int().nonnegative().default(0),
  duplicateEmployeeNumbers: z.coerce.number().int().nonnegative().default(0),
});
