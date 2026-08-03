import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function InstructorProfilePage() {
  const user = await requireUserOrRedirect();
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("instructor_profiles").select("slug,biography,verification_level,teaching_languages,availability,status").eq("user_id", user.id).maybeSingle();

  return (
    <DashboardShell>
      <PageHeading title="Instructor profile" description="Manage public teaching identity, verification display, languages, availability placeholder, and profile completion guidance." />
      <DataTable title="Profile status" description="Private earnings and personal contact details are never exposed on public instructor pages." headers={["Field", "Value"]} rows={[
        ["Slug", data?.slug ?? "No public profile yet"],
        ["Status", <Badge key={data?.status ?? "missing"}>{data?.status ?? "missing"}</Badge>],
        ["Verification", <Badge key={data?.verification_level ?? "unverified"}>{data?.verification_level ?? "unverified"}</Badge>],
        ["Languages", data?.teaching_languages?.join(", ") || "Not set"],
        ["Availability", data?.availability || "Placeholder not set"],
        ["Biography", data?.biography ? "Added" : "Missing"],
      ]} empty="No instructor profile found." />
    </DashboardShell>
  );
}
