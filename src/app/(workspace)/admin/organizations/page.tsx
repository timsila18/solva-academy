import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { EmptyState } from "@/components/feedback/empty-state";

export default function AdminOrganizationsPage() {
  return <DashboardShell><PageHeading title="Organizations" description="Review employer and institution workspaces, public visibility, and tenant boundaries." /><EmptyState title="No organizations loaded" description="Organization creation is implemented; enterprise training features are deferred." /></DashboardShell>;
}
