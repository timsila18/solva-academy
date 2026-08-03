import { publishCourseAction } from "@/features/courses/actions";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/feedback/empty-state";
import { Field, Input, Select, TextArea } from "@/components/ui/form-fields";

export default function AdminCoursesPage() {
  return (
    <DashboardShell>
      <PageHeading title="Admin course management" description="Manage all courses, versions, review queues, risk classifications, suspended courses, archived courses, content issues, media issues, and publishing controls." />
      <Card className="grid gap-4 md:grid-cols-4">
        <Field label="Status"><Select><option>All</option><option>Draft</option><option>Under review</option><option>Approved</option><option>Published</option><option>Suspended</option></Select></Field>
        <Field label="Risk"><Select><option>All risks</option><option>Standard</option><option>High stakes</option><option>Child safety</option></Select></Field>
        <Field label="School"><Select><option>All schools</option></Select></Field>
        <Field label="Search"><Input placeholder="Course title or slug" /></Field>
      </Card>
      <Card className="mt-6">
        <h2 className="font-semibold">Publish approved version</h2>
        <form action={publishCourseAction} className="mt-4 grid gap-4 md:grid-cols-2">
          <Field label="Course ID"><Input name="courseId" required /></Field>
          <Field label="Approved version ID"><Input name="versionId" required /></Field>
          <Field label="Reason"><TextArea name="reason" /></Field>
          <Button className="md:col-span-2" type="submit">Publish approved snapshot</Button>
        </form>
      </Card>
      <div className="mt-6"><EmptyState title="No course rows loaded" description="Connect Supabase list queries to show real course records. No fake popularity, ratings, or learner counts are displayed." /></div>
    </DashboardShell>
  );
}
