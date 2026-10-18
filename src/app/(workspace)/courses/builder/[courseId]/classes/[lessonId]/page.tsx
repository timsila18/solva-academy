import Link from "next/link";
import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { StudioForm } from "@/components/courses/studio-form";
import { StudioQuestion } from "@/components/courses/studio-question";
import { VideoUpload } from "@/components/courses/video-upload";
import { ClassResourceUpload } from "@/components/courses/class-resource-upload";
import { Field, Input, TextArea } from "@/components/ui/form-fields";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { getStudioCourse } from "@/lib/courses/studio-data";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
export default async function ClassEditor({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const { courseId, lessonId } = await params;
  const user = await requireUserOrRedirect();
  const data = await getStudioCourse(courseId, user.id);
  const lesson = data?.classes.find((l) => l.id === lessonId);
  if (!data || !lesson) notFound();
  const db = createServiceSupabaseClient();
  const assessments = await db
    .from("assessments")
    .select("id")
    .eq("course_id", courseId)
    .eq("lesson_id", lessonId)
    .eq("status", "draft");
  const quizzes = assessments.data?.length
    ? await db
        .from("quizzes")
        .select("id")
        .in(
          "assessment_id",
          assessments.data.map((a) => a.id),
        )
    : { data: [], error: null };
  const questions = quizzes.data?.length
    ? await db
        .from("quiz_questions")
        .select(
          "id,prompt,explanation,question_type,quiz_question_options(option_text,is_correct,display_order)",
        )
        .in(
          "quiz_id",
          quizzes.data.map((q) => q.id),
        )
        .eq("status", "active")
        .order("display_order")
    : { data: [], error: null };
  const checksError = assessments.error || quizzes.error || questions.error;
  return (
    <DashboardShell>
      <Link
        href={`/courses/builder/${courseId}`}
        className="mb-5 inline-block text-sm text-primary"
      >
        Back to course
      </Link>
      <PageHeading title={lesson.title} description={data.course.title} />
      {data.editable && lesson.status !== "archived" ? (
        <>
          <StudioForm className="grid max-w-4xl gap-5">
            <input type="hidden" name="command" value="edit" />
            <input type="hidden" name="courseId" value={courseId} />
            <input type="hidden" name="lessonId" value={lessonId} />
            <Field label="Class title">
              <Input
                name="title"
                required
                minLength={3}
                defaultValue={lesson.title}
              />
            </Field>
            <Field label="Class notes">
              <TextArea name="summary" defaultValue={lesson.short_summary} />
            </Field>
            <Field label="Learning outcomes">
              <TextArea
                name="outcomes"
                defaultValue={lesson.learning_objective}
              />
            </Field>
            <Field label="Practice activity">
              <TextArea
                name="exercise"
                defaultValue={lesson.learner_instructions}
              />
            </Field>
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Duration (minutes)">
                <Input
                  type="number"
                  min={0}
                  name="minutes"
                  defaultValue={lesson.estimated_duration_minutes ?? 0}
                />
              </Field>
              <Field label="Individual class price (KES)">
                <Input
                  type="number"
                  min={0}
                  max={1000000}
                  step={1}
                  name="priceKes"
                  defaultValue={lesson.priceKes}
                />
              </Field>
            </div>
          </StudioForm>
          <section className="my-8 border-t border-border pt-6">
            <h2 className="font-semibold">Class video</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {lesson.videoAttached
                ? "Video attached. A new upload replaces the attached video."
                : "Awaiting video."}{" "}
            Compressed MP4, up to 350 MB. Larger originals use the local compressor.
            </p>
          {lesson.videoAttached&&<video controls preload="none" src={`/api/courses/media/preview?courseId=${courseId}&lessonId=${lessonId}`} aria-label="Class video preview" className="my-4 aspect-video w-full max-w-4xl bg-black"/>}
          <VideoUpload courseId={courseId} lessonId={lessonId} pendingUploadId={lesson.pendingVideoUpload}/>
          </section>
          <section className="border-t border-border py-6">
            <h2 className="font-semibold">Knowledge checks</h2>
            {checksError ? (
              <p role="alert">Questions could not load. Please refresh.</p>
            ) : (
              questions.data?.map((q, index) => (
                <details key={q.id} className="border-b border-border py-4">
                  <summary className="cursor-pointer">
                    {index + 1}. {q.prompt}
                  </summary>
                  {q.question_type === "single_choice" &&
                  q.quiz_question_options.length === 4 ? (
                    <StudioQuestion
                      courseId={courseId}
                      lessonId={lessonId}
                      question={{
                        ...q,
                        options: q.quiz_question_options.sort(
                          (a, b) => a.display_order - b.display_order,
                        ),
                      }}
                    />
                  ) : (
                    <p className="py-3 text-sm">
                      This question uses an advanced format.
                    </p>
                  )}
                  <StudioForm
                    submitLabel="Remove question"
                    confirm="Remove this question from the draft?"
                    className="mt-4"
                  >
                    <input
                      type="hidden"
                      name="command"
                      value="question_remove"
                    />
                    <input type="hidden" name="courseId" value={courseId} />
                    <input type="hidden" name="questionId" value={q.id} />
                  </StudioForm>
                </details>
              ))
            )}
            <details className="py-4">
              <summary className="cursor-pointer font-medium">
                Add a question
              </summary>
              <StudioQuestion courseId={courseId} lessonId={lessonId} />
            </details>
          </section>
        </>
      ) : (
        <p className="py-6">This class is read-only.</p>
      )}
      <section className="border-t border-border py-6">
        <h2 className="mb-4 font-semibold">Materials</h2>
        {data.materials
          .filter((r) => !r.lesson_id || r.lesson_id === lessonId)
          .map((r) => (
            <p key={r.id} className="py-2">
              {r.url ? (
                <a
                  href={r.url}
                  className="text-primary underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  {r.title}
                </a>
              ) : (
                r.title
              )}
            </p>
          ))}
        {data.editable && lesson.status !== "archived" && (
          <ClassResourceUpload courseId={courseId} lessonId={lessonId} />
        )}
      </section>
    </DashboardShell>
  );
}
