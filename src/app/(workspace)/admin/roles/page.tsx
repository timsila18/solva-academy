import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requirePlatformAdmin } from "@/lib/authorization/server";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

export default async function AdminRolesPage() {
  await requirePlatformAdmin();
  const db = createServiceSupabaseClient();
  const [roles, assignments, profiles, workspaces] = await Promise.all([
    db.from("roles").select("id,name,slug,scope,is_protected").eq("is_active", true).order("scope").order("name"),
    db.from("user_role_assignments").select("id,user_id,role_id,workspace_id,scope,status,expires_at").eq("status", "active").lte("starts_at", new Date().toISOString()).or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`),
    db.from("profiles").select("id,email,account_status"),
    db.from("workspaces").select("id,name,type"),
  ]);
  const activeProfiles = new Map((profiles.data ?? []).filter((profile) => profile.account_status === "active").map((profile) => [profile.id, profile]));
  return <DashboardShell><h1 className="text-2xl font-semibold">Roles and access</h1><p className="mt-3 max-w-3xl text-sm text-muted-foreground">Platform administrators manage Solva Academy. Academy staff work within their academy, organization staff within their organization, and learners use Personal Learning.</p>
    <section className="mt-7"><h2 className="font-semibold">Active assignments</h2>{assignments.error || roles.error || profiles.error || workspaces.error ? <p role="alert" className="mt-4">Role assignments could not load.</p> : <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[38rem] text-left text-sm"><thead><tr className="border-b border-border">{["Account", "Role", "Scope", "Workspace"].map((label) => <th key={label} className="px-3 py-3 font-medium">{label}</th>)}</tr></thead><tbody>{assignments.data?.filter((assignment) => activeProfiles.has(assignment.user_id)).map((assignment) => <tr key={assignment.id} className="border-b border-border"><td className="px-3 py-3">{activeProfiles.get(assignment.user_id)?.email}</td><td className="px-3 py-3">{roles.data?.find((role) => role.id === assignment.role_id)?.name ?? "Unavailable role"}</td><td className="px-3 py-3 capitalize">{assignment.scope}</td><td className="px-3 py-3">{workspaces.data?.find((workspace) => workspace.id === assignment.workspace_id)?.name ?? "Not assigned"}</td></tr>)}</tbody></table></div>}</section>
    <details className="mt-8 border-t border-border pt-4"><summary className="cursor-pointer font-semibold">Available roles</summary><ul className="mt-4 divide-y divide-border">{roles.data?.map((role) => <li key={role.id} className="flex flex-wrap justify-between gap-3 py-3 text-sm"><span>{role.name}{role.is_protected ? " (protected)" : ""}</span><span className="capitalize text-muted-foreground">{role.scope}</span></li>)}</ul></details>
  </DashboardShell>;
}
