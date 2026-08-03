export type RubricCriterion = {
  name: string;
  weight: number;
};

export function validateRubricWeights(criteria: RubricCriterion[], expectedTotal = 100) {
  const total = criteria.reduce((sum, criterion) => sum + criterion.weight, 0);
  return {
    valid: Math.abs(total - expectedTotal) < 0.001,
    total,
    expectedTotal,
  };
}
