import { CatalogueHero, SchoolCatalogueGrid, SkillCloud } from "@/components/catalog/learning-structure";
import { coreSkills } from "@/lib/catalog/learning-structure";

export default function SchoolsPage() {
  return (
    <>
      <CatalogueHero
        eyebrow="Schools"
        title="Browse Solva Academy by school, category, skill, and pathway."
        description="Schools are administrator-managed learning domains. They organize categories, skills, academies, instructors, paths, certificates, and eventually published courses."
        primary={{ label: "View paths", href: "/learning-paths" }}
        secondary={{ label: "Explore skills", href: "/skills" }}
      />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <SchoolCatalogueGrid />
        <div className="mt-12 rounded-md border border-border bg-card p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Shared skills</p>
          <h2 className="mt-3 text-3xl font-semibold">Skills can appear across many schools.</h2>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            Skills are reusable platform records. A skill like Excel can support HR, business, finance, technology, and enterprise reporting.
          </p>
          <div className="mt-6"><SkillCloud skills={coreSkills} /></div>
        </div>
      </section>
    </>
  );
}
