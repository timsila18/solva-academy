import { CatalogueHero, EnterpriseStructureGrid, TrustStructureGrid } from "@/components/catalog/learning-structure";
import { EmptyState } from "@/components/feedback/empty-state";
import { ButtonLink } from "@/components/ui/button";

export default function EmployersPage() {
  return (
    <>
      <CatalogueHero
        eyebrow="Enterprise learning"
        title="Organization learning workspaces for people, departments, skills, compliance, and transcripts."
        description="Solva Academy borrows the strongest enterprise learning structure from mature platforms, then localizes it for Kenyan employers, NGOs, churches, schools, SACCOs, government institutions, and training companies."
        primary={{ label: "Create organization", href: "/organizations/create" }}
        secondary={{ label: "View learning paths", href: "/learning-paths" }}
      />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <EnterpriseStructureGrid />
        <div className="mt-12">
          <TrustStructureGrid />
        </div>
        <div className="mt-8">
          <EmptyState
            title="Enterprise course assignments need real course records"
            description="Departments, campaigns, compliance paths, and employee transcripts are structured now. Real assignments become active once approved courses and internal academy content are available."
            action={<ButtonLink href="/organization" variant="outline">Open organization workspace</ButtonLink>}
          />
        </div>
      </section>
    </>
  );
}
