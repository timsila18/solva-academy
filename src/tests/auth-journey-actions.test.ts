import { beforeEach, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  signUp: vi.fn(),
  signIn: vi.fn(),
  redirect: vi.fn((path: string) => {
    throw new Error(`REDIRECT:${path}`);
  }),
}));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: async () => ({
    auth: { signUp: mocks.signUp, signInWithPassword: mocks.signIn },
  }),
}));
vi.mock("@/lib/audit/audit", () => ({ writeAuditEvent: vi.fn() }));
vi.mock("@/lib/config/env", () => ({
  getEnv: () => ({ NEXT_PUBLIC_APP_URL: "https://academy.solvaone.co.ke" }),
}));
import { signInAction, signUpAction } from "@/features/auth/actions";
beforeEach(() => {
  vi.clearAllMocks();
});
function learnerForm() {
  const form = new FormData();
  Object.entries({
    fullName: "Learner Test",
    email: "learner@example.com",
    password: "GoodPassword123!",
    confirmPassword: "GoodPassword123!",
    country: "KE",
    preferredLanguage: "en",
    ageBracket: "adult",
    intent: "learner",
    termsAccepted: "on",
    privacyAcknowledged: "on",
  }).forEach(([key, value]) => form.set(key, value));
  return form;
}

it("sends an academy-owner signup straight to the academy application", async () => {
  mocks.signUp.mockResolvedValue({
    data: { user: { id: "user" }, session: {} },
    error: null,
  });
  const form = new FormData();
  Object.entries({
    fullName: "Test User",
    email: "test@example.com",
    password: "TestPassword123!",
    confirmPassword: "TestPassword123!",
    country: "KE",
    preferredLanguage: "en",
    ageBracket: "adult",
    intent: "academy",
    termsAccepted: "on",
    privacyAcknowledged: "on",
  }).forEach(([key, value]) => form.set(key, value));
  await expect(signUpAction(form)).rejects.toThrow("REDIRECT:/academies/start");
  expect(mocks.signUp.mock.calls[0][0].options.data.onboarding_intent).toBe(
    "academy",
  );
  expect(mocks.signUp.mock.calls[0][0].options.data).not.toHaveProperty("role");
});

it("returns a signed-in user to the academy application they started", async () => {
  mocks.signIn.mockResolvedValue({
    data: { user: { id: "user" } },
    error: null,
  });
  const form = new FormData();
  form.set("email", "test@example.com");
  form.set("password", "TestPassword123!");
  form.set("next", "/academies/start");
  await expect(signInAction(form)).rejects.toThrow("REDIRECT:/academies/start");
});

it("keeps the return destination after an unsuccessful sign-in", async () => {
  mocks.signIn.mockResolvedValue({ data: { user: null }, error: {} });
  const form = new FormData();
  form.set("email", "test@example.com");
  form.set("password", "wrong");
  form.set("next", "/academies/start");
  await expect(signInAction(form)).rejects.toThrow(
    "REDIRECT:/auth/sign-in?error=auth&next=%2Facademies%2Fstart",
  );
});

it("signs a new learner into their personal learning journey", async () => {
  mocks.signUp.mockResolvedValue({
    data: { user: { id: "learner" }, session: {} },
    error: null,
  });
  const form = learnerForm();
  form.set("email", " LEARNER@EXAMPLE.COM ");
  await expect(signUpAction(form)).rejects.toThrow("REDIRECT:/learner");
  expect(mocks.signUp.mock.calls[0][0].email).toBe("learner@example.com");
  expect(mocks.signIn).not.toHaveBeenCalled();
});

it("recovers a repeated registration only after verifying the supplied password", async () => {
  mocks.signUp.mockResolvedValue({
    data: { user: null, session: null },
    error: { code: "user_already_exists" },
  });
  mocks.signIn.mockResolvedValue({
    data: { user: { id: "learner" }, session: { access_token: "test" } },
    error: null,
  });
  const form = learnerForm();
  form.set("next", "/courses/example");
  await expect(signUpAction(form)).rejects.toThrow("REDIRECT:/courses/example");
  expect(mocks.signIn).toHaveBeenCalledWith({
    email: "learner@example.com",
    password: "GoodPassword123!",
  });
});

it("does not log in an existing account when the password is wrong", async () => {
  mocks.signUp.mockResolvedValue({
    data: { user: null, session: null },
    error: { code: "user_already_exists" },
  });
  mocks.signIn.mockResolvedValue({
    data: { user: null, session: null },
    error: { code: "invalid_credentials" },
  });
  await expect(signUpAction(learnerForm())).rejects.toThrow(
    "REDIRECT:/auth/sign-up?error=account&intent=learner",
  );
});

it("explains rate limits and preserves the intended role without retrying authentication", async () => {
  mocks.signUp.mockResolvedValue({
    data: { user: null, session: null },
    error: { status: 429, code: "over_request_rate_limit" },
  });
  await expect(signUpAction(learnerForm())).rejects.toThrow(
    "REDIRECT:/auth/sign-up?error=rate-limit&intent=learner",
  );
  expect(mocks.signIn).not.toHaveBeenCalled();
});
