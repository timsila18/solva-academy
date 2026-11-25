import { render, screen, fireEvent } from "@testing-library/react";
import { it, expect } from "vitest";
import { Transcript } from "@/components/learning/transcript";
it("filters real transcript paragraphs and shows a useful empty state", () => {
  render(
    <Transcript
      text={"Recruitment begins with a role.\nPayroll is a separate process."}
    />,
  );
  fireEvent.change(screen.getByRole("searchbox"), {
    target: { value: "PAYROLL" },
  });
  expect(
    screen.getByText("Payroll is a separate process."),
  ).toBeInTheDocument();
  expect(
    screen.queryByText("Recruitment begins with a role."),
  ).not.toBeInTheDocument();
  fireEvent.change(screen.getByRole("searchbox"), {
    target: { value: "missing" },
  });
  expect(screen.getByText("No matching text.")).toBeInTheDocument();
});
