import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function AcademiesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const search = q.trim().slice(0, 100);
  const db = await createServerSupabaseClient();
  let query = db
    .from("academies")
    .select("id,name,slug,description")
    .eq("status", "active")
    .eq("visibility", "public")
    .order("name")
    .limit(60);
  if (search)
    query = query.ilike(
      "name",
      `%${search.replaceAll("%", "\\%").replaceAll("_", "\\_")}%`,
    );
  const { data: academies, error } = await query;
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Academies</h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            Find an academy for the skills you want to learn.
          </p>
        </div>
        <ButtonLink href="/academies/start">Start your academy</ButtonLink>
      </div>
      <form className="mt-7 flex gap-3">
        <input
          name="q"
          aria-label="Search academies"
          defaultValue={search}
          placeholder="Search academies"
          className="min-w-0 flex-1 rounded border border-border bg-background px-3 py-2"
        />
        <button
          type="submit"
          className="rounded bg-primary px-4 py-2 text-sm font-medium text-white"
        >
          Search
        </button>
      </form>
      <div className="mt-7 divide-y divide-border border-y border-border">
        {error ? (
          <p role="alert" className="py-6">
            Academies could not load. Please try again.
          </p>
        ) : academies?.length ? (
          academies.map((a) => (
            <article key={a.id} className="py-5">
              <h2 className="text-lg font-semibold">
                <Link href={`/academies/${a.slug}`}>{a.name}</Link>
              </h2>
              {a.description && (
                <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
                  {a.description}
                </p>
              )}
              <Link
                href={`/academies/${a.slug}`}
                className="mt-3 inline-block text-sm text-primary underline"
              >
                View academy
              </Link>
            </article>
          ))
        ) : (
          <p className="py-7 text-sm text-muted-foreground">
            {search
              ? "No academies match your search."
              : "Academies will appear here as they launch."}
          </p>
        )}
      </div>
    </section>
  );
}
