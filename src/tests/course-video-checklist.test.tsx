import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
vi.mock("@/components/courses/video-upload", () => ({ VideoUpload: ({ lessonId }: { lessonId: string }) => <form aria-label={`Upload ${lessonId}`} /> }));
import { CourseVideoChecklist, type PreparedLesson } from "@/components/courses/course-video-checklist";
afterEach(cleanup);
const lessons: PreparedLesson[] = Array.from({ length: 16 }, (_, i) => ({ id: `lesson-${i}`, title: `Class ${i + 1}`, lesson_type: "video", short_summary: "Class summary", learning_objective: "Apply HR practice", learner_instructions: i === 15 ? "Final capstone" : "Practical exercise instructions", videoAttached: false, priceKes: 1000 }));
it("shows all sixteen empty video slots, saved prices and a truthful progress count", () => {
  const { container } = render(<CourseVideoChecklist courseId="course" lessons={lessons} />);
  expect(screen.getByRole("status")).toHaveTextContent("0 of 16 videos added");
  expect(screen.getAllByText("Awaiting video")).toHaveLength(16);
  expect(screen.getAllByText("KSh 1,000")).toHaveLength(16);
  expect(container.querySelectorAll("details[open]")).toHaveLength(0);
  expect(screen.getByText("Final capstone")).toBeInTheDocument();
});
it("counts only attached videos, not other lesson types", () => {
  render(<CourseVideoChecklist courseId="course" lessons={[{ ...lessons[0], videoAttached: true }, { ...lessons[1], lesson_type: "text" }]} />);
  expect(screen.getByRole("status")).toHaveTextContent("1 of 1 videos added");
  expect(screen.getByText("Video attached")).toBeInTheDocument();
});
