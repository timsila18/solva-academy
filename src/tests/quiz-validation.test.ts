import { describe, expect, it } from "vitest";
import { stripCorrectAnswersForPreview, validateQuestionConfig } from "@/lib/courses/quiz-validation";

describe("quiz authoring validation", () => {
  it("requires exactly one correct answer for single choice", () => {
    const errors = validateQuestionConfig({
      type: "single_choice",
      options: [
        { text: "A", isCorrect: true },
        { text: "B", isCorrect: true },
      ],
    });

    expect(errors).toContain("Single-choice questions must have exactly one correct option.");
  });

  it("accepts numeric ranges", () => {
    const errors = validateQuestionConfig({
      type: "numeric",
      numericAnswer: { min: 10, max: 12 },
    });

    expect(errors).toEqual([]);
  });

  it("strips correct answers from learner preview payloads", () => {
    const preview = stripCorrectAnswersForPreview([{ text: "A", isCorrect: true, matchValue: "1" }]);
    expect(preview).toEqual([{ text: "A" }]);
  });
});
