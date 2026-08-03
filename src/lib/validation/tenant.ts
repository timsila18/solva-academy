import { z } from "zod";

export const schoolSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  themeColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  visibility: z.enum(["public", "hidden", "admin_only"]),
  status: z.enum(["draft", "published", "archived"]),
  featured: z.boolean().default(false),
});

export const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  schoolId: z.string().uuid(),
  parentId: z.string().uuid().optional().or(z.literal("")),
  description: z.string().optional(),
  status: z.enum(["draft", "active", "archived"]).default("active"),
});

export const skillSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  status: z.enum(["draft", "active", "archived"]).default("active"),
});

export const academyApplicationSchema = z.object({
  academyName: z.string().min(3),
  slug: z.string().min(3),
  shortDescription: z.string().min(20),
  schoolId: z.string().uuid().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
  experience: z.string().optional(),
  country: z.string().min(2),
  county: z.string().optional(),
  whyTeach: z.string().min(20),
  expectedAudience: z.string().min(10),
  termsAccepted: z.literal("on"),
});

export const instructorApplicationSchema = z.object({
  biography: z.string().min(40),
  experience: z.string().optional(),
  expertise: z.string().min(3),
  schoolId: z.string().uuid().optional().or(z.literal("")),
  languages: z.string().min(2),
  teachingStyle: z.string().optional(),
  portfolioLinks: z.string().optional(),
  sampleLessonUrl: z.string().url().optional().or(z.literal("")),
  availability: z.string().optional(),
  identityConfirmation: z.literal("on"),
  childTeachingPreference: z.enum(["not_requested", "interested", "not_interested"]),
});

export const organizationSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  type: z.string().min(2),
  industry: z.string().optional(),
  country: z.string().min(2),
  county: z.string().optional(),
  description: z.string().min(10),
  website: z.string().url().optional().or(z.literal("")),
  primaryContact: z.string().min(2),
  employeeSize: z.string().min(1),
});

export const invitationSchema = z.object({
  workspaceId: z.string().uuid(),
  email: z.string().email(),
  roleId: z.string().uuid(),
  roleLabel: z.string().min(2),
  academyId: z.string().uuid().optional().or(z.literal("")),
  organizationId: z.string().uuid().optional().or(z.literal("")),
});

export const reviewActionSchema = z.object({
  resourceType: z.enum(["academy_application", "instructor_application", "organization", "verification"]),
  resourceId: z.string().uuid(),
  decision: z.enum(["approve", "reject", "request_changes", "suspend", "archive"]),
  notes: z.string().optional(),
});
