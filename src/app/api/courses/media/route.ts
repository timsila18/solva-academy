import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createServerSupabaseClient,
  createServiceSupabaseClient,
} from "@/lib/supabase/server";
import { canManageCourse } from "@/lib/courses/access";

const schema = z.object({
  courseId: z.uuid(),
  lessonId: z.uuid(),
  name: z.string().min(1).max(200),
  size: z
    .number()
    .positive()
    .max(100 * 1024 * 1024),
  type: z.literal("video/mp4"),
});

export async function POST(request: Request) {
  const auth = await createServerSupabaseClient();
  const {
    data: { user },
  } = await auth.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Sign in to upload." }, { status: 401 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json(
      { error: "Choose an MP4 file up to 100 MB." },
      { status: 400 },
    );
  const { courseId, lessonId } = parsed.data;
  if (!(await canManageCourse(courseId, user.id)))
    return NextResponse.json(
      { error: "You cannot edit this course." },
      { status: 403 },
    );
  const db = createServiceSupabaseClient();
  const { data: lesson } = await db
    .from("course_lessons")
    .select("id")
    .eq("id", lessonId)
    .eq("course_id", courseId)
    .single();
  if (!lesson)
    return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
  const path = `${courseId}/${lessonId}/${crypto.randomUUID()}.mp4`;
  const { data, error } = await db.storage
    .from("course-media")
    .createSignedUploadUrl(path);
  if (error || !data)
    return NextResponse.json(
      { error: "Upload is unavailable. Try again." },
      { status: 503 },
    );
  return NextResponse.json({ path, token: data.token });
}

export async function PUT(request: Request) {
  const auth = await createServerSupabaseClient();
  const {
    data: { user },
  } = await auth.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Sign in to save." }, { status: 401 });
  const parsed = z
    .object({ courseId: z.uuid(), lessonId: z.uuid(), path: z.string() })
    .safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  const { courseId, lessonId, path } = parsed.data;
  if (
    !(await canManageCourse(courseId, user.id)) ||
    !new RegExp(`^${courseId}/${lessonId}/[a-f0-9-]{36}\\.mp4$`).test(path)
  ) {
    return NextResponse.json(
      { error: "You cannot save this upload." },
      { status: 403 },
    );
  }
  const { error } = await auth.rpc("studio_attach_upload", {
    target_course: courseId,
    target_lesson: lessonId,
    object_path: path,
    kind: "video",
    label: null,
  });
  if (error)
    return NextResponse.json(
      { error: "Could not attach the video." },
      { status: 500 },
    );
  return NextResponse.json({ ok: true });
}
