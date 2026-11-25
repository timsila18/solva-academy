export type LaunchClass = {
  id: string;
  title: string;
  lesson_type: string;
  videoAttached: boolean;
  learning_objective?: string | null;
  learner_instructions?: string | null;
  estimated_duration_minutes?: number;
};
export type LaunchItem = {
  id: string;
  title: string;
  detail: string;
  status: "ready" | "needed" | "suggested" | "waiting";
  group: "review" | "launch" | "recommended";
  href: string;
};
export function evaluateLaunchReadiness(input: {
  course: {
    id: string;
    title: string;
    short_description: string;
    school_id?: string | null;
    level_id?: string | null;
    language?: string;
    status: string;
    visibility: string;
    certificate_available: boolean;
  };
  classes: LaunchClass[];
  priced: boolean;
  paid: boolean;
  payments: boolean;
  checks: { lessonId: string; valid: boolean; required: boolean }[];
  resources: string[];
  certificateConfigured: boolean;
  settingsHref: string;
}) {
  const { course, classes } = input;
  const root = `/courses/builder/${course.id}`;
  const items: LaunchItem[] = [];
  const add = (
    id: string,
    title: string,
    detail: string,
    status: LaunchItem["status"],
    group: LaunchItem["group"],
    href: string,
  ) => items.push({ id, title, detail, status, group, href });
  const basics =
    course.title.trim().length >= 3 &&
    course.short_description.trim().length >= 20 &&
    !!course.school_id &&
    !!course.level_id &&
    !!course.language;
  add(
    "details",
    "Course details",
    basics
      ? "Title, description, school and level are set."
      : "Add the missing course details.",
    basics ? "ready" : "needed",
    "review",
    `${root}#details`,
  );
  add(
    "classes",
    "Class outline",
    `${classes.length} ${classes.length === 1 ? "class" : "classes"}`,
    classes.length ? "ready" : "needed",
    "review",
    root,
  );
  const missingVideos = classes.filter(
    (c) => c.lesson_type === "video" && !c.videoAttached,
  );
  add(
    "videos",
    "Class videos",
    missingVideos.length
      ? `${missingVideos.length} recordings still needed.`
      : "All video classes have a recording.",
    missingVideos.length ? "needed" : "ready",
    "review",
    missingVideos[0] ? `${root}/classes/${missingVideos[0].id}` : root,
  );
  const missingOutcomes = classes.filter((c) => !c.learning_objective?.trim());
  add(
    "outcomes",
    "Learning outcomes",
    missingOutcomes.length
      ? `${missingOutcomes.length} classes need learning outcomes.`
      : "Learning outcomes are set for every class.",
    missingOutcomes.length ? "needed" : "ready",
    "review",
    missingOutcomes[0] ? `${root}/classes/${missingOutcomes[0].id}` : root,
  );
  const bad = input.checks.filter((c) => !c.valid);
  const withoutChecks = classes.filter(
    (c) => !input.checks.some((q) => q.lessonId === c.id && q.valid),
  );
  add(
    "checks",
    "Knowledge checks",
    bad.length
      ? `${bad.length} checks need a question or answer correction.`
      : withoutChecks.length
        ? `${withoutChecks.length} classes have no knowledge check.`
        : "Every class has a knowledge check.",
    bad.length
      ? "needed"
      : withoutChecks.length
        ? course.certificate_available
          ? "needed"
          : "suggested"
        : "ready",
    bad.length || course.certificate_available ? "review" : "recommended",
    bad[0]
      ? `${root}/classes/${bad[0].lessonId}`
      : withoutChecks[0]
        ? `${root}/classes/${withoutChecks[0].id}`
        : `${root}/checks`,
  );
  add(
    "pricing",
    "Pricing",
    input.priced
      ? "Current prices are set."
      : "Set a price for the course and each class offered separately.",
    input.priced ? "ready" : "needed",
    "launch",
    `${root}#details`,
  );
  add(
    "payments",
    "Payment methods",
    !input.paid
      ? "No payment is needed for the current prices."
      : input.payments
        ? "Online payments are configured. A live purchase still needs testing."
        : "Online payments are not connected.",
    !input.paid || input.payments ? "ready" : "needed",
    "launch",
    input.settingsHref,
  );
  const approved =
    course.status === "published" && course.visibility === "public";
  add(
    "publication",
    "Approval and publication",
    approved
      ? "Published and visible to learners."
      : ["submitted_review", "under_review", "approved", "scheduled"].includes(
            course.status,
          )
        ? "Waiting for review or publication."
        : "Not published yet.",
    approved ? "ready" : "waiting",
    "launch",
    `${root}#publication`,
  );
  if (course.certificate_available) {
    const ready =
      input.certificateConfigured &&
      input.checks.length > 0 &&
      input.checks.every((q) => q.required && q.valid);
    add(
      "certificate",
      "Completion certificate",
      ready
        ? "Certificate and required checks are configured."
        : "Set the pass mark, required checks and certificate settings.",
      ready ? "ready" : "needed",
      "review",
      `${root}/completion`,
    );
  }
  const noResources = classes.filter((c) => !input.resources.includes(c.id));
  add(
    "resources",
    "Class resources",
    noResources.length
      ? `${noResources.length} classes have no downloadable resources.`
      : "Resources are attached to every class.",
    noResources.length ? "suggested" : "ready",
    "recommended",
    noResources[0] ? `${root}/classes/${noResources[0].id}` : root,
  );
  const noExercises = classes.filter((c) => !c.learner_instructions?.trim());
  add(
    "exercises",
    "Practical exercises",
    noExercises.length
      ? `${noExercises.length} classes have no exercise.`
      : "Practical exercises are included.",
    noExercises.length ? "suggested" : "ready",
    "recommended",
    noExercises[0] ? `${root}/classes/${noExercises[0].id}` : root,
  );
  const noDurations = classes.filter((c) => !c.estimated_duration_minutes);
  add(
    "duration",
    "Class durations",
    noDurations.length
      ? `${noDurations.length} classes need a duration.`
      : "Class durations are set.",
    noDurations.length ? "suggested" : "ready",
    "recommended",
    noDurations[0] ? `${root}/classes/${noDurations[0].id}` : root,
  );
  return {
    items,
    readyForReview: items
      .filter((i) => i.group === "review")
      .every((i) => i.status === "ready"),
    readyForLaunch: items
      .filter((i) => i.group !== "recommended")
      .every((i) => i.status === "ready"),
    missingVideos,
    missingOutcomes,
  };
}
