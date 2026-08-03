import { recordLessonProgressAction } from "@/features/commerce/actions";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/feedback/empty-state";
import { Field, Input } from "@/components/ui/form-fields";

export default async function CoursePlayerPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  return (
    <DashboardShell>
      <PageHeading title="Course player" description="Learners access the enrolled course version through entitlement and enrollment checks." />
      <Card>
        <p className="text-sm text-muted-foreground">Course ID: <span className="font-mono text-foreground">{courseId}</span></p>
        <div className="mt-5 grid gap-4 md:grid-cols-[16rem_1fr]">
          <EmptyState title="Curriculum navigation" description="Modules and lessons load lazily from the enrolled version." />
          <EmptyState title="Lesson content" description="No autoplay. Text-first, captions, transcripts, and low-data preferences are supported by the data model." />
        </div>
      </Card>
      <Card className="mt-6">
        <h2 className="font-semibold">Record lesson progress</h2>
        <form action={recordLessonProgressAction} className="mt-4 grid gap-4 md:grid-cols-2">
          <Field label="Enrollment ID"><Input name="enrollmentId" required /></Field>
          <Field label="Lesson ID"><Input name="lessonId" required /></Field>
          <Field label="Progress %"><Input name="progressPercentage" type="number" min="0" max="100" defaultValue="100" /></Field>
          <Field label="Position seconds"><Input name="positionSeconds" type="number" defaultValue="0" /></Field>
          <Button className="md:col-span-2" type="submit">Save progress</Button>
        </form>
      </Card>
    </DashboardShell>
  );
}
