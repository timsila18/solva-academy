import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function InstructorCertificatesPage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("certificates").select("certificate_number,verification_code,status,issued_at,course_id").order("issued_at", { ascending: false }).limit(100);

  return (
    <DashboardShell>
      <PageHeading title="Certificates" description="Instructor-visible issued, pending, revoked, and corrected certificate records. Unrelated academies and courses remain hidden by RLS." />
      <DataTable title="Certificate records" description="Verification activity is prepared as a future analytics extension." headers={["Certificate", "Course", "Status", "Issued", "Verification"]} rows={(data ?? []).map((item) => [item.certificate_number, item.course_id, <Badge key={item.status}>{item.status}</Badge>, item.issued_at ? new Date(item.issued_at).toLocaleDateString("en-KE") : "Not issued", item.verification_code])} empty="No visible certificate records yet." />
    </DashboardShell>
  );
}
