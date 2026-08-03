import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { EmptyState } from "@/components/feedback/empty-state";

export default async function QuizAttemptPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const { attemptId } = await params;
  return (
    <DashboardShell>
      <PageHeading title="Quiz attempt" description="Correct answers remain server-protected. Autosave and scoring are attached to the attempt record." />
      <EmptyState title="Quiz attempt shell" description={`Attempt ${attemptId} is ready for question rendering, autosave, scoring, and manual-review states.`} />
    </DashboardShell>
  );
}
