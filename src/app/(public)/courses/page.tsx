import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function CoursesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const db = await createServerSupabaseClient();
  let query = db.from("courses").select("id,title,slug,short_description,language").eq("status", "published").eq("visibility", "public").order("created_at", { ascending: false }).limit(100);
  if (q) query = query.ilike("title", `%${q.slice(0, 100)}%`);
  const { data: courses, error } = await query;
  return <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
    <div className="flex flex-wrap items-center justify-between gap-4"><h1 className="text-3xl font-semibold">Courses</h1><ButtonLink href="/courses/builder/new">Create course</ButtonLink></div>
    <form className="my-8 flex gap-3"><input aria-label="Search courses" name="q" defaultValue={q} placeholder="Search courses" className="min-w-0 flex-1 rounded border border-border bg-background px-3 py-2" /><button type="submit" className="rounded bg-primary px-4 py-2 text-primary-foreground">Search</button></form>
    {error ? <p role="alert">Courses could not load. Please try again shortly.</p> : courses?.length ? <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{courses.map((course) => <article key={course.id} className="rounded-lg border border-border p-5"><h2 className="text-xl font-semibold"><Link href={`/courses/${course.slug}`}>{course.title}</Link></h2><p className="mt-3 text-sm text-muted-foreground">{course.short_description}</p><Link href={`/courses/${course.slug}`} className="mt-5 inline-block text-primary underline">View course</Link></article>)}</div> : <p className="border-y border-border py-8 text-muted-foreground">{q ? "No courses match your search." : "Courses will appear here when enrollment opens."}</p>}
  </section>;
}
