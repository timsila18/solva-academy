import { notFound } from "next/navigation";
import { createCheckoutAction, saveCourseAction } from "@/features/commerce/actions";
import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { buyEpisodeAction } from "@/features/commerce/episode-actions";

export default async function PublicCoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = await createServerSupabaseClient();
  const { data: course } = await db.from("courses").select("id,title,subtitle,short_description,full_description,estimated_duration_minutes,language").eq("slug", slug).eq("status", "published").eq("visibility", "public").single();
  if (!course) notFound();
  const { data: links } = await db.from("course_products").select("product_id").eq("course_id", course.id);
  const { data: price } = links?.length ? await db.from("product_prices").select("id,product_id,amount_minor,promotional_amount_minor,currency").in("product_id", links.map((item) => item.product_id)).eq("status", "active").eq("enrollment_available", true).lte("starts_at", new Date().toISOString()).or(`ends_at.is.null,ends_at.gt.${new Date().toISOString()}`).limit(1).maybeSingle() : { data: null };
  const { data: outcomes } = await db.from("course_learning_outcomes").select("id,statement").eq("course_id", course.id).order("display_order");
  const { data: episodes } = await db.from("episode_products").select("product_id,lesson_id,version_id").eq("course_id", course.id);
  const { data: episodePrices } = episodes?.length ? await db.from("product_prices").select("id,product_id,amount_minor,promotional_amount_minor,currency").in("product_id", episodes.map((episode) => episode.product_id)).eq("status", "active").eq("enrollment_available", true).lte("starts_at", new Date().toISOString()).or(`ends_at.is.null,ends_at.gt.${new Date().toISOString()}`) : { data: [] };
  const { data: lessons } = episodes?.length ? await db.from("course_lessons").select("id,title,version_id").eq("course_id", course.id).in("id", episodes.map((episode) => episode.lesson_id)).order("display_order") : { data: [] };
  const { data: versions } = await db.from("course_versions").select("id").eq("course_id", course.id).eq("status", "published");
  return <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
    <h1 className="text-3xl font-semibold">{course.title}</h1>
    {course.subtitle && <p className="mt-3 text-xl">{course.subtitle}</p>}
    <p className="mt-4 text-muted-foreground">{course.short_description}</p>
    <div className="mt-6 flex flex-wrap items-center gap-4 border-y border-border py-5">
      {price ? <form action={createCheckoutAction}>
        <input type="hidden" name="courseId" value={course.id} /><input type="hidden" name="productId" value={price.product_id} /><input type="hidden" name="priceId" value={price.id} />
        <Button type="submit">{(price.promotional_amount_minor ?? price.amount_minor) === 0 ? "Enroll for free" : `Enroll - ${new Intl.NumberFormat("en-KE", { style: "currency", currency: price.currency }).format((price.promotional_amount_minor ?? price.amount_minor) / 100)}`}</Button>
      </form> : <p>Enrollment is not open yet.</p>}
      <form action={saveCourseAction}><input type="hidden" name="courseId" value={course.id} /><Button type="submit" variant="outline">Save course</Button></form>
    </div>
    <section className="mt-8"><h2 className="text-xl font-semibold">About this course</h2><p className="mt-3 whitespace-pre-wrap">{course.full_description || course.short_description}</p></section>
    {!!outcomes?.length && <section className="mt-8"><h2 className="text-xl font-semibold">What you will learn</h2><ul className="mt-3 list-disc space-y-2 pl-5">{outcomes.map((outcome) => <li key={outcome.id}>{outcome.statement}</li>)}</ul></section>}
    {!!episodes?.length && <section className="mt-8"><h2 className="text-xl font-semibold">Buy individual classes</h2><div className="mt-4 divide-y divide-border">{lessons?.map((lesson) => {
      const episode = episodes.find((item) => item.lesson_id === lesson.id && versions?.some((version) => version.id === item.version_id));
      const price = episodePrices?.find((item) => item.product_id === episode?.product_id);
      return price ? <div key={lesson.id} className="flex flex-wrap items-center justify-between gap-4 py-4"><h3 className="font-medium">{lesson.title}</h3><form action={buyEpisodeAction}><input type="hidden" name="priceId" value={price.id} /><Button type="submit" variant="outline">Buy class - {new Intl.NumberFormat("en-KE", { style: "currency", currency: price.currency }).format((price.promotional_amount_minor ?? price.amount_minor) / 100)}</Button></form></div> : null;
    })}</div></section>}
  </section>;
}
