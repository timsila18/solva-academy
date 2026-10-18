import { render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
const state = vi.hoisted(() => ({ pending: false }));
vi.mock("react-dom", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react-dom")>()),
  useFormStatus: () => ({ pending: state.pending }),
}));
import { RegistrationSubmit } from "@/components/auth/registration-submit";
import {
  registrationErrorCode,
  registrationErrorMessage,
} from "@/lib/auth/registration-errors";
it("prevents repeat clicks while registration is pending", () => {
  state.pending = true;
  render(<RegistrationSubmit />);
  expect(
    screen.getByRole("button", { name: "Creating your account..." }),
  ).toBeDisabled();
  expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
  state.pending = false;
});
it("maps provider errors to useful safe messages rather than displaying raw details", () => {
  expect(registrationErrorCode({ code: "weak_password" })).toBe("password");
  expect(registrationErrorCode({ code: "email_address_invalid" })).toBe(
    "email",
  );
  expect(registrationErrorCode({ status: 500 })).toBe("auth");
  expect(registrationErrorMessage("account")).toContain("signing in");
  expect(registrationErrorMessage("rate-limit")).toContain(
    "wait a few minutes",
  );
});
