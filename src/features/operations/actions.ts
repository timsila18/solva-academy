"use server";

import { redirect } from "next/navigation";
import { writeAuditEvent } from "@/lib/audit/audit";
import { requireUser } from "@/lib/authorization/server";
import { notifyUser } from "@/lib/notifications/notifications";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { academyPolicySchema, gradingActivitySchema, payoutDecisionSchema, payoutRequestSchema, storefrontSettingsSchema } from "@/lib/validation/operations";

export async function requestPayoutAction(formData: FormData) {
  const user = await requireUser();
  const parsed = payoutRequestSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/instructor/payouts?error=invalid");

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("payout_requests")
    .insert({
      requester_id: user.id,
      academy_id: parsed.data.academyId || null,
      workspace_id: parsed.data.workspaceId || null,
      amount_minor: parsed.data.amountMinor,
      currency: parsed.data.currency,
      destination_label: parsed.data.destinationLabel,
      method: parsed.data.method,
      notes: parsed.data.notes,
      status: "submitted",
      requested_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error || !data) redirect("/instructor/payouts?error=create");
  await writeAuditEvent({ actorId: user.id, action: "payout_requested", resourceType: "payout_request", resourceId: data.id, success: true });
  await notifyUser({ userId: user.id, type: "payout_submitted", title: "Payout request submitted", body: "Your payout request is queued for finance review.", resourceType: "payout_request", resourceId: data.id });
  redirect("/instructor/payouts?submitted=true");
}

export async function decidePayoutAction(formData: FormData) {
  const user = await requireUser();
  const parsed = payoutDecisionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/admin/payouts?error=invalid");

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("payout_requests")
    .update({
      status: parsed.data.status,
      decided_by: user.id,
      decided_at: ["approved", "rejected", "paid"].includes(parsed.data.status) ? new Date().toISOString() : null,
      decision_reason: parsed.data.decisionReason,
      payment_reference: parsed.data.paymentReference,
      paid_at: parsed.data.status === "paid" ? new Date().toISOString() : null,
    })
    .eq("id", parsed.data.payoutRequestId);

  if (error) redirect("/admin/payouts?error=decision");
  await writeAuditEvent({ actorId: user.id, action: `payout_${parsed.data.status}`, resourceType: "payout_request", resourceId: parsed.data.payoutRequestId, reason: parsed.data.decisionReason, success: true });
  redirect("/admin/payouts?updated=true");
}

export async function saveAcademyPolicyAction(formData: FormData) {
  const user = await requireUser();
  const parsed = academyPolicySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/academy/policies?error=invalid");

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("academy_policies").upsert({
    academy_id: parsed.data.academyId,
    internal_review_required: parsed.data.internalReviewRequired,
    course_branding_rules: parsed.data.courseBrandingRules,
    assessment_rules: parsed.data.assessmentRules,
    refund_guidance: parsed.data.refundGuidance,
    communication_preferences: { notes: parsed.data.communicationPreferences ?? "" },
    learner_conduct: parsed.data.learnerConduct,
    instructor_expectations: parsed.data.instructorExpectations,
    visibility: parsed.data.visibility,
    updated_by: user.id,
    updated_at: new Date().toISOString(),
  });

  if (error) redirect("/academy/policies?error=save");
  await writeAuditEvent({ actorId: user.id, action: "academy_policy_saved", resourceType: "academy_policy", resourceId: parsed.data.academyId, success: true });
  redirect("/academy/policies?saved=true");
}

export async function saveStorefrontSettingsAction(formData: FormData) {
  const user = await requireUser();
  const parsed = storefrontSettingsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/academy/storefront?error=invalid");

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("academy_storefront_settings").upsert({
    academy_id: parsed.data.academyId,
    headline: parsed.data.headline,
    description: parsed.data.description,
    public_visibility: parsed.data.publicVisibility,
    show_instructors: parsed.data.showInstructors,
    show_certificates: parsed.data.showCertificates,
    updated_by: user.id,
    updated_at: new Date().toISOString(),
  });

  if (error) redirect("/academy/storefront?error=save");
  await writeAuditEvent({ actorId: user.id, action: "academy_storefront_saved", resourceType: "academy_storefront", resourceId: parsed.data.academyId, success: true });
  redirect("/academy/storefront?saved=true");
}

export async function recordGradingActivityAction(formData: FormData) {
  const user = await requireUser();
  const parsed = gradingActivitySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/instructor/assignments?error=invalid");

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("grading_activity")
    .insert({
      grader_id: user.id,
      course_id: parsed.data.courseId || null,
      enrollment_id: parsed.data.enrollmentId || null,
      assignment_submission_id: parsed.data.assignmentSubmissionId || null,
      quiz_attempt_answer_id: parsed.data.quizAttemptAnswerId || null,
      activity_type: parsed.data.activityType,
      score: parsed.data.score,
      max_score: parsed.data.maxScore,
      learner_feedback: parsed.data.learnerFeedback,
      private_note: parsed.data.privateNote,
      status: parsed.data.status,
      published_at: parsed.data.status === "published" ? new Date().toISOString() : null,
    })
    .select("id")
    .single();

  if (error || !data) redirect("/instructor/assignments?error=grade");
  await writeAuditEvent({ actorId: user.id, action: "grading_activity_recorded", resourceType: "grading_activity", resourceId: data.id, success: true });
  redirect("/instructor/assignments?saved=true");
}
