import { createServiceSupabaseClient } from "@/lib/supabase/server";
type SnapshotQuestion = {
  id: string;
  prompt: string;
  points: number;
  explanation?: string;
  options: { id: string; text: string; correct: boolean }[];
};
export type LearnerCheck = {
  id: string;
  courseId: string;
  lessonId: string;
  title: string;
  status: string;
  attemptNumber: number;
  score: number | null;
  maxScore: number | null;
  passed: boolean | null;
  passingScore: number;
  deadline: string | null;
  answers: Record<string, string>;
  questions: {
    id: string;
    prompt: string;
    points: number;
    options: { id: string; text: string }[];
    correctOption?: string;
    explanation?: string;
  }[];
};
export function projectCheck(
  attempt: {
    id: string;
    status: string;
    attempt_number: number;
    score: number | null;
    max_score: number | null;
    passed: boolean | null;
    started_at: string;
    question_snapshot: SnapshotQuestion[];
    delivery_rules: {
      passingScore?: number;
      timeLimitMinutes?: number;
      showCorrectAnswers?: boolean;
      showExplanations?: boolean;
    };
    draft_answers: Record<string, string>;
  },
  context: { courseId: string; lessonId: string; title: string },
  answers?: Record<string, string>,
): LearnerCheck {
  const closed = ["passed", "failed"].includes(attempt.status);
  return {
    id: attempt.id,
    ...context,
    status: attempt.status,
    attemptNumber: attempt.attempt_number,
    score: attempt.score,
    maxScore: attempt.max_score,
    passed: attempt.passed,
    passingScore: attempt.delivery_rules.passingScore ?? 70,
    deadline: attempt.delivery_rules.timeLimitMinutes
      ? new Date(
          new Date(attempt.started_at).getTime() +
            attempt.delivery_rules.timeLimitMinutes * 60000,
        ).toISOString()
      : null,
    answers: answers ?? attempt.draft_answers,
    questions: attempt.question_snapshot.map((q) => ({
      id: q.id,
      prompt: q.prompt,
      points: q.points,
      options: q.options.map((o) => ({ id: o.id, text: o.text })),
      ...(closed && attempt.delivery_rules.showCorrectAnswers
        ? { correctOption: q.options.find((o) => o.correct)?.id }
        : {}),
      ...(closed && attempt.delivery_rules.showExplanations && q.explanation
        ? { explanation: q.explanation }
        : {}),
    })),
  };
}
export async function getLearnerCheck(id: string, userId: string) {
  const db = createServiceSupabaseClient();
  const { data: attempt, error } = await db
    .from("quiz_attempts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !attempt) return null;
  const { error: accessError } = await db.rpc("learning_attempt_access", {
    target_attempt: id,
    subject: userId,
  });
  if (accessError) return null;
  const { data: quiz } = await db
    .from("quizzes")
    .select("assessment_id")
    .eq("id", attempt.quiz_id)
    .maybeSingle();
  const { data: a } = quiz
    ? await db
        .from("assessments")
        .select("title,lesson_id,course_id")
        .eq("id", quiz.assessment_id)
        .maybeSingle()
    : { data: null };
  if (!a?.lesson_id) return null;
  let answers;
  if (["passed", "failed"].includes(attempt.status)) {
    const { data } = await db
      .from("quiz_attempt_answers")
      .select("question_id,answer")
      .eq("attempt_id", id);
    answers = Object.fromEntries(
      (data ?? []).map((r) => [r.question_id, r.answer.optionId]),
    );
  }
  return projectCheck(
    attempt,
    { courseId: a.course_id, lessonId: a.lesson_id, title: a.title },
    answers,
  );
}
