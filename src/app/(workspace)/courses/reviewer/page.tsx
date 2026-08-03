import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { EmptyState } from "@/components/feedback/empty-state";
import { Card } from "@/components/ui/card";
import { Field, Select } from "@/components/ui/form-fields";

export default function ReviewerCoursesPage() {
  return (
    <DashboardShell>
      <PageHeading title="Reviewer workspace" description="Review assigned courses, unassigned queues, due dates, changes requested, completed reviews, escalations, and conflict declarations." />
      <Card className="grid gap-4 md:grid-cols-4">
        <Field label="Status"><Select><option>Assigned</option><option>Unassigned</option><option>Due soon</option><option>Overdue</option><option>Resubmitted</option></Select></Field>
        <Field label="School"><Select><option>All schools</option></Select></Field>
        <Field label="Risk"><Select><option>All risks</option><option>Standard</option><option>High stakes</option><option>Child safety</option></Select></Field>
        <Field label="Priority"><Select><option>Normal</option><option>High</option><option>Urgent</option></Select></Field>
      </Card>
      <div className="mt-6"><EmptyState title="No assigned reviews loaded" description="Course reviews, comments, checklists, and assignments are stored in the Prompt 3 schema." /></div>
    </DashboardShell>
  );
}
