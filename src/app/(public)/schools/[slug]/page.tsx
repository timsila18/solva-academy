import { EmptyState } from "@/components/feedback/empty-state";
import { PathwayGrid, SkillCloud } from "@/components/catalog/learning-structure";
import { Card } from "@/components/ui/card";
import { findSchoolBySlug } from "@/lib/catalog/learning-structure";

export default async function SchoolDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const school = findSchoolBySlug(slug);
  const title = school?.name ?? slug.replaceAll("-", " ");
  const paths = school?.paths.map((path) => ({
    name: path,
    school: school.name,
    description: `A ${school.name.toLowerCase()} programme blueprint. Approved courses, instructors, and certificates attach here when published.`,
    skills: school.skills,
  })) ?? [];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">School</p>
      <h1 className="mt-3 text-4xl font-semibold capitalize">{title}</h1>
      <p className="mt-3 max-w-3xl text-muted-foreground">
        {school?.description ?? "School detail pages are ready for Admin-managed banners, icons, theme colors, categories, featured academies, and SEO."}
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Card><h2 className="font-semibold">Categories</h2><p className="mt-2 text-sm text-muted-foreground">{school?.categories.join(", ") ?? "Hierarchical categories load from Supabase."}</p></Card>
        <Card><h2 className="font-semibold">Skills</h2><p className="mt-2 text-sm text-muted-foreground">Reusable skills connect later to courses, certificates, employers, and opportunities.</p></Card>
        <Card><h2 className="font-semibold">Academies</h2><p className="mt-2 text-sm text-muted-foreground">Approved academies can be featured here without exposing drafts or private tenant data.</p></Card>
      </div>
      {school ? (
        <>
          <div className="mt-10">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Skill map</p>
            <div className="mt-4"><SkillCloud skills={school.skills} /></div>
          </div>
          <div className="mt-10">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Path blueprints</p>
            <div className="mt-4"><PathwayGrid paths={paths} /></div>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {school.outcomes.map((outcome) => (
              <Card key={outcome}><h2 className="font-semibold">Outcome</h2><p className="mt-2 text-sm text-muted-foreground">{outcome}</p></Card>
            ))}
          </div>
        </>
      ) : null}
      <div className="mt-8"><EmptyState title="No fake course catalogue" description="Courses appear only after Prompt 3 course builder and review workflows." /></div>
    </section>
  );
}
