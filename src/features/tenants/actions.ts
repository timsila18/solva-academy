"use server";

import { redirect } from "next/navigation";
import { writeAuditEvent } from "@/lib/audit/audit";
import { requirePlatformAdmin, requireUser } from "@/lib/authorization/server";
import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import type { AcademyApplicationState } from "./application-state";
import {
  academyApplicationSchema,
  instructorApplicationSchema,
  invitationSchema,
  organizationSchema,
  reviewActionSchema,
} from "@/lib/validation/tenant";

export async function submitAcademyApplicationAction(_previous: AcademyApplicationState, formData: FormData): Promise<AcademyApplicationState> {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { needsSignIn: true, error: "Please sign in before submitting your academy application. Your entries are still here." };
  const parsed = academyApplicationSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the required fields and try again." };

  const slug = slugify(parsed.data.slug || parsed.data.academyName);
  if (!slug) return { error: "Enter a valid academy name and preferred slug." };
  if (parsed.data.schoolId) {
    const { data: school } = await supabase.from("schools").select("id").eq("id", parsed.data.schoolId).eq("visibility", "public").in("status", ["active", "published"]).maybeSingle();
    if (!school) return { error: "Please select an available school." };
  }
  const { data, error } = await supabase
    .from("academy_applications")
    .insert({
      applicant_id: user.id,
      academy_name: parsed.data.academyName,
      slug,
      short_description: parsed.data.shortDescription,
      school_id: parsed.data.schoolId || null,
      website: parsed.data.website || null,
      experience: parsed.data.experience || null,
      country: parsed.data.country,
      county: parsed.data.county || null,
      why_teach: parsed.data.whyTeach,
      expected_audience: parsed.data.expectedAudience,
      terms_accepted: true,
      status: "submitted",
      submitted_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  await writeAuditEvent({
    actorId: user.id,
    action: "academy_application_submitted",
    resourceType: "academy_application",
    resourceId: data?.id,
    success: !error,
  });

  if (error || !data) return { error: error?.code === "23505" ? "That academy name or slug is already in use. Please choose another." : "Your application could not be saved. Your entries are still here; please try again." };
  return { success: true };
}

export async function submitInstructorApplicationAction(formData: FormData) {
  const user = await requireUser();
  const parsed = instructorApplicationSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/instructors/apply?error=validation");

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("instructor_applications")
    .insert({
      applicant_id: user.id,
      biography: parsed.data.biography,
      experience: parsed.data.experience || null,
      expertise: parsed.data.expertise,
      school_id: parsed.data.schoolId || null,
      languages: parsed.data.languages.split(",").map((item) => item.trim()).filter(Boolean),
      teaching_style: parsed.data.teachingStyle || null,
      portfolio_links: parsed.data.portfolioLinks
        ? parsed.data.portfolioLinks.split(",").map((url) => url.trim()).filter(Boolean)
        : [],
      sample_lesson_url: parsed.data.sampleLessonUrl || null,
      availability: parsed.data.availability || null,
      identity_confirmation: true,
      child_teaching_preference: parsed.data.childTeachingPreference,
      status: "submitted",
      submitted_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (!error && data) {
    await supabase.from("review_queue").insert({
      resource_type: "instructor_application",
      resource_id: data.id,
      status: "open",
    });
  }

  await writeAuditEvent({
    actorId: user.id,
    action: "instructor_application_submitted",
    resourceType: "instructor_application",
    resourceId: data?.id,
    success: !error,
  });

  if (error) redirect("/instructors/apply?error=submission");
  redirect("/instructor?submitted=instructor");
}

export async function createOrganizationAction(formData: FormData) {
  const user = await requireUser();
  const parsed = organizationSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/organizations/create?error=validation");

  const supabase = await createServerSupabaseClient();
  const slug = slugify(parsed.data.slug || parsed.data.name);

  const { data: workspace, error: workspaceError } = await supabase
    .from("workspaces")
    .insert({
      name: parsed.data.name,
      slug: `organization-${slug}`,
      type: "organization",
      owner_id: user.id,
      status: "active",
    })
    .select("id")
    .single();

  if (workspaceError || !workspace) redirect("/organizations/create?error=workspace");

  const { data: organization, error } = await supabase
    .from("organizations")
    .insert({
      name: parsed.data.name,
      slug,
      type: parsed.data.type,
      owner_id: user.id,
      workspace_id: workspace.id,
      status: "draft",
      industry: parsed.data.industry || null,
      country: parsed.data.country,
      county: parsed.data.county || null,
      description: parsed.data.description,
      website: parsed.data.website || null,
      primary_contact: parsed.data.primaryContact,
      employee_size: parsed.data.employeeSize,
    })
    .select("id")
    .single();

  await supabase.from("workspace_members").insert({
    workspace_id: workspace.id,
    user_id: user.id,
    status: "active",
    joined_at: new Date().toISOString(),
  });

  await writeAuditEvent({
    actorId: user.id,
    action: "organization_created",
    resourceType: "organization",
    resourceId: organization?.id,
    workspaceId: workspace.id,
    success: !error,
  });

  if (error) redirect("/organizations/create?error=submission");
  redirect("/organization?created=organization");
}

export async function inviteWorkspaceMemberAction(formData: FormData) {
  const user = await requireUser();
  const parsed = invitationSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/academy/team?error=validation");

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("workspace_invitations")
    .insert({
      workspace_id: parsed.data.workspaceId,
      academy_id: parsed.data.academyId || null,
      organization_id: parsed.data.organizationId || null,
      email: parsed.data.email,
      role_id: parsed.data.roleId,
      role_label: parsed.data.roleLabel,
      invited_by: user.id,
    })
    .select("id")
    .single();

  await writeAuditEvent({
    actorId: user.id,
    action: "workspace_invitation_created",
    resourceType: "workspace_invitation",
    resourceId: data?.id,
    workspaceId: parsed.data.workspaceId,
    success: !error,
  });

  redirect(error ? "/academy/team?error=invite" : "/academy/team?invited=true");
}

export async function reviewQueueAction(formData: FormData) {
  await requirePlatformAdmin();
  if (formData.get("resourceType") === "academy_application") return reviewAcademyApplicationAction(formData);
  redirect("/admin/review-queues?error=unsupported");
}

export async function reviewAcademyApplicationAction(formData: FormData) {
  await requirePlatformAdmin();
  const parsed = reviewActionSchema.safeParse({ ...Object.fromEntries(formData), resourceType: "academy_application" });
  if (!parsed.success || !["approve", "reject", "request_changes"].includes(parsed.data.decision)
    || (parsed.data.decision !== "approve" && !parsed.data.notes?.trim())
    || (parsed.data.notes?.length ?? 0) > 5000) redirect("/admin/review-queues?error=validation");
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.rpc("review_academy_application", {
    application_id: parsed.data.resourceId,
    decision: parsed.data.decision,
    review_note: parsed.data.notes?.trim() || null,
  });
  if (error) redirect("/admin/review-queues?error=review");
  revalidatePath("/admin/review-queues");
  revalidatePath("/welcome");
  revalidatePath("/academy");
  redirect("/admin/review-queues?reviewed=true");
}
