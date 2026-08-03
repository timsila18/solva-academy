import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { EmptyState } from "@/components/feedback/empty-state";

export default function AdminSchoolsPage() {
  return <DashboardShell><PageHeading title="Schools" description="Manage Admin-configurable schools, ordering, status, and visibility." /><EmptyState title="Seed schools after Supabase migration" description="Human Resources, Music, Dance, Academic Tutoring, Business and Entrepreneurship, and Technology and AI are included in seed SQL." /></DashboardShell>;
}
