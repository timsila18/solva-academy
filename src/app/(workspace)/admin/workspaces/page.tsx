import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { EmptyState } from "@/components/feedback/empty-state";

export default function AdminWorkspacesPage() {
  return <DashboardShell><PageHeading title="Workspaces" description="Inspect personal, tutor, academy, organization, and platform administration workspaces." /><EmptyState title="Workspace data loads from Supabase" description="No fake workspace rows are shown." /></DashboardShell>;
}
