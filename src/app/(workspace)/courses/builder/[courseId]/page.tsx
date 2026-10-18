import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowUp,
  ArrowDown,
  Copy,
  Trash2,
  RotateCcw,
  ChevronRight,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { StudioForm } from "@/components/courses/studio-form";
import { StudioDetails } from "@/components/courses/studio-details";
import { Field, TextArea } from "@/components/ui/form-fields";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { getStudioCourse, studioChoices } from "@/lib/courses/studio-data";
export default async function CourseStudio({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const user = await requireUserOrRedirect();
  const data = await getStudioCourse(courseId, user.id);
  if (!data) notFound();
  const choices = await studioChoices();
  const active = data.classes.filter((l) => l.status !== "archived");
  const ready = active.filter(
    (l) => l.videoAttached && l.learning_objective?.trim(),
  ).length;
  return (
    <DashboardShell>
      <PageHeading
        title={data.course.title}
        description={`Course Studio · ${data.course.status.replaceAll("_", " ")}`}
      />
      {!data.editable && (
        <p
          role="status"
          className="mb-6 border-l-2 border-primary pl-4 text-sm"
        >
          This version is read-only. Courses under review or with published or
          purchased content cannot be changed here.
        </p>
      )}
      <div className="mb-6 flex flex-wrap justify-between gap-3 text-sm text-muted-foreground">
        <span>
          {active.length} classes · {ready} ready
        </span>
        <span>
          Full course: KSh {data.coursePriceKes.toLocaleString("en-KE")}
        </span>
      </div>
      <section
        aria-label="Classes"
        className="divide-y divide-border border-y border-border"
      >
        {active.map((lesson, index) => (
          <div
            key={lesson.id}
            className="flex flex-wrap items-center gap-3 py-4"
          >
            <span className="w-7 text-sm text-muted-foreground">
              {index + 1}
            </span>
            <Link
              className="min-w-0 flex-1"
              href={`/courses/builder/${courseId}/classes/${lesson.id}`}
            >
              <span className="block font-medium break-words">
                {lesson.title}
              </span>
              <span className="text-xs text-muted-foreground">
                {lesson.videoAttached ? "Video added" : "Awaiting video"}
                {data.settings?.sell_classes
                  ? ` · KSh ${lesson.priceKes.toLocaleString("en-KE")}`
                  : ""}
              </span>
            </Link>
            {data.editable && (
              <div className="flex items-center gap-1">
                {[
                  { command: "move_up", label: "Move up", Icon: ArrowUp },
                  { command: "move_down", label: "Move down", Icon: ArrowDown },
                  {
                    command: "duplicate",
                    label: "Duplicate outline",
                    Icon: Copy,
                  },
                  { command: "remove", label: "Remove class", Icon: Trash2 },
                ].map(({ command, label, Icon }) => (
                  <StudioForm
                    key={command}
                    compact
                    className=""
                    confirm={
                      command === "remove"
                        ? "Remove this class from the draft? It can be restored."
                        : undefined
                    }
                  >
                    <input type="hidden" name="command" value={command} />
                    <input type="hidden" name="courseId" value={courseId} />
                    <input type="hidden" name="lessonId" value={lesson.id} />
                    <button
                      type="submit"
                      aria-label={`${label}: ${lesson.title}`}
                      title={label}
                      className="rounded p-2 hover:bg-muted"
                    >
                      <Icon size={16} />
                    </button>
                  </StudioForm>
                ))}
              </div>
            )}
            <Link
              href={`/courses/builder/${courseId}/classes/${lesson.id}`}
              aria-label={`Edit ${lesson.title}`}
              className="p-2"
            >
              <ChevronRight size={18} />
            </Link>
          </div>
        ))}
        {!active.length && (
          <p className="py-8 text-sm text-muted-foreground">No classes yet.</p>
        )}
      </section>
      {data.editable && (
        <section className="py-6">
          <h2 className="mb-4 font-semibold">Add classes</h2>
          <StudioForm submitLabel="Add classes">
            <input type="hidden" name="command" value="add" />
            <input type="hidden" name="courseId" value={courseId} />
            <Field label="Class titles (one per line)">
              <TextArea name="titles" required rows={3} />
            </Field>
          </StudioForm>
        </section>
      )}
      {data.classes.some((l) => l.status === "archived") && (
        <details className="border-t border-border py-5">
          <summary>Removed classes</summary>
          {data.classes
            .filter((l) => l.status === "archived")
            .map((l) => (
              <div className="flex justify-between py-3" key={l.id}>
                <span>{l.title}</span>
                {data.editable && (
                  <StudioForm compact className="">
                    <input type="hidden" name="command" value="restore" />
                    <input type="hidden" name="courseId" value={courseId} />
                    <input type="hidden" name="lessonId" value={l.id} />
                    <button
                      aria-label={`Restore ${l.title}`}
                      title="Restore class"
                    >
                      <RotateCcw size={18} />
                    </button>
                  </StudioForm>
                )}
              </div>
            ))}
        </details>
      )}
      <details className="border-t border-border py-5">
        <summary className="cursor-pointer font-semibold">
          Course details & pricing
        </summary>
        {data.editable ? (
          <StudioForm className="mt-5 grid gap-5">
            <input type="hidden" name="command" value="details" />
            <input type="hidden" name="courseId" value={courseId} />
            <StudioDetails
              {...choices}
              course={data.course}
              price={data.coursePriceKes}
              classPrice={(data.settings?.default_class_price_minor ?? 0) / 100}
              sellClasses={data.settings?.sell_classes}
            />
          </StudioForm>
        ) : (
          <p className="mt-4 text-sm">{data.course.short_description}</p>
        )}
      </details>
      <details className="border-t border-border py-5">
        <summary className="cursor-pointer font-semibold">
          Course materials
        </summary>
        <ul className="mt-4 space-y-3">
          {data.materials.map((r) => (
            <li key={r.id}>
              {r.url ? (
                <a
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline"
                >
                  {r.title}
                </a>
              ) : (
                r.title
              )}
            </li>
          ))}
        </ul>
        <Link
          href={`/courses/builder/${courseId}/checks`}
          className="mt-4 inline-block text-sm text-primary"
        >
          Review existing knowledge checks
        </Link>
      </details>
      <section className="border-t border-border py-5">
        <h2 className="font-semibold">Publication review</h2>
        <p className="my-3 text-sm text-muted-foreground">
          {ready} of {active.length} classes have a video and learning outcomes.
          Submission locks this draft for review.
        </p>
        {data.editable && (
          <StudioForm
            submitLabel="Submit for review"
            confirm="Submit this course for review and lock the draft?"
          >
            <input type="hidden" name="command" value="submit" />
            <input type="hidden" name="courseId" value={courseId} />
          </StudioForm>
        )}
      </section>
    </DashboardShell>
  );
}
