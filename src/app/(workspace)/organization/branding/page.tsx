import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { SectionGrid } from "@/components/dashboard/section-grid";

export default function EnterpriseBrandingPage() {
  return (
    <DashboardShell>
      <PageHeading title="Enterprise branding" description="Organization-scoped logo, banner, colors, contact, support, internal homepage, and welcome message without affecting platform or academy branding." />
      <SectionGrid items={[
        ["Logo and banner", "Stored in enterprise_branding for organization-only surfaces."],
        ["Colors", "Accent color remains organization-scoped."],
        ["Support", "Organization support contacts are separate from Solva Academy support."],
        ["Welcome message", "Internal homepage content is prepared."],
      ]} />
    </DashboardShell>
  );
}
