import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/feedback/empty-state";
import { Badge } from "@/components/ui/badge";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function AcademyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: academy } = await supabase.from("academies").select("id,name,description,slug,status,visibility,logo_path,banner_path").eq("slug", slug).maybeSingle();
  const [storefront, branding, courses, members] = academy
    ? await Promise.all([
        supabase.from("academy_storefront_settings").select("headline,description,show_instructors,show_certificates,public_visibility").eq("academy_id", academy.id).maybeSingle(),
        supabase.from("academy_branding").select("accent_color,mission,website,contact_email,support_email,location,public_visibility").eq("academy_id", academy.id).maybeSingle(),
        supabase.from("courses").select("title,slug,status,short_description").eq("academy_id", academy.id).eq("status", "published").limit(12),
        supabase.from("academy_members").select("role_label,status").eq("academy_id", academy.id).eq("status", "active").limit(12),
      ])
    : [{ data: null }, { data: null }, { data: [] }, { data: [] }];

  const publicVisible = academy && ["public", "unlisted"].includes(academy.visibility) && storefront.data?.public_visibility !== "private";

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="rounded-lg border border-border bg-card p-8">
        <p className="text-sm font-medium text-primary">Academy storefront</p>
        <h1 className="mt-2 text-3xl font-semibold">{storefront.data?.headline || academy?.name || slug.replaceAll("-", " ")}</h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          {publicVisible ? storefront.data?.description || academy?.description || "This academy has not added a storefront description yet." : "This academy storefront is not publicly available."}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge>{academy?.status ?? "not found"}</Badge>
          {branding.data?.location ? <Badge>{branding.data.location}</Badge> : null}
          {branding.data?.mission ? <Badge>Mission added</Badge> : null}
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <ButtonLink href="/academies" variant="outline">Back to directory</ButtonLink>
          {branding.data?.website ? <ButtonLink href={branding.data.website} variant="outline">Website</ButtonLink> : null}
        </div>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="font-semibold">Published courses</h2>
          <div className="mt-3 grid gap-3">
            {(courses.data ?? []).length ? courses.data?.map((course) => (
              <ButtonLink key={course.slug} href={`/courses/${course.slug}`} variant="outline">{course.title}</ButtonLink>
            )) : <p className="text-sm text-muted-foreground">No published academy courses yet.</p>}
          </div>
        </Card>
        <Card>
          <h2 className="font-semibold">Instructors</h2>
          <p className="mt-2 text-sm text-muted-foreground">{storefront.data?.show_instructors === false ? "This academy has hidden instructor listings." : "Instructor profiles appear after public instructor linkage is configured."}</p>
          <p className="mt-3 text-sm text-muted-foreground">Active visible team records: {members.data?.length ?? 0}</p>
        </Card>
        <Card>
          <h2 className="font-semibold">Certificates</h2>
          <p className="mt-2 text-sm text-muted-foreground">{storefront.data?.show_certificates === false ? "Certificate display is hidden by academy settings." : "Certificate examples and verification activity are prepared for future display."}</p>
        </Card>
        <Card>
          <h2 className="font-semibold">Contact</h2>
          <p className="mt-2 text-sm text-muted-foreground">{branding.data?.contact_email || branding.data?.support_email || "Public contact details have not been added."}</p>
        </Card>
      </div>
      <div className="mt-6"><EmptyState title="No fake academy statistics" description="Student counts, ratings, revenue, and popularity labels are intentionally absent until real data exists." /></div>
    </section>
  );
}
