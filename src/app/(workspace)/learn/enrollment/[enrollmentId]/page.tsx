import { createQuizAttemptAction, submitAssignmentAction } from "@/features/commerce/actions";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, TextArea } from "@/components/ui/form-fields";

export default async function EnrollmentPage({ params }: { params: Promise<{ enrollmentId: string }> }) {
  const { enrollmentId } = await params;
  return (
    <DashboardShell>
      <PageHeading title="Learning activity" description="Resume learning, start quiz attempts, submit assignments, and preserve progress by enrolled version." />
      <div className="grid gap-5 md:grid-cols-2">
        <Card>
          <h2 className="font-semibold">Start quiz attempt</h2>
          <form action={createQuizAttemptAction} className="mt-4 grid gap-4">
            <input type="hidden" name="enrollmentId" value={enrollmentId} />
            <Field label="Quiz ID"><Input name="quizId" required /></Field>
            <Button type="submit">Start attempt</Button>
          </form>
        </Card>
        <Card>
          <h2 className="font-semibold">Submit assignment</h2>
          <form action={submitAssignmentAction} className="mt-4 grid gap-4">
            <input type="hidden" name="enrollmentId" value={enrollmentId} />
            <Field label="Assignment ID"><Input name="assignmentId" required /></Field>
            <Field label="Response"><TextArea name="responseText" required /></Field>
            <Button type="submit">Submit assignment</Button>
          </form>
        </Card>
      </div>
    </DashboardShell>
  );
}
