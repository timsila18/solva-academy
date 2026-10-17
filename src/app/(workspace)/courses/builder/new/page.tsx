import { createCourseAction } from "@/features/courses/actions";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select, TextArea } from "@/components/ui/form-fields";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function NewCoursePage() {
  const user = await requireUserOrRedirect();
  const db = await createServerSupabaseClient();
  const [{ data: memberships }, { data: schools }, { data: types }, { data: levels }] = await Promise.all([
    db.from("workspace_members").select("workspace_id,workspaces(id,name)").eq("user_id", user.id).eq("status", "active"),
    db.from("schools").select("id,name").order("name"),
    db.from("course_types").select("id,name").eq("status", "active"),
    db.from("course_levels").select("id,name").eq("status", "active"),
  ]);
  return (
    <DashboardShell>
      <PageHeading title="Create course" description="Create an instructor-owned, academy-owned, or platform-owned course draft in one primary owning workspace." />
      <Card>
        <form action={createCourseAction} className="grid gap-4 md:grid-cols-2">
          <Field label="Workspace"><Select name="owningWorkspaceId" required><option value="">Choose workspace</option>{memberships?.map((membership) => <option key={membership.workspace_id} value={membership.workspace_id}>{(membership.workspaces as unknown as { name: string } | null)?.name ?? "Workspace"}</option>)}</Select></Field>
          <Field label="Title"><Input name="title" required /></Field>
          <Field label="Slug"><Input name="slug" required /></Field>
          <Field label="Subtitle"><Input name="subtitle" /></Field>
          <Field label="Language"><Input name="language" defaultValue="en" required /></Field>
          <Field label="School"><Select name="schoolId" required><option value="">Choose school</option>{schools?.map((school) => <option key={school.id} value={school.id}>{school.name}</option>)}</Select></Field>
          <Field label="Course type"><Select name="courseTypeId" required><option value="">Choose type</option>{types?.map((type) => <option key={type.id} value={type.id}>{type.name}</option>)}</Select></Field>
          <Field label="Level"><Select name="levelId" required><option value="">Choose level</option>{levels?.map((level) => <option key={level.id} value={level.id}>{level.name}</option>)}</Select></Field>
          <Field label="Estimated duration minutes"><Input name="estimatedDurationMinutes" type="number" defaultValue="0" /></Field>
          <Field label="Delivery format"><Select name="deliveryFormat" defaultValue="self_paced"><option value="self_paced">Self-paced</option><option value="instructor_led">Instructor-led</option><option value="blended">Blended</option></Select></Field>
          <Field label="Visibility"><Select name="visibility" defaultValue="private"><option value="private">Private</option><option value="unlisted">Unlisted</option><option value="public">Public after publish</option></Select></Field>
          <Field label="Short description"><TextArea name="shortDescription" required /></Field>
          <Field label="Full description"><TextArea name="fullDescription" /></Field>
          <Field label="Target learner"><TextArea name="targetLearner" /></Field>
          <Field label="Prerequisites"><TextArea name="prerequisites" /></Field>
          <Button className="md:col-span-2" type="submit">Create draft course</Button>
        </form>
      </Card>
    </DashboardShell>
  );
}
