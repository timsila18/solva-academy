import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createServerSupabaseClient,
  createServiceSupabaseClient,
} from "@/lib/supabase/server";
import { canManageCourse } from "@/lib/courses/access";
import { MAX_CLASS_VIDEO_BYTES } from "@/lib/courses/video-policy";
import {
  hostedUploadTicket,
  hostedUploadStatus,
} from "@/lib/courses/hosted-video";

const schema = z.object({
  courseId: z.uuid(),
  lessonId: z.uuid(),
  name: z.string().min(1).max(200),
  size: z.number().positive().max(MAX_CLASS_VIDEO_BYTES),
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
      {
        error:
          "Compressed MP4 videos must be no larger than 350 MB. Use Compress original for larger recordings.",
      },
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
  if (process.env.ACADEMY_VIDEO_PROVIDER === "hostafrica") {
    const { count } = await db
      .from("course_video_uploads")
      .select("id", { count: "exact", head: true })
      .eq("actor_id", user.id)
      .eq("status", "pending")
      .gt("expires_at", new Date().toISOString());
    if ((count ?? 0) >= 3)
      return NextResponse.json(
        { error: "Finish an existing video upload before starting another." },
        { status: 429 },
      );
    const { data: ticket, error: ticketError } = await db
      .from("course_video_uploads")
      .insert({ course_id: courseId, lesson_id: lessonId, actor_id: user.id })
      .select("*")
      .single();
    if (ticketError || !ticket)
      return NextResponse.json(
        { error: "Could not start a private video upload." },
        { status: 503 },
      );
    try {
      return NextResponse.json(hostedUploadTicket(ticket), {
        headers: { "Cache-Control": "no-store" },
      });
    } catch {
      return NextResponse.json(
        { error: "Private video hosting is not configured." },
        { status: 503 },
      );
    }
  }
  const path = `${courseId}/${lessonId}/${crypto.randomUUID()}.mp4`;
  const { data, error } = await db.storage
    .from("course-media")
    .createSignedUploadUrl(path);
  if (error || !data)
    return NextResponse.json(
      { error: "Upload is unavailable. Try again." },
      { status: 503 },
    );
  return NextResponse.json(
    {
      path,
      token: data.token,
      storageOrigin: process.env.NEXT_PUBLIC_SUPABASE_URL,
      publishableKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function GET(request: Request) {
  const auth = await createServerSupabaseClient();
  const {
    data: { user },
  } = await auth.auth.getUser();
  if (!user)
    return NextResponse.json(
      { error: "Sign in again to attach the video." },
      { status: 401 },
    );
  const parsed = z
    .object({
      courseId: z.uuid(),
      lessonId: z.uuid(),
      path: z.string().max(200),
    })
    .safeParse(Object.fromEntries(new URL(request.url).searchParams));
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  const { courseId, lessonId, path } = parsed.data;
  if (!(await canManageCourse(courseId, user.id)))
    return NextResponse.json(
      { error: "Course access expired or the draft is locked." },
      { status: 403 },
    );
  const db = createServiceSupabaseClient();
  if (path.startsWith("hostafrica:")) {
    const { data: ticket } = await db
      .from("course_video_uploads")
      .select("*")
      .eq("id", path.slice(11))
      .eq("actor_id", user.id)
      .eq("course_id", courseId)
      .eq("lesson_id", lessonId)
      .maybeSingle();
    if (!ticket)
      return NextResponse.json({ error: "Upload not found." }, { status: 404 });
    if (
      ticket.status === "cancelled" ||
      (ticket.status === "pending" &&
        new Date(ticket.expires_at).getTime() < Date.now())
    )
      return NextResponse.json(
        { error: "Upload expired or was cancelled. Start a new upload." },
        { status: 410 },
      );
    try {
      return NextResponse.json(
        { ready: Boolean(await hostedUploadStatus(ticket)) },
        { headers: { "Cache-Control": "no-store" } },
      );
    } catch {
      return NextResponse.json(
        { error: "Private video storage is unavailable." },
        { status: 503 },
      );
    }
  }
  if (!new RegExp(`^${courseId}/${lessonId}/[a-f0-9-]{36}\\.mp4$`).test(path))
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  const { data, error } = await db.storage
    .from("course-media")
    .list(`${courseId}/${lessonId}`, {
      search: path.split("/").pop(),
      limit: 10,
    });
  if (error)
    return NextResponse.json(
      { error: "Storage is unavailable. Please retry." },
      { status: 503 },
    );
  return NextResponse.json(
    {
      ready: data?.some((file) => file.name === path.split("/").pop()) ?? false,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function DELETE(request: Request) {
  const auth = await createServerSupabaseClient();
  const {
    data: { user },
  } = await auth.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Sign in again." }, { status: 401 });
  const parsed = z
    .object({ path: z.string().regex(/^hostafrica:[a-f0-9-]{36}$/) })
    .safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  const db = createServiceSupabaseClient();
  const { error } = await db
    .from("course_video_uploads")
    .update({ status: "cancelled" })
    .eq("id", parsed.data.path.slice(11))
    .eq("actor_id", user.id)
    .eq("status", "pending");
  return error
    ? NextResponse.json(
        { error: "Could not cancel the upload." },
        { status: 503 },
      )
    : NextResponse.json({ ok: true });
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
  if (path.startsWith("hostafrica:")) {
    if (!(await canManageCourse(courseId, user.id)))
      return NextResponse.json(
        { error: "You cannot edit this course." },
        { status: 403 },
      );
    const db = createServiceSupabaseClient();
    const { data: ticket } = await db
      .from("course_video_uploads")
      .select("*")
      .eq("id", path.slice(11))
      .eq("actor_id", user.id)
      .eq("course_id", courseId)
      .eq("lesson_id", lessonId)
      .maybeSingle();
    if (!ticket)
      return NextResponse.json({ error: "Upload not found." }, { status: 404 });
    try {
      const info = await hostedUploadStatus(ticket);
      if (!info)
        return NextResponse.json(
          { error: "Upload is not complete." },
          { status: 409 },
        );
      const { error } = await db.rpc("studio_attach_hosted_video", {
        upload_id: ticket.id,
        verified_bytes: info.bytes,
        verified_sha256: info.sha256,
      });
      if (error) throw error;
      return NextResponse.json({ ok: true });
    } catch {
      return NextResponse.json(
        { error: "The video could not be verified or the draft is locked." },
        { status: 409 },
      );
    }
  }
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
