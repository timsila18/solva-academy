import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { EmptyState } from "@/components/feedback/empty-state";

export default function SavedCoursesPage() {
  return <DashboardShell><PageHeading title="Saved courses" description="Saved courses are user-private and duplicate-protected." /><EmptyState title="No saved courses loaded" description="Save real published courses from the course detail page." /></DashboardShell>;
}
