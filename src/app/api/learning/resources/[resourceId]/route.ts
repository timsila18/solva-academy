import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createServerSupabaseClient,
  createServiceSupabaseClient,
} from "@/lib/supabase/server";
import { getLearningAccess } from "@/lib/courses/access";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ resourceId: string }> },
) {
  const auth = await createServerSupabaseClient();
  const {
    data: { user },
  } = await auth.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const { resourceId } = await params;
  if (!z.uuid().safeParse(resourceId).success)
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  const db = createServiceSupabaseClient();
  const { data: r } = await db
    .from("course_resources")
    .select("course_id,lesson_id,file_path,metadata,download_permission")
    .eq("id", resourceId)
    .eq("status", "active")
    .single();
  if (!r?.lesson_id || r.download_permission === "none")
    return NextResponse.json(
      { error: "Resource unavailable." },
      { status: 404 },
    );
  const access = await getLearningAccess(r.course_id, user.id, r.lesson_id);
  if (!access)
    return NextResponse.json(
      { error: "Class access required." },
      { status: 403 },
    );
  const { data: l } = await db
    .from("course_lessons")
    .select("version_id")
    .eq("id", r.lesson_id)
    .eq("course_id", r.course_id)
    .neq("status", "archived")
    .single();
  if (
    !l ||
    l.version_id !== access.course_version_id ||
    !r.file_path?.startsWith(`${r.course_id}/${r.lesson_id}/`) ||
    r.file_path.includes("..") ||
    r.metadata?.bucket !== "course-resources"
  )
    return NextResponse.json(
      { error: "Resource unavailable." },
      { status: 404 },
    );
  const { data, error } = await db.storage
    .from("course-resources")
    .createSignedUrl(r.file_path, 300, { download: true });
  if (error || !data)
    return NextResponse.json(
      { error: "Download unavailable. Please retry." },
      { status: 503 },
    );
  return NextResponse.redirect(data.signedUrl, {
    status: 303,
    headers: { "Cache-Control": "private, no-store" },
  });
}
