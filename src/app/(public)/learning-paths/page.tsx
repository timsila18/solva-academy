import { CatalogueHero, PathwayGrid } from "@/components/catalog/learning-structure";
import { EmptyState } from "@/components/feedback/empty-state";
import { solvaSchools } from "@/lib/catalog/learning-structure";

export default function LearningPathsPage() {
  const paths = solvaSchools.flatMap((school) =>
    school.paths.map((path) => ({
      name: path,
      school: school.name,
      description: `A planned pathway that can bundle approved courses, projects, assessments, and certificate rules for ${school.name.toLowerCase()}.`,
      skills: school.skills,
    })),
  );

  return (
    <>
      <CatalogueHero
        eyebrow="Learning paths"
        title="Role, skill, academy, and compliance paths for structured progress."
        description="Borrowing the best idea from mature learning platforms: learners should see clear pathways, not a pile of disconnected courses. Solva paths remain empty until approved courses are attached."
        primary={{ label: "Browse schools", href: "/schools" }}
        secondary={{ label: "Explore courses", href: "/courses" }}
      />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <PathwayGrid paths={paths} />
        <div className="mt-8">
          <EmptyState title="No published path enrollment yet" description="Learners will enroll after real path records, course versions, and completion rules are published." />
        </div>
      </section>
    </>
  );
}
