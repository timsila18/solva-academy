import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function InstructorCertificatesPage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("certificates")
    .select("certificate_number,verification_code,status,issued_at,course_id")
    .order("issued_at", { ascending: false })
    .limit(100);

  return (
    <DashboardShell>
      <PageHeading
        title="Certificates"
        description="Completion certificates for your learners."
      />
      <DataTable
        title="Certificate records"
        description="Issued certificates and their current status."
        headers={["Certificate", "Course", "Status", "Issued", "Verification"]}
        rows={(data ?? []).map((item) => [
          item.certificate_number,
          item.course_id,
          <Badge key={item.status}>{item.status}</Badge>,
          item.issued_at
            ? new Date(item.issued_at).toLocaleDateString("en-KE")
            : "Not issued",
          item.verification_code,
        ])}
        empty="No certificates issued yet."
      />
    </DashboardShell>
  );
}
