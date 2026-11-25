import { beforeEach, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  reset: vi.fn(),
  getUser: vi.fn(),
  update: vi.fn(),
  signOut: vi.fn(),
  exchange: vi.fn(),
  set: vi.fn(),
  get: vi.fn(),
  remove: vi.fn(),
}));
vi.mock("next/navigation", () => ({
  redirect: (path: string) => {
    throw new Error("REDIRECT:" + path);
  },
}));
vi.mock("next/headers", () => ({
  cookies: async () => ({
    set: mocks.set,
    get: mocks.get,
    delete: mocks.remove,
  }),
}));
vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: async () => ({
    auth: {
      resetPasswordForEmail: mocks.reset,
      getUser: mocks.getUser,
      updateUser: mocks.update,
      signOut: mocks.signOut,
      exchangeCodeForSession: mocks.exchange,
    },
  }),
}));
vi.mock("@/lib/config/env", () => ({
  getEnv: () => ({ NEXT_PUBLIC_APP_URL: "https://academy.solvaone.co.ke" }),
}));
vi.mock("@/lib/audit/audit", () => ({ writeAuditEvent: vi.fn() }));
import {
  forgotPasswordAction,
  resetPasswordAction,
} from "@/features/auth/actions";
import { GET } from "@/app/(auth)/auth/callback/route";
import { NextRequest } from "next/server";
beforeEach(() => vi.clearAllMocks());
function passwordForm() {
  const f = new FormData();
  f.set("password", "New-Test-Password-123!");
  f.set("confirmPassword", "New-Test-Password-123!");
  return f;
}
it("sends reset mail through the established callback and marks the browser recovery journey", async () => {
  mocks.reset.mockResolvedValue({ error: null });
  const form = new FormData();
  form.set("email", "tim@example.com");
  await expect(forgotPasswordAction(form)).rejects.toThrow(
    "REDIRECT:/auth/check-email",
  );
  expect(mocks.reset).toHaveBeenCalledWith("tim@example.com", {
    redirectTo: "https://academy.solvaone.co.ke/auth/callback",
  });
  expect(mocks.set).toHaveBeenCalledWith(
    "sa-password-recovery",
    "requested",
    expect.objectContaining({ httpOnly: true, secure: true, maxAge: 1800 }),
  );
});
it("reports a delivery failure rather than pretending an email was sent", async () => {
  mocks.reset.mockResolvedValue({ error: { status: 503 } });
  const f = new FormData();
  f.set("email", "tim@example.com");
  await expect(forgotPasswordAction(f)).rejects.toThrow(
    "REDIRECT:/auth/forgot-password?error=delivery",
  );
  expect(mocks.set).not.toHaveBeenCalled();
});
it("requires an authenticated recovery session before changing any password", async () => {
  mocks.getUser.mockResolvedValue({ data: { user: null }, error: null });
  await expect(resetPasswordAction(passwordForm())).rejects.toThrow(
    "REDIRECT:/auth/forgot-password?error=expired",
  );
  expect(mocks.update).not.toHaveBeenCalled();
});
it("rejects mismatched passwords without calling auth", async () => {
  const form = passwordForm();
  form.set("confirmPassword", "Different-Password-123!");
  await expect(resetPasswordAction(form)).rejects.toThrow(
    "REDIRECT:/auth/reset-password?error=validation",
  );
  expect(mocks.getUser).not.toHaveBeenCalled();
});
it("updates only the authenticated user and ends sessions after a successful reset", async () => {
  mocks.getUser.mockResolvedValue({
    data: { user: { id: "user" } },
    error: null,
  });
  mocks.update.mockResolvedValue({ error: null });
  mocks.signOut.mockResolvedValue({ error: null });
  await expect(resetPasswordAction(passwordForm())).rejects.toThrow(
    "REDIRECT:/auth/sign-in?reset=success",
  );
  expect(mocks.update).toHaveBeenCalledWith({
    password: "New-Test-Password-123!",
  });
  expect(mocks.signOut).toHaveBeenCalledWith({ scope: "global" });
});
it("routes a successfully exchanged recovery code to the new password form", async () => {
  mocks.exchange.mockResolvedValue({ error: null });
  mocks.get.mockReturnValue({ value: "requested" });
  const result = await GET(
    new NextRequest(
      "https://academy.solvaone.co.ke/auth/callback?code=test-code",
    ),
  );
  expect(result.headers.get("location")).toBe(
    "https://academy.solvaone.co.ke/auth/reset-password",
  );
  expect(mocks.remove).toHaveBeenCalledWith("sa-password-recovery");
});
it("does not treat an expired recovery code as a successful sign-in", async () => {
  mocks.exchange.mockResolvedValue({ error: { message: "Expired" } });
  mocks.get.mockReturnValue({ value: "requested" });
  const result = await GET(
    new NextRequest(
      "https://academy.solvaone.co.ke/auth/callback?code=test-code",
    ),
  );
  expect(result.headers.get("location")).toBe(
    "https://academy.solvaone.co.ke/auth/forgot-password?error=expired",
  );
});
