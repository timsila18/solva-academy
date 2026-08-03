import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { EmptyState } from "@/components/feedback/empty-state";

export default function AdminUsersPage() {
  return (
    <DashboardShell>
      <PageHeading title="Users" description="Search and inspect user profiles, role assignments, workspace memberships, and audit history." />
      <EmptyState title="Connect Supabase to search users" description="This page is permission-controlled. User data is intentionally not mocked." />
    </DashboardShell>
  );
}
