import { create } from 'zustand';
import type { Answer, ParticipantId, Participant, SessionMode } from '../types';
import {
  isPersistEnabled,
  setPersistEnabled as persistPref,
  saveSession,
  loadSession,
  clearSession,
  clearAll,
} from '../lib/storage';

export type Phase = 'intake' | 'facilitatorIntro' | 'assessment' | 'handoff' | 'results';

type AnswerMap = Record<string, Answer>;

interface PersistedSnapshot {
  mode: SessionMode | null;
  phase: Phase;
  currentParticipant: ParticipantId;
  nameA: string;
  nameB: string;
  answers: Record<ParticipantId, AnswerMap>;
}

interface SessionState {
  reviewMode: boolean;
  persistEnabled: boolean;

  mode: SessionMode | null;
  phase: Phase;
  currentParticipant: ParticipantId;
  nameA: string;
  nameB: string;
  answers: Record<ParticipantId, AnswerMap>;

  // intake
  setReviewMode: (v: boolean) => void;
  setMode: (m: SessionMode) => void;
  setName: (id: ParticipantId, name: string) => void;
  setPersistEnabled: (v: boolean) => void;
  clearSaved: () => void;

  // flow
  beginSession: () => void;
  proceedFromFacilitatorIntro: () => void;
  recordAnswer: (questionId: string, value: number) => void;
  toggleDealbreaker: (questionId: string) => void;
  finishParticipant: () => void;
  proceedAfterHandoff: () => void;
  reset: () => void;

  // selectors
  getParticipant: (id: ParticipantId) => Participant;
  restore: () => void;
}

const emptyAnswers = (): Record<ParticipantId, AnswerMap> => ({ a: {}, b: {} });

function snapshot(s: SessionState): PersistedSnapshot {
  return {
    mode: s.mode,
    phase: s.phase,
    currentParticipant: s.currentParticipant,
    nameA: s.nameA,
    nameB: s.nameB,
    answers: s.answers,
  };
}

export const useSession = create<SessionState>((set, get) => {
  const persistNow = () => {
    const s = get();
    if (s.persistEnabled) saveSession(snapshot(s));
  };

  return {
    reviewMode: false,
    persistEnabled: isPersistEnabled(),

    mode: null,
    phase: 'intake',
    currentParticipant: 'a',
    nameA: '',
    nameB: '',
    answers: emptyAnswers(),

    setReviewMode: (v) => set({ reviewMode: v }),

    setMode: (m) => set({ mode: m }),

    setName: (id, name) => {
      set(id === 'a' ? { nameA: name } : { nameB: name });
      persistNow();
    },

    setPersistEnabled: (v) => {
      persistPref(v);
      set({ persistEnabled: v });
      if (v) persistNow();
    },

    clearSaved: () => {
      clearSession();
    },

    beginSession: () => {
      // Default highlight on the intake screen is Couple; honor it if untouched.
      const mode: SessionMode = get().mode ?? 'couple';
      const phase: Phase = mode === 'facilitator' ? 'facilitatorIntro' : 'assessment';
      set({ mode, phase, currentParticipant: 'a' });
      persistNow();
    },

    proceedFromFacilitatorIntro: () => {
      set({ phase: 'assessment', currentParticipant: 'a' });
      persistNow();
    },

    recordAnswer: (questionId, value) => {
      const { currentParticipant, answers } = get();
      const prev = answers[currentParticipant][questionId];
      const updated: Answer = {
        questionId,
        value,
        flaggedDealbreaker: prev?.flaggedDealbreaker ?? false,
      };
      set({
        answers: {
          ...answers,
          [currentParticipant]: { ...answers[currentParticipant], [questionId]: updated },
        },
      });
      persistNow();
    },

    toggleDealbreaker: (questionId) => {
      const { currentParticipant, answers } = get();
      const prev = answers[currentParticipant][questionId];
      if (!prev) return; // can only flag an answered question
      const updated: Answer = { ...prev, flaggedDealbreaker: !prev.flaggedDealbreaker };
      set({
        answers: {
          ...answers,
          [currentParticipant]: { ...answers[currentParticipant], [questionId]: updated },
        },
      });
      persistNow();
    },

    finishParticipant: () => {
      const { mode, currentParticipant } = get();
      if (mode === 'solo') {
        set({ phase: 'results' });
      } else if (currentParticipant === 'a') {
        set({ phase: 'handoff' });
      } else {
        set({ phase: 'results' });
      }
      persistNow();
    },

    proceedAfterHandoff: () => {
      set({ phase: 'assessment', currentParticipant: 'b' });
      persistNow();
    },

    reset: () => {
      clearSession();
      set({
        mode: null,
        phase: 'intake',
        currentParticipant: 'a',
        nameA: '',
        nameB: '',
        answers: emptyAnswers(),
      });
    },

    getParticipant: (id) => {
      const { answers, nameA, nameB } = get();
      return {
        id,
        displayName: id === 'a' ? nameA || undefined : nameB || undefined,
        answers: Object.values(answers[id]),
      };
    },

    restore: () => {
      const saved = loadSession<PersistedSnapshot>();
      if (!saved) return;
      set({
        mode: saved.mode,
        phase: saved.phase,
        currentParticipant: saved.currentParticipant,
        nameA: saved.nameA,
        nameB: saved.nameB,
        answers: saved.answers ?? emptyAnswers(),
      });
    },
  };
});

export { clearAll };
