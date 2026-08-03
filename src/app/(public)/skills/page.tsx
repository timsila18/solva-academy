import { CatalogueHero, SkillCloud, TrustStructureGrid } from "@/components/catalog/learning-structure";
import { Card } from "@/components/ui/card";
import { coreSkills, solvaSchools } from "@/lib/catalog/learning-structure";

export default function SkillsPage() {
  return (
    <>
      <CatalogueHero
        eyebrow="Skills"
        title="A reusable skills catalogue for learning, certificates, enterprise training, and opportunity matching."
        description="Skills are not decorative tags. They connect schools, courses, learning paths, certificates, employee transcripts, academy specializations, and future opportunity matching."
        primary={{ label: "Browse learning paths", href: "/learning-paths" }}
        secondary={{ label: "View schools", href: "/schools" }}
      />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <SkillCloud skills={coreSkills} />
        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          {solvaSchools.map((school) => (
            <Card key={school.slug}>
              <p className="text-sm font-semibold text-primary">{school.name}</p>
              <h2 className="mt-2 text-xl font-semibold">Skill map</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{school.description}</p>
              <div className="mt-5"><SkillCloud skills={school.skills} /></div>
            </Card>
          ))}
        </div>
        <div className="mt-12">
          <TrustStructureGrid />
        </div>
      </section>
    </>
  );
}
