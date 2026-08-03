import { ContentTypeGrid, PathwayGrid, SkillCloud } from "@/components/catalog/learning-structure";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/feedback/empty-state";
import { Field, Input, Select } from "@/components/ui/form-fields";
import { coreSkills, solvaSchools } from "@/lib/catalog/learning-structure";

export default function CoursesPage() {
  const pathBlueprints = solvaSchools.flatMap((school) =>
    school.paths.map((path) => ({
      name: path,
      school: school.name,
      description: `A structured ${school.name.toLowerCase()} path blueprint. Real courses are attached only after approval and publication.`,
      skills: school.skills,
    })),
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Courses</h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            Published courses will appear here from approved snapshots. Drafts and private courses never appear publicly.
          </p>
        </div>
        <ButtonLink href="/courses/builder/new">Create course</ButtonLink>
      </div>
      <div className="mt-8 grid gap-4 rounded-lg border border-border bg-card p-4 md:grid-cols-4">
        <Field label="Search"><Input placeholder="Search real published courses" /></Field>
        <Field label="School"><Select><option>All schools</option></Select></Field>
        <Field label="Level"><Select><option>All levels</option><option>Beginner</option><option>Professional</option></Select></Field>
        <Field label="Sort"><Select><option>Relevance</option><option>Newest</option><option>Alphabetical</option><option>Duration</option><option>Featured</option></Select></Field>
      </div>
      <div className="mt-8">
        <EmptyState title="No published courses yet" description="No fake ratings, enrollment counts, sales, reviews, or popularity data are shown." />
      </div>
      <div className="mt-12">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Catalogue structure</p>
        <h2 className="mt-3 text-3xl font-semibold">Course types Solva Academy supports.</h2>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          These are platform structures, not fake course listings. Published course cards will attach to these types after course review.
        </p>
        <div className="mt-6"><ContentTypeGrid /></div>
      </div>
      <div className="mt-12">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Path blueprints</p>
        <h2 className="mt-3 text-3xl font-semibold">Programs are ready to bundle approved courses.</h2>
        <div className="mt-6"><PathwayGrid paths={pathBlueprints} /></div>
      </div>
      <div className="mt-12">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Skills catalogue</p>
        <h2 className="mt-3 text-3xl font-semibold">Reusable skills that courses can teach and certificates can prove.</h2>
        <div className="mt-6"><SkillCloud skills={coreSkills} /></div>
      </div>
    </section>
  );
}
