import {
  addAssessmentAction,
  addLearningOutcomeAction,
  addLessonAction,
  addModuleAction,
  addResourceAction,
  submitCourseReviewAction,
  saveCoursePriceAction,
} from "@/features/courses/actions";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select, TextArea } from "@/components/ui/form-fields";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { canManageCourse } from "@/lib/courses/access";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { VideoUpload } from "@/components/courses/video-upload";
import { saveEpisodePriceAction } from "@/features/commerce/episode-actions";
import { CourseVideoChecklist } from "@/components/courses/course-video-checklist";

export default async function CourseBuilderPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const user = await requireUserOrRedirect();
  if (!await canManageCourse(courseId, user.id)) notFound();
  const db = createServiceSupabaseClient();
  const { data: course } = await db.from("courses").select("title,status").eq("id", courseId).single();
  const { data: version } = await db.from("course_versions").select("id").eq("course_id", courseId).eq("status", "draft").order("version_number", { ascending: false }).limit(1).maybeSingle();
  const { data: modules } = await db.from("course_modules").select("id,title").eq("course_id", courseId).order("display_order");
  let lessonQuery = db.from("course_lessons").select("id,title,lesson_type,short_summary,learning_objective,learner_instructions").eq("course_id", courseId).order("display_order");
  if (version) lessonQuery = lessonQuery.eq("version_id", version.id);
  const { data: lessons, error: lessonError } = await lessonQuery;
  const lessonIds = (lessons ?? []).map((lesson) => lesson.id);
  const { data: videos, error: videoError } = lessonIds.length ? await db.from("lesson_content_blocks").select("lesson_id,content").in("lesson_id", lessonIds).eq("block_type", "video").eq("status", "active") : { data: [], error: null };
  const { data: courseProducts } = await db.from("course_products").select("product_id").eq("course_id", courseId);
  const { data: episodeProducts } = await db.from("episode_products").select("lesson_id,product_id").eq("course_id", courseId);
  const productIds = [...(courseProducts ?? []), ...(episodeProducts ?? [])].map((product) => product.product_id);
  const { data: prices } = productIds.length ? await db.from("product_prices").select("product_id,amount_minor").in("product_id", productIds).eq("status", "active").eq("currency", "KES").order("created_at", { ascending: false }) : { data: [] };
  const coursePrice = prices?.find((price) => courseProducts?.some((product) => product.product_id === price.product_id));
  const { data: resources } = await db.from("course_resources").select("id,title,file_path").eq("course_id", courseId).eq("status", "active");
  const resourceLinks = await Promise.all((resources ?? []).map(async (resource) => {
    const { data } = resource.file_path?.startsWith(`${courseId}/`) ? await db.storage.from("course-resources").createSignedUrl(resource.file_path, 3600) : { data: null };
    return { id: resource.id, title: resource.title, url: data?.signedUrl ?? null };
  }));
  return (
    <DashboardShell>
      <PageHeading title={course?.title ?? "Course builder"} description={course?.status === "draft" ? "Draft course · Not published" : "Course preparation"} />
      {coursePrice && <p className="mb-6 text-sm text-muted-foreground">Full programme: KSh {(coursePrice.amount_minor / 100).toLocaleString("en-KE")}</p>}
      {lessonError || videoError ? <p role="alert">The class list could not load. Please refresh before uploading.</p> : <CourseVideoChecklist courseId={courseId} lessons={(lessons ?? []).map((lesson) => ({ ...lesson,
        videoAttached: Boolean(videos?.some((video) => video.lesson_id === lesson.id && video.content?.bucket === "course-media" && typeof video.content?.path === "string" && video.content.path.startsWith(`${courseId}/${lesson.id}/`))),
        priceKes: (prices?.find((price) => episodeProducts?.some((product) => product.lesson_id === lesson.id && product.product_id === price.product_id))?.amount_minor ?? 0) / 100 || null,
      }))} />}
      {resourceLinks.length > 0 && <section className="mt-8 border-t border-border py-5"><h2 className="font-semibold">Course materials</h2><ul className="mt-3 space-y-2">{resourceLinks.map((resource) => <li key={resource.id} className="text-sm">{resource.url ? <a href={resource.url} className="text-primary underline">{resource.title}</a> : <span>{resource.title} - download unavailable</span>}</li>)}</ul></section>}
      <details className="mt-8 border-t border-border pt-5"><summary className="cursor-pointer font-semibold">Course settings & curriculum</summary>
      <div className="mt-5 grid gap-5">
        <section className="border-y border-border py-5">
          <h2 className="font-semibold">Full course price</h2>
          <form action={saveCoursePriceAction} className="mt-4 flex flex-wrap items-end gap-4">
            <input type="hidden" name="courseId" value={courseId} />
            <Field label="Price in KES"><Input name="amountKes" type="number" min="0" max="1000000" step="1" defaultValue={coursePrice ? coursePrice.amount_minor / 100 : undefined} required /></Field>
            <Button type="submit">Save price</Button>
          </form>
        </section>
        <Card id="outcomes">
          <h2 className="font-semibold">Learning outcomes</h2>
          <form action={addLearningOutcomeAction} className="mt-4 grid gap-4 md:grid-cols-2">
            <input type="hidden" name="courseId" value={courseId} />
            <Field label="Outcome statement"><TextArea name="statement" required /></Field>
            <Field label="Skill ID"><Input name="skillId" /></Field>
            <Field label="Competency level"><Input name="competencyLevel" /></Field>
            <Field label="Display order"><Input name="displayOrder" type="number" defaultValue="1" /></Field>
            <Button className="md:col-span-2" type="submit">Add outcome</Button>
          </form>
        </Card>

        <Card id="curriculum">
          <h2 className="font-semibold">Curriculum</h2>
          <form action={addModuleAction} className="mt-4 grid gap-4 md:grid-cols-2">
            <input type="hidden" name="courseId" value={courseId} />
            <Field label="Module title"><Input name="title" required /></Field>
            <input type="hidden" name="versionId" value={version?.id ?? ""} />
            <Field label="Estimated minutes"><Input name="estimatedDurationMinutes" type="number" defaultValue="0" /></Field>
            <Field label="Display order"><Input name="displayOrder" type="number" defaultValue="1" /></Field>
            <Field label="Description"><TextArea name="description" /></Field>
            <Field label="Learning objectives"><TextArea name="learningObjectives" /></Field>
            <label className="flex gap-2 text-sm md:col-span-2"><input type="checkbox" name="required" /> Required module</label>
            <Button className="md:col-span-2" type="submit">Add module</Button>
          </form>
          <form action={addLessonAction} className="mt-6 grid gap-4 border-t border-border pt-6 md:grid-cols-2">
            <input type="hidden" name="courseId" value={courseId} />
            <Field label="Module"><Select name="moduleId" required><option value="">Choose a module</option>{modules?.map((module) => <option key={module.id} value={module.id}>{module.title}</option>)}</Select></Field>
            <input type="hidden" name="versionId" value={version?.id ?? ""} />
            <Field label="Lesson title"><Input name="title" required /></Field>
            <Field label="Slug"><Input name="slug" required /></Field>
            <Field label="Lesson type"><Select name="lessonType"><option>text</option><option>video</option><option>audio</option><option>pdf</option><option>quiz</option><option>assignment</option><option>practice_activity</option></Select></Field>
            <Field label="Display order"><Input name="displayOrder" type="number" defaultValue="1" /></Field>
            <Field label="Estimated minutes"><Input name="estimatedDurationMinutes" type="number" defaultValue="0" /></Field>
            <Field label="Learning objective"><TextArea name="learningObjective" /></Field>
            <label className="flex gap-2 text-sm md:col-span-2"><input type="checkbox" name="previewAvailable" /> Available as preview lesson</label>
            <Button className="md:col-span-2" type="submit">Add lesson</Button>
          </form>
        </Card>

        <section className="divide-y divide-border border-y border-border">
          {lessons?.map((lesson) => <section key={lesson.id} className="py-4"><h3 className="font-medium">{lesson.title}</h3>{lesson.lesson_type === "video" && <VideoUpload courseId={courseId} lessonId={lesson.id} />}<form action={saveEpisodePriceAction} className="mt-3 flex flex-wrap items-end gap-3"><input type="hidden" name="courseId" value={courseId} /><input type="hidden" name="lessonId" value={lesson.id} /><Field label="Individual class price (KES)"><Input name="amountKes" type="number" min="1" max="1000000" step="1" required /></Field><Button type="submit" variant="outline">Save class price</Button></form></section>)}
        </section>
        <Card id="resources">
          <h2 className="font-semibold">Resource library</h2>
          <form action={addResourceAction} className="mt-4 grid gap-4 md:grid-cols-2">
            <input type="hidden" name="courseId" value={courseId} />
            <Field label="Title"><Input name="title" required /></Field>
            <Field label="Type"><Select name="resourceType"><option>pdf</option><option>presentation</option><option>template</option><option>external_link</option><option>dataset</option><option>practice_file</option></Select></Field>
            <Field label="File path"><Input name="filePath" placeholder="course-resources/..." /></Field>
            <Field label="External URL"><Input name="externalUrl" type="url" /></Field>
            <Field label="Copyright declaration"><Select name="copyrightDeclaration"><option value="created_by_me">I created this content</option><option value="academy_owned">My academy owns this content</option><option value="permission_granted">I have permission</option><option value="licensed_for_use">Licensed for this use</option><option value="official_public_resource">Official public resource</option><option value="exception_requires_review">Exception requiring review</option></Select></Field>
            <Field label="Attribution"><Input name="attribution" /></Field>
            <Field label="Description"><TextArea name="description" /></Field>
            <Button className="md:col-span-2" type="submit">Add resource metadata</Button>
          </form>
        </Card>

        <Card id="assessments">
          <h2 className="font-semibold">Assessments</h2>
          <form action={addAssessmentAction} className="mt-4 grid gap-4 md:grid-cols-2">
            <input type="hidden" name="courseId" value={courseId} />
            <Field label="Title"><Input name="title" required /></Field>
            <Field label="Type"><Select name="assessmentType"><option value="quiz">Quiz</option><option value="assignment">Assignment</option><option value="practical">Practical</option><option value="project">Project</option><option value="final">Final</option></Select></Field>
            <Field label="Stakes"><Select name="stakes"><option value="practice">Practice</option><option value="formative">Formative</option><option value="summative">Summative</option><option value="final">Final</option><option value="high_stakes">High stakes</option></Select></Field>
            <Field label="Review method"><Select name="reviewMethod"><option value="automated">Automated</option><option value="manual">Manual</option></Select></Field>
            <label className="flex gap-2 text-sm md:col-span-2"><input type="checkbox" name="required" /> Required for completion</label>
            <Button className="md:col-span-2" type="submit">Add assessment</Button>
          </form>
        </Card>

        <Card>
          <h2 className="font-semibold">Readiness and review</h2>
          <p className="mt-2 text-sm text-muted-foreground">The server-side readiness checker blocks missing outcomes, modules, lessons, school, level, and course type.</p>
          <form action={submitCourseReviewAction} className="mt-4 grid gap-4">
            <input type="hidden" name="courseId" value={courseId} />
            <Field label="Version change summary"><TextArea name="changeSummary" required /></Field>
            <Button type="submit">Run readiness check and submit for review</Button>
          </form>
        </Card>

      </div>
      </details>
    </DashboardShell>
  );
}
