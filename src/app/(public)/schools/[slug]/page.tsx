import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function SchoolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = await createServerSupabaseClient();
  const { data: school } = await db.from("schools").select("id,name,description").eq("slug", slug).eq("visibility", "public").in("status", ["published", "active"]).single();
  if (!school) notFound();
  const { data: courses, error } = await db.from("courses").select("id,title,slug,short_description").eq("school_id", school.id).eq("visibility", "public").eq("status", "published").order("created_at", { ascending: false });
  return <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6"><Link href="/schools" className="text-sm text-primary underline">All schools</Link><h1 className="mt-5 text-3xl font-semibold">{school.name}</h1>{school.description && <p className="mt-3 text-muted-foreground">{school.description}</p>}<h2 className="mt-8 text-xl font-semibold">Courses</h2>{error ? <p role="alert" className="mt-5">Courses could not load. Please try again.</p> : courses?.length ? <div className="mt-4 divide-y divide-border border-y border-border">{courses.map((course) => <Link key={course.id} href={`/courses/${course.slug}`} className="block py-5"><h3 className="font-semibold">{course.title}</h3><p className="mt-2 text-sm text-muted-foreground">{course.short_description}</p></Link>)}</div> : <p className="mt-4 border-y border-border py-6 text-muted-foreground">Courses in this school will appear here when enrollment opens.</p>}</section>;
}
