import { useMemo } from 'react';
import { useSession } from '../../app/store';
import { getActiveQuestions } from '../../data/questions';
import { AXES } from '../../data/axes';
import { computeSessionResult } from '../scoring/engine';
import { ar } from '../../lib/i18n/strings';
import type { Question, SessionResult } from '../../types';

export interface ResultBundle {
  result: SessionResult;
  questions: Question[];
  nameA: string;
  nameB: string;
}

export function useResult(): ResultBundle {
  const reviewMode = useSession((s) => s.reviewMode);
  const mode = useSession((s) => s.mode);
  const getParticipant = useSession((s) => s.getParticipant);
  const nameAraw = useSession((s) => s.nameA);
  const nameBraw = useSession((s) => s.nameB);
  // Subscribe to answers so results recompute if state is restored/changed.
  const answers = useSession((s) => s.answers);

  const nameA = nameAraw || ar.defaultNameA;
  const nameB = nameBraw || ar.defaultNameB;

  return useMemo(() => {
    const questions = getActiveQuestions(reviewMode);
    const a = getParticipant('a');
    const b = mode === 'solo' ? undefined : getParticipant('b');
    const result = computeSessionResult(questions, AXES, a, b);
    return { result, questions, nameA, nameB };
    // `answers` drives recomputation; getParticipant reads current store state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewMode, mode, nameA, nameB, answers]);
}
