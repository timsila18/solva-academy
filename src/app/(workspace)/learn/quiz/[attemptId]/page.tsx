import { DashboardShell } from "@/components/layout/dashboard-shell";
import { notFound } from "next/navigation";
import { z } from "zod";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { getLearnerCheck } from "@/lib/learning/checks";
import { KnowledgeCheck } from "@/components/learning/knowledge-check";

export default async function QuizAttemptPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const user = await requireUserOrRedirect();
  const { attemptId } = await params;
  if (!z.uuid().safeParse(attemptId).success) notFound();
  const check = await getLearnerCheck(attemptId, user.id);
  if (!check) notFound();
  return (
    <DashboardShell>
      <KnowledgeCheck initial={check} />
    </DashboardShell>
  );
}
