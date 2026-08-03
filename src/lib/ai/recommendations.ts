export type RecommendationSignal = {
  id: string;
  title: string;
  type: "course" | "skill" | "learning_path" | "live_session" | "academy" | "assessment";
  tags: string[];
  level?: "beginner" | "intermediate" | "advanced";
  mandatory?: boolean;
  dueSoon?: boolean;
  completed?: boolean;
};

export type LearnerPreference = {
  interests: string[];
  currentLevel?: "beginner" | "intermediate" | "advanced";
};

export function rankRecommendations(signals: RecommendationSignal[], preference: LearnerPreference) {
  const interestSet = new Set(preference.interests.map((interest) => interest.toLowerCase()));
  return signals
    .filter((signal) => !signal.completed)
    .map((signal) => {
      const tagScore = signal.tags.filter((tag) => interestSet.has(tag.toLowerCase())).length * 0.25;
      const levelScore = signal.level && signal.level === preference.currentLevel ? 0.2 : 0;
      const mandatoryScore = signal.mandatory ? 0.25 : 0;
      const dueScore = signal.dueSoon ? 0.2 : 0;
      const score = Math.min(1, 0.2 + tagScore + levelScore + mandatoryScore + dueScore);
      return {
        resourceId: signal.id,
        recommendationType: signal.type,
        title: signal.title,
        score: Number(score.toFixed(4)),
        reason: signal.mandatory
          ? "Recommended because it is required learning."
          : tagScore > 0
            ? "Recommended because it matches learner interests."
            : "Recommended as a useful next learning activity.",
      };
    })
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
}
