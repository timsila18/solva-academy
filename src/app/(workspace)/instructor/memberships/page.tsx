import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireUserOrRedirect } from "@/lib/authorization/server";

export default async function InstructorMembershipsPage() {
  const user = await requireUserOrRedirect();
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("workspace_members").select("id,workspace_id,status,joined_at").eq("user_id", user.id).eq("status", "active");

  return (
    <DashboardShell>
      <PageHeading title="Academy memberships" description="Academy and workspace memberships available to the current instructor identity." />
      <DataTable title="Memberships" description="Role-specific academy data remains scoped by workspace membership and RLS." headers={["Workspace", "Status", "Joined"]} rows={(data ?? []).map((item) => [item.workspace_id, <Badge key={item.status}>{item.status}</Badge>, item.joined_at ? new Date(item.joined_at).toLocaleDateString("en-KE") : "Not recorded"])} empty="No active workspace memberships found." />
    </DashboardShell>
  );
}
