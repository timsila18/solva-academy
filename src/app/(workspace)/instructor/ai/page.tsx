import { PageHeading } from "@/components/dashboard/page-heading";
import { QuickLinks } from "@/components/dashboard/quick-links";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUserOrRedirect } from "@/lib/authorization/server";

export default async function InstructorAiPage() {
  await requireUserOrRedirect();
  return (
    <DashboardShell>
      <PageHeading title="Instructor AI" description="Create course, assessment, rubric, lesson, and feedback drafts for instructor review without publishing automatically." />
      <QuickLinks links={[["Course creator", "/instructor/ai/course-creator"], ["Assessments", "/instructor/ai/assessments"], ["Feedback", "/instructor/ai/feedback"]]} />
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Course drafts", "Outline modules, lessons, outcomes, and teaching notes."],
          ["Assessment drafts", "Create quizzes, assignments, and rubrics that remain draft-only."],
          ["Feedback support", "Draft learner feedback with safety labels and audit tracking."],
        ].map(([title, description]) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}
