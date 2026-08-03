import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { EmptyState } from "@/components/feedback/empty-state";

export default function AdminAuditLogsPage() {
  return <DashboardShell><PageHeading title="Audit logs" description="Audit records capture sensitive platform activity without storing secrets or raw tokens." /><EmptyState title="No audit records loaded" description="Filtering and live records require a configured Supabase project." /></DashboardShell>;
}
