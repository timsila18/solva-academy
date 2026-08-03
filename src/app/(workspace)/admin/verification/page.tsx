import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { EmptyState } from "@/components/feedback/empty-state";

export default function AdminVerificationPage() {
  return <DashboardShell><PageHeading title="Verification" description="Modular verification levels: Unverified, Basic, Verified, Professional, Enterprise Approved, Child Teaching Approved." /><EmptyState title="No verification requests loaded" description="Verification requests are stored separately from instructor profiles." /></DashboardShell>;
}
