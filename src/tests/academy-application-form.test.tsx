import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
vi.mock("@/features/tenants/actions", () => ({ submitAcademyApplicationAction: async () => ({ needsSignIn: true, error: "Please sign in before submitting." }) }));
import { AcademyApplicationForm } from "@/components/academies/application-form";
afterEach(cleanup);

it("preserves entered application details when the session has expired", async () => {
  const user = userEvent.setup();
  render(<AcademyApplicationForm schools={[{ id: "school", name: "Human Resources" }]} loadFailed={false} signedIn />);
  await user.type(screen.getByLabelText("Academy name"), "Solva HR Academy");
  await user.type(screen.getByLabelText("Preferred slug"), "solva-hr-academy");
  await user.selectOptions(screen.getByLabelText("School"), "school");
  await user.type(screen.getByLabelText("Short description"), "Practical professional training for HR practitioners.");
  await user.type(screen.getByLabelText("Why do you want to teach?"), "Help professionals apply practical human resources knowledge.");
  await user.type(screen.getByLabelText("Expected audience"), "HR professionals and learners");
  await user.click(screen.getByRole("checkbox"));
  await user.click(screen.getByRole("button", { name: "Submit academy application" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Please sign in");
  expect(screen.getByLabelText("Academy name")).toHaveValue("Solva HR Academy");
  expect(screen.getByLabelText("Short description")).toHaveValue("Practical professional training for HR practitioners.");
  expect(screen.getByLabelText("School")).toHaveValue("school");
  expect(screen.getByRole("link", { name: /Sign in in a new tab/ })).toHaveAttribute("target", "_blank");
}, 15000);
