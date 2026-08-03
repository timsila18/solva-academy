export type SolvaSchool = {
  name: string;
  slug: string;
  description: string;
  categories: string[];
  skills: string[];
  paths: string[];
  outcomes: string[];
};

export const solvaSchools: SolvaSchool[] = [
  {
    name: "Human Resources",
    slug: "human-resources",
    description: "Kenyan-first people operations, payroll, labour law, employee relations, and workplace compliance.",
    categories: ["Payroll", "Labour Law", "Recruitment", "Employee Relations", "Performance Management"],
    skills: ["Payroll Processing", "PAYE", "NSSF", "SHIF", "Employee Relations", "HR Reporting"],
    paths: ["Payroll Officer Path", "HR Officer Path", "HR Manager Path"],
    outcomes: ["Prepare compliant payroll records", "Handle core HR operations", "Support workplace policy implementation"],
  },
  {
    name: "Business and Entrepreneurship",
    slug: "business-and-entrepreneurship",
    description: "Practical business building for SMEs, creators, founders, managers, and growing teams.",
    categories: ["Business Planning", "Sales", "Operations", "Customer Service", "SME Finance"],
    skills: ["Business Planning", "Pricing", "Customer Discovery", "Sales Pipeline", "Operations Design"],
    paths: ["SME Founder Path", "Business Manager Path", "Sales Operator Path"],
    outcomes: ["Build usable business plans", "Run simple operating systems", "Understand customers and revenue"],
  },
  {
    name: "Technology and AI",
    slug: "technology-and-ai",
    description: "Digital skills, software foundations, AI literacy, automation, and practical technology for work.",
    categories: ["Coding", "AI Literacy", "Data", "Automation", "Digital Productivity"],
    skills: ["Coding", "Flutter", "Prompting", "Data Analysis", "Excel", "Automation"],
    paths: ["Junior Developer Path", "AI for Work Path", "Digital Operations Path"],
    outcomes: ["Build practical digital tools", "Use AI responsibly at work", "Automate repeatable tasks"],
  },
  {
    name: "Academic Tutoring",
    slug: "academic-tutoring",
    description: "Structured academic support for school learners, exam preparation, and parent-supervised learning.",
    categories: ["Mathematics", "Languages", "Science", "Exam Preparation", "Study Skills"],
    skills: ["Problem Solving", "Reading", "Writing", "Study Planning", "Exam Technique"],
    paths: ["CBC Support Path", "Exam Readiness Path", "Study Skills Path"],
    outcomes: ["Improve school performance", "Build study confidence", "Prepare for exams safely"],
  },
  {
    name: "Music",
    slug: "music",
    description: "Instrument, voice, music theory, performance, and creative practice for children and adults.",
    categories: ["Instruments", "Voice", "Music Theory", "Performance", "Children's Music"],
    skills: ["Music Theory", "Guitar", "Piano", "Voice", "Rhythm", "Performance"],
    paths: ["Beginner Piano Path", "Guitar Foundations Path", "Children's Music Path"],
    outcomes: ["Build consistent practice", "Understand musical foundations", "Prepare for performance"],
  },
  {
    name: "Dance",
    slug: "dance",
    description: "Dance foundations, choreography, performance preparation, wellness, and creative movement.",
    categories: ["Foundations", "Choreography", "Fitness", "Performance", "Children's Dance"],
    skills: ["Coordination", "Rhythm", "Choreography", "Stage Confidence", "Movement Safety"],
    paths: ["Beginner Dance Path", "Performance Readiness Path", "Children's Dance Path"],
    outcomes: ["Build movement confidence", "Learn structured choreography", "Prepare safely for performance"],
  },
];

export const contentTypes = [
  {
    name: "Single Courses",
    description: "Focused learning units with outcomes, modules, assessments, completion rules, and certificate settings.",
  },
  {
    name: "Learning Paths",
    description: "Ordered course bundles for a role, skill, onboarding journey, compliance need, or academy programme.",
  },
  {
    name: "Professional Certificates",
    description: "Reviewed programmes that combine courses, projects, assessments, and certificate verification.",
  },
  {
    name: "Practical Projects",
    description: "Hands-on work products that prove skill application, such as payroll files, business plans, or portfolios.",
  },
  {
    name: "Live Classes",
    description: "Scheduled Solco-powered learning sessions for tutoring, cohorts, coaching, and organization training.",
  },
  {
    name: "Internal Training",
    description: "Private organization learning for onboarding, compliance, teams, departments, and employee transcripts.",
  },
];

export const learnerJourneys = [
  {
    name: "Explore",
    description: "Browse schools, academies, instructors, skills, and upcoming learning paths before committing.",
  },
  {
    name: "Enroll",
    description: "Join a course, path, academy programme, live class, or organization assignment with clear requirements.",
  },
  {
    name: "Practice",
    description: "Complete lessons, assignments, quizzes, projects, discussions, and live learning activities.",
  },
  {
    name: "Prove",
    description: "Earn certificates, badges, transcripts, skill evidence, and shareable verification records.",
  },
  {
    name: "Progress",
    description: "Move into advanced paths, academy programmes, employer learning, tutoring, or income opportunities.",
  },
];

export const enterpriseLearningStructure = [
  {
    name: "Role Paths",
    description: "Structured learning for HR Officers, Payroll Officers, Supervisors, Managers, ICT Officers, and custom roles.",
  },
  {
    name: "Compliance Paths",
    description: "Mandatory training with due dates, renewals, risk levels, certificate monitoring, and audit records.",
  },
  {
    name: "Onboarding Paths",
    description: "New employee, intern, volunteer, contractor, graduate trainee, and department onboarding journeys.",
  },
  {
    name: "Skill Frameworks",
    description: "Required, desired, department, role, and employee skills connected to assignments and transcripts.",
  },
];

export const coreSkills = Array.from(
  new Set(solvaSchools.flatMap((school) => school.skills).concat([
    "Leadership",
    "Conflict Resolution",
    "Accounting",
    "Business Communication",
    "Customer Service",
    "Data Protection",
    "Cyber Security",
    "First Aid",
  ])),
).sort();

export function findSchoolBySlug(slug: string) {
  return solvaSchools.find((school) => school.slug === slug);
}
