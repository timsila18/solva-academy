"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import type { LearnerCheck } from "@/lib/learning/checks";
import { Button } from "@/components/ui/button";
export function KnowledgeCheck({ initial }: { initial: LearnerCheck }) {
  const [check, setCheck] = useState(initial);
  const [answers, setAnswers] = useState(initial.answers);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const queue = useRef<Promise<void>>(Promise.resolve());
  const closed = ["passed", "failed"].includes(check.status);
  function save(next: Record<string, string>) {
    setAnswers(next);
    setMessage("Saving answers...");
    queue.current = queue.current
      .catch(() => {})
      .then(async () => {
        try {
          const r = await fetch(`/api/learning/checks/${check.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ answers: next }),
          });
          if (!r.ok) throw new Error();
          setMessage("Answers saved.");
        } catch {
          setMessage(
            "Answers are not saved yet. Keep this page open and try submitting when connected.",
          );
        }
      });
  }
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setMessage("Submitting...");
    try {
      await queue.current;
      const r = await fetch(`/api/learning/checks/${check.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const result = await r.json();
      if (!r.ok || !result.check)
        throw new Error(result.error ?? "Could not submit.");
      setCheck(result.check);
      setMessage("Your result is saved.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not submit. Your answers remain on this page.",
      );
    } finally {
      setPending(false);
    }
  }
  return (
    <section className="mx-auto max-w-3xl">
      <Link
        href={`/learn/${check.courseId}?lesson=${check.lessonId}`}
        className="text-sm text-primary underline"
      >
        Back to class
      </Link>
      <h1 className="mt-5 text-2xl font-semibold">{check.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Attempt {check.attemptNumber} · Pass mark {check.passingScore}%
        {check.deadline
          ? ` · Submit by ${new Date(check.deadline).toLocaleTimeString()}`
          : ""}
      </p>
      {closed && (
        <div className="mt-5 border-y border-border py-5" role="status">
          <h2 className="text-lg font-semibold">
            {check.passed ? "Check passed" : "Keep practising"}
          </h2>
          <p className="mt-2">
            Score: {check.score} / {check.maxScore}
          </p>
          <p className="mt-2 text-sm">
            {check.passed
              ? "You can continue to the next class."
              : "Review the class, then return to start another attempt if available."}
          </p>
        </div>
      )}
      <form onSubmit={submit} className="mt-6 space-y-6">
        {check.questions.map((q, index) => (
          <fieldset
            key={q.id}
            disabled={closed || pending}
            className="border-b border-border pb-6"
          >
            <legend className="mb-3 font-medium">
              {index + 1}. {q.prompt}
            </legend>
            <div className="grid gap-2">
              {q.options.map((o) => (
                <label
                  key={o.id}
                  className="flex items-start gap-3 rounded border border-border px-3 py-3 text-sm has-[:checked]:border-primary"
                >
                  <input
                    className="mt-0.5 accent-primary"
                    type="radio"
                    name={q.id}
                    value={o.id}
                    checked={answers[q.id] === o.id}
                    required
                    onChange={() => save({ ...answers, [q.id]: o.id })}
                  />
                  <span>
                    {o.text}
                    {closed && q.correctOption === o.id && (
                      <span className="ml-2 font-medium text-primary">
                        Correct answer
                      </span>
                    )}
                  </span>
                </label>
              ))}
            </div>
            {closed && q.explanation && (
              <p className="mt-3 text-sm text-muted-foreground">
                {q.explanation}
              </p>
            )}
          </fieldset>
        ))}
        {!closed && (
          <Button type="submit" disabled={pending}>
            {pending ? "Submitting..." : "Submit answers"}
          </Button>
        )}
        <p role="status" className="text-sm text-muted-foreground">
          {message}
        </p>
      </form>
    </section>
  );
}
