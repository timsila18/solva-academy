import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { EmptyState } from "@/components/feedback/empty-state";

export default function AdminAcademiesPage() {
  return <DashboardShell><PageHeading title="Academies" description="Inspect academy tenants, status, branding, team boundaries, and audit history." /><EmptyState title="No academies loaded" description="Approved applications create academy records and workspaces." /></DashboardShell>;
}
