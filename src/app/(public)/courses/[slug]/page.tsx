import { notFound } from "next/navigation";
import {
  createCheckoutAction,
  saveCourseAction,
} from "@/features/commerce/actions";
import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { buyEpisodeAction } from "@/features/commerce/episode-actions";
import Link from "next/link";

export default async function PublicCoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const db = await createServerSupabaseClient();
  const { data: course } = await db
    .from("courses")
    .select(
      "id,title,subtitle,short_description,full_description,estimated_duration_minutes,language,published_version_id,target_learner,prerequisites,certificate_available,academy_id,level_id",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .eq("visibility", "public")
    .single();
  if (!course) notFound();
  const { data: links } = await db
    .from("course_products")
    .select("product_id")
    .eq("course_id", course.id);
  const { data: price } = links?.length
    ? await db
        .from("product_prices")
        .select("id,product_id,amount_minor,promotional_amount_minor,currency")
        .in(
          "product_id",
          links.map((item) => item.product_id),
        )
        .eq("status", "active")
        .eq("enrollment_available", true)
        .lte("starts_at", new Date().toISOString())
        .or(`ends_at.is.null,ends_at.gt.${new Date().toISOString()}`)
        .limit(1)
        .maybeSingle()
    : { data: null };
  const { data: outcomes } = await db
    .from("course_learning_outcomes")
    .select("id,statement")
    .eq("course_id", course.id)
    .order("display_order");
  const { data: episodes } = await db
    .from("episode_products")
    .select("product_id,lesson_id,version_id")
    .eq("course_id", course.id);
  const { data: episodePrices } = episodes?.length
    ? await db
        .from("product_prices")
        .select("id,product_id,amount_minor,promotional_amount_minor,currency")
        .in(
          "product_id",
          episodes.map((episode) => episode.product_id),
        )
        .eq("status", "active")
        .eq("enrollment_available", true)
        .lte("starts_at", new Date().toISOString())
        .or(`ends_at.is.null,ends_at.gt.${new Date().toISOString()}`)
    : { data: [] };
  const { data: lessons } = episodes?.length
    ? await db
        .from("course_lessons")
        .select("id,title,version_id")
        .eq("course_id", course.id)
        .in(
          "id",
          episodes.map((episode) => episode.lesson_id),
        )
        .order("display_order")
    : { data: [] };
  const { data: versions } = await db
    .from("course_versions")
    .select("id")
    .eq("course_id", course.id)
    .eq("status", "published");
  const { data: syllabus } = course.published_version_id
    ? await db
        .from("course_lessons")
        .select(
          "id,title,short_summary,estimated_duration_minutes,module_id,display_order",
        )
        .eq("course_id", course.id)
        .eq("version_id", course.published_version_id)
        .neq("status", "archived")
        .order("display_order")
    : { data: [] };
  const { data: modules } = course.published_version_id
    ? await db
        .from("course_modules")
        .select("id,title,display_order")
        .eq("course_id", course.id)
        .eq("version_id", course.published_version_id)
        .neq("status", "archived")
        .order("display_order")
    : { data: [] };
  const { data: academy } = course.academy_id
    ? await db
        .from("academies")
        .select("name,slug")
        .eq("id", course.academy_id)
        .maybeSingle()
    : { data: null };
  const { data: audience } = await db
    .from("course_target_learners")
    .select("who_for,prior_knowledge,required_tools")
    .eq("course_id", course.id)
    .maybeSingle();
  const { data: level } = course.level_id
    ? await db
        .from("course_levels")
        .select("name")
        .eq("id", course.level_id)
        .maybeSingle()
    : { data: null };
  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold">{course.title}</h1>
      {course.subtitle && <p className="mt-3 text-xl">{course.subtitle}</p>}
      <p className="mt-4 text-muted-foreground">{course.short_description}</p>
      {academy && (
        <p className="mt-4 text-sm">
          Offered by{" "}
          <Link
            href={`/academies/${academy.slug}`}
            className="text-primary underline"
          >
            {academy.name}
          </Link>
        </p>
      )}
      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <span>{syllabus?.length ?? 0} classes</span>
        {course.estimated_duration_minutes > 0 && (
          <span>{course.estimated_duration_minutes} minutes</span>
        )}
        <span>
          {course.language === "en"
            ? "English"
            : course.language === "sw"
              ? "Kiswahili"
              : course.language}
        </span>
        {level && <span>{level.name}</span>}
        <span>Self-paced</span>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-4 border-y border-border py-5">
        {price ? (
          <form action={createCheckoutAction}>
            <input type="hidden" name="courseId" value={course.id} />
            <input type="hidden" name="productId" value={price.product_id} />
            <input type="hidden" name="priceId" value={price.id} />
            <Button type="submit">
              {(price.promotional_amount_minor ?? price.amount_minor) === 0
                ? "Enroll for free"
                : `Enroll - ${new Intl.NumberFormat("en-KE", { style: "currency", currency: price.currency }).format((price.promotional_amount_minor ?? price.amount_minor) / 100)}`}
            </Button>
          </form>
        ) : (
          <p>Enrollment is not open yet.</p>
        )}
        <form action={saveCourseAction}>
          <input type="hidden" name="courseId" value={course.id} />
          <Button type="submit" variant="outline">
            Save course
          </Button>
        </form>
      </div>
      <section className="mt-8">
        <h2 className="text-xl font-semibold">About this course</h2>
        <p className="mt-3 whitespace-pre-wrap">
          {course.full_description || course.short_description}
        </p>
      </section>
      {!!outcomes?.length && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold">What you will learn</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            {outcomes.map((outcome) => (
              <li key={outcome.id}>{outcome.statement}</li>
            ))}
          </ul>
        </section>
      )}
      {(audience?.who_for || course.target_learner) && (
        <section className="mt-8 border-t border-border pt-6">
          <h2 className="text-xl font-semibold">Who this is for</h2>
          <p className="mt-3 whitespace-pre-wrap">
            {audience?.who_for || course.target_learner}
          </p>
        </section>
      )}
      {(audience?.prior_knowledge ||
        course.prerequisites ||
        audience?.required_tools) && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold">Before you start</h2>
          <p className="mt-3 whitespace-pre-wrap">
            {audience?.prior_knowledge || course.prerequisites}
          </p>
          {audience?.required_tools && (
            <p className="mt-2">{audience.required_tools}</p>
          )}
        </section>
      )}
      {!!syllabus?.length && (
        <section className="mt-8 border-t border-border pt-6">
          <h2 className="text-xl font-semibold">Course syllabus</h2>
          <div className="mt-4 divide-y divide-border">
            {modules?.map((m) => (
              <details key={m.id} className="py-4">
                <summary className="cursor-pointer font-medium">
                  {m.title}
                </summary>
                <ul className="mt-3 space-y-3">
                  {syllabus
                    .filter((l) => l.module_id === m.id)
                    .map((l) => (
                      <li key={l.id} className="text-sm">
                        <p>
                          {l.title}
                          {l.estimated_duration_minutes > 0
                            ? ` · ${l.estimated_duration_minutes} min`
                            : ""}
                        </p>
                        {l.short_summary && (
                          <p className="mt-1 text-muted-foreground">
                            {l.short_summary}
                          </p>
                        )}
                      </li>
                    ))}
                </ul>
              </details>
            ))}
          </div>
        </section>
      )}
      <section className="mt-8 border-y border-border py-6">
        <h2 className="text-xl font-semibold">What your purchase includes</h2>
        <p className="mt-3 text-sm">
          The full course includes its published classes and attached learning
          resources. An individual-class purchase covers only that class; it
          does not include the full-course certificate.
        </p>
        {course.certificate_available && (
          <p className="mt-3 text-sm">
            A certificate of completion is available after the required classes
            and assessments. This is not a university degree or professional
            licence.
          </p>
        )}
        <p className="mt-3 text-sm">
          Access terms and the applicable refund policy are shown before
          payment.{" "}
          <Link href="/support" className="text-primary underline">
            Ask a question
          </Link>
        </p>
      </section>
      {!!episodes?.length && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold">Buy individual classes</h2>
          <div className="mt-4 divide-y divide-border">
            {lessons?.map((lesson) => {
              const episode = episodes.find(
                (item) =>
                  item.lesson_id === lesson.id &&
                  versions?.some((version) => version.id === item.version_id),
              );
              const price = episodePrices?.find(
                (item) => item.product_id === episode?.product_id,
              );
              return price ? (
                <div
                  key={lesson.id}
                  className="flex flex-wrap items-center justify-between gap-4 py-4"
                >
                  <h3 className="font-medium">{lesson.title}</h3>
                  <form action={buyEpisodeAction}>
                    <input type="hidden" name="priceId" value={price.id} />
                    <Button type="submit" variant="outline">
                      Buy class -{" "}
                      {new Intl.NumberFormat("en-KE", {
                        style: "currency",
                        currency: price.currency,
                      }).format(
                        (price.promotional_amount_minor ?? price.amount_minor) /
                          100,
                      )}
                    </Button>
                  </form>
                </div>
              ) : null;
            })}
          </div>
        </section>
      )}
    </section>
  );
}
