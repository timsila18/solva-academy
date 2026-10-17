import Link from "next/link";
import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { canManageCourse } from "@/lib/courses/access";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

export default async function CourseChecksPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const user = await requireUserOrRedirect();
  if (!await canManageCourse(courseId, user.id)) notFound();
  const db = createServiceSupabaseClient();
  const assessments = await db.from("assessments").select("id,title,status").eq("course_id", courseId).eq("assessment_type", "quiz").order("title");
  const ids = (assessments.data ?? []).map((a) => a.id);
  const quizzes = ids.length ? await db.from("quizzes").select("id,assessment_id").in("assessment_id", ids) : { data: [], error: null };
  const quizIds = (quizzes.data ?? []).map((q) => q.id);
  const questions = quizIds.length ? await db.from("quiz_questions").select("id,quiz_id,prompt,explanation,display_order").in("quiz_id", quizIds).order("display_order") : { data: [], error: null };
  const questionIds = (questions.data ?? []).map((q) => q.id);
  const options = questionIds.length ? await db.from("quiz_question_options").select("id,question_id,option_text,is_correct").in("question_id", questionIds).order("display_order") : { data: [], error: null };
  const failed = assessments.error || quizzes.error || questions.error || options.error;
  return <DashboardShell><Link href={`/courses/builder/${courseId}`} className="text-sm text-primary">Back to course</Link>
    <h1 className="mt-5 text-2xl font-semibold">Knowledge checks</h1>
    <p className="mt-2 text-sm text-muted-foreground">Instructor review · Draft questions and answer key</p>
    {failed ? <p role="alert" className="mt-6">The questions could not load. Please try again.</p> : <div className="mt-7 divide-y divide-border border-y border-border">{assessments.data?.map((assessment) => {
      const quiz = quizzes.data?.find((q) => q.assessment_id === assessment.id);
      return <details key={assessment.id} className="py-4"><summary className="cursor-pointer text-sm font-semibold">{assessment.title}<span className="ml-3 font-normal capitalize text-muted-foreground">{assessment.status}</span></summary>
        <ol className="mt-5 list-decimal space-y-7 pl-5">{questions.data?.filter((q) => q.quiz_id === quiz?.id).map((question) => <li key={question.id} className="text-sm"><h2 className="font-medium">{question.prompt}</h2>
          <ul className="mt-3 space-y-2">{options.data?.filter((o) => o.question_id === question.id).map((option) => <li key={option.id} className={option.is_correct ? "font-medium text-primary" : "text-muted-foreground"}>{option.option_text}{option.is_correct ? " (correct)" : ""}</li>)}</ul>
          <p className="mt-3 text-muted-foreground">{question.explanation}</p>
        </li>)}</ol>
      </details>;
    })}{!assessments.data?.length && <p className="py-6 text-sm text-muted-foreground">No knowledge checks have been prepared.</p>}</div>}
  </DashboardShell>;
}
