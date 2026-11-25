import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { getStudioCourse } from "./studio-data";
import { evaluateLaunchReadiness } from "./launch-readiness";
import { isPaystackConfigured } from "@/lib/payments/paystack";
import { isMpesaConfigured } from "@/lib/payments/mpesa";
export async function getLaunchReadiness(courseId: string, userId: string) {
  const studio = await getStudioCourse(courseId, userId);
  if (!studio) return null;
  const db = createServiceSupabaseClient();
  const classes = studio.classes.filter((c) => c.status !== "archived");
  const ids = classes.map((c) => c.id);
  const { data: assessments, error: assessmentError } = ids.length
    ? await db
        .from("assessments")
        .select("id,lesson_id,required,quizzes(id)")
        .eq("course_id", courseId)
        .in("lesson_id", ids)
        .neq("status", "archived")
    : { data: [], error: null };
  const quizIds = (assessments ?? []).flatMap((a) =>
    (Array.isArray(a.quizzes) ? a.quizzes : a.quizzes ? [a.quizzes] : []).map(
      (q) => q.id,
    ),
  );
  const { data: questions, error: questionError } = quizIds.length
    ? await db
        .from("quiz_questions")
        .select(
          "id,quiz_id,question_type,points,quiz_question_options(id,is_correct)",
        )
        .in("quiz_id", quizIds)
        .eq("status", "active")
    : { data: [], error: null };
  const { data: products, error: productError } = await db
    .from("course_products")
    .select("product_id")
    .eq("course_id", courseId);
  const { data: episodes, error: episodeError } = await db
    .from("episode_products")
    .select("product_id,lesson_id")
    .eq("course_id", courseId)
    .eq(
      "version_id",
      studio.version?.id ?? "00000000-0000-0000-0000-000000000000",
    );
  const productIds = [...(products ?? []), ...(episodes ?? [])].map(
    (p) => p.product_id,
  );
  const { data: prices, error: priceError } = productIds.length
    ? await db
        .from("product_prices")
        .select("product_id,amount_minor,promotional_amount_minor")
        .in("product_id", productIds)
        .eq("status", "active")
        .eq("enrollment_available", true)
        .lte("starts_at", new Date().toISOString())
        .or(`ends_at.is.null,ends_at.gt.${new Date().toISOString()}`)
    : { data: [], error: null };
  const { data: templates, error: templateError } = await db
    .from("certificate_templates")
    .select("template")
    .eq("status", "active")
    .contains("template", { course_id: courseId, issuance_enabled: true });
  if (
    [
      assessmentError,
      questionError,
      productError,
      episodeError,
      priceError,
      templateError,
    ].some(Boolean)
  )
    throw new Error("Launch checklist could not load.");
  const checks = (assessments ?? []).map((a) => {
    const quizzes = Array.isArray(a.quizzes)
      ? a.quizzes
      : a.quizzes
        ? [a.quizzes]
        : [];
    const qs = (questions ?? []).filter((q) =>
      quizzes.some((z) => z.id === q.quiz_id),
    );
    return {
      lessonId: a.lesson_id,
      required: a.required,
      valid:
        qs.length > 0 &&
        qs.every(
          (q) =>
            q.question_type === "single_choice" &&
            q.points > 0 &&
            q.quiz_question_options.length >= 2 &&
            q.quiz_question_options.filter((o) => o.is_correct).length === 1,
        ),
    };
  });
  const fullPrice = (prices ?? []).some((p) =>
    products?.some((cp) => cp.product_id === p.product_id),
  );
  const classPrices =
    !studio.settings?.sell_classes ||
    classes.every((c) =>
      episodes?.some(
        (e) =>
          e.lesson_id === c.id &&
          prices?.some((p) => p.product_id === e.product_id),
      ),
    );
  const result = evaluateLaunchReadiness({
    course: studio.course,
    classes,
    priced: fullPrice && classPrices,
    paid:
      prices?.some((p) => (p.promotional_amount_minor ?? p.amount_minor) > 0) ??
      false,
    payments: isPaystackConfigured() || isMpesaConfigured(),
    checks,
    resources: studio.materials
      .map((r) => r.lesson_id)
      .filter((id): id is string => !!id),
    certificateConfigured:
      templates?.some((t) => t.template.specimen_only !== true) ?? false,
    settingsHref: "/support",
  });
  return { ...result, studio };
}
