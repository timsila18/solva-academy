"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { canManageCourse } from "@/lib/courses/access";
import { writeAuditEvent } from "@/lib/audit/audit";

export async function saveEpisodePriceAction(form: FormData) {
  const user = await requireUserOrRedirect();
  const { courseId, lessonId, amountKes } = z.object({ courseId: z.uuid(), lessonId: z.uuid(), amountKes: z.coerce.number().int().min(1).max(1000000) }).parse(Object.fromEntries(form));
  if (!await canManageCourse(courseId, user.id)) redirect("/instructor/courses?error=access");
  const db = createServiceSupabaseClient();
  const { data: lesson } = await db.from("course_lessons").select("title,version_id").eq("id", lessonId).eq("course_id", courseId).single();
  if (!lesson?.version_id) redirect(`/courses/builder/${courseId}?error=version`);
  const { data: existing } = await db.from("episode_products").select("product_id").eq("lesson_id", lessonId).eq("version_id", lesson.version_id).maybeSingle();
  let productId = existing?.product_id;
  if (!productId) {
    const { data: product, error } = await db.from("products").insert({ product_type: "course", name: lesson.title, status: "active" }).select("id").single();
    if (error || !product) redirect(`/courses/builder/${courseId}?error=product`);
    productId = product.id;
    const { error: linkError } = await db.from("episode_products").insert({ product_id: productId, course_id: courseId, lesson_id: lessonId, version_id: lesson.version_id });
    if (linkError) redirect(`/courses/builder/${courseId}?error=product`);
  }
  const { data: price, error } = await db.from("product_prices").insert({ product_id: productId, currency: "KES", amount_minor: amountKes * 100 }).select("id").single();
  if (error || !price) redirect(`/courses/builder/${courseId}?error=price`);
  await db.from("product_prices").update({ status: "inactive" }).eq("product_id", productId).neq("id", price.id);
  await writeAuditEvent({ actorId: user.id, action: "episode_price_saved", resourceType: "course_lesson", resourceId: lessonId, newData: { amountKes } });
  redirect(`/courses/builder/${courseId}?saved=episode-price`);
}

export async function buyEpisodeAction(form: FormData) {
  const user = await requireUserOrRedirect();
  const priceId = z.uuid().parse(form.get("priceId"));
  const db = createServiceSupabaseClient();
  const { data: price } = await db.from("product_prices").select("*").eq("id", priceId).eq("status", "active").eq("enrollment_available", true).single();
  if (!price || new Date(price.starts_at) > new Date() || (price.ends_at && new Date(price.ends_at) <= new Date())) redirect("/courses?error=price");
  const { data: episode } = await db.from("episode_products").select("*").eq("product_id", price.product_id).single();
  if (!episode) redirect("/courses?error=episode");
  const { data: version } = await db.from("course_versions").select("status").eq("id", episode.version_id).eq("course_id", episode.course_id).single();
  const { data: course } = await db.from("courses").select("id").eq("id", episode.course_id).eq("status", "published").eq("visibility", "public").single();
  if (!course || version?.status !== "published") redirect("/courses?error=unavailable");
  const amount = price.promotional_amount_minor ?? price.amount_minor;
  const { data: order, error } = await db.from("orders").insert({ order_number: `SA-${crypto.randomUUID()}`, customer_id: user.id, currency: price.currency, subtotal_minor: amount, grand_total_minor: amount, status: "pending_payment", payment_status: "unpaid" }).select("id").single();
  if (error || !order) redirect("/courses?error=order");
  const { error: itemError } = await db.from("order_items").insert({ order_id: order.id, product_id: price.product_id, course_id: episode.course_id, lesson_id: episode.lesson_id, published_course_version_id: episode.version_id, quantity: 1, unit_price_minor: amount, total_minor: amount, access_duration_days: price.access_duration_days, refund_policy_snapshot: price.refund_policy });
  if (itemError) redirect("/courses?error=order");
  if (amount === 0) {
    const { error: accessError } = await db.rpc("complete_order_access", { target_order_id: order.id, actor: user.id });
    if (accessError) redirect("/courses?error=access");
    redirect(`/learn/${episode.course_id}?lesson=${episode.lesson_id}`);
  }
  redirect(`/checkout/${order.id}`);
}
