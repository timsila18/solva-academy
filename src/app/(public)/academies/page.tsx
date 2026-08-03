import { Search } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/feedback/empty-state";
import { Field, Input, Select } from "@/components/ui/form-fields";

export default function AcademiesPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Academies</h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            Search and filters are ready for real approved academies. No fake statistics are displayed.
          </p>
        </div>
        <ButtonLink href="/academies/start">Start your academy</ButtonLink>
      </div>
      <div className="mt-8 grid gap-4 rounded-lg border border-border bg-card p-4 md:grid-cols-4">
        <Field label="Search">
          <Input placeholder="Academy name or topic" />
        </Field>
        <Field label="School">
          <Select><option>All schools</option><option>Human Resources</option><option>Technology & AI</option></Select>
        </Field>
        <Field label="Country">
          <Select><option>All countries</option><option>Kenya</option></Select>
        </Field>
        <Field label="Sort">
          <Select><option>Featured</option><option>Newest</option><option>Alphabetical</option></Select>
        </Field>
      </div>
      <div className="mt-8">
        <EmptyState title="Academy catalogue coming during approval setup" description="Academies will become public only after real applications, review, and launch controls are implemented." />
      </div>
      <div className="mt-6 text-sm text-muted-foreground">
        <Search size={16} className="mr-2 inline" aria-hidden />
        Directory search currently covers schools, skills, instructors, public organizations, and approved academies after Supabase is connected.
      </div>
    </section>
  );
}
