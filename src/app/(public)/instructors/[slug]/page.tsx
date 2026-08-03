import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/feedback/empty-state";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function InstructorProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: profile } = await supabase.from("instructor_profiles").select("id,user_id,slug,biography,verification_level,school_ids,skill_ids,teaching_languages,availability,social_links,status").eq("slug", slug).eq("public_visibility", "public").maybeSingle();
  const [publicProfile, courses] = profile
    ? await Promise.all([
        supabase.from("instructor_public_profiles").select("teaching_philosophy,experience_summary,badges,profile_completion").eq("instructor_profile_id", profile.id).maybeSingle(),
        supabase.from("courses").select("title,slug,short_description,status").eq("owner_id", profile.user_id).eq("status", "published").limit(8),
      ])
    : [{ data: null }, { data: [] }];

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <Card>
        <div className="flex flex-wrap gap-6">
          <div className="grid size-24 place-items-center rounded-lg bg-muted text-2xl font-semibold">{slug.slice(0, 1).toUpperCase()}</div>
          <div>
            <p className="text-sm font-medium text-primary">Public instructor profile</p>
            <h1 className="mt-2 text-3xl font-semibold">{slug.replaceAll("-", " ")}</h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              {profile?.biography ?? "This instructor profile is not public or has not been approved."}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge>{profile?.verification_level ?? "not public"}</Badge>
              {profile?.teaching_languages?.map((language: string) => <Badge key={language}>{language}</Badge>)}
              <Badge>No private earnings</Badge>
              <Badge>No fake reviews</Badge>
            </div>
          </div>
        </div>
      </Card>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="font-semibold">Teaching philosophy</h2>
          <p className="mt-2 text-sm text-muted-foreground">{publicProfile.data?.teaching_philosophy || "Teaching philosophy has not been added."}</p>
        </Card>
        <Card>
          <h2 className="font-semibold">Experience</h2>
          <p className="mt-2 text-sm text-muted-foreground">{publicProfile.data?.experience_summary || "Experience summary has not been added."}</p>
        </Card>
        <Card>
          <h2 className="font-semibold">Published courses</h2>
          <div className="mt-3 grid gap-3">
            {(courses.data ?? []).length ? courses.data?.map((course) => <ButtonLink key={course.slug} href={`/courses/${course.slug}`} variant="outline">{course.title}</ButtonLink>) : <p className="text-sm text-muted-foreground">No published courses are visible yet.</p>}
          </div>
        </Card>
        <Card>
          <h2 className="font-semibold">Availability</h2>
          <p className="mt-2 text-sm text-muted-foreground">{profile?.availability || "Availability placeholder has not been configured."}</p>
        </Card>
      </div>
      <div className="mt-6"><EmptyState title="Ratings and reviews" description="Ratings and reviews appear only after real learning activity and review collection exist." /></div>
    </section>
  );
}
