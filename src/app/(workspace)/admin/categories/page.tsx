import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { EmptyState } from "@/components/feedback/empty-state";

export default function AdminCategoriesPage() {
  return <DashboardShell><PageHeading title="Categories" description="Manage taxonomy hierarchy without code changes." /><EmptyState title="Category management foundation" description="Parent-child category structure is in the database migration." /></DashboardShell>;
}
