import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DataTable } from "@/components/dashboard/data-table";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireUserOrRedirect } from "@/lib/authorization/server";

export default async function InstructorCoursesPage() {
  const user = await requireUserOrRedirect();
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("courses").select("id,title,status,visibility,updated_at").eq("owner_id", user.id).order("updated_at", { ascending: false });

  return (
    <DashboardShell>
      <PageHeading title="Course Studio" description="Your courses" />
      <div className="mb-5 flex flex-wrap gap-2">
        <ButtonLink href="/courses/builder/new">Create course</ButtonLink>
        <ButtonLink href="/courses/reviewer" variant="outline">Review comments</ButtonLink>
      </div>
      <DataTable
        title="Owned courses"
        description=""
        headers={["Course", "Status", "Visibility", "Updated", "Actions"]}
        rows={(data ?? []).map((course) => [
          course.title,
          <Badge key={course.status}>{course.status}</Badge>,
          course.visibility,
          new Date(course.updated_at).toLocaleDateString("en-KE"),
          <ButtonLink key={course.id} href={`/courses/builder/${course.id}`} size="sm" variant="outline">Open</ButtonLink>,
        ])}
        empty="No instructor-owned courses yet."
      />
    </DashboardShell>
  );
}
