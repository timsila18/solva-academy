import { EnterpriseStructureGrid, PathwayGrid } from "@/components/catalog/learning-structure";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { enterpriseLearningStructure } from "@/lib/catalog/learning-structure";

export default async function EnterpriseLearningPathsPage() {
  const user = await requireUserOrRedirect();
  const supabase = await createServerSupabaseClient();
  const { data: org } = await supabase.from("organizations").select("id").eq("owner_id", user.id).limit(1).maybeSingle();
  const { data } = org ? await supabase.from("enterprise_learning_paths").select("name,path_type,status,created_at").eq("organization_id", org.id).order("created_at", { ascending: false }) : { data: [] };
  return (
    <DashboardShell>
      <PageHeading title="Learning paths" description="Role paths, onboarding, compliance, succession, and custom paths with ordered courses, required and optional items, completion rules, and certificate pathways." />
      <div className="mb-6">
        <EnterpriseStructureGrid />
      </div>
      <DataTable title="Learning paths" description="Path item creation can be expanded from the normalized path item table." headers={["Name", "Type", "Status", "Created"]} rows={(data ?? []).map((path) => [path.name, path.path_type, <Badge key={path.status}>{path.status}</Badge>, new Date(path.created_at).toLocaleDateString("en-KE")])} empty="No learning paths yet." />
      <div className="mt-8">
        <PageHeading title="Default enterprise path templates" description="Templates are structural examples for admins to configure; they do not create assignments or fake completion data." />
        <PathwayGrid paths={enterpriseLearningStructure.map((item) => ({ name: item.name, description: item.description, school: "Enterprise" }))} />
      </div>
    </DashboardShell>
  );
}
