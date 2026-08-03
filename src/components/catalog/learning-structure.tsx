import Link from "next/link";
import { ArrowRight, BookOpen, BriefcaseBusiness, CheckCircle2, Layers3, Route, Search, ShieldCheck, Sparkles, Tags } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { contentTypes, enterpriseLearningStructure, learnerJourneys, solvaSchools, type SolvaSchool } from "@/lib/catalog/learning-structure";

export function CatalogueHero({
  eyebrow,
  title,
  description,
  primary,
  secondary,
}: {
  eyebrow: string;
  title: string;
  description: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="border-b border-border solva-surface">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">{eyebrow}</p>
        <h1 className="mt-4 max-w-5xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">{title}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">{description}</p>
        {(primary || secondary) ? (
          <div className="mt-8 flex flex-wrap gap-3">
            {primary ? (
              <ButtonLink href={primary.href} size="lg">
                {primary.label}
                <ArrowRight size={18} aria-hidden />
              </ButtonLink>
            ) : null}
            {secondary ? <ButtonLink href={secondary.href} variant="outline" size="lg">{secondary.label}</ButtonLink> : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function ContentTypeGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {contentTypes.map((type) => (
        <Card key={type.name}>
          <Layers3 className="text-primary" aria-hidden />
          <h3 className="mt-4 font-semibold">{type.name}</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{type.description}</p>
        </Card>
      ))}
    </div>
  );
}

export function SchoolCatalogueGrid({ schools = solvaSchools }: { schools?: SolvaSchool[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {schools.map((school) => (
        <Link key={school.slug} href={`/schools/${school.slug}`} className="group">
          <Card className="h-full transition hover:border-primary hover:bg-[#0d111a]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-primary">School</p>
                <h3 className="mt-2 text-2xl font-semibold group-hover:text-primary">{school.name}</h3>
              </div>
              <BookOpen className="text-muted-foreground group-hover:text-primary" aria-hidden />
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{school.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {school.skills.slice(0, 4).map((skill) => <Badge key={skill}>{skill}</Badge>)}
            </div>
            <p className="mt-5 text-sm font-semibold text-primary">View categories, skills, and path blueprints</p>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export function SkillCloud({ skills }: { skills: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <Badge key={skill} className="border-primary/50 bg-[#061a3d] text-white">{skill}</Badge>
      ))}
    </div>
  );
}

export function PathwayGrid({ paths }: { paths: Array<{ name: string; description: string; school?: string; skills?: string[] }> }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {paths.map((path) => (
        <Card key={`${path.school ?? "path"}-${path.name}`} className="flex min-h-56 flex-col justify-between">
          <div>
            <Route className="text-primary" aria-hidden />
            <p className="mt-4 text-sm font-semibold text-primary">{path.school ?? "Learning path"}</p>
            <h3 className="mt-2 text-xl font-semibold">{path.name}</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{path.description}</p>
          </div>
          {path.skills?.length ? <div className="mt-5 flex flex-wrap gap-2">{path.skills.slice(0, 3).map((skill) => <Badge key={skill}>{skill}</Badge>)}</div> : null}
        </Card>
      ))}
    </div>
  );
}

export function LearnerJourneyStrip() {
  return (
    <div className="grid gap-3 md:grid-cols-5">
      {learnerJourneys.map((journey, index) => (
        <Card key={journey.name} className="p-4">
          <span className="grid size-8 place-items-center rounded-md bg-primary text-sm font-bold text-white">{index + 1}</span>
          <h3 className="mt-4 font-semibold">{journey.name}</h3>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">{journey.description}</p>
        </Card>
      ))}
    </div>
  );
}

export function EnterpriseStructureGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {enterpriseLearningStructure.map((item) => (
        <Card key={item.name}>
          <BriefcaseBusiness className="text-primary" aria-hidden />
          <h3 className="mt-4 font-semibold">{item.name}</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
        </Card>
      ))}
    </div>
  );
}

export function DiscoverySearchPanel() {
  return (
    <Card className="grid gap-4 p-4 md:grid-cols-[1fr_auto]">
      <label className="flex min-h-12 items-center gap-3 rounded-md border border-border bg-[#05070a] px-3">
        <Search size={18} className="text-muted-foreground" aria-hidden />
        <span className="sr-only">Search Solva Academy</span>
        <input className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" placeholder="Search skills, schools, academies, instructors, and paths" />
      </label>
      <ButtonLink href="/courses" variant="outline">Open catalogue</ButtonLink>
    </Card>
  );
}

export function TrustStructureGrid() {
  const items = [
    ["Skill outcomes", "Every course and path should say what skill evidence the learner will produce.", Tags],
    ["Reviewed publishing", "Courses, certificates, academy pages, and instructor claims move through approval workflows.", ShieldCheck],
    ["Verified proof", "Certificates, badges, transcripts, and project evidence become shareable records.", CheckCircle2],
    ["Opportunity layer", "Skills can later connect to jobs, gigs, internships, scholarships, and employer demand.", Sparkles],
  ] as const;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map(([title, description, Icon]) => (
        <Card key={title}>
          <Icon className="text-primary" aria-hidden />
          <h3 className="mt-4 font-semibold">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
        </Card>
      ))}
    </div>
  );
}
