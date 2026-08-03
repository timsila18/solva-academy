"use server";

import { redirect } from "next/navigation";
import { writeAuditEvent } from "@/lib/audit/audit";
import { requireUser } from "@/lib/authorization/server";
import { notifyUser } from "@/lib/notifications/notifications";
import { getLiveProviderAdapter } from "@/lib/live/provider";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { attendanceCorrectionSchema, liveChatSchema, liveIncidentSchema, livePollResponseSchema, livePollSchema, liveRegistrationSchema, liveSessionSchema } from "@/lib/validation/live";

export async function createLiveSessionAction(formData: FormData) {
  const user = await requireUser();
  const parsed = liveSessionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/live/create?error=validation");
  const startsAt = new Date(parsed.data.startsAt);
  const endsAt = new Date(startsAt.getTime() + parsed.data.durationMinutes * 60_000);
  const supabase = await createServerSupabaseClient();
  const slug = `${slugify(parsed.data.title)}-${Date.now().toString(36)}`;
  const { data: session, error } = await supabase.from("live_sessions").insert({
    slug,
    session_type_id: parsed.data.sessionTypeId || null,
    owner_workspace_id: parsed.data.ownerWorkspaceId,
    host_id: user.id,
    title: parsed.data.title,
    short_description: parsed.data.shortDescription || null,
    full_description: parsed.data.fullDescription || null,
    course_id: parsed.data.courseId || null,
    academy_id: parsed.data.academyId || null,
    organization_id: parsed.data.organizationId || null,
    campaign_id: parsed.data.campaignId || null,
    learning_assignment_id: parsed.data.learningAssignmentId || null,
    starts_at: startsAt.toISOString(),
    ends_at: endsAt.toISOString(),
    timezone: parsed.data.timezone,
    duration_minutes: parsed.data.durationMinutes,
    capacity: parsed.data.capacity || null,
    language: parsed.data.language,
    visibility: parsed.data.visibility,
    registration_mode: parsed.data.registrationMode,
    recording_policy: parsed.data.recordingPolicy,
    child_safety_enabled: parsed.data.childSafetyEnabled,
    waiting_room_enabled: true,
    status: "scheduled",
    created_by: user.id,
  }).select("id,slug,title,starts_at,ends_at,capacity").single();
  if (error || !session) redirect("/live/create?error=create");
  const { data: occurrence } = await supabase.from("live_session_occurrences").insert({ session_id: session.id, starts_at: session.starts_at, ends_at: session.ends_at, timezone: parsed.data.timezone }).select("id").single();
  await supabase.from("live_session_hosts").insert({ session_id: session.id, user_id: user.id, role: "host" });
  const room = await getLiveProviderAdapter().createRoom({ sessionId: session.id, title: session.title, startsAt, endsAt, capacity: session.capacity });
  await supabase.from("live_session_rooms").insert({ session_id: session.id, occurrence_id: occurrence?.id, provider: room.provider, provider_room_id: room.providerRoomId, room_url: room.roomUrl, status: "ready" });
  await writeAuditEvent({ actorId: user.id, action: "live_session_created", resourceType: "live_session", resourceId: session.id, workspaceId: parsed.data.ownerWorkspaceId, success: true });
  redirect(`/live/${session.slug}`);
}

export async function registerForLiveSessionAction(formData: FormData) {
  const user = await requireUser();
  const parsed = liveRegistrationSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/live?error=registration");
  const supabase = await createServerSupabaseClient();
  const { data: session } = await supabase.from("live_sessions").select("id,capacity,registration_mode").eq("id", parsed.data.sessionId).single();
  if (!session) redirect("/live?error=session");
  const { count } = await supabase.from("live_session_registrations").select("*", { count: "exact", head: true }).eq("session_id", session.id).in("status", ["registered", "approved", "attended"]);
  const status = session.capacity && (count ?? 0) >= session.capacity ? "waitlisted" : session.registration_mode === "approval_required" ? "pending_approval" : "registered";
  const { data, error } = await supabase.from("live_session_registrations").insert({
    session_id: session.id,
    user_id: user.id,
    name: parsed.data.name || null,
    email: parsed.data.email || null,
    terms_accepted: parsed.data.termsAccepted,
    guardian_consent: parsed.data.guardianConsent,
    status,
  }).select("id").single();
  if (!error && status === "waitlisted") await supabase.from("live_session_waitlists").insert({ session_id: session.id, registration_id: data?.id, user_id: user.id, position: (count ?? 0) + 1 });
  await writeAuditEvent({ actorId: user.id, action: `live_session_${status}`, resourceType: "live_session_registration", resourceId: data?.id, success: !error });
  redirect(error ? "/live?error=duplicate" : "/learner/live?registered=true");
}

export async function generateJoinTokenAction(formData: FormData) {
  const user = await requireUser();
  const sessionId = String(formData.get("sessionId"));
  const occurrenceId = String(formData.get("occurrenceId") || "");
  const role = String(formData.get("role") || "attendee") as "host" | "attendee" | "moderator" | "presenter" | "child_participant";
  const supabase = await createServerSupabaseClient();
  const { data: room } = await supabase.from("live_session_rooms").select("provider_room_id").eq("session_id", sessionId).maybeSingle();
  if (!room?.provider_room_id) redirect(`/live/classroom/${occurrenceId || sessionId}?error=room`);
  const ttl = Number(process.env.SOLCO_TOKEN_TTL_SECONDS ?? 900);
  const token = await getLiveProviderAdapter().generateToken({ roomId: room.provider_room_id, userId: user.id, role, ttlSeconds: ttl });
  await supabase.from("live_session_join_events").insert({ session_id: sessionId, occurrence_id: occurrenceId || null, user_id: user.id, participant_role: role, event_type: "waiting", metadata: { token_expires_at: token.expiresAt.toISOString(), permissions: token.permissions } });
  await writeAuditEvent({ actorId: user.id, action: "live_join_token_generated", resourceType: "live_session", resourceId: sessionId, success: true });
  redirect(`/live/classroom/${occurrenceId || sessionId}?ready=true`);
}

export async function sendLiveChatMessageAction(formData: FormData) {
  const user = await requireUser();
  const parsed = liveChatSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/live?error=chat");
  const message = parsed.data.message.replace(/<[^>]*>/g, "").trim();
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("live_session_chat_messages").insert({ session_id: parsed.data.sessionId, occurrence_id: parsed.data.occurrenceId || null, sender_id: user.id, message });
  redirect(error ? `/live/classroom/${parsed.data.occurrenceId || parsed.data.sessionId}?error=chat` : `/live/classroom/${parsed.data.occurrenceId || parsed.data.sessionId}?chat=sent`);
}

export async function createLivePollAction(formData: FormData) {
  const user = await requireUser();
  const parsed = livePollSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/instructor/live?error=poll");
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("live_session_polls").insert({ session_id: parsed.data.sessionId, created_by: user.id, question: parsed.data.question, poll_type: parsed.data.pollType, status: "launched", launched_at: new Date().toISOString() }).select("id").single();
  if (!error && data && parsed.data.options) {
    await supabase.from("live_session_poll_options").insert(parsed.data.options.split("\n").map((label, index) => ({ poll_id: data.id, label: label.trim(), display_order: index })).filter((option) => option.label));
  }
  await writeAuditEvent({ actorId: user.id, action: "live_poll_created", resourceType: "live_session_poll", resourceId: data?.id, success: !error });
  redirect(error ? "/instructor/live?error=poll" : "/instructor/live?poll=created");
}

export async function submitLivePollResponseAction(formData: FormData) {
  const user = await requireUser();
  const parsed = livePollResponseSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/learner/live?error=poll");
  const supabase = await createServerSupabaseClient();
  await supabase.from("live_session_poll_responses").upsert({ poll_id: parsed.data.pollId, user_id: user.id, response: { value: parsed.data.response } });
  redirect("/learner/live?poll=submitted");
}

export async function reportLiveIncidentAction(formData: FormData) {
  const user = await requireUser();
  const parsed = liveIncidentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/live?error=incident");
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("live_session_incidents").insert({ session_id: parsed.data.sessionId, occurrence_id: parsed.data.occurrenceId || null, reporter_id: user.id, incident_type: parsed.data.incidentType, description: parsed.data.description, severity: parsed.data.severity }).select("id").single();
  await writeAuditEvent({ actorId: user.id, action: "live_incident_reported", resourceType: "live_session_incident", resourceId: data?.id, success: !error });
  redirect(error ? "/live?error=incident" : "/live?incident=reported");
}

export async function correctAttendanceAction(formData: FormData) {
  const user = await requireUser();
  const parsed = attendanceCorrectionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/instructor/live?error=attendance");
  const supabase = await createServerSupabaseClient();
  await supabase.from("live_session_attendance").update({ status: parsed.data.newStatus, manual_correction: true, correction_reason: parsed.data.reason, updated_at: new Date().toISOString() }).eq("id", parsed.data.attendanceId);
  await supabase.from("live_session_attendance_corrections").insert({ attendance_id: parsed.data.attendanceId, actor_id: user.id, original_status: parsed.data.originalStatus, new_status: parsed.data.newStatus, reason: parsed.data.reason });
  await writeAuditEvent({ actorId: user.id, action: "live_attendance_corrected", resourceType: "live_session_attendance", resourceId: parsed.data.attendanceId, reason: parsed.data.reason, success: true });
  redirect("/instructor/live?attendance=corrected");
}

export async function notifySessionReminder(userId: string, sessionId: string, title: string) {
  await notifyUser({ userId, type: "live_session_reminder", title: "Live session reminder", body: title, resourceType: "live_session", resourceId: sessionId });
}
