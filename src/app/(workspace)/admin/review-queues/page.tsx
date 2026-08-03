import { reviewQueueAction } from "@/features/tenants/actions";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { EmptyState } from "@/components/feedback/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select, TextArea } from "@/components/ui/form-fields";

export default function AdminReviewQueuesPage() {
  return (
    <DashboardShell>
      <PageHeading title="Review queues" description="Admin queue foundation for academies, instructors, organizations, verification, and later approval workflows." />
      <Card>
        <form action={reviewQueueAction} className="grid gap-4 md:grid-cols-2">
          <Field label="Resource type">
            <Select name="resourceType">
              <option value="academy_application">Academy application</option>
              <option value="instructor_application">Instructor application</option>
              <option value="organization">Organization</option>
              <option value="verification">Verification</option>
            </Select>
          </Field>
          <Field label="Resource ID"><Input name="resourceId" placeholder="UUID" required /></Field>
          <Field label="Decision">
            <Select name="decision">
              <option value="approve">Approve</option>
              <option value="reject">Reject</option>
              <option value="request_changes">Request changes</option>
              <option value="suspend">Suspend</option>
              <option value="archive">Archive</option>
            </Select>
          </Field>
          <Field label="Notes"><TextArea name="notes" /></Field>
          <Button className="md:col-span-2" type="submit">Submit review decision</Button>
        </form>
      </Card>
      <div className="mt-6"><EmptyState title="No queue items loaded" description="Every reviewer action writes an audit event." /></div>
    </DashboardShell>
  );
}
