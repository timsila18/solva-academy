import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function SchoolsPage() {
  const db = await createServerSupabaseClient();
  const { data: schools, error } = await db.from("schools").select("id,name,slug,description").eq("visibility", "public").in("status", ["published", "active"]).order("display_order");
  return <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6"><h1 className="text-3xl font-semibold">Schools</h1><p className="mt-3 text-muted-foreground">Find courses by subject.</p>{error ? <p role="alert" className="mt-6">Schools could not load. Please try again.</p> : <div className="mt-7 divide-y divide-border border-y border-border">{schools?.map((school) => <Link key={school.id} href={`/schools/${school.slug}`} className="flex items-center justify-between gap-5 py-5 hover:text-primary"><span><span className="block font-semibold">{school.name}</span>{school.description && <span className="mt-2 block text-sm text-muted-foreground">{school.description}</span>}</span><ArrowRight className="shrink-0" size={18} aria-hidden="true" /></Link>)}</div>}<p className="mt-7 text-sm text-muted-foreground">Want to offer your own courses? <Link href="/academies/start" className="text-primary underline">Start an academy</Link>.</p></section>;
}
