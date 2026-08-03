import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { SectionGrid } from "@/components/dashboard/section-grid";

export default function OrganizationCertificatesPage() {
  return (
    <DashboardShell>
      <PageHeading title="Certificate monitoring" description="Track issued, expiring, expired, revoked, required renewals, and future recertification reminders for organization learning." />
      <SectionGrid items={[
        ["Issued", "Issued certificate records are available through certificate and transcript tables."],
        ["Expiring", "Expiration fields are ready for renewal monitoring."],
        ["Expired", "Expired certificates can be reported without deleting history."],
        ["Revoked", "Revocation status remains auditable."],
      ]} />
    </DashboardShell>
  );
}
