import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function AcademyCertificatesPage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("certificates").select("certificate_number,course_id,status,issued_at,verification_code").order("issued_at", { ascending: false }).limit(100);
  return (
    <DashboardShell>
      <PageHeading title="Academy certificates" description="Academy certificate records visible through tenant permissions, including issued, pending, revoked, and corrected states." />
      <DataTable title="Certificates" description="Verification activity analytics remain a placeholder." headers={["Certificate", "Course", "Status", "Issued", "Verification"]} rows={(data ?? []).map((item) => [item.certificate_number, item.course_id, <Badge key={item.status}>{item.status}</Badge>, item.issued_at ? new Date(item.issued_at).toLocaleDateString("en-KE") : "Not issued", item.verification_code])} empty="No academy certificate records yet." />
    </DashboardShell>
  );
}
