export type SearchableAiIndex = {
  id: string;
  title: string;
  body: string;
  visibility: "private" | "workspace" | "academy" | "organization" | "public";
  metadata?: Record<string, unknown>;
};

export type RetrievalHit = {
  indexId: string;
  title: string;
  excerpt: string;
  score: number;
  reason: string;
};

const injectionPatterns = [
  /ignore (all )?(previous|prior) instructions/i,
  /reveal (the )?(system|developer|hidden) prompt/i,
  /bypass (policy|safety|guardrails)/i,
  /act as (an )?(admin|super admin|root)/i,
  /export private data/i,
];

export function detectPromptInjection(text: string) {
  const matches = injectionPatterns.filter((pattern) => pattern.test(text)).map((pattern) => pattern.source);
  return {
    detected: matches.length > 0,
    matches,
  };
}

function terms(text: string) {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, " ")
      .split(/\s+/)
      .filter((term) => term.length > 2),
  );
}

export function retrieveContext(query: string, indexes: SearchableAiIndex[], limit = 5): RetrievalHit[] {
  const queryTerms = terms(query);
  return indexes
    .map((item) => {
      const itemTerms = terms(`${item.title} ${item.body}`);
      const overlap = [...queryTerms].filter((term) => itemTerms.has(term));
      const score = queryTerms.size ? overlap.length / queryTerms.size : 0;
      const firstMatch = overlap[0];
      const matchIndex = firstMatch ? item.body.toLowerCase().indexOf(firstMatch) : -1;
      const start = Math.max(0, matchIndex - 80);
      const excerpt = item.body.slice(start, start + 320);
      return {
        indexId: item.id,
        title: item.title,
        excerpt,
        score: Number(score.toFixed(4)),
        reason: overlap.length ? `Matched ${overlap.slice(0, 5).join(", ")}` : "No strong keyword overlap",
      };
    })
    .filter((hit) => hit.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, limit);
}

export function estimateCostMinor(inputTokens: number, outputTokens: number, inputRateMinor = 0, outputRateMinor = 0) {
  const inputCost = (inputTokens / 1000) * inputRateMinor;
  const outputCost = (outputTokens / 1000) * outputRateMinor;
  return Number((inputCost + outputCost).toFixed(4));
}
