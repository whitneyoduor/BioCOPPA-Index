import { describe, it, expect } from 'vitest';
import type { Dataset } from '../data/types';
import {
  computeIndex,
  computeWeightedScore,
  scoreToPercentage,
  scoreToIndexOutOf10,
  weightedAverage,
  peerDomainAverages,
} from './calculations';
import { MOCK_DATASETS } from '../data/datasets';

function sampleDataset(): Dataset {
  return {
    meta: { id: 'x', country: 'X', year: 2024, source: 'test', version: 't' },
    indicators: [
      { id: '1', code: 'RD-01', name: 'A', domain: 'research', section: 'Institutional Landscape & Capacity', description: '', importance: 4, performance: 3 },
      { id: '2', code: 'IN-01', name: 'B', domain: 'industry', section: 'Production & Registration', description: '', importance: 5, performance: 2 },
      { id: '3', code: 'PL-01', name: 'C', domain: 'policy', section: 'Policy Framework', description: '', importance: 5, performance: 4 },
    ],
  };
}

describe('computeWeightedScore', () => {
  it('multiplies importance by performance', () => {
    expect(computeWeightedScore(4, 3)).toBe(12);
    expect(computeWeightedScore(5, 5)).toBe(25);
    expect(computeWeightedScore(1, 1)).toBe(1);
  });
});

describe('weightedAverage', () => {
  it('returns sum(i*p)/sum(i)', () => {
    expect(weightedAverage([{ weight: 4, value: 3 }, { weight: 4, value: 3 }])).toBe(3);
    expect(weightedAverage([{ weight: 5, value: 2 }, { weight: 1, value: 4 }])).toBe(2.3333333333333335);
  });
  it('handles empty input', () => {
    expect(weightedAverage([])).toBe(0);
  });
});

describe('score conversions', () => {
  it('normalises 1-5 to 0-100', () => {
    expect(scoreToPercentage(1)).toBe(0);
    expect(scoreToPercentage(3)).toBe(50);
    expect(scoreToPercentage(5)).toBe(100);
  });
  it('normalises 1-5 to 0-10', () => {
    expect(scoreToIndexOutOf10(1)).toBe(0);
    expect(scoreToIndexOutOf10(5)).toBe(10);
    expect(scoreToIndexOutOf10(3)).toBe(5);
  });
});

describe('computeIndex', () => {
  it('computes weighted scores per indicator', () => {
    const idx = computeIndex(sampleDataset());
    const all = idx.domains.flatMap((d) => d.indicators);
    expect(all.find((i) => i.id === '1')?.weightedScore).toBe(12);
    expect(all.find((i) => i.id === '2')?.weightedScore).toBe(10);
    expect(all.find((i) => i.id === '3')?.weightedScore).toBe(20);
  });

  it('computes domain scores as weighted averages', () => {
    const idx = computeIndex(sampleDataset());
    expect(idx.domains.find((d) => d.domainId === 'research')?.score).toBe(3);
    expect(idx.domains.find((d) => d.domainId === 'industry')?.score).toBe(2);
    expect(idx.domains.find((d) => d.domainId === 'policy')?.score).toBe(4);
  });

  it('overall score is the average of the three domain scores', () => {
    const idx = computeIndex(sampleDataset());
    expect(idx.overallScore).toBe(3);
  });

  it('percentage and index are consistent', () => {
    const idx = computeIndex(sampleDataset());
    expect(idx.percentage).toBe(50);
    expect(idx.indexOutOf10).toBe(5);
  });

  it('identifies strongest and weakest indicators', () => {
    const idx = computeIndex(sampleDataset());
    expect(idx.strongestIndicators[0].id).toBe('3');
    expect(idx.weakestIndicators[0].id).toBe('2');
  });

  it('identifies top and bottom domains', () => {
    const idx = computeIndex(sampleDataset());
    expect(idx.topDomain.domainId).toBe('policy');
    expect(idx.bottomDomain.domainId).toBe('industry');
  });

  it('computes index for every mock dataset without error', () => {
    for (const ds of MOCK_DATASETS) {
      const idx = computeIndex(ds);
      expect(idx.domains).toHaveLength(3);
      expect(idx.overallScore).toBeGreaterThan(1);
      expect(idx.overallScore).toBeLessThanOrEqual(5);
    }
  });
});

describe('peerDomainAverages', () => {
  it('excludes the active dataset and averages domain scores', () => {
    const peer = computeIndex(MOCK_DATASETS[1]);
    const avgs = peerDomainAverages(MOCK_DATASETS, MOCK_DATASETS[0].meta.id);
    expect(avgs.research).toBeCloseTo(peer.domains.find((d) => d.domainId === 'research')?.score ?? 0, 2);
    expect(avgs.industry).toBeCloseTo(peer.domains.find((d) => d.domainId === 'industry')?.score ?? 0, 2);
    expect(avgs.policy).toBeCloseTo(peer.domains.find((d) => d.domainId === 'policy')?.score ?? 0, 2);
  });
});
