import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import Link from "next/link";

export default function InstructorReviewsPage() {
  return (
    <DashboardShell>
      <PageHeading
        title="Reviews"
        description="Learner reviews are not available yet."
      />
      <Link href="/support" className="text-sm text-primary underline">
        Ask about course feedback
      </Link>
    </DashboardShell>
  );
}
