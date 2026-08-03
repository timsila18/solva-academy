import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function EnterpriseTrainersPage() {
  const user = await requireUserOrRedirect();
  const supabase = await createServerSupabaseClient();
  const { data: org } = await supabase.from("organizations").select("id").eq("owner_id", user.id).limit(1).maybeSingle();
  const { data } = org ? await supabase.from("enterprise_trainers").select("user_id,trainer_type,department_id,status,created_at").eq("organization_id", org.id).order("created_at", { ascending: false }) : { data: [] };
  return (
    <DashboardShell>
      <PageHeading title="Enterprise trainers" description="Corporate, department, compliance, HR, guest, and internal reviewer trainers remain scoped to one organization." />
      <DataTable title="Trainers" description="Trainer assignment actions are audited through role and trainer records." headers={["User", "Type", "Department", "Status", "Created"]} rows={(data ?? []).map((trainer) => [trainer.user_id, trainer.trainer_type, trainer.department_id ?? "-", <Badge key={trainer.status}>{trainer.status}</Badge>, new Date(trainer.created_at).toLocaleDateString("en-KE")])} empty="No enterprise trainers yet." />
    </DashboardShell>
  );
}
