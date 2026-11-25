import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import Link from "next/link";

export default function AcademySupportPage() {
  return (
    <DashboardShell>
      <PageHeading
        title="Academy support"
        description="Get help with your academy, learners, or payments."
      />
      <Link href="/support" className="text-sm text-primary underline">
        Open a support ticket
      </Link>
    </DashboardShell>
  );
}
