import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient, createServiceSupabaseClient } from "@/lib/supabase/server";
import { getLearningAccess } from "@/lib/courses/access";

export async function POST(request: Request) {
  const auth = await createServerSupabaseClient();
  const { data: { user } } = await auth.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const parsed = z.object({ courseId: z.uuid(), lessonId: z.uuid(), position: z.number().int().min(0).max(86400), completed: z.boolean() }).safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid progress." }, { status: 400 });
  const { courseId, lessonId, position, completed } = parsed.data;
  const enrollment = await getLearningAccess(courseId, user.id, lessonId);
  if (!enrollment) return NextResponse.json({ error: "Enrollment required." }, { status: 403 });
  const db = createServiceSupabaseClient();
  const { data: lesson } = await db.from("course_lessons").select("version_id").eq("id", lessonId).eq("course_id", courseId).neq("status", "archived").single();
  if (!lesson || (enrollment.course_version_id && lesson.version_id !== enrollment.course_version_id)) return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
  if (enrollment.episodeOnly) {
    if (!enrollment.allowedLessonIds?.includes(lessonId)) return NextResponse.json({ error: "Class access required." }, { status: 403 });
    const { data: previous } = await db.from("episode_progress").select("completed").eq("entitlement_id", enrollment.id).maybeSingle();
    const { error } = await db.from("episode_progress").upsert({ entitlement_id: enrollment.id, last_position_seconds: position, completed: completed || previous?.completed === true, updated_at: new Date().toISOString() });
    return NextResponse.json({ ok: !error }, { status: error ? 500 : 200 });
  }
  const { data: previous } = await db.from("lesson_progress").select("status").eq("enrollment_id", enrollment.id).eq("lesson_id", lessonId).maybeSingle();
  const isCompleted = completed || previous?.status === "completed";
  const values: Record<string, unknown> = { enrollment_id: enrollment.id, lesson_id: lessonId, last_position_seconds: position, status: isCompleted ? "completed" : "started", progress_percentage: isCompleted ? 100 : 0, updated_at: new Date().toISOString() };
  if (completed && previous?.status !== "completed") values.completed_at = new Date().toISOString();
  const { error } = await db.from("lesson_progress").upsert(values, { onConflict: "enrollment_id,lesson_id" });
  if (error) return NextResponse.json({ error: "Progress could not be saved." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
