import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { SectionGrid } from "@/components/dashboard/section-grid";

export default function EnterpriseBillingPage() {
  return (
    <DashboardShell>
      <PageHeading title="Billing placeholder" description="Enterprise billing is intentionally deferred to a later prompt while preserving workspace hooks." />
      <SectionGrid items={[["Billing profile", "Deferred."], ["Invoices", "Deferred."], ["Plans", "Deferred."], ["Usage", "Deferred."]]} />
    </DashboardShell>
  );
}
