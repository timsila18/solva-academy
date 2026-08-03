import { createLiveSessionAction } from "@/features/live/actions";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select, TextArea } from "@/components/ui/form-fields";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function CreateLiveSessionPage() {
  const supabase = await createServerSupabaseClient();
  const { data: types } = await supabase.from("live_session_types").select("id,name").order("name");
  const { data: workspaces } = await supabase.from("workspaces").select("id,name").limit(20);
  return (
    <DashboardShell>
      <PageHeading title="Create Solco session" description="Schedule a live class, webinar, coaching session, workshop, or organization training with attendance, recording, chat, reminders, and child-safety controls." />
      <Card>
        <form action={createLiveSessionAction} className="grid gap-4 md:grid-cols-2">
          <Field label="Workspace"><Select name="ownerWorkspaceId" required>{(workspaces ?? []).map((workspace) => <option key={workspace.id} value={workspace.id}>{workspace.name}</option>)}</Select></Field>
          <Field label="Session type"><Select name="sessionTypeId"><option value="">None</option>{(types ?? []).map((type) => <option key={type.id} value={type.id}>{type.name}</option>)}</Select></Field>
          <Field label="Title"><Input name="title" required /></Field>
          <Field label="Start time"><Input name="startsAt" type="datetime-local" required /></Field>
          <Field label="Duration minutes"><Input name="durationMinutes" type="number" defaultValue="60" min="1" required /></Field>
          <Field label="Timezone"><Input name="timezone" defaultValue="Africa/Nairobi" required /></Field>
          <Field label="Capacity"><Input name="capacity" type="number" min="1" /></Field>
          <Field label="Visibility"><Select name="visibility" defaultValue="private"><option value="private">Private</option><option value="course">Course</option><option value="academy">Academy</option><option value="organization">Organization</option><option value="public">Public</option><option value="unlisted">Unlisted</option></Select></Field>
          <Field label="Registration"><Select name="registrationMode" defaultValue="invitation_only"><option value="invitation_only">Invitation only</option><option value="course_enrollment">Course enrollment</option><option value="manual">Manual</option><option value="approval_required">Approval required</option><option value="public">Public</option><option value="organization_assigned">Organization assigned</option></Select></Field>
          <Field label="Recording"><Select name="recordingPolicy" defaultValue="host_controlled"><option value="disabled">Disabled</option><option value="host_controlled">Host controlled</option><option value="automatic">Automatic</option><option value="explicit_authorization_required">Explicit authorization</option></Select></Field>
          <Field label="Course ID"><Input name="courseId" /></Field>
          <Field label="Academy ID"><Input name="academyId" /></Field>
          <Field label="Organization ID"><Input name="organizationId" /></Field>
          <Field label="Campaign ID"><Input name="campaignId" /></Field>
          <Field label="Child safety"><Select name="childSafetyEnabled" defaultValue="false"><option value="false">Standard</option><option value="true">Child-focused controls</option></Select></Field>
          <Field label="Short description"><TextArea name="shortDescription" /></Field>
          <Field label="Full description"><TextArea name="fullDescription" /></Field>
          <Button type="submit" className="md:col-span-2">Schedule session</Button>
        </form>
      </Card>
    </DashboardShell>
  );
}
