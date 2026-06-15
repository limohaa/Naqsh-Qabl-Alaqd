import { describe, it, expect } from 'vitest';
import {
  computeSessionResult,
  computeAxisOwnScores,
  normalizeValue,
  alignmentBand,
  gapBand,
  DEALBREAKER_DIVERGENCE_THRESHOLD,
} from './engine';
import type { Axis, Participant, Question } from '../../types';

const axes: Axis[] = [
  { id: 'x', labelAr: 'محور أ', weight: 2, description: '' },
  { id: 'y', labelAr: 'محور ب', weight: 1, description: '' },
];

const likert = [
  { value: 1, labelAr: '1' },
  { value: 2, labelAr: '2' },
  { value: 3, labelAr: '3' },
  { value: 4, labelAr: '4' },
  { value: 5, labelAr: '5' },
];

const questions: Question[] = [
  {
    id: 'x1',
    axis: 'x',
    textAr: '',
    type: 'likert5',
    options: likert,
    weight: 1,
    isDealbreakerCandidate: true,
    status: 'APPROVED',
  },
  {
    id: 'x2',
    axis: 'x',
    textAr: '',
    type: 'likert5',
    options: likert,
    weight: 1,
    isDealbreakerCandidate: false,
    status: 'APPROVED',
  },
  {
    id: 'y1',
    axis: 'y',
    textAr: '',
    type: 'likert5',
    options: likert,
    weight: 1,
    isDealbreakerCandidate: false,
    status: 'APPROVED',
  },
];

function participant(id: 'a' | 'b', values: Record<string, number>, flags: string[] = []): Participant {
  return {
    id,
    answers: Object.entries(values).map(([questionId, value]) => ({
      questionId,
      value,
      flaggedDealbreaker: flags.includes(questionId),
    })),
  };
}

describe('normalizeValue', () => {
  it('maps likert 1..5 to 0..1', () => {
    const q = questions[0];
    expect(normalizeValue(q, 1)).toBe(0);
    expect(normalizeValue(q, 3)).toBe(0.5);
    expect(normalizeValue(q, 5)).toBe(1);
  });

  it('clamps out-of-range values', () => {
    const q = questions[0];
    expect(normalizeValue(q, 0)).toBe(0);
    expect(normalizeValue(q, 99)).toBe(1);
  });

  it('returns 0 when all options share one value', () => {
    const q: Question = { ...questions[0], options: [{ value: 3, labelAr: '3' }] };
    expect(normalizeValue(q, 3)).toBe(0);
  });
});

describe('computeSessionResult — alignment bounds', () => {
  it('identical answers → alignment 100, gaps 0', () => {
    const vals = { x1: 4, x2: 2, y1: 5 };
    const result = computeSessionResult(questions, axes, participant('a', vals), participant('b', vals));
    expect(result.overallAlignment).toBe(100);
    for (const ax of result.perAxis) expect(ax.gap).toBe(0);
    expect(result.dealbreakerConflicts).toHaveLength(0);
  });

  it('maximal divergence → alignment 0', () => {
    const a = participant('a', { x1: 1, x2: 1, y1: 1 });
    const b = participant('b', { x1: 5, x2: 5, y1: 5 });
    const result = computeSessionResult(questions, axes, a, b);
    expect(result.overallAlignment).toBe(0);
    for (const ax of result.perAxis) expect(ax.gap).toBe(100);
  });

  it('partial divergence yields an intermediate alignment', () => {
    const a = participant('a', { x1: 3, x2: 3, y1: 3 });
    const b = participant('b', { x1: 4, x2: 4, y1: 4 });
    const result = computeSessionResult(questions, axes, a, b);
    expect(result.overallAlignment).toBeGreaterThan(0);
    expect(result.overallAlignment).toBeLessThan(100);
    // Each pair differs by 1 step of 4 → 25% gap → 75 alignment.
    expect(result.overallAlignment).toBe(75);
  });

  it('respects axis weights in overall alignment', () => {
    // Big gap on heavy axis x, perfect on light axis y.
    const a = participant('a', { x1: 1, x2: 1, y1: 3 });
    const b = participant('b', { x1: 5, x2: 5, y1: 3 });
    const result = computeSessionResult(questions, axes, a, b);
    // axis x gap 100 (weight 2), axis y gap 0 (weight 1) → weighted gap = 200/3
    expect(result.overallAlignment).toBeCloseTo(100 - 200 / 3, 1);
  });
});

describe('dealbreaker logic', () => {
  it('surfaces a conflict when flagged and divergence beyond threshold', () => {
    const a = participant('a', { x1: 1, x2: 3, y1: 3 }, ['x1']);
    const b = participant('b', { x1: 5, x2: 3, y1: 3 });
    const result = computeSessionResult(questions, axes, a, b);
    expect(result.dealbreakerConflicts).toHaveLength(1);
    expect(result.dealbreakerConflicts[0].questionId).toBe('x1');
    expect(result.dealbreakerConflicts[0].flaggedBy).toEqual(['a']);
  });

  it('does not surface when flagged but answers agree', () => {
    const a = participant('a', { x1: 4, x2: 3, y1: 3 }, ['x1']);
    const b = participant('b', { x1: 4, x2: 3, y1: 3 }, ['x1']);
    const result = computeSessionResult(questions, axes, a, b);
    expect(result.dealbreakerConflicts).toHaveLength(0);
  });

  it('does not surface when divergent but nobody flagged it', () => {
    const a = participant('a', { x1: 1, x2: 3, y1: 3 });
    const b = participant('b', { x1: 5, x2: 3, y1: 3 });
    const result = computeSessionResult(questions, axes, a, b);
    expect(result.dealbreakerConflicts).toHaveLength(0);
  });

  it('a high overall alignment still surfaces a hard dealbreaker conflict', () => {
    // Agree on everything except one flagged, maximally divergent question.
    const a = participant('a', { x1: 1, x2: 3, y1: 3 }, ['x1']);
    const b = participant('b', { x1: 5, x2: 3, y1: 3 });
    const result = computeSessionResult(questions, axes, a, b);
    expect(result.overallAlignment).toBeGreaterThan(50); // overall still decent
    expect(result.dealbreakerConflicts.length).toBeGreaterThan(0); // but conflict not buried
  });

  it('threshold boundary is inclusive', () => {
    // Exactly 0.5 divergence (1 -> 3 on a 0..1 scale) should trigger.
    const a = participant('a', { x1: 1, x2: 3, y1: 3 }, ['x1']);
    const b = participant('b', { x1: 3, x2: 3, y1: 3 });
    const result = computeSessionResult(questions, axes, a, b);
    expect(DEALBREAKER_DIVERGENCE_THRESHOLD).toBe(0.5);
    expect(result.dealbreakerConflicts).toHaveLength(1);
  });
});

describe('solo mode', () => {
  it('produces own axis scores and no comparison data', () => {
    const a = participant('a', { x1: 5, x2: 5, y1: 1 });
    const result = computeSessionResult(questions, axes, a);
    expect(result.isSolo).toBe(true);
    expect(result.overallAlignment).toBe(0);
    expect(result.dealbreakerConflicts).toHaveLength(0);
    const x = result.perAxis.find((p) => p.axis === 'x')!;
    expect(x.scoreA).toBe(100);
    expect(x.scoreB).toBe(0);
  });

  it('computeAxisOwnScores weights intra-axis questions', () => {
    const a = participant('a', { x1: 5, x2: 1, y1: 3 });
    const scores = computeAxisOwnScores(questions, axes, a);
    // x1=1.0, x2=0.0 equal weight → 50; y1=0.5 → 50
    expect(scores.x).toBe(50);
    expect(scores.y).toBe(50);
  });
});

describe('bands', () => {
  it('alignmentBand thresholds', () => {
    expect(alignmentBand(80)).toBe('high');
    expect(alignmentBand(60)).toBe('medium');
    expect(alignmentBand(40)).toBe('low');
  });
  it('gapBand thresholds (small gap = high alignment)', () => {
    expect(gapBand(10)).toBe('high');
    expect(gapBand(30)).toBe('medium');
    expect(gapBand(50)).toBe('low');
  });
});
