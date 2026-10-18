import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createServerSupabaseClient,
  createServiceSupabaseClient,
} from "@/lib/supabase/server";
import { canManageCourse } from "@/lib/courses/access";
const types = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    "pptx",
  "image/png": "png",
  "image/jpeg": "jpg",
} as const;
export async function POST(request: Request) {
  const auth = await createServerSupabaseClient();
  const {
    data: { user },
  } = await auth.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Sign in to upload." }, { status: 401 });
  const parsed = z
    .object({
      courseId: z.uuid(),
      lessonId: z.uuid(),
      type: z.enum(
        Object.keys(types) as [keyof typeof types, ...(keyof typeof types)[]],
      ),
      size: z
        .number()
        .positive()
        .max(50 * 1024 * 1024),
      rights: z.literal(true),
    })
    .safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json(
      {
        error:
          "Choose a PDF, PPTX, PNG or JPEG up to 50 MB and confirm upload rights.",
      },
      { status: 400 },
    );
  const { courseId, lessonId, type } = parsed.data;
  if (!(await canManageCourse(courseId, user.id)))
    return NextResponse.json(
      { error: "You cannot edit this course." },
      { status: 403 },
    );
  const db = createServiceSupabaseClient();
  const { data: lesson } = await db
    .from("course_lessons")
    .select("id")
    .eq("course_id", courseId)
    .eq("id", lessonId)
    .neq("status", "archived")
    .maybeSingle();
  if (!lesson)
    return NextResponse.json({ error: "Class not found." }, { status: 404 });
  const path = `${courseId}/${lessonId}/${crypto.randomUUID()}.${types[type]}`;
  const { data, error } = await db.storage
    .from("course-resources")
    .createSignedUploadUrl(path);
  return error || !data
    ? NextResponse.json({ error: "Upload unavailable." }, { status: 503 })
    : NextResponse.json({ path, token: data.token });
}
export async function PUT(request: Request) {
  const db = await createServerSupabaseClient();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Sign in to save." }, { status: 401 });
  const parsed = z
    .object({
      courseId: z.uuid(),
      lessonId: z.uuid(),
      path: z.string().max(500),
      title: z.string().trim().min(1).max(200),
      rights: z.literal(true),
    })
    .safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid resource." }, { status: 400 });
  const { courseId, lessonId, path, title } = parsed.data;
  const { error } = await db.rpc("studio_attach_upload", {
    target_course: courseId,
    target_lesson: lessonId,
    object_path: path,
    kind: "resource",
    label: title,
  });
  return error
    ? NextResponse.json(
        { error: "The resource could not be attached. Refresh and try again." },
        { status: 409 },
      )
    : NextResponse.json({ ok: true });
}
