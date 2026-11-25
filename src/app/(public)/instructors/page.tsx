import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/feedback/empty-state";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function InstructorsPage() {
  const db = await createServerSupabaseClient();
  const { data: instructors, error } = await db
    .from("instructor_profiles")
    .select("id,slug,biography,teaching_languages")
    .eq("status", "active")
    .eq("public_visibility", "public")
    .order("created_at", { ascending: false })
    .limit(60);
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Instructors</h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            Meet the people behind the courses.
          </p>
        </div>
        <ButtonLink href="/instructors/apply">Apply to teach</ButtonLink>
      </div>
      <div className="mt-8">
        {error ? (
          <p role="alert">Instructors could not load. Please try again.</p>
        ) : instructors?.length ? (
          <div className="divide-y divide-border border-y border-border">
            {instructors.map((i) => (
              <article key={i.id} className="py-5">
                <h2 className="text-lg font-semibold capitalize">
                  <Link href={`/instructors/${i.slug}`}>
                    {i.slug.replaceAll("-", " ")}
                  </Link>
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {i.biography}
                </p>
                <Link
                  href={`/instructors/${i.slug}`}
                  className="mt-3 inline-block text-sm text-primary underline"
                >
                  View instructor
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Instructors"
            description="Instructor profiles will appear here as they join."
          />
        )}
      </div>
    </section>
  );
}
