import type { QuestionType } from "@/types/course";

export type QuestionConfig = {
  type: QuestionType;
  options?: Array<{ text: string; isCorrect?: boolean; matchValue?: string }>;
  numericAnswer?: { exact?: number; min?: number; max?: number; tolerance?: number };
  acceptedAnswers?: string[];
};

export function validateQuestionConfig(question: QuestionConfig) {
  const errors: string[] = [];
  const options = question.options ?? [];
  const correctCount = options.filter((option) => option.isCorrect).length;

  if (question.type === "single_choice" && correctCount !== 1) {
    errors.push("Single-choice questions must have exactly one correct option.");
  }
  if (question.type === "multiple_choice" && correctCount < 1) {
    errors.push("Multiple-choice questions must have at least one correct option.");
  }
  if (question.type === "true_false" && (options.length !== 2 || correctCount !== 1)) {
    errors.push("True/false questions must have two options and one correct answer.");
  }
  if (question.type === "matching" && options.some((option) => !option.matchValue)) {
    errors.push("Matching questions must define a match value for each option.");
  }
  if (question.type === "ordering" && options.length < 2) {
    errors.push("Ordering questions require at least two items.");
  }
  if (question.type === "numeric" && !question.numericAnswer?.exact && question.numericAnswer?.min === undefined) {
    errors.push("Numeric questions require an exact answer or accepted range.");
  }
  if (question.type === "short_answer" && (question.acceptedAnswers?.length ?? 0) < 1) {
    errors.push("Short-answer questions need at least one accepted answer variant.");
  }

  return errors;
}

export function stripCorrectAnswersForPreview<T extends { isCorrect?: boolean; matchValue?: string }>(options: T[]) {
  return options.map((option) => {
    const safe = { ...option };
    delete safe.isCorrect;
    delete safe.matchValue;
    return safe;
  });
}
