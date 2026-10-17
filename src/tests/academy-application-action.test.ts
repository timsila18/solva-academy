import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ getUser: vi.fn(), from: vi.fn(), audit: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({ createServerSupabaseClient: async () => ({ auth: { getUser: mocks.getUser }, from: mocks.from }) }));
vi.mock("@/lib/audit/audit", () => ({ writeAuditEvent: mocks.audit }));
import { submitAcademyApplicationAction } from "@/features/tenants/actions";

beforeEach(() => vi.clearAllMocks());
describe("academy application submission", () => {
  it("returns a sign-in message instead of throwing for an anonymous or expired session", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: null }, error: null });
    const result = await submitAcademyApplicationAction({}, new FormData());
    expect(result.needsSignIn).toBe(true);
    expect(result.error).toContain("sign in");
    expect(mocks.from).not.toHaveBeenCalled();
  });
  it("returns field validation errors without writing an application", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: { id: "user" } }, error: null });
    const result = await submitAcademyApplicationAction({}, new FormData());
    expect(result.error).toBeTruthy();
    expect(mocks.from).not.toHaveBeenCalled();
  });
  it("confirms success only after the application was saved", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: { id: "user" } }, error: null });
    const single = vi.fn().mockResolvedValue({ data: { id: "app" }, error: null });
    mocks.from.mockReturnValue({ insert: () => ({ select: () => ({ single }) }) });
    const form = new FormData();
    Object.entries({ academyName: "Example Academy", slug: "example-academy", shortDescription: "Practical workplace training for professionals.", country: "KE", whyTeach: "Help professionals apply workplace skills confidently.", expectedAudience: "HR professionals", termsAccepted: "on" }).forEach(([key, value]) => form.set(key, value));
    expect(await submitAcademyApplicationAction({}, form)).toEqual({ success: true });
    expect(mocks.from).toHaveBeenCalledWith("academy_applications");
    expect(mocks.audit).toHaveBeenCalledWith(expect.objectContaining({ success: true, resourceId: "app" }));
    single.mockResolvedValue({ data: null, error: { code: "23505" } });
    expect((await submitAcademyApplicationAction({}, form)).error).toContain("already in use");
  });
});
