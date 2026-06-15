import { describe, it, expect, beforeEach } from 'vitest';
import { useSession } from './store';

// Reset the store to a clean slate before each test. `reset` returns to intake.
beforeEach(() => {
  useSession.getState().reset();
});

describe('session flow — couple', () => {
  it('intake → assessment(a) → handoff → assessment(b) → results', () => {
    const s = () => useSession.getState();
    s().setMode('couple');
    s().beginSession();
    expect(s().phase).toBe('assessment');
    expect(s().currentParticipant).toBe('a');

    s().finishParticipant();
    expect(s().phase).toBe('handoff');

    s().proceedAfterHandoff();
    expect(s().phase).toBe('assessment');
    expect(s().currentParticipant).toBe('b');

    s().finishParticipant();
    expect(s().phase).toBe('results');
  });

  it('defaults an untouched mode to couple', () => {
    const s = () => useSession.getState();
    s().beginSession();
    expect(s().mode).toBe('couple');
    expect(s().phase).toBe('assessment');
  });
});

describe('session flow — solo', () => {
  it('skips handoff and goes straight to results', () => {
    const s = () => useSession.getState();
    s().setMode('solo');
    s().beginSession();
    expect(s().phase).toBe('assessment');
    s().finishParticipant();
    expect(s().phase).toBe('results');
  });
});

describe('session flow — facilitator', () => {
  it('shows the facilitator intro before the first assessment', () => {
    const s = () => useSession.getState();
    s().setMode('facilitator');
    s().beginSession();
    expect(s().phase).toBe('facilitatorIntro');
    s().proceedFromFacilitatorIntro();
    expect(s().phase).toBe('assessment');
    expect(s().currentParticipant).toBe('a');
  });
});

describe('answers + dealbreaker flag', () => {
  it('records answers per participant and toggles the flag', () => {
    const s = () => useSession.getState();
    s().setMode('couple');
    s().beginSession();
    s().recordAnswer('q1', 4);
    expect(s().answers.a.q1.value).toBe(4);
    expect(s().answers.a.q1.flaggedDealbreaker).toBe(false);

    s().toggleDealbreaker('q1');
    expect(s().answers.a.q1.flaggedDealbreaker).toBe(true);

    // Participant B answers are tracked separately.
    s().finishParticipant();
    s().proceedAfterHandoff();
    s().recordAnswer('q1', 2);
    expect(s().answers.b.q1.value).toBe(2);
    expect(s().answers.a.q1.value).toBe(4); // A untouched
  });

  it('cannot flag an unanswered question', () => {
    const s = () => useSession.getState();
    s().toggleDealbreaker('ghost');
    expect(s().answers.a.ghost).toBeUndefined();
  });

  it('getParticipant returns answers as an array', () => {
    const s = () => useSession.getState();
    s().recordAnswer('q1', 3);
    s().recordAnswer('q2', 5);
    const p = s().getParticipant('a');
    expect(p.answers).toHaveLength(2);
    expect(p.answers.map((a) => a.questionId).sort()).toEqual(['q1', 'q2']);
  });
});
