import { beforeEach, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ admin: vi.fn(), rpc: vi.fn(), revalidate: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: (path: string) => { throw new Error(`REDIRECT:${path}`); } }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidate }));
vi.mock("@/lib/authorization/server", () => ({ requirePlatformAdmin: mocks.admin, requireUser: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({ createServerSupabaseClient: async () => ({ rpc: mocks.rpc }) }));
vi.mock("@/lib/audit/audit", () => ({ writeAuditEvent: vi.fn() }));
import { reviewAcademyApplicationAction } from "@/features/tenants/actions";
function form(decision = "approve", notes = "") {
  const data = new FormData();
  data.set("resourceId", "1dc487e7-0c22-4091-8ae7-28b5bbb4987b");
  data.set("decision", decision); data.set("notes", notes); return data;
}
beforeEach(() => { vi.clearAllMocks(); mocks.admin.mockResolvedValue({ id: "reviewer" }); mocks.rpc.mockResolvedValue({ error: null }); });
it("saves an authenticated academy review and refreshes the list", async () => {
  await expect(reviewAcademyApplicationAction(form())).rejects.toThrow("reviewed=true");
  expect(mocks.rpc).toHaveBeenCalledWith("review_academy_application", { application_id: "1dc487e7-0c22-4091-8ae7-28b5bbb4987b", decision: "approve", review_note: null });
  expect(mocks.revalidate).toHaveBeenCalledWith("/admin/review-queues");
});
it("does not report success when the database rejects approval", async () => {
  mocks.rpc.mockResolvedValue({ error: { message: "Already reviewed" } });
  await expect(reviewAcademyApplicationAction(form())).rejects.toThrow("error=review");
  expect(mocks.revalidate).not.toHaveBeenCalled();
});
it.each(["reject", "request_changes", "suspend"])("rejects an invalid or unexplained %s", async (decision) => {
  await expect(reviewAcademyApplicationAction(form(decision))).rejects.toThrow("error=validation");
  expect(mocks.rpc).not.toHaveBeenCalled();
});
it("does not allow a non-admin to submit a review", async () => {
  mocks.admin.mockRejectedValue(new Error("Forbidden"));
  await expect(reviewAcademyApplicationAction(form())).rejects.toThrow("Forbidden");
  expect(mocks.rpc).not.toHaveBeenCalled();
});
