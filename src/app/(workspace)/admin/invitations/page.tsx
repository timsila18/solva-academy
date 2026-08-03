import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { EmptyState } from "@/components/feedback/empty-state";

export default function AdminInvitationsPage() {
  return <DashboardShell><PageHeading title="Workspace invitations" description="Inspect invitation email, expiry, cancel/resend/accept/reject status, role assignment, workspace assignment, and audit history." /><EmptyState title="No invitations loaded" description="Duplicate prevention is enforced by the workspace_invitations unique constraint." /></DashboardShell>;
}
