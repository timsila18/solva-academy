import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { studioChoices } from "@/lib/courses/studio-data";
import { CourseSetup } from "@/components/courses/course-setup";
export default async function NewCoursePage() {
  const user = await requireUserOrRedirect();
  const db = await createServerSupabaseClient();
  const { data, error } = await db
    .from("workspace_members")
    .select("workspace_id,workspaces(id,name)")
    .eq("user_id", user.id)
    .eq("status", "active");
  if (error)
    return (
      <DashboardShell>
        <p role="alert">Your workspaces could not load. Please refresh.</p>
      </DashboardShell>
    );
  const allowed = [];
  for (const member of data ?? []) {
    const access = await db.rpc("studio_workspace_allowed", {
      workspace: member.workspace_id,
      subject: user.id,
    });
    const workspace = member.workspaces as unknown as {
      id: string;
      name: string;
    };
    if (access.data && workspace) allowed.push(workspace);
  }
  return (
    <DashboardShell>
      <PageHeading title="Create a course" description="Course Studio" />
      {allowed.length ? (
        <CourseSetup workspaces={allowed} {...await studioChoices()} />
      ) : (
        <p>
          You need an approved academy or teaching workspace before creating a
          course.
        </p>
      )}
    </DashboardShell>
  );
}
