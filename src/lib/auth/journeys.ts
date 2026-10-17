export const accountJourneys = [
  { id: "learner", label: "Learner", description: "Take courses and build your skills.", destination: "/learner" },
  { id: "instructor", label: "Instructor", description: "Apply to teach your own courses.", destination: "/instructors/apply" },
  { id: "academy", label: "Academy owner", description: "Start an academy and bring your courses together.", destination: "/academies/start" },
  { id: "organization", label: "Employer or organization", description: "Arrange learning for your team.", destination: "/organizations/create" },
  { id: "parent", label: "Parent or guardian", description: "Find learning for your family.", destination: "/welcome" },
] as const;

export function journeyDestination(value: unknown) {
  return accountJourneys.find((journey) => journey.id === value)?.destination ?? "/welcome";
}

export function safeReturnPath(value: unknown, fallback = "/welcome") {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || /[\\\r\n]/.test(value)) return fallback;
  try {
    const url = new URL(value, "https://academy.solvaone.co.ke");
    if (url.origin !== "https://academy.solvaone.co.ke") return fallback;
    if (!/^\/(welcome|learner|learn|checkout|courses|academies\/start|instructors\/apply|organizations\/create|academy|organization|instructor|admin|settings)(\/|$)/.test(url.pathname)) return fallback;
    return `${url.pathname}${url.search}`;
  } catch { return fallback; }
}
