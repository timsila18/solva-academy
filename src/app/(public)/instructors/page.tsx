import { SkillCloud } from "@/components/catalog/learning-structure";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/feedback/empty-state";
import { coreSkills } from "@/lib/catalog/learning-structure";

export default function InstructorsPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Instructors</h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            Public instructor profiles appear only after real instructor approval and visibility settings.
          </p>
        </div>
        <ButtonLink href="/instructors/apply">Apply to teach</ButtonLink>
      </div>
      <div className="mt-8">
        <EmptyState title="No public instructors yet" description="Instructor ratings and reviews are placeholders until real course delivery exists." />
      </div>
      <div className="mt-12 rounded-md border border-border bg-card p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Instructor specializations</p>
        <h2 className="mt-3 text-3xl font-semibold">Instructor profiles will connect to schools and verified skills.</h2>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          This gives learners a Coursera-like way to judge fit: not only by name, but by school, skills, academy, language, verification level, and teaching format.
        </p>
        <div className="mt-6"><SkillCloud skills={coreSkills} /></div>
      </div>
    </section>
  );
}
