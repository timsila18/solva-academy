import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DataTable } from "@/components/dashboard/data-table";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function AcademyCoursesPage() {
  const user = await requireUserOrRedirect();
  const supabase = await createServerSupabaseClient();
  const { data: academies } = await supabase.from("academies").select("id").eq("owner_id", user.id);
  const ids = (academies ?? []).map((academy) => academy.id);
  const { data } = ids.length ? await supabase.from("courses").select("id,title,status,visibility,academy_id,updated_at").in("academy_id", ids).order("updated_at", { ascending: false }) : { data: [] };
  return (
    <DashboardShell>
      <PageHeading title="Academy courses" description="Manage academy course operations, internal review, platform review, version shortcuts, learner overview, and analytics entry points." />
      <div className="mb-5"><ButtonLink href="/courses/builder/new">Create academy course</ButtonLink></div>
      <DataTable title="Courses" description="Only courses in academies governed by this workspace are shown." headers={["Course", "Status", "Visibility", "Updated", "Open"]} rows={(data ?? []).map((course) => [course.title, <Badge key={course.status}>{course.status}</Badge>, course.visibility, new Date(course.updated_at).toLocaleDateString("en-KE"), <ButtonLink key={course.id} href={`/courses/builder/${course.id}`} size="sm" variant="outline">Open</ButtonLink>])} empty="No academy courses yet." />
    </DashboardShell>
  );
}
