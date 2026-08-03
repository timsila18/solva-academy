import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { Card } from "@/components/ui/card";

const adminAreas = [
  ["Users", "/admin/users", "Search users, inspect roles, and review memberships."],
  ["Roles", "/admin/roles", "Inspect protected system roles and configurable custom roles."],
  ["Permissions", "/admin/permissions", "Review granular permission codes and role mappings."],
  ["Workspaces", "/admin/workspaces", "Inspect platform, learner, academy, and organization workspaces."],
  ["Schools", "/admin/schools", "Manage schools and school visibility."],
  ["Categories", "/admin/categories", "Manage taxonomy hierarchy."],
  ["Skills", "/admin/skills", "Manage reusable skills taxonomy."],
  ["Academies", "/admin/academies", "Review academy records and tenant status."],
  ["Organizations", "/admin/organizations", "Review organization workspaces and visibility."],
  ["Enterprise", "/admin/enterprise", "Monitor enterprise learning, internal academies, compliance, assignments, campaigns, and support."],
  ["Instructor applications", "/admin/instructor-applications", "Review teaching applications and verification readiness."],
  ["Review queues", "/admin/review-queues", "Approve, reject, request changes, suspend, or archive submissions."],
  ["Courses", "/admin/courses", "Manage courses, versions, reviews, publishing controls, and content issues."],
  ["Finance", "/admin/finance", "Orders, payment attempts, M-Pesa callbacks, receipts, refunds, and reconciliation."],
  ["Payouts", "/admin/payouts", "Review instructor and academy payout requests with audited finance decisions."],
  ["Enrollments", "/admin/enrollments", "Entitlements, enrollments, progress, completion, and certificate records."],
  ["Invitations", "/admin/invitations", "Inspect workspace invitation status and audit history."],
  ["Feature flags", "/admin/feature-flags", "Enable or disable staged capabilities."],
  ["System settings", "/admin/settings", "Configure platform-level business settings."],
  ["Audit logs", "/admin/audit-logs", "Filter sensitive platform activity."],
];

export default function AdminDashboardPage() {
  return (
    <DashboardShell>
      <PageHeading title="Platform administration" description="Protected Admin shell for Solva Academy operations. Server-side authorization and RLS enforce real access once Supabase is configured." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {adminAreas.map(([title, href, description]) => (
          <Link key={href} href={href}>
            <Card className="h-full transition hover:border-primary">
              <h2 className="font-semibold">{title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </DashboardShell>
  );
}
