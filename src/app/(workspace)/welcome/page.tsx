import Link from "next/link";
import { BookOpen, Building2, GraduationCap, Users, ArrowRight } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function WelcomePage() {
  const user = await requireUserOrRedirect();
  const db = await createServerSupabaseClient();
  const { data: applications } = await db.from("academy_applications").select("id,academy_name,status").eq("applicant_id", user.id).order("created_at", { ascending: false }).limit(5);
  const choices = [
    { title: "My learning", text: "Open your courses or find something new.", href: "/learner", Icon: BookOpen },
    { title: "Start an academy", text: "Apply, add your courses, and manage your academy.", href: "/academies/start", Icon: GraduationCap },
    { title: "Teach a course", text: "Apply to join as an instructor.", href: "/instructors/apply", Icon: Users },
    { title: "Train my team", text: "Set up learning for your organization.", href: "/organizations/create", Icon: Building2 },
  ];
  return <DashboardShell>
    <h1 className="text-2xl font-semibold">Welcome{user.user_metadata?.full_name ? `, ${String(user.user_metadata.full_name).split(" ")[0]}` : ""}</h1>
    <p className="mt-2 text-muted-foreground">What would you like to do?</p>
    <div className="mt-7 divide-y divide-border border-y border-border">{choices.map(({ title, text, href, Icon }) => <Link key={href} href={href} className="flex items-center gap-4 py-5 hover:text-primary"><Icon size={22} className="shrink-0 text-primary" aria-hidden="true" /><span className="min-w-0 flex-1"><span className="block font-semibold">{title}</span><span className="mt-1 block text-sm text-muted-foreground">{text}</span></span><ArrowRight size={18} className="shrink-0" aria-hidden="true" /></Link>)}</div>
    {!!applications?.length && <section className="mt-8"><h2 className="font-semibold">Academy applications</h2><div className="mt-3 divide-y divide-border">{applications.map((application) => <div key={application.id} className="flex flex-wrap justify-between gap-2 py-3 text-sm"><span>{application.academy_name}</span><span className="text-muted-foreground">{application.status.replaceAll("_", " ")}</span></div>)}</div></section>}
    <p className="mt-8 text-sm text-muted-foreground">Schools, such as Human Resources, group subjects together. To offer your own courses, start an academy.</p>
  </DashboardShell>;
}
