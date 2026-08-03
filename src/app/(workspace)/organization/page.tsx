import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { MetricsGrid } from "@/components/dashboard/metric-card";
import { QuickLinks } from "@/components/dashboard/quick-links";
import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { calculateCompletionRate, calculateComplianceScore } from "@/lib/enterprise/analytics";

export default async function OrganizationDashboardPage() {
  const user = await requireUserOrRedirect();
  const supabase = await createServerSupabaseClient();
  const { data: organizations } = await supabase.from("organizations").select("id,name,status,workspace_id").eq("owner_id", user.id).order("created_at", { ascending: false });
  const orgIds = (organizations ?? []).map((org) => org.id);
  const [employees, departments, teams, assignments, compliance, certificates, campaigns, announcements] = await Promise.all([
    orgIds.length ? supabase.from("enterprise_employees").select("id,status,learning_status").in("organization_id", orgIds) : { data: [] },
    orgIds.length ? supabase.from("organization_departments").select("id,status").in("organization_id", orgIds) : { data: [] },
    orgIds.length ? supabase.from("enterprise_teams").select("id,status").in("organization_id", orgIds) : { data: [] },
    orgIds.length ? supabase.from("enterprise_learning_assignments").select("id,status,mandatory,due_at").in("organization_id", orgIds) : { data: [] },
    orgIds.length ? supabase.from("enterprise_compliance_records").select("id,status,risk_level").in("organization_id", orgIds) : { data: [] },
    supabase.from("certificates").select("id,status").limit(100),
    orgIds.length ? supabase.from("enterprise_campaigns").select("name,status,ends_at").in("organization_id", orgIds).order("created_at", { ascending: false }).limit(5) : { data: [] },
    orgIds.length ? supabase.from("enterprise_announcements").select("title,priority,published_at").in("organization_id", orgIds).order("created_at", { ascending: false }).limit(5) : { data: [] },
  ]);
  const assignmentRows = (assignments.data ?? []) as Array<{ status: "assigned" | "started" | "in_progress" | "completed" | "overdue" | "expired" | "cancelled" | "waived" | "failed" | "reassigned"; mandatory: boolean }>;
  const complianceRows = (compliance.data ?? []).map((item) => ({ status: item.status, riskLevel: item.risk_level })) as Array<{ status: "assigned" | "completed" | "overdue" | "expiring" | "expired" | "waived" | "failed"; riskLevel: "low" | "normal" | "high" | "critical" }>;

  return (
    <DashboardShell>
      <PageHeading title="Enterprise workspace" description="Manage organization people, departments, teams, assignments, compliance, internal academies, analytics, reports, certificates, skills, campaigns, and announcements." />
      <QuickLinks links={[
        ["People", "/organization/people"],
        ["Import", "/organization/import"],
        ["Departments", "/organization/departments"],
        ["Teams", "/organization/teams"],
        ["Assignments", "/organization/assignments"],
        ["Compliance", "/organization/compliance"],
        ["Reports", "/organization/reports"],
        ["Manager", "/organization/manager"],
      ]} />
      <MetricsGrid metrics={[
        { label: "Employees", value: employees.data?.length ?? 0, definition: "Active enterprise employee learning records visible to this organization user." },
        { label: "Departments", value: departments.data?.length ?? 0, definition: "Organization department hierarchy records." },
        { label: "Teams", value: teams.data?.length ?? 0, definition: "Teams, projects, committees, and taskforces." },
        { label: "Active assignments", value: assignmentRows.filter((a) => !["completed", "cancelled", "waived"].includes(a.status)).length, definition: "Learning assignments that still require activity." },
        { label: "Mandatory learning", value: assignmentRows.filter((a) => a.mandatory).length, definition: "Assignments marked mandatory." },
        { label: "Overdue learning", value: assignmentRows.filter((a) => a.status === "overdue").length, definition: "Assignments explicitly marked overdue." },
        { label: "Completion rate", value: `${calculateCompletionRate(assignmentRows)}%`, definition: "Completed assignments divided by applicable assignments." },
        { label: "Compliance score", value: `${calculateComplianceScore(complianceRows)}%`, definition: "Completed compliance records with critical risk penalties." },
      ]} />
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <DataTable title="Organizations" description="No cross-organization data is mixed." headers={["Organization", "Status"]} rows={(organizations ?? []).map((org) => [org.name, <Badge key={org.status}>{org.status}</Badge>])} empty="No organization workspace found." />
        <DataTable title="Recent campaigns" description="Learning campaigns, onboarding programmes, and compliance drives." headers={["Campaign", "Status", "Ends"]} rows={(campaigns.data ?? []).map((campaign) => [campaign.name, <Badge key={campaign.status}>{campaign.status}</Badge>, campaign.ends_at ? new Date(campaign.ends_at).toLocaleDateString("en-KE") : "No end date"])} empty="No enterprise campaigns yet." />
        <DataTable title="Announcements" description="Organization, department, team, and employee announcements." headers={["Title", "Priority", "Published"]} rows={(announcements.data ?? []).map((item) => [item.title, <Badge key={item.priority}>{item.priority}</Badge>, item.published_at ? new Date(item.published_at).toLocaleDateString("en-KE") : "Draft"])} empty="No announcements yet." />
        <DataTable title="Certificate monitoring" description="Visible certificate records for monitoring; recertification reminders are deferred." headers={["Status", "Count"]} rows={["issued", "revoked", "corrected", "expired"].map((status) => [status, certificates.data?.filter((cert) => cert.status === status).length ?? 0])} empty="No certificate data visible." />
      </div>
    </DashboardShell>
  );
}
