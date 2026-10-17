"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

export function WorkspaceNavigation({ teaching, academy, organization, administrator }: { teaching: boolean; academy: boolean; organization: boolean; administrator: boolean }) {
  const pathname = usePathname();
  const groups = [
    ...(teaching ? [{ label: "Teaching", prefix: "/instructor", links: [["Overview", "/instructor"], ["My courses", "/instructor/courses"], ["Create course", "/courses/builder/new"], ["Learners", "/instructor/learners"], ["Assignments", "/instructor/assignments"], ["Earnings", "/instructor/earnings"]] }] : []),
    ...(academy ? [{ label: "My academy", prefix: "/academy", links: [["Overview", "/academy"], ["Courses", "/academy/courses"], ["Team", "/academy/team"], ["Learners", "/academy/learners"], ["Branding", "/academy/brand"], ["Revenue", "/academy/revenue"]] }] : []),
    ...(organization ? [{ label: "My organization", prefix: "/organization", links: [["Overview", "/organization"], ["People", "/organization/people"], ["Departments", "/organization/departments"], ["Learning", "/organization/learning"], ["Assignments", "/organization/assignments"], ["Reports", "/organization/reports"]] }] : []),
    ...(administrator ? [{ label: "Administration", prefix: "/admin", links: [["Overview", "/admin"], ["Applications", "/admin/review-queues"], ["Schools", "/admin/schools"], ["Academies", "/admin/academies"], ["Users", "/admin/users"], ["Courses", "/admin/courses"], ["Finance", "/admin/finance"], ["Settings", "/admin/settings"]] }] : []),
  ];
  const item = ([label, href]: string[]) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} className={`block rounded-md px-3 py-2 text-sm ${pathname === href ? "bg-primary/10 font-semibold text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>{label}</Link>;
  return <nav aria-label="Your account" className="mt-4 space-y-1">
    {[["Home", "/welcome"], ["My learning", "/learner"], ["Browse courses", "/courses"]].map(item)}
    {groups.map((group) => <details key={group.label} open={pathname.startsWith(group.prefix) || (group.label === "Teaching" && pathname.startsWith("/courses/builder"))} className="border-t border-border pt-2"><summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2 text-sm font-medium">{group.label}<ChevronDown size={15} aria-hidden="true" /></summary><div className="pb-2 pl-2">{group.links.map(item)}</div></details>)}
    <div className="border-t border-border pt-2">{[["Profile & settings", "/settings/profile"], ["Help", "/help"]].map(item)}</div>
  </nav>;
}
