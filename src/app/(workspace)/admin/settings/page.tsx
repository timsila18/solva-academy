import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { EmptyState } from "@/components/feedback/empty-state";

export default function AdminSettingsPage() {
  return <DashboardShell><PageHeading title="System settings" description="Business settings belong in database-backed configuration, while secrets stay in environment variables." /><EmptyState title="Settings service foundation" description="Default platform settings are seeded through SQL and guarded by platform permissions." /></DashboardShell>;
}
