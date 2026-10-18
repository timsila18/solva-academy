import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createServerSupabaseClient,
  createServiceSupabaseClient,
} from "@/lib/supabase/server";
import { hostedPlaybackUrl } from "@/lib/courses/hosted-video";
export async function GET(request: Request) {
  const auth = await createServerSupabaseClient();
  const {
    data: { user },
  } = await auth.auth.getUser();
  if (!user) return new NextResponse(null, { status: 401 });
  const parsed = z
    .object({ courseId: z.uuid(), lessonId: z.uuid() })
    .safeParse(Object.fromEntries(new URL(request.url).searchParams));
  if (!parsed.success) return new NextResponse(null, { status: 400 });
  const { courseId, lessonId } = parsed.data;
  const db = createServiceSupabaseClient();
  const access = await db.rpc("studio_can_read_course", {
    target_course_id: courseId,
    subject: user.id,
  });
  if (access.error || !access.data)
    return new NextResponse(null, { status: 403 });
  const { data: lesson } = await db
    .from("course_lessons")
    .select("id")
    .eq("id", lessonId)
    .eq("course_id", courseId)
    .maybeSingle();
  if (!lesson) return new NextResponse(null, { status: 404 });
  const { data: blocks } = await db
    .from("lesson_content_blocks")
    .select("content")
    .eq("lesson_id", lessonId)
    .eq("block_type", "video")
    .eq("status", "active")
    .limit(1);
  const content = blocks?.[0]?.content;
  let url: string | null = null;
  if (
    content?.provider === "hostafrica" &&
    typeof content.uploadId === "string"
  )
    url = await hostedPlaybackUrl(content.uploadId, courseId, lessonId);
  else if (
    content?.bucket === "course-media" &&
    typeof content.path === "string" &&
    content.path.startsWith(`${courseId}/${lessonId}/`)
  ) {
    const { data } = await db.storage
      .from("course-media")
      .createSignedUrl(content.path, 3600);
    url = data?.signedUrl ?? null;
  }
  return url
    ? NextResponse.redirect(url, {
        status: 307,
        headers: { "Cache-Control": "private, no-store" },
      })
    : new NextResponse(null, { status: 404 });
}
