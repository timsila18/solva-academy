import Link from "next/link";
import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { getLearningAccess } from "@/lib/courses/access";
import { LessonVideo } from "@/components/courses/lesson-video";

export default async function CoursePlayerPage({ params, searchParams }: { params: Promise<{ courseId: string }>; searchParams: Promise<{ lesson?: string }> }) {
  const user = await requireUserOrRedirect();
  const { courseId } = await params;
  const { lesson: selectedId } = await searchParams;
  const enrollment = await getLearningAccess(courseId, user.id, selectedId);
  if (!enrollment) return <DashboardShell><PageHeading title="Course access required" description="Enroll in this course to access its lessons." /><Link href="/courses" className="text-primary underline">Browse courses</Link></DashboardShell>;
  const db = createServiceSupabaseClient();
  const { data: course } = await db.from("courses").select("title").eq("id", courseId).single();
  const { data: modules } = await db.from("course_modules").select("id,title,display_order").eq("course_id", courseId).order("display_order");
  let lessonQuery = db.from("course_lessons").select("id,title,module_id,transcript,version_id,learning_objective,learner_instructions").eq("course_id", courseId).neq("status", "archived").order("display_order");
  if (enrollment.course_version_id) lessonQuery = lessonQuery.eq("version_id", enrollment.course_version_id);
  if (enrollment.allowedLessonIds) lessonQuery = lessonQuery.in("id", enrollment.allowedLessonIds);
  const { data: lessons } = await lessonQuery;
  const selected = lessons?.find((lesson) => lesson.id === selectedId) ?? lessons?.[0];
  if (!course) notFound();
  const { data: progress } = enrollment.episodeOnly ? { data: [] } : await db.from("lesson_progress").select("lesson_id,status,last_position_seconds").eq("enrollment_id", enrollment.id);
  const { data: episodePosition } = enrollment.episodeOnly ? await db.from("episode_progress").select("last_position_seconds").eq("entitlement_id", enrollment.id).maybeSingle() : { data: null };
  const { data: blocks } = selected ? await db.from("lesson_content_blocks").select("block_type,content").eq("lesson_id", selected.id).eq("status", "active").eq("visibility", "learner").order("display_order") : { data: [] };
  const video = blocks?.find((block) => block.block_type === "video")?.content;
  const { data: media } = video?.bucket === "course-media" && typeof video.path === "string" && video.path.startsWith(`${courseId}/${selected?.id}/`) ? await db.storage.from("course-media").createSignedUrl(video.path, 14400) : { data: null };
  return <DashboardShell>
    <PageHeading title={course.title} description={selected?.title ?? "Lessons are being prepared."} />
    <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <nav aria-label="Course curriculum" className="divide-y divide-border border-y border-border">
        {modules?.map((module) => <section key={module.id} className="py-3"><h2 className="mb-2 text-sm font-semibold">{module.title}</h2>{lessons?.filter((lesson) => lesson.module_id === module.id).map((lesson) => <Link key={lesson.id} href={`/learn/${courseId}?lesson=${lesson.id}`} aria-current={lesson.id === selected?.id ? "page" : undefined} className={`block px-2 py-2 text-sm ${lesson.id === selected?.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>{progress?.find((item) => item.lesson_id === lesson.id)?.status === "completed" ? "Completed: " : ""}{lesson.title}</Link>)}</section>)}
      </nav>
      <section className="min-w-0">
        {selected && media ? <LessonVideo key={selected.id} src={media.signedUrl} courseId={courseId} lessonId={selected.id} initialPosition={episodePosition?.last_position_seconds ?? progress?.find((item) => item.lesson_id === selected.id)?.last_position_seconds ?? 0} /> : <p className="border border-border p-6 text-muted-foreground">No video is available for this lesson yet.</p>}
        {selected?.transcript && <section className="mt-6"><h2 className="font-semibold">Transcript</h2><p className="mt-3 whitespace-pre-wrap">{selected.transcript}</p></section>}
        {selected?.learning_objective && <section className="mt-6"><h2 className="font-semibold">Learning outcomes</h2><p className="mt-3 text-sm">{selected.learning_objective}</p></section>}
        {selected?.learner_instructions && <section className="mt-6"><h2 className="font-semibold">Practical exercise</h2><p className="mt-3 whitespace-pre-wrap text-sm">{selected.learner_instructions}</p></section>}
      </section>
    </div>
  </DashboardShell>;
}
