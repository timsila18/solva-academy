import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { EmptyState } from "@/components/feedback/empty-state";

export default function AdminInstructorApplicationsPage() {
  return <DashboardShell><PageHeading title="Instructor applications" description="Review biographies, expertise, languages, sample lessons, identity confirmation placeholders, and child teaching preference." /><EmptyState title="No instructor applications loaded" description="Approved instructors become public only according to visibility settings." /></DashboardShell>;
}
