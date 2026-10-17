"use server";

import { redirect } from "next/navigation";
import { writeAuditEvent } from "@/lib/audit/audit";
import { requireUser } from "@/lib/authorization/server";
import { createServerSupabaseClient, createServiceSupabaseClient } from "@/lib/supabase/server";
import { z } from "zod";
import { slugify } from "@/lib/utils";
import { canManageCourse } from "@/lib/courses/access";
import {
  assessmentSchema,
  createCourseSchema,
  lessonSchema,
  moduleSchema,
  outcomeSchema,
  publishCourseSchema,
  resourceSchema,
  reviewSubmissionSchema,
} from "@/lib/validation/course";

export async function createCourseAction(formData: FormData) {
  const user = await requireUser();
  const parsed = createCourseSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/courses/builder/new?error=validation");

  const supabase = await createServerSupabaseClient();
  const slug = slugify(parsed.data.slug || parsed.data.title);
  const { data: course, error } = await supabase
    .from("courses")
    .insert({
      owning_workspace_id: parsed.data.owningWorkspaceId,
      owner_id: user.id,
      academy_id: parsed.data.academyId || null,
      title: parsed.data.title,
      slug,
      subtitle: parsed.data.subtitle || null,
      short_description: parsed.data.shortDescription,
      full_description: parsed.data.fullDescription || null,
      school_id: parsed.data.schoolId || null,
      primary_category_id: parsed.data.primaryCategoryId || null,
      course_type_id: parsed.data.courseTypeId || null,
      level_id: parsed.data.levelId || null,
      language: parsed.data.language,
      target_learner: parsed.data.targetLearner || null,
      prerequisites: parsed.data.prerequisites || null,
      estimated_duration_minutes: parsed.data.estimatedDurationMinutes,
      delivery_format: parsed.data.deliveryFormat,
      visibility: parsed.data.visibility,
      status: "draft",
    })
    .select("id")
    .single();

  if (!error && course) {
    await supabase.from("course_versions").insert({
      course_id: course.id,
      version_number: 1,
      status: "draft",
      created_by: user.id,
    });
    await supabase.from("course_team_members").insert({
      course_id: course.id,
      user_id: user.id,
      role_label: "Course Owner",
      role_slug: "course-owner",
    });
  }

  await writeAuditEvent({
    actorId: user.id,
    action: "course_created",
    resourceType: "course",
    resourceId: course?.id,
    workspaceId: parsed.data.owningWorkspaceId,
    success: !error,
  });

  if (error || !course) redirect("/courses/builder/new?error=create");
  redirect(`/courses/builder/${course.id}`);
}

export async function addLearningOutcomeAction(formData: FormData) {
  const user = await requireUser();
  const parsed = outcomeSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/courses/builder?error=outcome");

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("course_learning_outcomes").insert({
    course_id: parsed.data.courseId,
    statement: parsed.data.statement,
    skill_id: parsed.data.skillId || null,
    competency_level: parsed.data.competencyLevel || null,
    display_order: parsed.data.displayOrder,
  }).select("id").single();

  await writeAuditEvent({ actorId: user.id, action: "course_outcome_added", resourceType: "course", resourceId: parsed.data.courseId, success: !error });
  redirect(error ? `/courses/builder/${parsed.data.courseId}?error=outcome` : `/courses/builder/${parsed.data.courseId}?created=outcome#outcomes`);
}

export async function addModuleAction(formData: FormData) {
  const user = await requireUser();
  const parsed = moduleSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/courses/builder?error=module");
  if (!await canManageCourse(parsed.data.courseId, user.id)) redirect("/instructor/courses?error=access");

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("course_modules").insert({
    course_id: parsed.data.courseId,
    version_id: parsed.data.versionId || null,
    title: parsed.data.title,
    description: parsed.data.description || null,
    learning_objectives: parsed.data.learningObjectives || null,
    estimated_duration_minutes: parsed.data.estimatedDurationMinutes,
    display_order: parsed.data.displayOrder,
    required: parsed.data.required === "on",
  });

  await writeAuditEvent({ actorId: user.id, action: "course_module_created", resourceType: "course", resourceId: parsed.data.courseId, success: !error });
  redirect(error ? `/courses/builder/${parsed.data.courseId}?error=module` : `/courses/builder/${parsed.data.courseId}?created=module#curriculum`);
}

export async function addLessonAction(formData: FormData) {
  const user = await requireUser();
  const parsed = lessonSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/courses/builder?error=lesson");
  if (!await canManageCourse(parsed.data.courseId, user.id)) redirect("/instructor/courses?error=access");

  const supabase = await createServerSupabaseClient();
  const { data: module } = await supabase.from("course_modules").select("id,version_id").eq("id", parsed.data.moduleId).eq("course_id", parsed.data.courseId).single();
  if (!module || !module.version_id || module.version_id !== parsed.data.versionId) redirect(`/courses/builder/${parsed.data.courseId}?error=module`);
  const { error } = await supabase.from("course_lessons").insert({
    course_id: parsed.data.courseId,
    module_id: parsed.data.moduleId,
    version_id: parsed.data.versionId || null,
    title: parsed.data.title,
    slug: slugify(parsed.data.slug || parsed.data.title),
    lesson_type: parsed.data.lessonType,
    short_summary: parsed.data.shortSummary || null,
    learning_objective: parsed.data.learningObjective || null,
    estimated_duration_minutes: parsed.data.estimatedDurationMinutes,
    display_order: parsed.data.displayOrder,
    preview_available: parsed.data.previewAvailable === "on",
  });

  await writeAuditEvent({ actorId: user.id, action: "course_lesson_created", resourceType: "course", resourceId: parsed.data.courseId, success: !error });
  redirect(error ? `/courses/builder/${parsed.data.courseId}?error=lesson` : `/courses/builder/${parsed.data.courseId}?created=lesson#curriculum`);
}

export async function addResourceAction(formData: FormData) {
  const user = await requireUser();
  const parsed = resourceSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/courses/builder?error=resource");

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("course_resources").insert({
    course_id: parsed.data.courseId,
    module_id: parsed.data.moduleId || null,
    lesson_id: parsed.data.lessonId || null,
    title: parsed.data.title,
    description: parsed.data.description || null,
    resource_type: parsed.data.resourceType,
    file_path: parsed.data.filePath || null,
    external_url: parsed.data.externalUrl || null,
    owner_id: user.id,
    copyright_declaration: parsed.data.copyrightDeclaration,
    attribution: parsed.data.attribution || null,
    license: parsed.data.license || null,
  });

  await writeAuditEvent({ actorId: user.id, action: "course_resource_added", resourceType: "course", resourceId: parsed.data.courseId, success: !error });
  redirect(error ? `/courses/builder/${parsed.data.courseId}?error=resource` : `/courses/builder/${parsed.data.courseId}?created=resource#resources`);
}

export async function addAssessmentAction(formData: FormData) {
  const user = await requireUser();
  const parsed = assessmentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/courses/builder?error=assessment");

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("assessments").insert({
    course_id: parsed.data.courseId,
    module_id: parsed.data.moduleId || null,
    lesson_id: parsed.data.lessonId || null,
    assessment_type: parsed.data.assessmentType,
    title: parsed.data.title,
    stakes: parsed.data.stakes,
    review_method: parsed.data.reviewMethod,
    required: parsed.data.required === "on",
  }).select("id").single();

  if (!error && data && parsed.data.assessmentType === "quiz") {
    await supabase.from("quizzes").insert({ assessment_id: data.id, practice_or_graded: parsed.data.stakes === "practice" ? "practice" : "graded" });
  }
  if (!error && data && parsed.data.assessmentType === "assignment") {
    await supabase.from("assignments").insert({ assessment_id: data.id, instructions: "Draft assignment instructions." });
  }

  await writeAuditEvent({ actorId: user.id, action: "course_assessment_created", resourceType: "course", resourceId: parsed.data.courseId, success: !error });
  redirect(error ? `/courses/builder/${parsed.data.courseId}?error=assessment` : `/courses/builder/${parsed.data.courseId}?created=assessment#assessments`);
}

export async function submitCourseReviewAction(formData: FormData) {
  const user = await requireUser();
  const parsed = reviewSubmissionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/courses/builder?error=review");

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.rpc("create_course_review", {
    target_course_id: parsed.data.courseId,
    actor: user.id,
    change_summary: parsed.data.changeSummary,
  });

  await writeAuditEvent({ actorId: user.id, action: "course_review_submitted", resourceType: "course", resourceId: parsed.data.courseId, success: !error });
  redirect(error ? `/courses/builder/${parsed.data.courseId}?error=readiness` : `/courses/reviewer?submitted=${data}`);
}

export async function publishCourseAction(formData: FormData) {
  const user = await requireUser();
  const parsed = publishCourseSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/admin/courses?error=publish");

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.rpc("publish_course_version", {
    target_course_id: parsed.data.courseId,
    target_version_id: parsed.data.versionId,
    actor: user.id,
    reason: parsed.data.reason || null,
  });
  if (!error) {
    await createServiceSupabaseClient().from("course_products").update({ published_version_id: parsed.data.versionId }).eq("course_id", parsed.data.courseId);
  }

  await writeAuditEvent({ actorId: user.id, action: "course_publish_requested", resourceType: "course", resourceId: parsed.data.courseId, reason: parsed.data.reason, success: !error });
  redirect(error ? "/admin/courses?error=publish" : "/admin/courses?published=true");
}

export async function saveCoursePriceAction(formData: FormData) {
  const user = await requireUser();
  const parsed = z.object({ courseId: z.uuid(), amountKes: z.coerce.number().int().min(0).max(1000000) }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/instructor/courses?error=price");
  const { courseId, amountKes } = parsed.data;
  if (!await canManageCourse(courseId, user.id)) redirect("/instructor/courses?error=access");
  const db = createServiceSupabaseClient();
  const { data: course } = await db.from("courses").select("title,short_description").eq("id", courseId).single();
  if (!course) redirect("/instructor/courses?error=course");
  const { data: linked } = await db.from("course_products").select("product_id").eq("course_id", courseId).limit(1).maybeSingle();
  let productId = linked?.product_id;
  if (!productId) {
    const { data: product, error } = await db.from("products").insert({ product_type: "course", name: course.title, description: course.short_description, status: "active" }).select("id").single();
    if (error || !product) redirect(`/courses/builder/${courseId}?error=price`);
    productId = product.id;
    const { error: linkError } = await db.from("course_products").insert({ course_id: courseId, product_id: productId });
    if (linkError) redirect(`/courses/builder/${courseId}?error=price`);
  }
  const { data: price, error } = await db.from("product_prices").insert({ product_id: productId, amount_minor: amountKes * 100, currency: "KES", status: "active", enrollment_available: true }).select("id").single();
  if (error || !price) redirect(`/courses/builder/${courseId}?error=price`);
  const { error: archiveError } = await db.from("product_prices").update({ status: "inactive" }).eq("product_id", productId).neq("id", price.id).eq("status", "active");
  if (archiveError) redirect(`/courses/builder/${courseId}?error=price`);
  await writeAuditEvent({ actorId: user.id, action: "course_price_saved", resourceType: "course", resourceId: courseId, newData: { amountMinor: amountKes * 100, currency: "KES" } });
  redirect(`/courses/builder/${courseId}?saved=price`);
}
