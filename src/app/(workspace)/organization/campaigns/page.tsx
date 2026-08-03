import { createCampaignAction } from "@/features/enterprise/actions";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Field, Input, Select, TextArea } from "@/components/ui/form-fields";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function CampaignsPage() {
  const user = await requireUserOrRedirect();
  const supabase = await createServerSupabaseClient();
  const { data: org } = await supabase.from("organizations").select("id").eq("owner_id", user.id).limit(1).maybeSingle();
  const { data } = org ? await supabase.from("enterprise_campaigns").select("name,campaign_type,status,starts_at,ends_at").eq("organization_id", org.id).order("created_at", { ascending: false }) : { data: [] };
  return (
    <DashboardShell>
      <PageHeading title="Learning campaigns" description="Create onboarding, compliance, skills, renewal, and learning campaigns with timelines, audiences, announcements, tracking, and success metrics." />
      <div className="grid gap-5 xl:grid-cols-[1fr_24rem]">
        <DataTable title="Campaigns" description="Campaign success metrics are stored without invented outcomes." headers={["Name", "Type", "Status", "Starts", "Ends"]} rows={(data ?? []).map((c) => [c.name, c.campaign_type, <Badge key={c.status}>{c.status}</Badge>, c.starts_at ? new Date(c.starts_at).toLocaleDateString("en-KE") : "-", c.ends_at ? new Date(c.ends_at).toLocaleDateString("en-KE") : "-"])} empty="No campaigns yet." />
        <Card>
          <h2 className="font-semibold">Create campaign</h2>
          <form action={createCampaignAction} className="mt-4 grid gap-4">
            <Field label="Organization ID"><Input name="organizationId" defaultValue={org?.id} required /></Field>
            <Field label="Name"><Input name="name" required /></Field>
            <Field label="Type"><Select name="campaignType" defaultValue="learning"><option value="learning">Learning</option><option value="onboarding">Onboarding</option><option value="compliance">Compliance</option><option value="skills">Skills</option><option value="renewal">Renewal</option></Select></Field>
            <Field label="Starts"><Input name="startsAt" type="datetime-local" /></Field>
            <Field label="Ends"><Input name="endsAt" type="datetime-local" /></Field>
            <Field label="Description"><TextArea name="description" /></Field>
            <Button type="submit" disabled={!org}>Create campaign</Button>
          </form>
        </Card>
      </div>
    </DashboardShell>
  );
}
