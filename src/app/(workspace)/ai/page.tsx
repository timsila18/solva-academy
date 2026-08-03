import { DataTable } from "@/components/dashboard/data-table";
import { MetricsGrid } from "@/components/dashboard/metric-card";
import { PageHeading } from "@/components/dashboard/page-heading";
import { QuickLinks } from "@/components/dashboard/quick-links";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { getAiDashboardStats } from "@/lib/ai/queries";

export default async function AiWorkspacePage() {
  const user = await requireUserOrRedirect();
  const stats = await getAiDashboardStats(user.id);

  return (
    <DashboardShell>
      <PageHeading title="Solco Intelligence" description="Use AI tutoring, study support, search, translation, recommendations, and accessibility assistance with tenant-aware governance and audit logging." />
      <QuickLinks links={[["AI Tutor", "/ai/tutor"], ["Study tools", "/ai/study"], ["Semantic search", "/ai/search"], ["Instructor AI", "/instructor/ai"], ["Enterprise AI", "/organization/ai"]]} />
      <MetricsGrid metrics={[
        { label: "Recent requests", value: stats.requests.length, definition: "AI requests visible to this user in the current governed context." },
        { label: "Conversations", value: stats.conversationCount, definition: "Private or workspace-scoped AI conversations." },
        { label: "Recommendations", value: stats.recommendationCount, definition: "Active AI recommendation records." },
        { label: "Tokens tracked", value: stats.totalTokens, definition: "Estimated input and output tokens recorded for cost governance." },
      ]} />
      <div className="mt-6">
        <DataTable title="Recent AI activity" description="Every request has safety and status tracking." headers={["Type", "Status", "Safety", "Created"]} rows={stats.requests.map((request) => [request.request_type, <Badge key={request.status}>{request.status}</Badge>, <Badge key={request.safety_status}>{request.safety_status}</Badge>, new Date(request.created_at).toLocaleString("en-KE")])} empty="No AI requests yet." />
      </div>
    </DashboardShell>
  );
}
