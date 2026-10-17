import Link from "next/link";
import { ArrowRight, ChevronDown, ClipboardCheck } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";

const sections = [
  { title: "People & academies", links: [
    ["Academies", "/admin/academies"], ["Users", "/admin/users"],
    ["Organizations", "/admin/organizations"], ["Instructor applications", "/admin/instructor-applications"],
    ["Roles & access", "/admin/roles"], ["Invitations", "/admin/invitations"],
  ] },
  { title: "Learning & content", links: [
    ["Courses", "/admin/courses"], ["Schools", "/admin/schools"],
    ["Categories", "/admin/categories"], ["Skills", "/admin/skills"],
    ["Enrollments", "/admin/enrollments"], ["Enterprise learning", "/admin/enterprise"],
  ] },
  { title: "Finance", links: [["Payments & refunds", "/admin/finance"], ["Payouts", "/admin/payouts"]] },
  { title: "Platform settings", links: [
    ["Settings", "/admin/settings"], ["Workspaces", "/admin/workspaces"],
    ["Permissions", "/admin/permissions"], ["Feature flags", "/admin/feature-flags"],
    ["Audit history", "/admin/audit-logs"],
  ] },
];

export default function AdminDashboardPage() {
  return <DashboardShell>
    <div className="mx-auto w-full max-w-3xl">
      <h1 className="text-2xl font-semibold">Administration</h1>
      <p className="mt-2 text-sm text-muted-foreground">Solva Academy</p>
      <Link href="/admin/review-queues" className="group mt-8 flex min-h-24 items-center gap-4 border-y border-border py-5 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
        <ClipboardCheck size={23} className="shrink-0 text-primary" aria-hidden="true" />
        <span className="min-w-0 flex-1"><span className="block font-semibold">Academy applications</span><span className="mt-1 block text-sm text-muted-foreground">Review submissions and approve new academies.</span></span>
        <ArrowRight size={19} className="shrink-0 text-primary" aria-hidden="true" />
      </Link>
      <section aria-label="Administration tools" className="mt-8 divide-y divide-border border-b border-border">
        {sections.map((section) => <details key={section.title} className="group">
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-semibold [&::-webkit-details-marker]:hidden">
            {section.title}<ChevronDown size={17} className="shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>
          <div className="grid gap-x-8 pb-5 sm:grid-cols-2">{section.links.map(([label, href]) => <Link key={href} href={href} className="flex min-h-11 items-center justify-between gap-3 rounded px-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary">{label}<ArrowRight size={14} aria-hidden="true" /></Link>)}</div>
        </details>)}
      </section>
    </div>
  </DashboardShell>;
}
