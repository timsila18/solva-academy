import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { KnowledgeCheck } from "@/components/learning/knowledge-check";
import type { LearnerCheck } from "@/lib/learning/checks";
const check: LearnerCheck = {
  id: "attempt",
  courseId: "course",
  lessonId: "lesson",
  title: "Class check",
  status: "in_progress",
  attemptNumber: 1,
  score: null,
  maxScore: null,
  passed: null,
  passingScore: 70,
  deadline: null,
  answers: {},
  questions: [
    {
      id: "q",
      prompt: "Choose one",
      points: 1,
      options: [
        { id: "a", text: "Option A" },
        { id: "b", text: "Option B" },
      ],
    },
  ],
};
afterEach(() => vi.unstubAllGlobals());
it("saves selected answers and renders server-scored results", async () => {
  const fetch = vi.fn(async (_url: string, options: RequestInit) =>
    Response.json({
      check:
        options.method === "POST"
          ? { ...check, status: "passed", score: 1, maxScore: 1, passed: true }
          : check,
    }),
  );
  vi.stubGlobal("fetch", fetch);
  render(<KnowledgeCheck initial={check} />);
  fireEvent.click(screen.getByLabelText("Option A"));
  await waitFor(() =>
    expect(screen.getByRole("status")).toHaveTextContent("Answers saved"),
  );
  fireEvent.click(screen.getByRole("button", { name: "Submit answers" }));
  await waitFor(() =>
    expect(screen.getByText("Check passed")).toBeInTheDocument(),
  );
  expect(screen.getByText("Score: 1 / 1")).toBeInTheDocument();
  expect(fetch.mock.calls[1][1].body).toBe(
    JSON.stringify({ answers: { q: "a" } }),
  );
});
it("keeps answers on screen when submission fails", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () =>
      Response.json({ error: "Connection interrupted." }, { status: 503 }),
    ),
  );
  render(<KnowledgeCheck initial={{ ...check, answers: { q: "a" } }} />);
  fireEvent.click(screen.getByRole("button", { name: "Submit answers" }));
  await waitFor(() =>
    expect(screen.getByRole("status")).toHaveTextContent(
      "Connection interrupted.",
    ),
  );
  expect(screen.getByLabelText("Option A")).toBeChecked();
});
