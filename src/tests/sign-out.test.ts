import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ signOut: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({ createServerSupabaseClient: async () => ({ auth: { signOut: mocks.signOut } }) }));
import { POST } from "@/app/(auth)/auth/sign-out/route";

beforeEach(() => { vi.clearAllMocks(); mocks.signOut.mockResolvedValue({ error: null }); });
describe("logout redirect", () => {
  it("signs out and redirects with 303 so the homepage receives GET instead of POST", async () => {
    const response = await POST(new NextRequest("https://academy.solvaone.co.ke/auth/sign-out", { method: "POST" }));
    expect(mocks.signOut).toHaveBeenCalledOnce();
    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("https://academy.solvaone.co.ke/");
  });
  it("also returns an expired session to the homepage", async () => {
    mocks.signOut.mockResolvedValue({ error: { message: "Session missing" } });
    const response = await POST(new NextRequest("https://academy.solvaone.co.ke/auth/sign-out", { method: "POST" }));
    expect(response.status).toBe(303);
  });
});
