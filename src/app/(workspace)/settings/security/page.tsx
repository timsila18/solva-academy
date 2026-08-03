import { DataTable } from "@/components/dashboard/data-table";
import { MetricsGrid } from "@/components/dashboard/metric-card";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { getSecurityDashboard } from "@/lib/platform-ops/queries";
import { maskSessionFingerprint } from "@/lib/security/mfa";

export default async function SecuritySettingsPage() {
  const user = await requireUserOrRedirect();
  const data = await getSecurityDashboard(user.id);
  return (
    <DashboardShell>
      <PageHeading title="Security center" description="Review MFA status, active sessions, device history, security alerts, password reset activity, and session revocation records." />
      <MetricsGrid metrics={[
        { label: "Security events", value: data.events.length, definition: "Security events associated with this account." },
        { label: "MFA factors", value: data.factors.length, definition: "Authenticator, backup-code, and recovery factor records." },
        { label: "Active sessions", value: data.sessions.filter((s) => !s.revoked_at).length, definition: "Sessions not marked revoked." },
        { label: "Alerts", value: data.events.filter((e) => ["high", "critical"].includes(e.severity)).length, definition: "High and critical events requiring attention." },
      ]} />
      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <DataTable title="Sessions" description="Session revocation workflow is database-backed; Supabase token invalidation remains provider-specific." headers={["Fingerprint", "Last seen", "Status"]} rows={data.sessions.map((session) => [maskSessionFingerprint(session.session_fingerprint), new Date(session.last_seen_at).toLocaleString("en-KE"), session.revoked_at ? "Revoked" : "Active"])} empty="No tracked sessions yet." />
        <DataTable title="MFA factors" description="TOTP, backup code, and recovery records are stored without exposing secrets." headers={["Type", "Label", "Status"]} rows={data.factors.map((factor) => [factor.factor_type, factor.label, <Badge key={factor.status}>{factor.status}</Badge>])} empty="No MFA factors configured." />
        <DataTable title="Security events" description="Failed logins, new devices, resets, and security changes are retained." headers={["Event", "Severity", "Status", "Created"]} rows={data.events.map((event) => [event.event_type, <Badge key={event.severity}>{event.severity}</Badge>, <Badge key={event.status}>{event.status}</Badge>, new Date(event.created_at).toLocaleString("en-KE")])} empty="No security events yet." />
      </div>
    </DashboardShell>
  );
}
