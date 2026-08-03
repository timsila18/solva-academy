import { ArrowRight, Building2, GraduationCap, School, Search, ShieldCheck, Users } from "lucide-react";
import { ContentTypeGrid, LearnerJourneyStrip, SchoolCatalogueGrid, TrustStructureGrid } from "@/components/catalog/learning-structure";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/feedback/empty-state";

const goals: Array<[string, string, typeof GraduationCap]> = [
  ["Build career skills", "Short, practical learning paths for work-ready skills.", GraduationCap],
  ["Teach and earn", "Create courses, manage learners, and grow your academy.", Users],
  ["Train teams", "Assign learning, track progress, and manage compliance.", Building2],
];

export default function HomePage() {
  return (
    <div>
      <section className="border-b border-border solva-surface">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Premium learning infrastructure for Kenya and Africa.</p>
            <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-[0.96] sm:text-6xl lg:text-7xl">
              Learn, teach, and train with Solva Academy.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
              A serious learning platform for professionals, instructors, academies, and organizations that need practical skills, clean records, and trusted delivery.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/auth/sign-up" size="lg">
                Start learning
                <ArrowRight size={18} />
              </ButtonLink>
              <ButtonLink href="/academies" variant="outline" size="lg">
                Start your academy
              </ButtonLink>
              <ButtonLink href="/employers" variant="ghost" size="lg">
                Employer training
              </ButtonLink>
            </div>
          </div>
          <div className="rounded-md border border-border bg-[#0b0c0f] p-5 shadow-[0_28px_80px_rgba(0,0,0,0.55)]">
            <div className="rounded-md bg-white p-6 text-black">
              <div className="flex items-start justify-between gap-4 border-b border-[#d8dde7] pb-5">
                <div>
                  <p className="text-sm font-bold uppercase text-primary">Academy preview</p>
                  <h2 className="mt-3 text-3xl font-semibold">Timothy Sila HR Academy</h2>
                </div>
                <ShieldCheck className="text-primary" />
              </div>
              <div className="grid gap-5 py-6">
                <div>
                  <p className="text-sm font-bold uppercase text-[#7a828f]">Structure</p>
                  <p className="mt-2 text-lg leading-7 text-[#2b3442]">Schools, academies, courses, teams, approvals, and audit trails built for real training operations.</p>
                </div>
                <div>
                  <p className="text-sm font-bold uppercase text-[#7a828f]">Workspace</p>
                  <p className="mt-2 text-lg leading-7 text-[#2b3442]">Learners, instructors, academy owners, and employers use one account with controlled workspace switching.</p>
                </div>
                <div>
                  <p className="text-sm font-bold uppercase text-[#7a828f]">Trust</p>
                  <p className="mt-2 text-lg leading-7 text-[#2b3442]">Approvals, scoped roles, tenant isolation, and clean records keep the platform inspectable.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <label className="flex min-h-14 items-center gap-3 rounded-lg border border-border bg-card px-4 shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
          <Search size={20} className="text-muted-foreground" />
          <span className="sr-only">Search learning</span>
          <input className="w-full bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground" placeholder="Search courses, schools, academies, and skills" />
        </label>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:px-6 md:grid-cols-3">
        {goals.map(([title, description, Icon]) => (
          <Card key={title}>
            <CardHeader>
              <Icon className="text-primary" aria-hidden />
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Structured like a serious learning ecosystem</p>
          <h2 className="mt-3 text-3xl font-semibold">Courses are only one layer.</h2>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            Solva Academy organizes learning by schools, skills, paths, certificates, academies, and enterprise workspaces so learners can move from exploration to proof.
          </p>
        </div>
        <ContentTypeGrid />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Learner journey</p>
          <h2 className="mt-3 text-3xl font-semibold">Explore, enroll, practice, prove, progress.</h2>
        </div>
        <LearnerJourneyStrip />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Schools and skills</p>
            <h2 className="mt-3 text-3xl font-semibold">Kenyan-first schools with reusable skill maps.</h2>
          </div>
          <ButtonLink href="/schools" variant="outline">Browse schools</ButtonLink>
        </div>
        <SchoolCatalogueGrid />
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:px-6 lg:grid-cols-2">
        <EmptyState
          title="Browse schools"
          description="Explore schools that organize learning by practical fields and professional goals."
          action={<ButtonLink href="/schools" variant="outline">View schools</ButtonLink>}
        />
        <EmptyState
          title="Start an academy"
          description="Apply to create a branded learning business and manage your courses, team, and learners."
          action={<ButtonLink href="/academies/start" variant="outline">Apply now</ButtonLink>}
        />
        <EmptyState title="Teach on Solva" description="Create courses, host live sessions, review assignments, and track learner outcomes." action={<ButtonLink href="/instructors/apply" variant="outline">Become an instructor</ButtonLink>} />
        <EmptyState title="Train your team" description="Set up an organization workspace for onboarding, compliance, and workforce learning." action={<ButtonLink href="/organizations/create" variant="outline">Create workspace</ButtonLink>} />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Trust layer</p>
          <h2 className="mt-3 text-3xl font-semibold">Built for proof, not just content.</h2>
        </div>
        <TrustStructureGrid />
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-3">
          <div>
            <School className="text-primary" />
            <h2 className="mt-3 text-2xl font-semibold">Start your academy</h2>
            <p className="mt-2 text-muted-foreground">Launch a branded learning space with team roles, course review, and public pages.</p>
          </div>
          <div>
            <Users className="text-primary" />
            <h2 className="mt-3 text-2xl font-semibold">Become an instructor</h2>
            <p className="mt-2 text-muted-foreground">Teach practical skills, manage learners, and request payouts through audited workflows.</p>
          </div>
          <div>
            <Building2 className="text-primary" />
            <h2 className="mt-3 text-2xl font-semibold">Employer training</h2>
            <p className="mt-2 text-muted-foreground">Import teams, assign learning, monitor compliance, and keep employee transcripts.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
