import { createServiceSupabaseClient } from "@/lib/supabase/server";

export async function canManageCourse(courseId: string, userId: string) {
  const db = createServiceSupabaseClient();
  const { data, error } = await db.rpc("studio_can_edit_course", { target_course_id: courseId, subject: userId });
  return !error && data === true;
}

export async function getLearningAccess(courseId: string, userId: string, lessonId?: string) {
  const db = createServiceSupabaseClient();
  const { data } = await db.from("enrollments").select("*").eq("course_id", courseId).eq("learner_id", userId)
    .in("status", ["active", "not_started", "in_progress", "completed"]).maybeSingle();
  const episodeAccess = async () => {
    let query = db.from("episode_entitlements").select("*").eq("course_id", courseId).eq("learner_id", userId).eq("status", "active").or(`ends_at.is.null,ends_at.gt.${new Date().toISOString()}`);
    if (lessonId) query = query.eq("lesson_id", lessonId);
    const { data: episodes } = await query.order("created_at", { ascending: false });
    if (!episodes?.length) return null;
    const first = episodes[0];
    return { id: first.id, course_version_id: first.version_id, episodeOnly: true, allowedLessonIds: episodes.filter((item) => item.version_id === first.version_id).map((item) => item.lesson_id) };
  };
  if (!data || !data.course_version_id || (data.access_ends_at && new Date(data.access_ends_at) <= new Date())) return episodeAccess();
  const { data: entitlement } = await db.from("entitlements").select("status,ends_at")
    .eq("id", data.entitlement_id).eq("beneficiary_user_id", userId).single();
  if (!entitlement || entitlement.status !== "active" || (entitlement.ends_at && new Date(entitlement.ends_at) <= new Date())) return episodeAccess();
  return { ...data, episodeOnly: false, allowedLessonIds: null as string[] | null };
}
