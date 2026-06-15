import type {
  Answer,
  Axis,
  AxisScore,
  DealbreakerConflict,
  Participant,
  Question,
  SessionResult,
} from '../../types';

// Pure scoring engine. No React, no I/O, no globals. Given questions + axes +
// participants, returns deterministic scores. This is the part the rest of the
// app depends on, so it is fully unit-tested.

/** Default divergence (0–1) at or above which a flagged dealbreaker becomes a conflict. */
export const DEALBREAKER_DIVERGENCE_THRESHOLD = 0.5;

export interface ScoringConfig {
  dealbreakerThreshold: number;
}

const DEFAULT_CONFIG: ScoringConfig = {
  dealbreakerThreshold: DEALBREAKER_DIVERGENCE_THRESHOLD,
};

/**
 * Normalize a raw answer value to the 0..1 range based on its question options.
 * Uses the min/max of the option values so any option set maps cleanly.
 */
export function normalizeValue(question: Question, value: number): number {
  const values = question.options.map((o) => o.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (max === min) return 0;
  const clamped = Math.min(max, Math.max(min, value));
  return (clamped - min) / (max - min);
}

function weightedMean(pairs: { weight: number; value: number }[]): number {
  const totalWeight = pairs.reduce((s, p) => s + p.weight, 0);
  if (totalWeight === 0) return 0;
  return pairs.reduce((s, p) => s + p.weight * p.value, 0) / totalWeight;
}

function indexAnswers(participant: Participant | undefined): Map<string, Answer> {
  const map = new Map<string, Answer>();
  if (!participant) return map;
  for (const a of participant.answers) map.set(a.questionId, a);
  return map;
}

/**
 * Per-axis own score (0–100) for a single participant — used for solo
 * reflection and as the A/B positions in the comparison.
 */
export function computeAxisOwnScores(
  questions: Question[],
  axes: Axis[],
  participant: Participant,
): Record<string, number> {
  const answers = indexAnswers(participant);
  const result: Record<string, number> = {};
  for (const axis of axes) {
    const axisQs = questions.filter((q) => q.axis === axis.id);
    const pairs = axisQs
      .filter((q) => answers.has(q.id))
      .map((q) => ({
        weight: q.weight,
        value: normalizeValue(q, answers.get(q.id)!.value),
      }));
    result[axis.id] = Math.round(weightedMean(pairs) * 1000) / 10;
  }
  return result;
}

/**
 * Full session result: per-axis scores + gaps, overall alignment, and any
 * dealbreaker conflicts. Pass only `a` for solo mode.
 */
export function computeSessionResult(
  questions: Question[],
  axes: Axis[],
  a: Participant,
  b?: Participant,
  config: ScoringConfig = DEFAULT_CONFIG,
): SessionResult {
  const isSolo = b === undefined;
  const answersA = indexAnswers(a);
  const answersB = indexAnswers(b);

  const ownA = computeAxisOwnScores(questions, axes, a);
  const ownB = b ? computeAxisOwnScores(questions, axes, b) : {};

  const perAxis: AxisScore[] = [];
  const axisGapWeighted: { weight: number; value: number }[] = [];

  for (const axis of axes) {
    const axisQs = questions.filter((q) => q.axis === axis.id);

    const bothPairs = axisQs
      .filter((q) => answersA.has(q.id) && answersB.has(q.id))
      .map((q) => {
        const nA = normalizeValue(q, answersA.get(q.id)!.value);
        const nB = normalizeValue(q, answersB.get(q.id)!.value);
        return { weight: q.weight, value: Math.abs(nA - nB) };
      });

    const gap = isSolo ? 0 : Math.round(weightedMean(bothPairs) * 1000) / 10;

    perAxis.push({
      axis: axis.id,
      scoreA: ownA[axis.id] ?? 0,
      scoreB: ownB[axis.id] ?? 0,
      gap,
      answeredBoth: bothPairs.length,
    });

    if (!isSolo && bothPairs.length > 0) {
      axisGapWeighted.push({ weight: axis.weight, value: gap });
    }
  }

  const overallAlignment = isSolo
    ? 0
    : Math.round((100 - weightedMean(axisGapWeighted)) * 10) / 10;

  const dealbreakerConflicts = isSolo
    ? []
    : detectDealbreakers(questions, a, b, config);

  return { perAxis, overallAlignment, dealbreakerConflicts, isSolo };
}

function detectDealbreakers(
  questions: Question[],
  a: Participant,
  b: Participant,
  config: ScoringConfig,
): DealbreakerConflict[] {
  const answersA = indexAnswers(a);
  const answersB = indexAnswers(b);
  const conflicts: DealbreakerConflict[] = [];

  for (const q of questions) {
    const ansA = answersA.get(q.id);
    const ansB = answersB.get(q.id);
    if (!ansA || !ansB) continue;

    const flaggedBy: ('a' | 'b')[] = [];
    if (ansA.flaggedDealbreaker) flaggedBy.push('a');
    if (ansB.flaggedDealbreaker) flaggedBy.push('b');
    if (flaggedBy.length === 0) continue;

    const divergence = Math.abs(normalizeValue(q, ansA.value) - normalizeValue(q, ansB.value));
    if (divergence >= config.dealbreakerThreshold) {
      conflicts.push({
        questionId: q.id,
        note: `تباين على سؤال اعتُبر شرطًا أساسيًا (نسبة الاختلاف ${Math.round(divergence * 100)}%).`,
        flaggedBy,
        valueA: ansA.value,
        valueB: ansB.value,
      });
    }
  }

  // Largest divergence first so the hardest conflicts surface at the top.
  return conflicts.sort((x, y) => {
    const dx = Math.abs(x.valueA - x.valueB);
    const dy = Math.abs(y.valueA - y.valueB);
    return dy - dx;
  });
}

/** Alignment band for color/label coding. Never relies on color alone. */
export type AlignmentBand = 'high' | 'medium' | 'low';

export function alignmentBand(value: number): AlignmentBand {
  if (value >= 75) return 'high';
  if (value >= 50) return 'medium';
  return 'low';
}

/** Axis gap band: small gap = good alignment on that axis. */
export function gapBand(gap: number): AlignmentBand {
  if (gap <= 20) return 'high';
  if (gap <= 40) return 'medium';
  return 'low';
}
