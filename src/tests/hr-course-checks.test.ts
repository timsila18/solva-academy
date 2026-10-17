import { expect, it } from "vitest";
import checks from "../../scripts/content/hr-masterclass-checks.json";
import { validateQuestionConfig } from "@/lib/courses/quiz-validation";
it("has three brief, valid questions with explanations for each of the sixteen classes", () => {
  expect(checks).toHaveLength(16);
  expect(checks.flatMap((c) => c.questions)).toHaveLength(48);
  checks.forEach((check, i) => {
    expect(check.class).toBe(i + 1);
    expect(check.questions).toHaveLength(3);
    check.questions.forEach((q) => {
      expect(q.explanation.length).toBeGreaterThan(20);
      expect(q.options).toHaveLength(4);
      expect(validateQuestionConfig({ type: "single_choice", options: q.options.map((text, index) => ({ text, isCorrect: index === q.correct })) })).toEqual([]);
    });
  });
});
