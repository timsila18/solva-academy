import { DataTable } from "@/components/dashboard/data-table";
import { MetricsGrid } from "@/components/dashboard/metric-card";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { requirePlatformAdmin } from "@/lib/authorization/server";
import { getIntegrationDirectory } from "@/lib/launch/queries";

export default async function AdminIntegrationsPage() {
  await requirePlatformAdmin();
  const integrations = await getIntegrationDirectory();
  return (
    <DashboardShell>
      <PageHeading title="Integrations" description="Review available, configured, connected, error, administrator-only, and coming-later integrations without implying unverified connections work." />
      <MetricsGrid metrics={[
        { label: "Integrations", value: integrations.length, definition: "Integration records in the directory." },
        { label: "Available", value: integrations.filter((item) => item.status === "available").length, definition: "Can be configured with credentials." },
        { label: "Connected", value: integrations.filter((item) => item.status === "connected").length, definition: "Verified provider connections." },
        { label: "Coming later", value: integrations.filter((item) => item.status === "coming_later").length, definition: "Documented but not active." },
      ]} />
      <div className="mt-6">
        <DataTable title="Integration directory" description="External credentials and staging verification are required before enabling production use." headers={["Provider", "Category", "Status", "Updated"]} rows={integrations.map((item) => [item.display_name, item.category, <Badge key={item.status}>{item.status}</Badge>, new Date(item.updated_at).toLocaleDateString("en-KE")])} empty="No integrations configured." />
      </div>
    </DashboardShell>
  );
}
