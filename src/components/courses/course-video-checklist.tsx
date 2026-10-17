import { Check, Clock } from "lucide-react";
import { VideoUpload } from "@/components/courses/video-upload";

export type PreparedLesson = { id: string; title: string; lesson_type: string; short_summary: string | null;
  learning_objective: string | null; learner_instructions: string | null; videoAttached: boolean; priceKes: number | null };

export function CourseVideoChecklist({ courseId, lessons }: { courseId: string; lessons: PreparedLesson[] }) {
  const videoLessons = lessons.filter((lesson) => lesson.lesson_type === "video");
  const attached = videoLessons.filter((lesson) => lesson.videoAttached).length;
  return <section aria-label="Class videos">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4"><h2 className="font-semibold">Classes</h2><p className="text-sm text-muted-foreground" role="status">{attached} of {videoLessons.length} videos added</p></div>
    {!videoLessons.length && <p className="py-5 text-sm text-muted-foreground">No video classes yet.</p>}
    <ol className="divide-y divide-border">{videoLessons.map((lesson, index) => <li key={lesson.id} className="py-5">
      <div className="flex items-start gap-3"><span className="pt-0.5 text-sm tabular-nums text-muted-foreground">{String(index + 1).padStart(2, "0")}</span><div className="min-w-0 flex-1"><h3 className="font-medium">{lesson.title}</h3><div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground"><span className="inline-flex items-center gap-1.5">{lesson.videoAttached ? <Check size={14} aria-hidden="true" /> : <Clock size={14} aria-hidden="true" />}{lesson.videoAttached ? "Video attached" : "Awaiting video"}</span>{lesson.priceKes !== null && <span>KSh {lesson.priceKes.toLocaleString("en-KE")}</span>}</div>
        <details className="mt-4"><summary className="cursor-pointer text-sm text-primary">{lesson.videoAttached ? "Video & class details" : "Add video & view class details"}</summary>
          <VideoUpload courseId={courseId} lessonId={lesson.id} />
          {lesson.short_summary && <p className="mt-4 text-sm text-muted-foreground">{lesson.short_summary}</p>}
          {lesson.learning_objective && <div className="mt-4 text-sm"><h4 className="font-medium">Learning outcomes</h4><p className="mt-1 text-muted-foreground">{lesson.learning_objective}</p></div>}
          {lesson.learner_instructions && <div className="mt-4 text-sm"><h4 className="font-medium">Practical exercise</h4><p className="mt-1 whitespace-pre-wrap text-muted-foreground">{lesson.learner_instructions}</p></div>}
        </details>
      </div></div>
    </li>)}</ol>
  </section>;
}
