import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
vi.mock("@/features/courses/studio-actions", () => ({
  studioAction: vi.fn(async () => ({ success: "Saved." })),
}));
import { CourseSetup } from "@/components/courses/course-setup";
afterEach(cleanup);
it("shows names instead of internal IDs and preserves details between steps", () => {
  const choice = [{ id: "id", name: "Example" }];
  render(
    <CourseSetup
      workspaces={[{ id: "workspace", name: "My Academy" }]}
      schools={choice}
      levels={choice}
      templates={choice}
    />,
  );
  expect(
    screen.getByRole("option", { name: "My Academy" }),
  ).toBeInTheDocument();
  expect(screen.queryByLabelText(/slug|workspace id/i)).not.toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("Course title"), {
    target: { value: "Practical HR" },
  });
  fireEvent.change(screen.getByLabelText("Description"), {
    target: { value: "Practical human resource management for professionals." },
  });
  fireEvent.change(screen.getByLabelText("School"), {
    target: { value: "id" },
  });
  fireEvent.change(screen.getByLabelText("Level"), { target: { value: "id" } });
  fireEvent.click(screen.getByRole("button", { name: "Continue" }));
  expect(
    screen.getByRole("button", { name: "Create draft" }),
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Back" }));
  expect(screen.getByLabelText("Course title")).toHaveValue("Practical HR");
});
