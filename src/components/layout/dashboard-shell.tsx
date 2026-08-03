import Link from "next/link";
import { Bell, GraduationCap, HelpCircle, LogOut } from "lucide-react";
import { WorkspaceSwitcher } from "@/components/navigation/workspace-switcher";

const nav = [
  ["Solco Intelligence", "/ai"],
  ["AI tutor", "/ai/tutor"],
  ["AI study tools", "/ai/study"],
  ["AI search", "/ai/search"],
  ["Learner", "/learner"],
  ["Learner live", "/learner/live"],
  ["Instructor", "/instructor"],
  ["Instructor live", "/instructor/live"],
  ["Instructor AI", "/instructor/ai"],
  ["Instructor courses", "/instructor/courses"],
  ["Instructor learners", "/instructor/learners"],
  ["Assignments", "/instructor/assignments"],
  ["Quizzes", "/instructor/quizzes"],
  ["Instructor earnings", "/instructor/earnings"],
  ["Instructor payouts", "/instructor/payouts"],
  ["Instructor analytics", "/instructor/analytics"],
  ["Course builder", "/courses/builder/new"],
  ["Reviews", "/courses/reviewer"],
  ["Academy", "/academy"],
  ["Academy live", "/academy/live"],
  ["Academy courses", "/academy/courses"],
  ["Academy learners", "/academy/learners"],
  ["Academy team", "/academy/team"],
  ["Academy brand", "/academy/brand"],
  ["Academy analytics", "/academy/analytics"],
  ["Academy revenue", "/academy/revenue"],
  ["Academy payouts", "/academy/payouts"],
  ["Academy policies", "/academy/policies"],
  ["Academy storefront", "/academy/storefront"],
  ["Organization", "/organization"],
  ["Enterprise AI", "/organization/ai"],
  ["Organization live", "/organization/live"],
  ["People", "/organization/people"],
  ["Employee import", "/organization/import"],
  ["Departments", "/organization/departments"],
  ["Teams", "/organization/teams"],
  ["Org team", "/organization/team"],
  ["Learning", "/organization/learning"],
  ["Assignments", "/organization/assignments"],
  ["Internal academy", "/organization/internal-academy"],
  ["Enterprise skills", "/organization/skills"],
  ["Compliance", "/organization/compliance"],
  ["Certificates", "/organization/certificates"],
  ["Reports", "/organization/reports"],
  ["Enterprise analytics", "/organization/analytics"],
  ["Announcements", "/organization/announcements"],
  ["Manager", "/organization/manager"],
  ["Admin", "/admin"],
  ["AI governance", "/admin/ai"],
  ["Public APIs", "/admin/api"],
  ["Webhooks", "/admin/webhooks"],
  ["Integrations", "/admin/integrations"],
  ["Subscriptions", "/admin/subscriptions"],
  ["Billing", "/admin/billing"],
  ["Revenue", "/admin/revenue"],
  ["Support ops", "/admin/support"],
  ["Security", "/settings/security"],
  ["Monitoring", "/admin/monitoring"],
  ["Compliance admin", "/admin/compliance"],
  ["Enterprise admin", "/admin/enterprise"],
  ["Solco calendar", "/live/calendar"],
  ["Create live", "/live/create"],
  ["Payout review", "/admin/payouts"],
  ["Settings", "/settings/profile"],
  ["Privacy", "/settings/privacy"],
  ["Support", "/support"],
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/learner" className="flex items-center gap-2 font-semibold">
            <span className="grid size-9 place-items-center rounded-md border border-border bg-[#05070a] text-primary">
              <GraduationCap size={20} />
            </span>
            Solva Academy
          </Link>
          <div className="flex items-center gap-2">
            <button className="grid size-10 place-items-center rounded-md border border-border bg-[#15171c] hover:border-primary" aria-label="Notifications">
              <Bell size={18} />
            </button>
            <Link className="grid size-10 place-items-center rounded-md border border-border bg-[#15171c] hover:border-primary" href="/help" aria-label="Help">
              <HelpCircle size={18} />
            </Link>
            <form action="/auth/sign-out" method="post">
              <button className="grid size-10 place-items-center rounded-md border border-border bg-[#15171c] hover:border-primary" aria-label="Sign out">
                <LogOut size={18} />
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[18rem_1fr]">
        <aside className="space-y-4">
          <WorkspaceSwitcher />
          <nav className="grid max-h-[calc(100vh-10rem)] gap-1 overflow-y-auto rounded-md border border-border bg-card p-2" aria-label="Workspace navigation">
            {nav.map(([label, href]) => (
              <Link key={href} href={href} className="rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground">
                {label}
              </Link>
            ))}
          </nav>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
