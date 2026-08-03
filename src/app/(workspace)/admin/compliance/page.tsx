import { DataTable } from "@/components/dashboard/data-table";
import { MetricsGrid } from "@/components/dashboard/metric-card";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { requirePlatformAdmin } from "@/lib/authorization/server";
import { getComplianceDashboard, getMonitoringDashboard } from "@/lib/platform-ops/queries";

export default async function AdminCompliancePage() {
  await requirePlatformAdmin();
  const [compliance, monitoring] = await Promise.all([getComplianceDashboard(), getMonitoringDashboard()]);
  return (
    <DashboardShell>
      <PageHeading title="Compliance" description="Manage GDPR readiness, Kenya Data Protection Act workflows, consent records, privacy requests, data export/deletion queues, retention, and audit evidence." />
      <MetricsGrid metrics={[
        { label: "Privacy requests", value: compliance.requests.length, definition: "Recent data protection and privacy workflow records." },
        { label: "Open requests", value: compliance.requests.filter((r) => !["completed", "cancelled", "rejected"].includes(r.status)).length, definition: "Requests not yet closed." },
        { label: "Consent records", value: compliance.consents.length, definition: "Versioned consent records." },
        { label: "Retention policies", value: monitoring.retention.length, definition: "Configured retention policy categories." },
      ]} />
      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <DataTable title="Privacy requests" description="Export/deletion completion remains governed and auditable." headers={["Type", "Status", "Jurisdiction", "Due"]} rows={compliance.requests.map((request) => [request.request_type, <Badge key={request.status}>{request.status}</Badge>, request.jurisdiction, request.due_at ? new Date(request.due_at).toLocaleDateString("en-KE") : "No due date"])} empty="No compliance requests." />
        <DataTable title="Retention policies" description="Minimum legal retention cannot be weakened by workspace settings." headers={["Resource", "Minimum days", "Override"]} rows={monitoring.retention.map((policy) => [policy.resource_type, policy.minimum_retention_days, policy.workspace_override_allowed ? "Allowed" : "Locked"])} empty="No retention policies configured." />
      </div>
    </DashboardShell>
  );
}
