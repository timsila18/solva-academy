import Link from "next/link";
import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { getLearningAccess } from "@/lib/courses/access";
import { LessonVideo } from "@/components/courses/lesson-video";
import { hostedPlaybackUrl } from "@/lib/courses/hosted-video";
import { startLearningCheck } from "@/features/learning/actions";
import { Button } from "@/components/ui/button";
import { Transcript } from "@/components/learning/transcript";

export default async function CoursePlayerPage({
  params,
  searchParams,
}: {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ lesson?: string; error?: string }>;
}) {
  const user = await requireUserOrRedirect();
  const { courseId } = await params;
  const { lesson: selectedId, error } = await searchParams;
  const enrollment = await getLearningAccess(courseId, user.id, selectedId);
  if (!enrollment)
    return (
      <DashboardShell>
        <PageHeading
          title="Course access required"
          description="Enroll in this course to access its lessons."
        />
        <Link href="/courses" className="text-primary underline">
          Browse courses
        </Link>
      </DashboardShell>
    );
  const db = createServiceSupabaseClient();
  const { data: course } = await db
    .from("courses")
    .select("title")
    .eq("id", courseId)
    .single();
  const { data: modules } = await db
    .from("course_modules")
    .select("id,title,display_order")
    .eq("course_id", courseId)
    .eq("version_id", enrollment.course_version_id)
    .neq("status", "archived")
    .order("display_order");
  let lessonQuery = db
    .from("course_lessons")
    .select(
      "id,title,module_id,transcript,version_id,learning_objective,learner_instructions",
    )
    .eq("course_id", courseId)
    .neq("status", "archived")
    .order("display_order");
  if (enrollment.course_version_id)
    lessonQuery = lessonQuery.eq("version_id", enrollment.course_version_id);
  if (enrollment.allowedLessonIds)
    lessonQuery = lessonQuery.in("id", enrollment.allowedLessonIds);
  const { data: unsorted } = await lessonQuery;
  const lessons = [...(unsorted ?? [])].sort(
    (a, b) =>
      (modules?.findIndex((m) => m.id === a.module_id) ?? 0) -
      (modules?.findIndex((m) => m.id === b.module_id) ?? 0),
  );
  const { data: resume } = !enrollment.episodeOnly
    ? await db
        .from("learner_course_positions")
        .select("lesson_id")
        .eq("enrollment_id", enrollment.id)
        .maybeSingle()
    : { data: null };
  const selected =
    lessons.find((lesson) => lesson.id === (selectedId ?? resume?.lesson_id)) ??
    lessons[0];
  if (!course) notFound();
  const checkAccess =
    enrollment.episodeOnly && selected
      ? await getLearningAccess(courseId, user.id, selected.id)
      : enrollment;
  const { data: progress } = enrollment.episodeOnly
    ? { data: [] }
    : await db
        .from("lesson_progress")
        .select("lesson_id,status,last_position_seconds")
        .eq("enrollment_id", enrollment.id);
  const { data: episodePosition } = enrollment.episodeOnly
    ? await db
        .from("episode_progress")
        .select("last_position_seconds")
        .eq("entitlement_id", checkAccess?.id ?? enrollment.id)
        .maybeSingle()
    : { data: null };
  const { data: blocks } = selected
    ? await db
        .from("lesson_content_blocks")
        .select("block_type,content")
        .eq("lesson_id", selected.id)
        .eq("status", "active")
        .eq("visibility", "learner")
        .order("display_order")
    : { data: [] };
  const video = blocks?.find((block) => block.block_type === "video")?.content;
  const { data: media } =
    video?.bucket === "course-media" &&
    typeof video.path === "string" &&
    video.path.startsWith(`${courseId}/${selected?.id}/`)
      ? await db.storage.from("course-media").createSignedUrl(video.path, 14400)
      : { data: null };
  const hostedUrl =
    selected &&
    video?.provider === "hostafrica" &&
    typeof video.uploadId === "string"
      ? await hostedPlaybackUrl(video.uploadId, courseId, selected.id)
      : null;
  const videoUrl = hostedUrl ?? media?.signedUrl;
  const selectedIndex = lessons.findIndex((l) => l.id === selected?.id);
  const previous = lessons[selectedIndex - 1];
  const next = lessons[selectedIndex + 1];
  const { data: resources } = selected
    ? await db
        .from("course_resources")
        .select("id,title")
        .eq("course_id", courseId)
        .eq("lesson_id", selected.id)
        .eq("status", "active")
        .neq("download_permission", "none")
    : { data: [] };
  const { data: checks } =
    selected && checkAccess
      ? await db
          .from("assessments")
          .select(
            "id,title,required,quizzes(id,passing_score,attempts_allowed)",
          )
          .eq("course_id", courseId)
          .eq("lesson_id", selected.id)
          .eq("status", "active")
          .eq("review_method", "automated")
      : { data: [] };
  const quizIds = (checks ?? []).flatMap((c) =>
    (Array.isArray(c.quizzes) ? c.quizzes : c.quizzes ? [c.quizzes] : []).map(
      (q) => q.id,
    ),
  );
  const { data: attempts } =
    checkAccess && quizIds.length
      ? await db
          .from("quiz_attempts")
          .select("id,quiz_id,status,attempt_number,score,max_score,passed")
          .eq(
            enrollment.episodeOnly ? "episode_entitlement_id" : "enrollment_id",
            checkAccess.id,
          )
          .in("quiz_id", quizIds)
          .neq("status", "invalidated")
          .order("attempt_number", { ascending: false })
      : { data: [] };
  const completed =
    progress?.filter((p) => p.status === "completed").length ?? 0;
  return (
    <DashboardShell>
      <PageHeading
        title={course.title}
        description={selected?.title ?? "Lessons are being prepared."}
      />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4 text-sm">
        <Link href="/learner" className="text-primary underline">
          My learning
        </Link>
        <span>
          {enrollment.episodeOnly
            ? "Individual class access"
            : `${completed} of ${lessons.length} classes completed`}
        </span>
        <Link
          href={`/learn/enrollment/${enrollment.id}`}
          className={`text-primary underline ${enrollment.episodeOnly ? "hidden" : ""}`}
        >
          Learning record
        </Link>
      </div>
      {error && (
        <p role="alert" className="mb-4 text-sm">
          This check could not be started. It may be unavailable or you may have
          used all attempts. Contact{" "}
          <Link href="/support" className="underline">
            support
          </Link>{" "}
          if you need help.
        </p>
      )}
      <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <nav
          aria-label="Course curriculum"
          className="divide-y divide-border border-y border-border"
        >
          {modules?.map((module) => (
            <section key={module.id} className="py-3">
              <h2 className="mb-2 text-sm font-semibold">{module.title}</h2>
              {lessons
                ?.filter((lesson) => lesson.module_id === module.id)
                .map((lesson) => (
                  <Link
                    key={lesson.id}
                    href={`/learn/${courseId}?lesson=${lesson.id}`}
                    aria-current={
                      lesson.id === selected?.id ? "page" : undefined
                    }
                    className={`block px-2 py-2 text-sm ${lesson.id === selected?.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                  >
                    {progress?.find((item) => item.lesson_id === lesson.id)
                      ?.status === "completed"
                      ? "Completed: "
                      : ""}
                    {lesson.title}
                  </Link>
                ))}
            </section>
          ))}
        </nav>
        <section className="min-w-0">
          {selected && videoUrl ? (
            <LessonVideo
              key={selected.id}
              src={videoUrl}
              courseId={courseId}
              lessonId={selected.id}
              initialPosition={
                episodePosition?.last_position_seconds ??
                progress?.find((item) => item.lesson_id === selected.id)
                  ?.last_position_seconds ??
                0
              }
            />
          ) : (
            <p className="border border-border p-6 text-muted-foreground">
              No video is available for this lesson yet.
            </p>
          )}
          {selected?.transcript && <Transcript text={selected.transcript} />}
          {selected?.learning_objective && (
            <section className="mt-6">
              <h2 className="font-semibold">Learning outcomes</h2>
              <p className="mt-3 text-sm">{selected.learning_objective}</p>
            </section>
          )}
          {selected?.learner_instructions && (
            <section className="mt-6">
              <h2 className="font-semibold">Practical exercise</h2>
              <p className="mt-3 whitespace-pre-wrap text-sm">
                {selected.learner_instructions}
              </p>
            </section>
          )}
          {!!resources?.length && (
            <section className="mt-6 border-t border-border pt-5">
              <h2 className="font-semibold">Class resources</h2>
              <ul className="mt-3 space-y-3">
                {resources.map((r) => (
                  <li key={r.id}>
                    <a
                      className="text-sm text-primary underline"
                      href={`/api/learning/resources/${r.id}`}
                    >
                      {r.title}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {!!checks?.length && (
            <section className="mt-6 border-t border-border pt-5">
              <h2 className="font-semibold">Knowledge checks</h2>
              {checks.map((c) => {
                const q = (
                  Array.isArray(c.quizzes) ? c.quizzes[0] : c.quizzes
                ) as {
                  id: string;
                  passing_score: number | null;
                  attempts_allowed: number | null;
                } | null;
                const history =
                  attempts?.filter((a) => a.quiz_id === q?.id) ?? [];
                const latest = history[0];
                const canRetry =
                  !q?.attempts_allowed || history.length < q.attempts_allowed;
                return q ? (
                  <form
                    key={c.id}
                    action={startLearningCheck}
                    className="mt-3 flex flex-wrap items-center justify-between gap-3"
                  >
                    <input
                      type="hidden"
                      name="enrollmentId"
                      value={checkAccess?.id ?? enrollment.id}
                    />
                    <input type="hidden" name="quizId" value={q.id} />
                    <input type="hidden" name="courseId" value={courseId} />
                    <div>
                      <p className="text-sm font-medium">{c.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {c.required ? "Required" : "Practice"} · Pass{" "}
                        {q.passing_score ?? 70}% ·{" "}
                        {q.attempts_allowed ?? "Unlimited"} attempts
                      </p>
                      {latest && latest.status !== "in_progress" && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Last result: {latest.score}/{latest.max_score} ·{" "}
                          {latest.passed ? "Passed" : "Not passed"}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      {latest && (
                        <Link
                          href={`/learn/quiz/${latest.id}`}
                          className="text-sm text-primary underline"
                        >
                          {latest.status === "in_progress"
                            ? "Continue check"
                            : "View result"}
                        </Link>
                      )}
                      {(!latest ||
                        (latest.status !== "in_progress" && canRetry)) && (
                        <Button variant="outline" type="submit">
                          {latest ? "Try again" : "Start check"}
                        </Button>
                      )}
                      {latest &&
                        latest.status !== "in_progress" &&
                        !canRetry && (
                          <span className="text-xs text-muted-foreground">
                            No attempts remaining
                          </span>
                        )}
                    </div>
                  </form>
                ) : null;
              })}
            </section>
          )}
          <nav
            aria-label="Class navigation"
            className="mt-8 flex flex-wrap justify-between gap-4 border-t border-border pt-5"
          >
            {previous ? (
              <Link
                className="text-sm text-primary underline"
                href={`/learn/${courseId}?lesson=${previous.id}`}
              >
                Previous class
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                className="text-sm text-primary underline"
                href={`/learn/${courseId}?lesson=${next.id}`}
              >
                Next: {next.title}
              </Link>
            ) : (
              <Link className="text-sm text-primary underline" href="/learner">
                Back to my learning
              </Link>
            )}
          </nav>
          <p className="mt-6 text-sm text-muted-foreground">
            Need help with this class?{" "}
            <Link href="/support" className="text-primary underline">
              Contact support
            </Link>
          </p>
        </section>
      </div>
    </DashboardShell>
  );
}
