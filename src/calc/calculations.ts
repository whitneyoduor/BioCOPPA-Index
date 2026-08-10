import type { Dataset, DomainId, Indicator } from '../data/types';
import { DOMAIN_BY_ID, DOMAINS } from '../data/domains';

export const MIN_SCORE = 1;
export const MAX_SCORE = 5;

export interface WeightedIndicator extends Indicator {
  /** Importance x Performance (1-25). */
  weightedScore: number;
  /** Share of the indicator's weighted score within its domain (0-1). */
  share: number;
}

export interface SectionResult {
  name: string;
  description: string;
  indicators: WeightedIndicator[];
  /** Weighted average performance of the section (1-5). */
  score: number;
  weightedScoreSum: number;
}

export interface DomainResult {
  domainId: DomainId;
  domain: (typeof DOMAINS)[number];
  indicators: WeightedIndicator[];
  sections: SectionResult[];
  /** Weighted average performance of the domain (1-5). */
  score: number;
  weightedScoreSum: number;
}

export type ReadinessLevel = 'Emerging' | 'Developing' | 'Established' | 'Advanced';

export interface IndexResult {
  datasetId: string;
  country: string;
  year: number;
  domains: DomainResult[];
  /** Average of the three domain scores (1-5). */
  overallScore: number;
  /** Normalised score on a 0-100 scale. */
  percentage: number;
  /** Normalised score on a 0-10 scale. */
  indexOutOf10: number;
  readinessLevel: ReadinessLevel;
  topDomain: DomainResult;
  bottomDomain: DomainResult;
  strongestIndicators: WeightedIndicator[];
  weakestIndicators: WeightedIndicator[];
  topSections: SectionResult[];
  bottomSections: SectionResult[];
}

const round = (n: number, dp = 2): number => {
  const f = 10 ** dp;
  return Math.round(n * f) / f;
};

/** Weighted Score = Importance x Performance. */
export function computeWeightedScore(importance: number, performance: number): number {
  return importance * performance;
}

/** Normalise a 1-5 score to a 0-100 percentage. */
export function scoreToPercentage(score: number): number {
  return round(((score - MIN_SCORE) / (MAX_SCORE - MIN_SCORE)) * 100, 1);
}

/** Normalise a 1-5 score to a 0-10 index. */
export function scoreToIndexOutOf10(score: number): number {
  return round(((score - MIN_SCORE) / (MAX_SCORE - MIN_SCORE)) * 10, 2);
}

/** Weighted average where `weight` is the importance and `value` the performance. */
export function weightedAverage(items: Array<{ weight: number; value: number }>): number {
  if (items.length === 0) return 0;
  const totalWeight = items.reduce((s, i) => s + i.weight, 0);
  if (totalWeight === 0) return 0;
  return items.reduce((s, i) => s + i.weight * i.value, 0) / totalWeight;
}

export function readinessLevelFor(score: number): ReadinessLevel {
  const pct = scoreToPercentage(score);
  if (pct < 25) return 'Emerging';
  if (pct < 50) return 'Developing';
  if (pct < 75) return 'Established';
  return 'Advanced';
}

function computeSection(sectionName: string, indicators: WeightedIndicator[]): SectionResult {
  const definition = DOMAIN_SECTION_DESCRIPTIONS[sectionName];
  return {
    name: sectionName,
    description: definition,
    indicators,
    score: round(weightedAverage(indicators.map((i) => ({ weight: i.importance, value: i.performance })))),
    weightedScoreSum: indicators.reduce((s, i) => s + i.weightedScore, 0),
  };
}

function computeDomain(domainId: DomainId, indicators: Indicator[]): DomainResult {
  const domain = DOMAIN_BY_ID[domainId];
  const totalWeight = indicators.reduce((s, i) => s + i.importance, 0) || 1;
  const weighted: WeightedIndicator[] = indicators.map((i) => ({
    ...i,
    weightedScore: computeWeightedScore(i.importance, i.performance),
    share: round((i.importance * i.performance) / totalWeight, 4),
  }));

  const sections = domain.sections
    .map((s) => computeSection(s.name, weighted.filter((i) => i.section === s.name)))
    .filter((s) => s.indicators.length > 0);

  return {
    domainId,
    domain,
    indicators: weighted,
    sections,
    score: round(weightedAverage(weighted.map((i) => ({ weight: i.importance, value: i.performance })))),
    weightedScoreSum: weighted.reduce((s, i) => s + i.weightedScore, 0),
  };
}

const DOMAIN_SECTION_DESCRIPTIONS: Record<string, string> = {};
DOMAINS.forEach((d) => d.sections.forEach((s) => (DOMAIN_SECTION_DESCRIPTIONS[s.name] = s.description)));

/**
 * Compute the full BioCOPPA Index for a dataset.
 *
 *  - Weighted Score per indicator      = Importance x Performance
 *  - Domain Score                      = Sum(Importance x Performance) / Sum(Importance)
 *  - Overall BioCOPPA Score            = Average of the three domain scores
 *  - Percentage (0-100) & Index (0-10) = normalised from the 1-5 scale
 */
export function computeIndex(dataset: Dataset): IndexResult {
  const domains: DomainResult[] = DOMAINS.map((d) =>
    computeDomain(d.id, dataset.indicators.filter((i) => i.domain === d.id)),
  );

  const overallScore = weightedAverage(
    domains.map((d) => ({ weight: 1, value: d.score })),
  );

  const allWeighted = domains.flatMap((d) => d.indicators);
  const sorted = [...allWeighted].sort((a, b) => b.weightedScore - a.weightedScore);
  const strongestIndicators = sorted.slice(0, 3);
  const weakestIndicators = [...sorted].sort((a, b) => a.weightedScore - b.weightedScore).slice(0, 3);

  const allSections = domains.flatMap((d) => d.sections).filter((s) => s.indicators.length > 0);
  const sortedSections = [...allSections].sort((a, b) => b.score - a.score);

  const sortedDomains = [...domains].sort((a, b) => b.score - a.score);

  return {
    datasetId: dataset.meta.id,
    country: dataset.meta.country,
    year: dataset.meta.year,
    domains,
    overallScore: round(overallScore),
    percentage: scoreToPercentage(overallScore),
    indexOutOf10: scoreToIndexOutOf10(overallScore),
    readinessLevel: readinessLevelFor(overallScore),
    topDomain: sortedDomains[0],
    bottomDomain: sortedDomains[sortedDomains.length - 1],
    strongestIndicators,
    weakestIndicators,
    topSections: sortedSections.slice(0, 3),
    bottomSections: sortedSections.slice(-3).reverse(),
  };
}

/** Average domain scores across peer datasets, used for benchmark comparisons. */
export function peerDomainAverages(datasets: Dataset[], excludeId?: string): Record<DomainId, number> {
  const peers = datasets.filter((d) => d.meta.id !== excludeId);
  const result = {} as Record<DomainId, number>;
  DOMAINS.forEach((d) => {
    const values = peers.map((ds) => computeIndex(ds).domains.find((x) => x.domainId === d.id)?.score ?? 0);
    result[d.id] = values.length ? round(values.reduce((s, v) => s + v, 0) / values.length) : 0;
  });
  return result;
}

export interface Recommendation {
  id: string;
  domainId: DomainId;
  code?: string;
  title: string;
  detail: string;
  priority: 'high' | 'medium';
}

/** Auto-generated, data-driven recommendations for the report. */
export function generateRecommendations(index: IndexResult): Recommendation[] {
  const recs: Recommendation[] = [];

  index.weakestIndicators.forEach((i) => {
    const gap = i.importance - i.performance;
    recs.push({
      id: `rec-${i.code}`,
      domainId: i.domain,
      code: i.code,
      title: `Strengthen "${i.name}"`,
      detail: `Performance (${i.performance}/5) trails importance (${i.importance}/5) by ${gap} point${gap === 1 ? '' : 's'}; weighted score ${i.weightedScore}/25.`,
      priority: gap >= 2 ? 'high' : 'medium',
    });
  });

  const sortedDomains = [...index.domains].sort((a, b) => a.score - b.score);
  const weakestDomain = sortedDomains[0];
  recs.push({
    id: 'rec-domain',
    domainId: weakestDomain.domainId,
    title: `Prioritise the ${weakestDomain.domain.label}`,
    detail: `This is the lowest-scoring domain at ${weakestDomain.score.toFixed(2)}/5 (${scoreToPercentage(weakestDomain.score)}% readiness). Invest in its weakest sections to lift the overall index.`,
    priority: 'high',
  });

  recs.push({
    id: 'rec-strong',
    domainId: index.topDomain.domainId,
    title: `Build on strengths in ${index.topDomain.domain.label}`,
    detail: `This top domain (${index.topDomain.score.toFixed(2)}/5) is a model for others. Replicate its approaches across the remaining domains.`,
    priority: 'medium',
  });

  return recs;
}
