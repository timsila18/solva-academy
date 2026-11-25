"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import {
  createServiceSupabaseClient,
  createServerSupabaseClient,
} from "@/lib/supabase/server";
export async function saveLearningPolicy(formData: FormData) {
  await requireUserOrRedirect();
  const parsed = z
    .object({
      courseId: z.uuid(),
      passing: z.coerce.number().min(1).max(100),
      attempts: z.coerce.number().int().min(1).max(20),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/instructor/courses?error=policy");
  const db = await createServerSupabaseClient();
  const { error } = await db.rpc("studio_learning_policy", {
    target_course: parsed.data.courseId,
    passing: parsed.data.passing,
    attempts: parsed.data.attempts,
    checks_required: formData.get("required") === "on",
    enable_certificate: formData.get("certificate") === "on",
  });
  redirect(
    `/courses/builder/${parsed.data.courseId}/completion?${error ? "error=policy" : "saved=true"}`,
  );
}
export async function startLearningCheck(formData: FormData) {
  const user = await requireUserOrRedirect();
  const parsed = z
    .object({ enrollmentId: z.uuid(), quizId: z.uuid(), courseId: z.uuid() })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/learner?error=check");
  const { data, error } = await createServiceSupabaseClient().rpc(
    "learning_start_check",
    {
      target_enrollment: parsed.data.enrollmentId,
      target_quiz: parsed.data.quizId,
      subject: user.id,
    },
  );
  if (error || !data) redirect(`/learn/${parsed.data.courseId}?error=check`);
  redirect(`/learn/quiz/${data}`);
}
export async function claimCompletionCertificate(formData: FormData) {
  const user = await requireUserOrRedirect();
  const id = z.uuid().safeParse(formData.get("enrollmentId"));
  if (!id.success) redirect("/learner?error=certificate");
  const { data, error } = await createServiceSupabaseClient().rpc(
    "issue_certificate_for_enrollment",
    { target_enrollment_id: id.data, actor: user.id },
  );
  if (error || !data)
    redirect(`/learn/enrollment/${id.data}?error=certificate`);
  redirect(`/learner/certificates/${data}`);
}
