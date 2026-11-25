import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createServerSupabaseClient,
  createServiceSupabaseClient,
} from "@/lib/supabase/server";
import { getLearnerCheck } from "@/lib/learning/checks";
type Context = { params: Promise<{ attemptId: string }> };
async function mutate(request: Request, { params }: Context, submit: boolean) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return NextResponse.json(
      { error: "Request origin rejected." },
      { status: 403 },
    );
  const auth = await createServerSupabaseClient();
  const {
    data: { user },
  } = await auth.auth.getUser();
  if (!user)
    return NextResponse.json(
      { error: "Sign in to continue." },
      { status: 401 },
    );
  const { attemptId } = await params;
  if (!z.uuid().safeParse(attemptId).success)
    return NextResponse.json({ error: "Check not found." }, { status: 404 });
  if (Number(request.headers.get("content-length")) > 64000)
    return NextResponse.json(
      { error: "Answer data is too large." },
      { status: 413 },
    );
  const body = await request.text();
  if (Buffer.byteLength(body) > 64000)
    return NextResponse.json(
      { error: "Answer data is too large." },
      { status: 413 },
    );
  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid answers." }, { status: 400 });
  }
  const parsed = z
    .object({ answers: z.record(z.uuid(), z.uuid()) })
    .safeParse(payload);
  if (!parsed.success)
    return NextResponse.json(
      { error: "Choose a valid answer for each question." },
      { status: 400 },
    );
  const db = createServiceSupabaseClient();
  const { error } = await db.rpc(
    submit ? "learning_submit_check" : "learning_save_check",
    {
      target_attempt: attemptId,
      subject: user.id,
      responses: parsed.data.answers,
    },
  );
  if (error)
    return NextResponse.json(
      {
        error: submit
          ? "Answers could not be submitted. Check every question is answered and your access is active."
          : "Answers could not be saved. Check your connection or sign in again.",
      },
      { status: 409 },
    );
  if (submit) {
    const { data: a } = await db
      .from("quiz_attempts")
      .select("enrollment_id")
      .eq("id", attemptId)
      .single();
    if (a)
      await db.rpc("learning_refresh_completion", {
        target_enrollment: a.enrollment_id,
        subject: user.id,
      });
  }
  return NextResponse.json(
    { check: await getLearnerCheck(attemptId, user.id) },
    { headers: { "Cache-Control": "no-store" } },
  );
}
export const PUT = (request: Request, context: Context) =>
  mutate(request, context, false);
export const POST = (request: Request, context: Context) =>
  mutate(request, context, true);
