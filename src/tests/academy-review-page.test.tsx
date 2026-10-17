import { expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
const mocks = vi.hoisted(() => ({ admin: vi.fn(), fail: false }));
vi.mock("@/lib/authorization/server", () => ({ requirePlatformAdmin: mocks.admin }));
vi.mock("@/features/tenants/actions", () => ({ reviewAcademyApplicationAction: vi.fn() }));
vi.mock("@/components/layout/dashboard-shell", () => ({ DashboardShell: ({ children }: { children: React.ReactNode }) => <main>{children}</main> }));
vi.mock("@/lib/supabase/server", () => ({ createServiceSupabaseClient: () => ({
  from: (table: string) => {
    const result = table === "academy_applications" ? {
      data: [{ id: "application", applicant_id: "person", academy_name: "Solva HR Academy", status: "submitted", country: "KE", school_id: "school", short_description: "Practical HR learning", terms_accepted: true }], error: mocks.fail ? {} : null,
    } : { data: table === "profiles" ? [{ id: "person", email: "applicant@example.com", full_name: "Applicant" }] : [{ id: "school", name: "Human Resources" }], error: null };
    const builder = { select: () => builder, order: () => builder, in: () => builder, limit: async () => result, then: (resolve: (value: typeof result) => unknown) => Promise.resolve(result).then(resolve) };
    return builder;
  },
}) }));
import AdminReviewQueuesPage from "@/app/(workspace)/admin/review-queues/page";
it("shows saved applications and review controls without asking for internal IDs", async () => {
  mocks.fail = false;
  const html = renderToStaticMarkup(await AdminReviewQueuesPage({ searchParams: Promise.resolve({}) }));
  expect(html).toContain("Solva HR Academy");
  expect(html).toContain("Human Resources");
  expect(html).toContain("applicant@example.com");
  expect(html).toContain("Approve and create academy workspace");
  expect(html).not.toContain("Resource ID");
  expect(mocks.admin).toHaveBeenCalled();
});
it("shows a load failure instead of claiming there are no applications", async () => {
  mocks.fail = true;
  const html = renderToStaticMarkup(await AdminReviewQueuesPage({ searchParams: Promise.resolve({}) }));
  expect(html).toContain("Applications could not load");
  expect(html).not.toContain("No academy applications");
});
