import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PrintRecord } from "@/components/learning/print-record";
import { claimCompletionCertificate } from "@/features/learning/actions";

export default async function EnrollmentPage({
  params,
  searchParams,
}: {
  params: Promise<{ enrollmentId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { enrollmentId } = await params;
  const user = await requireUserOrRedirect();
  const db = createServiceSupabaseClient();
  const { data: e } = await db
    .from("enrollments")
    .select(
      "id,course_id,course_version_id,status,completion_percentage,completed_at",
    )
    .eq("id", enrollmentId)
    .eq("learner_id", user.id)
    .maybeSingle();
  if (!e) notFound();
  const { data: course } = await db
    .from("courses")
    .select("title,estimated_duration_minutes")
    .eq("id", e.course_id)
    .single();
  const { data: profile } = await db
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();
  const { data: lessons } = await db
    .from("course_lessons")
    .select("id,title,display_order")
    .eq("course_id", e.course_id)
    .eq("version_id", e.course_version_id)
    .neq("status", "archived")
    .order("display_order");
  const { data: progress } = await db
    .from("lesson_progress")
    .select("lesson_id,status,completed_at")
    .eq("enrollment_id", e.id);
  const { data: checks } = await db
    .from("quiz_attempts")
    .select(
      "id,quiz_id,attempt_number,status,score,max_score,passed,submitted_at",
    )
    .eq("enrollment_id", e.id)
    .order("started_at");
  const quizIds = [...new Set((checks ?? []).map((c) => c.quiz_id))];
  const { data: quizzes } = quizIds.length
    ? await db.from("quizzes").select("id,assessment_id").in("id", quizIds)
    : { data: [] };
  const { data: assessments } = await db
    .from("assessments")
    .select("id,title,required")
    .eq("course_id", e.course_id);
  const { data: cert } = await db
    .from("certificates")
    .select("id,status")
    .eq("enrollment_id", e.id)
    .eq("status", "issued")
    .maybeSingle();
  const { error } = await searchParams;
  return (
    <DashboardShell>
      <section className="mx-auto max-w-4xl print:text-black">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-primary">Solva Academy</p>
            <h1 className="mt-2 text-2xl font-semibold">Learning record</h1>
          </div>
          <PrintRecord />
        </div>
        <h2 className="mt-7 text-xl font-semibold">{course?.title}</h2>
        <p className="mt-2">{profile?.full_name}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {e.status.replaceAll("_", " ")} · {e.completion_percentage}% of
          required classes completed
          {course?.estimated_duration_minutes
            ? ` · Course duration: ${course.estimated_duration_minutes} minutes`
            : ""}
        </p>
        <div className="mt-6 divide-y divide-border border-y border-border">
          {lessons?.map((l) => {
            const p = progress?.find((p) => p.lesson_id === l.id);
            return (
              <div
                key={l.id}
                className="flex flex-wrap justify-between gap-3 py-3 text-sm"
              >
                <span>{l.title}</span>
                <span>
                  {p?.status === "completed"
                    ? "Completed"
                    : p?.status === "started"
                      ? "In progress"
                      : "Not started"}
                </span>
              </div>
            );
          })}
        </div>
        <h2 className="mt-8 font-semibold">Assessment results</h2>
        <div className="mt-3 divide-y divide-border">
          {checks?.length ? (
            checks.map((c) => (
              <div
                key={c.id}
                className="flex flex-wrap justify-between gap-3 py-3 text-sm"
              >
                <span>
                  {assessments?.find(
                    (a) =>
                      a.id ===
                      quizzes?.find((q) => q.id === c.quiz_id)?.assessment_id,
                  )?.title ?? "Knowledge check"}{" "}
                  · Attempt {c.attempt_number}
                </span>
                <span>
                  {c.score !== null
                    ? `${c.score}/${c.max_score} · ${c.passed ? "Passed" : "Not passed"}`
                    : "In progress"}
                </span>
              </div>
            ))
          ) : (
            <p className="py-4 text-sm text-muted-foreground">
              No submitted assessments yet.
            </p>
          )}
        </div>
        <p className="mt-7 text-xs text-muted-foreground">
          This record describes learning activity on Solva Academy. It is not a
          degree, professional licence, or claim of accreditation.
        </p>
        <div className="mt-7 flex flex-wrap gap-4 print:hidden">
          <Link
            href={`/learn/${e.course_id}`}
            className="text-primary underline"
          >
            Continue learning
          </Link>
          {cert ? (
            <Link
              href={`/learner/certificates/${cert.id}`}
              className="text-primary underline"
            >
              View certificate
            </Link>
          ) : e.status === "completed" ? (
            <form action={claimCompletionCertificate}>
              <input type="hidden" name="enrollmentId" value={e.id} />
              <Button type="submit" variant="outline">
                Get completion certificate
              </Button>
            </form>
          ) : null}
          <Link href="/support" className="text-primary underline">
            Get help
          </Link>
        </div>
        {error && (
          <p role="alert" className="mt-4 text-sm">
            A certificate is not available yet. Required learning must be
            complete and the instructor must enable certificate issuance.
          </p>
        )}
      </section>
    </DashboardShell>
  );
}
