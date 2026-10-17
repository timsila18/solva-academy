import Link from "next/link";
import { GraduationCap, HelpCircle, LogOut } from "lucide-react";
import { WorkspaceSwitcher } from "@/components/navigation/workspace-switcher";
import { WorkspaceNavigation } from "@/components/navigation/workspace-navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireUserOrRedirect } from "@/lib/authorization/server";

export async function DashboardShell({ children }: { children: React.ReactNode }) {
  const user = await requireUserOrRedirect();
  const db = await createServerSupabaseClient();
  const [memberships, preference, permission, assignments] = await Promise.all([
    db.from("workspace_members").select("workspace_id,workspaces(id,name,type)").eq("user_id", user.id).eq("status", "active"),
    db.from("user_preferences").select("active_workspace_id").eq("user_id", user.id).maybeSingle(),
    db.rpc("current_user_has_permission", { permission_code: "settings.manage.platform" }),
    db.from("user_role_assignments").select("roles(slug)").eq("user_id", user.id).eq("status", "active").lte("starts_at", new Date().toISOString()).or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`),
  ]);
  const workspaces = (memberships.data ?? []).flatMap((membership) => {
    const workspace = membership.workspaces as unknown as { id: string; name: string; type: string } | null;
    return workspace ? [workspace] : [];
  });
  const roles = (assignments.data ?? []).map((assignment) => (assignment.roles as unknown as { slug: string } | null)?.slug ?? "");
  const administrator = permission.data === true;
  const platformRole = roles.includes("founding-super-admin") ? "Founding Super Admin" : roles.includes("super-admin") ? "Super Admin" : administrator ? "Platform Administrator" : null;
  const academy = workspaces.some((workspace) => workspace.type === "academy");
  const organization = workspaces.some((workspace) => workspace.type === "organization");
  const teaching = roles.some((role) => ["instructor", "academy-owner", "academy-administrator", "academy-content-manager", "teaching-assistant", "corporate-trainer"].includes(role));
  const active = workspaces.find((workspace) => workspace.id === preference.data?.active_workspace_id)?.id ?? workspaces[0]?.id ?? "";
  return <div className="min-h-screen bg-background">
    <header className="border-b border-border bg-card"><div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
      <Link href="/welcome" className="flex items-center gap-2 font-semibold"><GraduationCap size={24} className="text-primary" aria-hidden="true" /><span>Solva Academy</span></Link>
      <div className="flex items-center gap-2"><Link href="/help" aria-label="Help" title="Help" className="grid size-10 place-items-center rounded-md hover:bg-muted"><HelpCircle size={19} /></Link><form action="/auth/sign-out" method="post"><button type="submit" aria-label="Sign out" title="Sign out" className="grid size-10 place-items-center rounded-md hover:bg-muted"><LogOut size={19} /></button></form></div>
    </div></header>
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[14rem_minmax(0,1fr)]">
      <aside><p className="mb-3 break-words px-3 text-sm">{user.email}</p>{platformRole && <p className="mb-4 px-3 text-xs font-semibold text-primary">Platform access: {platformRole}</p>}<WorkspaceSwitcher workspaces={workspaces} activeId={active} /><WorkspaceNavigation teaching={teaching} academy={academy} organization={organization} administrator={administrator} /></aside>
      <main className="min-w-0">{children}</main>
    </div>
  </div>;
}
