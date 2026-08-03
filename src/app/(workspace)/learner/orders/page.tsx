import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { EmptyState } from "@/components/feedback/empty-state";

export default function LearnerOrdersPage() {
  return <DashboardShell><PageHeading title="Orders and receipts" description="Learners can view only their own orders, payment attempts, and receipts." /><EmptyState title="No orders loaded" description="Checkout creates real server-calculated orders." /></DashboardShell>;
}
