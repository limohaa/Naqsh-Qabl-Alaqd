// Shared domain types for Naqsh. Kept free of any React or runtime dependency
// so the scoring engine and data layer stay pure and portable.

export type AxisId = string;

export type SessionMode = 'solo' | 'couple' | 'facilitator';

export type QuestionType = 'likert5' | 'binary' | 'choice';

export type QuestionStatus = 'DRAFT' | 'APPROVED';

export type ParticipantId = 'a' | 'b';

export interface Axis {
  id: AxisId;
  labelAr: string;
  labelFr?: string;
  weight: number; // relative axis weight, normalized at runtime
  description: string;
}

export interface QuestionOption {
  value: number;
  labelAr: string;
}

export interface Question {
  id: string;
  axis: AxisId;
  textAr: string;
  textFr?: string;
  type: QuestionType;
  options: QuestionOption[]; // always present; generated for likert5/binary
  weight: number; // intra-axis weight
  isDealbreakerCandidate: boolean;
  status: QuestionStatus; // review gate
  /** Short rationale, used by the review document; not shown to end users. */
  rationale?: string;
}

export interface Answer {
  questionId: string;
  value: number;
  flaggedDealbreaker?: boolean;
}

export interface Participant {
  id: ParticipantId;
  displayName?: string; // optional, never required
  answers: Answer[];
}

export interface AxisScore {
  axis: AxisId;
  scoreA: number; // 0–100, participant A's own position on the axis
  scoreB: number; // 0–100, participant B's own position (0 in solo)
  gap: number; // 0–100, weighted mean per-question divergence
  /** Number of questions in this axis that both participants answered. */
  answeredBoth: number;
}

export interface DealbreakerConflict {
  questionId: string;
  note: string;
  flaggedBy: ParticipantId[];
  valueA: number;
  valueB: number;
}

export interface SessionResult {
  perAxis: AxisScore[];
  overallAlignment: number; // 0–100
  dealbreakerConflicts: DealbreakerConflict[];
  isSolo: boolean;
}
