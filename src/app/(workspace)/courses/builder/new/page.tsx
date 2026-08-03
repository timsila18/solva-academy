import { createCourseAction } from "@/features/courses/actions";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select, TextArea } from "@/components/ui/form-fields";

export default function NewCoursePage() {
  return (
    <DashboardShell>
      <PageHeading title="Create course" description="Create an instructor-owned, academy-owned, or platform-owned course draft in one primary owning workspace." />
      <Card>
        <form action={createCourseAction} className="grid gap-4 md:grid-cols-2">
          <Field label="Owning workspace ID"><Input name="owningWorkspaceId" placeholder="Workspace UUID" required /></Field>
          <Field label="Academy ID"><Input name="academyId" placeholder="Optional academy UUID" /></Field>
          <Field label="Title"><Input name="title" required /></Field>
          <Field label="Slug"><Input name="slug" required /></Field>
          <Field label="Subtitle"><Input name="subtitle" /></Field>
          <Field label="Language"><Input name="language" defaultValue="en" required /></Field>
          <Field label="School ID"><Input name="schoolId" placeholder="Optional UUID" /></Field>
          <Field label="Primary category ID"><Input name="primaryCategoryId" placeholder="Optional UUID" /></Field>
          <Field label="Course type ID"><Input name="courseTypeId" placeholder="Optional UUID" /></Field>
          <Field label="Level ID"><Input name="levelId" placeholder="Optional UUID" /></Field>
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
