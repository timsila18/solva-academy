import {
  addAssessmentAction,
  addLearningOutcomeAction,
  addLessonAction,
  addModuleAction,
  addResourceAction,
  submitCourseReviewAction,
} from "@/features/courses/actions";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select, TextArea } from "@/components/ui/form-fields";
import { EmptyState } from "@/components/feedback/empty-state";

export default async function CourseBuilderPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  return (
    <DashboardShell>
      <PageHeading title="Course builder" description="Build identity, outcomes, curriculum, resources, assessments, review workflow, and publishing-ready versions." />
      <div className="grid gap-5">
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
            <Field label="Version ID"><Input name="versionId" /></Field>
            <Field label="Estimated minutes"><Input name="estimatedDurationMinutes" type="number" defaultValue="0" /></Field>
            <Field label="Display order"><Input name="displayOrder" type="number" defaultValue="1" /></Field>
            <Field label="Description"><TextArea name="description" /></Field>
            <Field label="Learning objectives"><TextArea name="learningObjectives" /></Field>
            <label className="flex gap-2 text-sm md:col-span-2"><input type="checkbox" name="required" /> Required module</label>
            <Button className="md:col-span-2" type="submit">Add module</Button>
          </form>
          <form action={addLessonAction} className="mt-6 grid gap-4 border-t border-border pt-6 md:grid-cols-2">
            <input type="hidden" name="courseId" value={courseId} />
            <Field label="Module ID"><Input name="moduleId" required /></Field>
            <Field label="Version ID"><Input name="versionId" /></Field>
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

        <EmptyState title="Autosave and structured content blocks" description="The database supports structured content blocks, updated-by foundations, and version-safe editing. Rich text autosave UI is the next refinement on top of these tables." />
      </div>
    </DashboardShell>
  );
}
