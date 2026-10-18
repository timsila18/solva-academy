import { StudioForm } from "./studio-form";
import { Field, Input, Select, TextArea } from "@/components/ui/form-fields";
export function StudioQuestion({
  courseId,
  lessonId,
  question,
}: {
  courseId: string;
  lessonId: string;
  question?: {
    id: string;
    prompt: string;
    explanation: string;
    options: { option_text: string; is_correct: boolean }[];
  };
}) {
  return (
    <StudioForm
      submitLabel={question ? "Save question" : "Add question"}
      className="mt-4 grid max-w-3xl gap-4"
    >
      <input type="hidden" name="command" value="question_save" />
      <input type="hidden" name="courseId" value={courseId} />
      <input type="hidden" name="lessonId" value={lessonId} />
      {question && (
        <input type="hidden" name="questionId" value={question.id} />
      )}
      <Field label="Question">
        <TextArea
          name="prompt"
          required
          minLength={5}
          defaultValue={question?.prompt}
        />
      </Field>
      <div className="grid gap-4 md:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <Field key={i} label={`Option ${i + 1}`}>
            <Input
              name={`option${i}`}
              required
              defaultValue={question?.options[i]?.option_text}
            />
          </Field>
        ))}
      </div>
      <Field label="Correct answer">
        <Select
          name="correct"
          defaultValue={Math.max(
            0,
            question?.options.findIndex((o) => o.is_correct) ?? 0,
          )}
        >
          {[0, 1, 2, 3].map((i) => (
            <option key={i} value={i}>
              Option {i + 1}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Answer explanation">
        <TextArea name="explanation" defaultValue={question?.explanation} />
      </Field>
    </StudioForm>
  );
}
