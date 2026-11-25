import Link from "next/link";
import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { getStudioCourse } from "@/lib/courses/studio-data";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { saveLearningPolicy } from "@/features/learning/actions";
import { Button } from "@/components/ui/button";
export default async function CompletionSettings({
  params,
  searchParams,
}: {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const user = await requireUserOrRedirect();
  const { courseId } = await params;
  const studio = await getStudioCourse(courseId, user.id);
  if (!studio) notFound();
  const db = createServiceSupabaseClient();
  const { data: checks } = await db
    .from("assessments")
    .select("required,quizzes(passing_score,attempts_allowed)")
    .eq("course_id", courseId)
    .neq("status", "archived");
  const first = checks?.[0];
  const q = (
    Array.isArray(first?.quizzes) ? first?.quizzes[0] : first?.quizzes
  ) as
    | { passing_score: number | null; attempts_allowed: number | null }
    | undefined;
  const { data: course } = await db
    .from("courses")
    .select("certificate_available,title")
    .eq("id", courseId)
    .single();
  const editable = await db.rpc("studio_can_edit_course", {
    target_course_id: courseId,
    subject: user.id,
  });
  const search = await searchParams;
  return (
    <DashboardShell>
      <section className="max-w-2xl">
        <Link
          href={`/courses/builder/${courseId}`}
          className="text-primary underline"
        >
          Back to Course Studio
        </Link>
        <h1 className="mt-5 text-2xl font-semibold">
          Completion and certificates
        </h1>
        <p className="mt-2 text-muted-foreground">{course?.title}</p>
        {search.saved && (
          <p role="status" className="mt-4">
            Completion requirements saved.
          </p>
        )}
        {search.error && (
          <p role="alert" className="mt-4">
            Could not save. Add knowledge checks and require them before
            enabling certificates. Published courses cannot be changed.
          </p>
        )}
        <form action={saveLearningPolicy} className="mt-7 grid gap-5">
          <input type="hidden" name="courseId" value={courseId} />
          <fieldset disabled={!editable.data} className="grid gap-5">
            <label className="grid gap-2 text-sm">
              Pass mark (%)
              <input
                type="number"
                name="passing"
                min={1}
                max={100}
                defaultValue={q?.passing_score ?? 70}
                required
                className="rounded border border-border bg-background px-3 py-2"
              />
            </label>
            <label className="grid gap-2 text-sm">
              Attempts per check
              <input
                type="number"
                name="attempts"
                min={1}
                max={20}
                defaultValue={q?.attempts_allowed ?? 3}
                required
                className="rounded border border-border bg-background px-3 py-2"
              />
            </label>
            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                name="required"
                defaultChecked={first?.required ?? false}
                className="mt-1"
              />
              Require learners to pass every knowledge check
            </label>
            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                name="certificate"
                defaultChecked={course?.certificate_available ?? false}
                className="mt-1"
              />
              Offer a certificate of completion after all required classes and
              checks
            </label>
            <p className="text-sm text-muted-foreground">
              Certificates identify your academy as issuer. They do not claim
              university accreditation or a professional licence. Practical
              assignments need a separate reviewed workflow before they can be
              required.
            </p>
            <Button type="submit">Save requirements</Button>
          </fieldset>
        </form>
      </section>
    </DashboardShell>
  );
}
