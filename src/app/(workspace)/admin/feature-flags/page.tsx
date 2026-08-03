import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/form-fields";
import { saveFeatureFlagAction } from "@/features/platform-ops/actions";
import { requirePlatformAdmin } from "@/lib/authorization/server";
import { initialFeatureFlags } from "@/lib/feature-flags/flags";
import { getFeatureFlags } from "@/lib/platform-ops/queries";

export default async function AdminFeatureFlagsPage() {
  await requirePlatformAdmin();
  const flags = await getFeatureFlags();
  return (
    <DashboardShell>
      <PageHeading title="Feature flags" description="Enable or disable eligible features globally, by workspace, by user, or by beta group without deployment." />
      <div className="grid gap-5 xl:grid-cols-[0.75fr_1.25fr]">
        <Card>
          <CardHeader><CardTitle>Save runtime flag</CardTitle><CardDescription>Code registry still protects unknown features; runtime rows control rollout.</CardDescription></CardHeader>
          <form action={saveFeatureFlagAction} className="grid gap-4">
            <Field label="Flag key"><Input name="flagKey" list="known-flags" required /><datalist id="known-flags">{initialFeatureFlags.map((flag) => <option key={flag} value={flag} />)}</datalist></Field>
            <Field label="Scope"><Select name="scope"><option value="global">Global</option><option value="workspace">Workspace</option><option value="user">User</option><option value="beta_group">Beta group</option></Select></Field>
            <Field label="Beta group"><Input name="betaGroup" /></Field>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="enabled" value="true" /> Enabled</label>
            <Button type="submit">Save flag</Button>
          </form>
        </Card>
        <DataTable title="Runtime flags" description="Database-backed rows are evaluated by scope in rollout services." headers={["Flag", "Scope", "Enabled", "Rollout"]} rows={flags.map((flag) => [flag.key, flag.scope ?? "global", <Badge key={String(flag.enabled)}>{flag.enabled ? "enabled" : "disabled"}</Badge>, `${flag.percentage_rollout ?? 0}%`])} empty="No runtime feature flags saved." />
      </div>
      <div className="mt-6">
        <Card className="flex flex-wrap gap-2">
          {initialFeatureFlags.map((flag) => <Badge key={flag}>{flag}</Badge>)}
        </Card>
      </div>
    </DashboardShell>
  );
}
