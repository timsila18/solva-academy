"use server";

import { redirect } from "next/navigation";
import { writeAuditEvent } from "@/lib/audit/audit";
import { requireUser, requireUserOrRedirect } from "@/lib/authorization/server";
import { createServerSupabaseClient, createServiceSupabaseClient } from "@/lib/supabase/server";
import { initiateMpesaStkPush, isMpesaConfigured, normalizeKenyanPhone } from "@/lib/payments/mpesa";
import { assignmentSubmissionSchema, checkoutSchema, paymentSchema, progressSchema, quizAttemptSchema, refundRequestSchema } from "@/lib/validation/commerce";

function orderNumber() {
  return `SAO-${Date.now()}-${Math.random().toString(16).slice(2, 8).toUpperCase()}`;
}

export async function createCheckoutAction(formData: FormData) {
  const user = await requireUserOrRedirect();
  const parsed = checkoutSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/courses?error=checkout");

  const supabase = createServiceSupabaseClient();
  const { data: price, error: priceError } = await supabase.from("product_prices").select("*").eq("id", parsed.data.priceId).eq("product_id", parsed.data.productId).eq("status", "active").eq("enrollment_available", true).single();
  if (priceError || !price) redirect(`/courses/${parsed.data.courseId}?error=price`);
  if (new Date(price.starts_at) > new Date() || (price.ends_at && new Date(price.ends_at) <= new Date())) redirect("/courses?error=price");
  const { data: published } = await supabase.from("courses").select("id").eq("id", parsed.data.courseId).eq("status", "published").eq("visibility", "public").single();
  if (!published) redirect("/courses?error=unavailable");

  const amountMinor = price.promotional_amount_minor ?? price.amount_minor;
  const { data: courseProduct } = await supabase
    .from("course_products")
    .select("published_version_id")
    .eq("product_id", parsed.data.productId)
    .eq("course_id", parsed.data.courseId)
    .maybeSingle();
  if (!courseProduct?.published_version_id) redirect("/courses?error=unavailable");
  const { data: order, error } = await supabase.from("orders").insert({
    order_number: orderNumber(),
    customer_id: user.id,
    currency: price.currency,
    subtotal_minor: amountMinor,
    grand_total_minor: amountMinor,
    status: "pending_payment",
    payment_status: "unpaid",
  }).select("id").single();
  if (error || !order) redirect(`/courses/${parsed.data.courseId}?error=order`);

  const { error: itemError } = await supabase.from("order_items").insert({
    order_id: order.id,
    product_id: parsed.data.productId,
    course_id: parsed.data.courseId,
    published_course_version_id: courseProduct?.published_version_id ?? null,
    quantity: 1,
    unit_price_minor: amountMinor,
    total_minor: amountMinor,
    access_duration_days: price.access_duration_days,
    refund_policy_snapshot: price.refund_policy,
  });
  if (itemError) redirect("/courses?error=order_item");
  if (amountMinor === 0) {
    const { error: accessError } = await supabase.rpc("complete_order_access", { target_order_id: order.id, actor: user.id });
    if (accessError) redirect("/courses?error=enrollment");
    redirect(`/learn/${parsed.data.courseId}`);
  }

  await writeAuditEvent({ actorId: user.id, action: "checkout_created", resourceType: "order", resourceId: order.id, success: true });
  redirect(`/checkout/${order.id}`);
}

export async function enrollFreeCourseAction(formData: FormData) {
  return createCheckoutAction(formData);
}

export async function initiatePaymentAction(formData: FormData) {
  const user = await requireUser();
  const parsed = paymentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/checkout?error=phone");
  const phone = normalizeKenyanPhone(parsed.data.phone);
  if (!phone) redirect(`/checkout/${parsed.data.orderId}?error=phone`);
  if (!isMpesaConfigured()) redirect(`/checkout/${parsed.data.orderId}?error=unavailable`);

  const supabase = createServiceSupabaseClient();
  const { data: order } = await supabase.from("orders").select("*").eq("id", parsed.data.orderId).eq("customer_id", user.id).single();
  if (!order) redirect("/checkout?error=order");
  if (order.payment_status === "paid" || !["pending_payment", "failed"].includes(order.status)) redirect(`/checkout/${order.id}/status`);
  const idempotencyKey = `${order.id}:${phone}:${order.grand_total_minor}`;
  let response;
  try { response = await initiateMpesaStkPush({
    amountMinor: order.grand_total_minor,
    phone,
    accountReference: order.order_number,
    description: "Solva Academy course payment",
  }); } catch { redirect(`/checkout/${order.id}?error=provider`); }

  const responseRecord = response as { MerchantRequestID?: string; CheckoutRequestID?: string };
  const { data: attempt, error: attemptError } = await supabase.from("payment_attempts").insert({
    order_id: order.id,
    provider: "mpesa",
    method: "mpesa_stk",
    amount_minor: order.grand_total_minor,
    currency: order.currency,
    phone,
    status: "initiated",
    merchant_request_id: responseRecord.MerchantRequestID,
    checkout_request_id: responseRecord.CheckoutRequestID,
    idempotency_key: idempotencyKey,
    raw_response: response,
    initiated_at: new Date().toISOString(),
  }).select("id").single();
  if (attemptError || !attempt) redirect(`/checkout/${order.id}?error=recording`);

  await supabase.from("orders").update({ status: "payment_initiated", payment_status: "initiated" }).eq("id", order.id);
  await writeAuditEvent({ actorId: user.id, action: "payment_initiated", resourceType: "payment_attempt", resourceId: attempt?.id, success: true });
  redirect(`/checkout/${order.id}/status`);
}

export async function saveCourseAction(formData: FormData) {
  const user = await requireUserOrRedirect();
  const courseId = String(formData.get("courseId"));
  const supabase = await createServerSupabaseClient();
  await supabase.from("saved_courses").upsert({ user_id: user.id, course_id: courseId });
  await writeAuditEvent({ actorId: user.id, action: "course_saved", resourceType: "course", resourceId: courseId, success: true });
  redirect("/learner/saved");
}

export async function recordLessonProgressAction(formData: FormData) {
  const user = await requireUser();
  const parsed = progressSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/learner?error=progress");
  const supabase = await createServerSupabaseClient();
  await supabase.from("lesson_progress").upsert({
    enrollment_id: parsed.data.enrollmentId,
    lesson_id: parsed.data.lessonId,
    status: parsed.data.progressPercentage >= 100 ? "completed" : "started",
    progress_percentage: parsed.data.progressPercentage,
    last_position_seconds: parsed.data.positionSeconds,
    completed_at: parsed.data.progressPercentage >= 100 ? new Date().toISOString() : null,
  });
  await writeAuditEvent({ actorId: user.id, action: "lesson_progress_recorded", resourceType: "enrollment", resourceId: parsed.data.enrollmentId, success: true });
  redirect(`/learn/enrollment/${parsed.data.enrollmentId}`);
}

export async function createQuizAttemptAction(formData: FormData) {
  await requireUser();
  const parsed = quizAttemptSchema.parse(Object.fromEntries(formData));
  const supabase = await createServerSupabaseClient();
  const { count } = await supabase.from("quiz_attempts").select("*", { count: "exact", head: true }).eq("enrollment_id", parsed.enrollmentId).eq("quiz_id", parsed.quizId);
  const { data } = await supabase.from("quiz_attempts").insert({ enrollment_id: parsed.enrollmentId, quiz_id: parsed.quizId, attempt_number: (count ?? 0) + 1 }).select("id").single();
  redirect(`/learn/quiz/${data?.id}`);
}

export async function submitAssignmentAction(formData: FormData) {
  await requireUser();
  const parsed = assignmentSubmissionSchema.parse(Object.fromEntries(formData));
  const supabase = await createServerSupabaseClient();
  await supabase.from("assignment_submissions").insert({ enrollment_id: parsed.enrollmentId, assignment_id: parsed.assignmentId, response_text: parsed.responseText, status: "submitted", submitted_at: new Date().toISOString() });
  redirect(`/learn/enrollment/${parsed.enrollmentId}?submitted=assignment`);
}

export async function requestRefundAction(formData: FormData) {
  const user = await requireUser();
  const parsed = refundRequestSchema.parse(Object.fromEntries(formData));
  const supabase = await createServerSupabaseClient();
  await supabase.from("refund_requests").insert({
    order_id: parsed.orderId,
    payment_attempt_id: parsed.paymentAttemptId || null,
    course_id: parsed.courseId || null,
    requester_id: user.id,
    reason: parsed.reason,
    explanation: parsed.explanation,
    requested_amount_minor: parsed.requestedAmountMinor,
    requested_resolution: parsed.requestedResolution,
  });
  redirect("/learner/refunds?submitted=true");
}
