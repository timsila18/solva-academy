import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { EmptyState } from "@/components/feedback/empty-state";

export default function PreferencesPage() {
  return <DashboardShell><PageHeading title="Preferences" description="Language, accessibility, low-data, notifications, privacy, and active workspace preferences." /><EmptyState title="Preference controls are staged" description="Database tables and navigation are ready for functional controls." /></DashboardShell>;
}
