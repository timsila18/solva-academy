import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const skills = ["Payroll Processing","Labour Law","Employee Relations","Recruitment","Excel","Leadership","Conflict Resolution","Music Theory","Guitar","Piano","Coding","Flutter","Accounting","Business Planning"];

export default function AdminSkillsPage() {
  return (
    <DashboardShell>
      <PageHeading title="Skills" description="Reusable skills can later connect to courses, learning paths, certificates, organizations, careers, and talent marketplace." />
      <Card className="flex flex-wrap gap-2">{skills.map((skill) => <Badge key={skill}>{skill}</Badge>)}</Card>
    </DashboardShell>
  );
}
