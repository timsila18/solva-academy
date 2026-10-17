import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const db = await createServerSupabaseClient();
  const { data: schools } = await db.from("schools").select("id,name,slug").eq("visibility", "public").in("status", ["published", "active"]).order("display_order");
  return <div className="mx-auto max-w-6xl px-4 sm:px-6">
    <section className="border-b border-border py-12 sm:py-16">
      <h1 className="text-3xl font-semibold sm:text-4xl">Solva Academy</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">Practical courses for your career, business, and everyday life.</p>
      <form action="/courses" className="mt-7 flex max-w-2xl gap-2"><label className="flex min-w-0 flex-1 items-center gap-3 rounded-md border border-border px-3"><Search size={19} className="shrink-0 text-muted-foreground" aria-hidden="true" /><span className="sr-only">Find a course</span><input name="q" placeholder="What would you like to learn?" className="min-h-12 min-w-0 w-full bg-transparent text-sm outline-none" /></label><button type="submit" className="rounded-md bg-primary px-4 text-sm font-medium text-white">Search</button></form>
      <div className="mt-5"><Link href="/courses" className="text-sm text-primary underline">Browse all courses</Link></div>
    </section>
    <section className="py-9"><h2 className="text-xl font-semibold">Explore by subject</h2><div className="mt-5 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">{schools?.map((school) => <Link key={school.id} href={`/schools/${school.slug}`} className="flex items-center justify-between gap-3 border-b border-border py-4 text-sm hover:text-primary"><span>{school.name}</span><ArrowRight size={16} aria-hidden="true" /></Link>)}</div></section>
      <section className="grid gap-8 border-t border-border py-9 md:grid-cols-2"><div><h2 className="text-xl font-semibold">Have something to teach?</h2><p className="mt-3 text-sm text-muted-foreground">Start your own academy or join as an instructor.</p><div className="mt-5 flex flex-wrap gap-3"><ButtonLink href="/academies/start" size="sm">Start an academy</ButtonLink><ButtonLink href="/instructors/apply" size="sm" variant="outline">Become an instructor</ButtonLink></div></div><div><h2 className="text-xl font-semibold">Learning for your team</h2><p className="mt-3 text-sm text-muted-foreground">Bring your organization’s training together in one place.</p><Link href="/organizations/create" className="mt-5 inline-block text-sm text-primary underline">Set up an organization</Link></div></section>
  </div>;
}
