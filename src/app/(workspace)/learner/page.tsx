import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ButtonLink } from "@/components/ui/button";

export default async function LearnerDashboardPage() {
  const user = await requireUserOrRedirect();
  const db = await createServerSupabaseClient();
  const [enrollments, episodes] = await Promise.all([
    db.from("enrollments").select("id,course_id,status,courses(title)").eq("learner_id", user.id).in("status", ["active", "not_started", "in_progress", "completed"]).order("enrolled_at", { ascending: false }),
    db.from("episode_entitlements").select("id,course_id,lesson_id,course_lessons(title)").eq("learner_id", user.id).eq("status", "active").or(`ends_at.is.null,ends_at.gt.${new Date().toISOString()}`),
  ]);
  const hasLearning = Boolean(enrollments.data?.length || episodes.data?.length);
  return <DashboardShell>
    <h1 className="text-2xl font-semibold">My learning</h1><p className="mt-2 text-muted-foreground">Your courses and classes.</p>
    {enrollments.error || episodes.error ? <p role="alert" className="mt-6 text-sm">Your learning could not load. Please refresh the page.</p> : hasLearning ? <div className="mt-6 divide-y divide-border border-y border-border">
      {enrollments.data?.map((enrollment) => <Link key={enrollment.id} href={`/learn/${enrollment.course_id}`} className="flex flex-wrap items-center justify-between gap-3 py-5"><span className="font-medium">{(enrollment.courses as unknown as { title: string } | null)?.title ?? "Course"}</span><span className="text-sm text-primary">{enrollment.status === "completed" ? "Review course" : "Continue learning"}</span></Link>)}
      {episodes.data?.filter((episode) => !enrollments.data?.some((enrollment) => enrollment.course_id === episode.course_id)).map((episode) => <Link key={episode.id} href={`/learn/${episode.course_id}?lesson=${episode.lesson_id}`} className="flex flex-wrap items-center justify-between gap-3 py-5"><span className="font-medium">{(episode.course_lessons as unknown as { title: string } | null)?.title ?? "Class"}</span><span className="text-sm text-primary">Open class</span></Link>)}
    </div> : <section className="mt-7 border-y border-border py-8"><h2 className="font-semibold">You haven’t joined a course yet</h2><p className="mt-2 text-sm text-muted-foreground">Find a course you’re interested in to get started.</p><div className="mt-5"><ButtonLink href="/courses">Browse courses</ButtonLink></div></section>}
    <div className="mt-7 flex flex-wrap gap-5 text-sm"><Link href="/welcome" className="text-primary underline">Teach or start an academy</Link><Link href="/learner/saved" className="text-primary underline">Saved courses</Link></div>
  </DashboardShell>;
}
