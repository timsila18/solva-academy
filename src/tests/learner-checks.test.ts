import { expect, it, vi } from "vitest";
vi.mock("@/lib/supabase/server", () => ({
  createServiceSupabaseClient: vi.fn(),
}));
vi.mock("@/lib/courses/access", () => ({ getLearningAccess: vi.fn() }));
import { projectCheck } from "@/lib/learning/checks";
const snapshot = [
  {
    id: "question",
    prompt: "What is HR?",
    points: 1,
    explanation: "Secret explanation",
    options: [
      { id: "a", text: "Correct", correct: true },
      { id: "b", text: "Other", correct: false },
    ],
  },
];
const attempt = {
  id: "attempt",
  status: "in_progress",
  attempt_number: 1,
  score: null,
  max_score: null,
  passed: null,
  started_at: "2026-11-25T09:00:00Z",
  question_snapshot: snapshot,
  delivery_rules: {
    passingScore: 70,
    timeLimitMinutes: 10,
    showCorrectAnswers: true,
    showExplanations: true,
  },
  draft_answers: {},
};
const context = {
  courseId: "course",
  lessonId: "lesson",
  title: "Knowledge check",
};
it("projects only prompts and option text before submission, never answer keys", () => {
  const result = projectCheck(attempt, context);
  expect(result.questions[0]).not.toHaveProperty("explanation");
  expect(result.questions[0]).not.toHaveProperty("correctOption");
  expect(result.questions[0].options[0]).not.toHaveProperty("correct");
  expect(JSON.stringify(result)).not.toContain("Secret explanation");
  expect(result.deadline).toBe("2026-11-25T09:10:00.000Z");
});
it("reveals only configured feedback after a closed attempt", () => {
  const result = projectCheck({ ...attempt, status: "passed" }, context);
  expect(result.questions[0].correctOption).toBe("a");
  expect(result.questions[0].explanation).toBe("Secret explanation");
  const hidden = projectCheck(
    {
      ...attempt,
      status: "failed",
      delivery_rules: { showCorrectAnswers: false, showExplanations: false },
    },
    context,
  );
  expect(hidden.questions[0]).not.toHaveProperty("correctOption");
  expect(hidden.questions[0]).not.toHaveProperty("explanation");
});
it("returns saved learner answers without injecting snapshot scoring data", () => {
  expect(projectCheck(attempt, context, { question: "b" }).answers).toEqual({
    question: "b",
  });
});
