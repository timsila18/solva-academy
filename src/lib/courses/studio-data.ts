import { createServiceSupabaseClient } from "@/lib/supabase/server";
export async function getStudioCourse(courseId: string, userId: string) {
  const db = createServiceSupabaseClient();
  const access = await db.rpc("studio_can_read_course", {
    target_course_id: courseId,
    subject: userId,
  });
  if (access.error || !access.data) return null;
  const [
    course,
    versions,
    modules,
    lessons,
    settings,
    products,
    episodes,
    resources,
    editable,
  ] = await Promise.all([
    db.from("courses").select("*").eq("id", courseId).single(),
    db
      .from("course_versions")
      .select("id,status")
      .eq("course_id", courseId)
      .order("version_number", { ascending: false }),
    db
      .from("course_modules")
      .select("id,title,display_order,version_id")
      .eq("course_id", courseId)
      .order("display_order"),
    db.from("course_lessons").select("*").eq("course_id", courseId),
    db
      .from("course_studio_settings")
      .select("*")
      .eq("course_id", courseId)
      .maybeSingle(),
    db.from("course_products").select("product_id").eq("course_id", courseId),
    db
      .from("episode_products")
      .select("product_id,lesson_id")
      .eq("course_id", courseId),
    db
      .from("course_resources")
      .select("*")
      .eq("course_id", courseId)
      .eq("status", "active"),
    db.rpc("studio_can_edit_course", {
      target_course_id: courseId,
      subject: userId,
    }),
  ]);
  if (
    [
      course,
      versions,
      modules,
      lessons,
      settings,
      products,
      episodes,
      resources,
      editable,
    ].some((r) => r.error)
  )
    throw new Error("Course Studio could not load.");
  const version =
    versions.data?.find((v) => v.status === "draft") ?? versions.data?.[0];
  const classes = (lessons.data ?? [])
    .filter((l) => l.version_id === version?.id)
    .sort(
      (a, b) =>
        (modules.data?.find((m) => m.id === a.module_id)?.display_order ?? 0) -
          (modules.data?.find((m) => m.id === b.module_id)?.display_order ??
            0) || a.display_order - b.display_order,
    );
  const ids = classes.map((l) => l.id);
  const productIds = [...(products.data ?? []), ...(episodes.data ?? [])].map(
    (p) => p.product_id,
  );
  const [blocks, prices] = await Promise.all([
    ids.length
      ? db
          .from("lesson_content_blocks")
          .select("lesson_id,content")
          .in("lesson_id", ids)
          .eq("block_type", "video")
          .eq("status", "active")
      : Promise.resolve({ data: [], error: null }),
    productIds.length
      ? db
          .from("product_prices")
          .select("product_id,amount_minor")
          .in("product_id", productIds)
          .eq("status", "active")
          .eq("currency", "KES")
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [], error: null }),
  ]);
  if (blocks.error || prices.error)
    throw new Error("Course media or pricing could not load.");
  const hosted = await db
    .from("course_video_uploads")
    .select("id,lesson_id,status,expires_at")
    .eq("course_id", courseId)
    .order("created_at", {ascending:false});
  if (hosted.error) throw new Error("Private video status could not load.");
  const enriched = classes.map((l) => ({
    ...l,
    pendingVideoUpload: hosted.data?.find(u=>u.lesson_id===l.id && u.status==="pending" && new Date(u.expires_at).getTime()>Date.now())?.id,
    videoAttached: Boolean(
      blocks.data?.some(
        (b) =>
          b.lesson_id === l.id &&
          ((b.content?.provider === "hostafrica" &&
            hosted.data?.some(
              (u) => u.id === b.content.uploadId && u.lesson_id === l.id && u.status === "attached",
            )) ||
            (b.content?.bucket === "course-media" &&
              typeof b.content?.path === "string" &&
              b.content.path.startsWith(`${courseId}/${l.id}/`))),
      ),
    ),
    priceKes:
      (prices.data?.find((p) =>
        episodes.data?.some(
          (e) => e.lesson_id === l.id && e.product_id === p.product_id,
        ),
      )?.amount_minor ?? 0) / 100,
  }));
  const materials = await Promise.all(
    (resources.data ?? []).map(async (r) => {
      const { data } = r.file_path?.startsWith(`${courseId}/`)
        ? await db.storage
            .from(
              r.metadata?.bucket === "course-authoring"
                ? "course-authoring"
                : "course-resources",
            )
            .createSignedUrl(r.file_path, 3600)
        : { data: null };
      return {
        ...r,
        url:
          data?.signedUrl ??
          (/^https?:\/\//.test(r.external_url ?? "") ? r.external_url : null),
      };
    }),
  );
  return {
    course: course.data!,
    version,
    classes: enriched,
    settings: settings.data,
    materials,
    editable: editable.data === true,
    coursePriceKes:
      (prices.data?.find((p) =>
        products.data?.some((cp) => cp.product_id === p.product_id),
      )?.amount_minor ?? 0) / 100,
  };
}
export async function studioChoices() {
  const db = createServiceSupabaseClient();
  const [schools, levels, templates] = await Promise.all([
    db
      .from("schools")
      .select("id,name")
      .in("status", ["published", "active"])
      .eq("visibility", "public")
      .order("name"),
    db
      .from("course_levels")
      .select("id,name")
      .eq("status", "active")
      .order("display_order"),
    db
      .from("course_studio_templates")
      .select("id,name")
      .eq("is_active", true)
      .order("display_order"),
  ]);
  if (schools.error || levels.error || templates.error)
    throw new Error("Course choices could not load.");
  return {
    schools: schools.data ?? [],
    levels: levels.data ?? [],
    templates: templates.data ?? [],
  };
}
