import Link from "next/link";
import { reviewAcademyApplicationAction } from "@/features/tenants/actions";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Field, Select, TextArea } from "@/components/ui/form-fields";
import { requirePlatformAdmin } from "@/lib/authorization/server";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

export default async function AdminReviewQueuesPage({ searchParams }: {
  searchParams: Promise<{ status?: string; reviewed?: string; error?: string }>;
}) {
  await requirePlatformAdmin();
  const params = await searchParams;
  const showAll = params.status === "all";
  const db = createServiceSupabaseClient();
  let query = db.from("academy_applications").select("*").order("submitted_at", { ascending: false });
  if (!showAll) query = query.in("status", ["submitted", "under_review", "changes_requested"]);
  const { data: applications, error } = await query.limit(100);
  const ids = [...new Set((applications ?? []).map((app) => app.applicant_id))];
  const schoolIds = [...new Set((applications ?? []).map((app) => app.school_id).filter(Boolean))];
  const [profiles, schools] = await Promise.all([
    ids.length ? db.from("profiles").select("id,full_name,email").in("id", ids) : Promise.resolve({ data: [], error: null }),
    schoolIds.length ? db.from("schools").select("id,name").in("id", schoolIds) : Promise.resolve({ data: [], error: null }),
  ]);
  const failed = error || profiles.error || schools.error;
  return <DashboardShell>
    <h1 className="text-2xl font-semibold">Academy applications</h1>
    <nav aria-label="Application filters" className="mt-5 flex gap-5 border-b border-border pb-3 text-sm">
      <Link href="/admin/review-queues" aria-current={!showAll ? "page" : undefined}>Awaiting review</Link>
      <Link href="/admin/review-queues?status=all" aria-current={showAll ? "page" : undefined}>All applications</Link>
    </nav>
    {params.reviewed && <p role="status" className="mt-5">Decision saved. An approved academy is available in the owner&apos;s workspace switcher.</p>}
    {params.error && <p role="alert" className="mt-5">The decision was not saved. Check the application status and try again. Rejections and change requests need a reason.</p>}
    {failed ? <p role="alert" className="mt-6">Applications could not load. Please refresh and try again.</p> : !applications?.length ? <p className="mt-8 text-muted-foreground">{showAll ? "No academy applications have been submitted." : "No academy applications are awaiting review."}</p> :
      <div className="mt-3 divide-y divide-border">{applications.map((app) => {
        const applicant = profiles.data?.find((profile) => profile.id === app.applicant_id);
        const pending = ["submitted", "under_review", "changes_requested"].includes(app.status);
        return <article key={app.id} className="py-6">
          <div className="flex flex-wrap items-start justify-between gap-3"><h2 className="text-lg font-semibold">{app.academy_name}</h2><span className="text-sm capitalize">{app.status.replaceAll("_", " ")}</span></div>
          <p className="mt-2 break-words text-sm text-muted-foreground">{applicant?.full_name ?? "Applicant"} · {applicant?.email ?? "Email unavailable"}</p>
          <p className="mt-1 text-sm text-muted-foreground">{schools.data?.find((school) => school.id === app.school_id)?.name ?? "No school selected"} · {app.country}{app.county ? `, ${app.county}` : ""} · {app.submitted_at ? new Date(app.submitted_at).toLocaleDateString("en-KE", { timeZone: "Africa/Nairobi" }) : "Not submitted"}</p>
          <p className="mt-4 max-w-4xl whitespace-pre-wrap break-words text-sm">{app.short_description}</p>
          <details className="mt-4"><summary className="cursor-pointer text-sm font-medium text-primary">Review application</summary>
            <dl className="mt-5 grid gap-5 text-sm md:grid-cols-2">{[
              ["Experience", app.experience], ["Why they want to teach", app.why_teach],
              ["Expected audience", app.expected_audience], ["Website", app.website],
              ["Preferred address", app.slug], ["Terms accepted", app.terms_accepted ? "Yes" : "No"],
              ["Previous review notes", app.review_notes],
            ].map(([label, value]) => <div key={label}><dt className="font-medium">{label}</dt><dd className="mt-1 whitespace-pre-wrap break-words text-muted-foreground">{value || "Not provided"}</dd></div>)}</dl>
            {pending && <form action={reviewAcademyApplicationAction} className="mt-6 grid max-w-2xl gap-4">
              <input type="hidden" name="resourceId" value={app.id} />
              <Field label="Decision"><Select name="decision" defaultValue="" required><option value="" disabled>Select a decision</option><option value="approve">Approve and create academy workspace</option><option value="request_changes">Request changes</option><option value="reject">Reject</option></Select></Field>
              <Field label="Review notes"><TextArea name="notes" maxLength={5000} /></Field>
              <Button type="submit" className="justify-self-start">Save decision</Button>
            </form>}
          </details>
        </article>;
      })}</div>}
  </DashboardShell>;
}
