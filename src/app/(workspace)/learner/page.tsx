import { LearnerJourneyStrip, PathwayGrid, SkillCloud } from "@/components/catalog/learning-structure";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { SectionGrid } from "@/components/dashboard/section-grid";
import { coreSkills, solvaSchools } from "@/lib/catalog/learning-structure";

export default function LearnerDashboardPage() {
  const recommendedPathBlueprints = solvaSchools.slice(0, 3).flatMap((school) =>
    school.paths.slice(0, 1).map((path) => ({
      name: path,
      school: school.name,
      description: "A suggested structure placeholder. Real recommendations will use enrollments, goals, skills, and privacy-safe learner preferences.",
      skills: school.skills,
    })),
  );

  return (
    <DashboardShell>
      <PageHeading title="Learner dashboard" description="Your personal learning workspace. Real enrollments will appear after the course and payment engines are implemented." />
      <div className="mb-6">
        <LearnerJourneyStrip />
      </div>
      <SectionGrid
        items={[
          ["Continue learning", "No courses enrolled yet."],
          ["Learning goals", "Set goals after personalized learning preferences are expanded."],
          ["Upcoming sessions", "No live classes scheduled."],
          ["Certificates", "No certificates issued yet."],
          ["Saved courses", "No saved courses yet."],
          ["Profile shortcut", "Edit your public and private profile settings."],
        ]}
      />
      <div className="mt-8">
        <PageHeading title="Path recommendations foundation" description="This gives the learner dashboard a structured path model without inventing enrollments, ratings, or completion data." />
        <PathwayGrid paths={recommendedPathBlueprints} />
      </div>
      <div className="mt-8 rounded-md border border-border bg-card p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Skill interests</p>
        <h2 className="mt-3 text-2xl font-semibold">Skills can drive discovery later.</h2>
        <div className="mt-5"><SkillCloud skills={coreSkills.slice(0, 18)} /></div>
      </div>
    </DashboardShell>
  );
}
