"use server";

import { redirect } from "next/navigation";
import { writeAuditEvent } from "@/lib/audit/audit";
import { requireUser } from "@/lib/authorization/server";
import { notifyUser } from "@/lib/notifications/notifications";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { announcementSchema, campaignSchema, departmentSchema, employeeSchema, importPreviewSchema, learningAssignmentSchema, skillSchema, teamSchema } from "@/lib/validation/enterprise";

export async function createEmployeeAction(formData: FormData) {
  const user = await requireUser();
  const parsed = employeeSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/organization/people?error=validation");
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("enterprise_employees").insert({
    organization_id: parsed.data.organizationId,
    department_id: parsed.data.departmentId || null,
    manager_employee_id: parsed.data.managerEmployeeId || null,
    employee_number: parsed.data.employeeNumber || null,
    full_name: parsed.data.fullName,
    email: parsed.data.email.toLowerCase(),
    role_title: parsed.data.roleTitle || null,
    location: parsed.data.location || null,
    employment_type: parsed.data.employmentType,
  }).select("id").single();
  await writeAuditEvent({ actorId: user.id, action: "enterprise_employee_created", resourceType: "enterprise_employee", resourceId: data?.id, success: !error });
  redirect(error ? "/organization/people?error=create" : "/organization/people?created=true");
}

export async function createDepartmentAction(formData: FormData) {
  const user = await requireUser();
  const parsed = departmentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/organization/departments?error=validation");
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("organization_departments").insert({
    organization_id: parsed.data.organizationId,
    parent_id: parsed.data.parentId || null,
    manager_id: parsed.data.managerId || null,
    learning_coordinator_id: parsed.data.learningCoordinatorId || null,
    name: parsed.data.name,
    slug: slugify(parsed.data.name),
    description: parsed.data.description || null,
    cost_center: parsed.data.costCenter || null,
    status: parsed.data.status,
  }).select("id").single();
  await writeAuditEvent({ actorId: user.id, action: "enterprise_department_created", resourceType: "organization_department", resourceId: data?.id, success: !error });
  redirect(error ? "/organization/departments?error=create" : "/organization/departments?created=true");
}

export async function createTeamAction(formData: FormData) {
  const user = await requireUser();
  const parsed = teamSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/organization/teams?error=validation");
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("enterprise_teams").insert({
    organization_id: parsed.data.organizationId,
    department_id: parsed.data.departmentId || null,
    manager_employee_id: parsed.data.managerEmployeeId || null,
    name: parsed.data.name,
    slug: slugify(parsed.data.name),
    description: parsed.data.description || null,
    team_type: parsed.data.teamType,
  }).select("id").single();
  await writeAuditEvent({ actorId: user.id, action: "enterprise_team_created", resourceType: "enterprise_team", resourceId: data?.id, success: !error });
  redirect(error ? "/organization/teams?error=create" : "/organization/teams?created=true");
}

export async function createLearningAssignmentAction(formData: FormData) {
  const user = await requireUser();
  const parsed = learningAssignmentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/organization/assignments?error=validation");
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("enterprise_learning_assignments").insert({
    organization_id: parsed.data.organizationId,
    course_id: parsed.data.courseId || null,
    learning_path_id: parsed.data.learningPathId || null,
    campaign_id: parsed.data.campaignId || null,
    title: parsed.data.title,
    target_type: parsed.data.targetType,
    target_employee_id: parsed.data.targetEmployeeId || null,
    target_department_id: parsed.data.targetDepartmentId || null,
    target_team_id: parsed.data.targetTeamId || null,
    target_role: parsed.data.targetRole || null,
    mandatory: parsed.data.mandatory,
    priority: parsed.data.priority,
    reason: parsed.data.reason || null,
    due_at: parsed.data.dueAt || null,
    certificate_required: parsed.data.certificateRequired,
    assigned_by: user.id,
  }).select("id").single();
  await writeAuditEvent({ actorId: user.id, action: "enterprise_assignment_created", resourceType: "enterprise_learning_assignment", resourceId: data?.id, success: !error });
  redirect(error ? "/organization/assignments?error=create" : "/organization/assignments?created=true");
}

export async function createCampaignAction(formData: FormData) {
  const user = await requireUser();
  const parsed = campaignSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/organization/campaigns?error=validation");
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("enterprise_campaigns").insert({
    organization_id: parsed.data.organizationId,
    name: parsed.data.name,
    slug: slugify(parsed.data.name),
    description: parsed.data.description || null,
    campaign_type: parsed.data.campaignType,
    starts_at: parsed.data.startsAt || null,
    ends_at: parsed.data.endsAt || null,
    created_by: user.id,
  }).select("id").single();
  await writeAuditEvent({ actorId: user.id, action: "enterprise_campaign_created", resourceType: "enterprise_campaign", resourceId: data?.id, success: !error });
  redirect(error ? "/organization/campaigns?error=create" : "/organization/campaigns?created=true");
}

export async function createEnterpriseSkillAction(formData: FormData) {
  const user = await requireUser();
  const parsed = skillSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/organization/skills?error=validation");
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("enterprise_skills").insert({
    organization_id: parsed.data.organizationId,
    name: parsed.data.name,
    slug: slugify(parsed.data.name),
    description: parsed.data.description || null,
    category: parsed.data.category || null,
  }).select("id").single();
  await writeAuditEvent({ actorId: user.id, action: "enterprise_skill_created", resourceType: "enterprise_skill", resourceId: data?.id, success: !error });
  redirect(error ? "/organization/skills?error=create" : "/organization/skills?created=true");
}

export async function createAnnouncementAction(formData: FormData) {
  const user = await requireUser();
  const parsed = announcementSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/organization/announcements?error=validation");
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("enterprise_announcements").insert({
    organization_id: parsed.data.organizationId,
    title: parsed.data.title,
    body: parsed.data.body,
    target_type: parsed.data.targetType,
    department_id: parsed.data.departmentId || null,
    team_id: parsed.data.teamId || null,
    employee_id: parsed.data.employeeId || null,
    priority: parsed.data.priority,
    published_at: parsed.data.publishNow ? new Date().toISOString() : null,
    created_by: user.id,
  }).select("id").single();
  if (!error && parsed.data.employeeId) {
    const { data: employee } = await supabase.from("enterprise_employees").select("user_id").eq("id", parsed.data.employeeId).maybeSingle();
    if (employee?.user_id) await notifyUser({ userId: employee.user_id, type: "enterprise_announcement", title: parsed.data.title, body: parsed.data.body, resourceType: "enterprise_announcement", resourceId: data?.id });
  }
  await writeAuditEvent({ actorId: user.id, action: "enterprise_announcement_created", resourceType: "enterprise_announcement", resourceId: data?.id, success: !error });
  redirect(error ? "/organization/announcements?error=create" : "/organization/announcements?created=true");
}

export async function createImportPreviewAction(formData: FormData) {
  const user = await requireUser();
  const parsed = importPreviewSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/organization/import?error=validation");
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("employee_import_jobs").insert({
    organization_id: parsed.data.organizationId,
    source_type: parsed.data.sourceType,
    status: "preview",
    total_rows: parsed.data.totalRows,
    valid_rows: parsed.data.validRows,
    invalid_rows: parsed.data.invalidRows,
    duplicate_emails: parsed.data.duplicateEmails,
    duplicate_employee_numbers: parsed.data.duplicateEmployeeNumbers,
    created_by: user.id,
  }).select("id").single();
  await writeAuditEvent({ actorId: user.id, action: "employee_import_preview_created", resourceType: "employee_import_job", resourceId: data?.id, success: !error });
  redirect(error ? "/organization/import?error=create" : "/organization/import?preview=true");
}
