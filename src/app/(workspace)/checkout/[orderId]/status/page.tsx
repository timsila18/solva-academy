import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { EmptyState } from "@/components/feedback/empty-state";

export default async function PaymentStatusPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  return (
    <DashboardShell>
      <PageHeading title="Payment status" description="Check your phone for the M-Pesa prompt. Payment is confirmed only after the secure provider callback is processed." />
      <EmptyState title="Processing payment" description={`Order ${orderId} remains protected against duplicate callbacks and delayed M-Pesa responses.`} />
    </DashboardShell>
  );
}
