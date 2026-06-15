import { useMemo, useState } from 'react';
import { useSession } from '../../app/store';
import { getActiveQuestions } from '../../data/questions';
import { ar } from '../../lib/i18n/strings';
import { ProgressBar } from '../../components/ProgressBar';
import { QuestionCard } from './QuestionCard';

export function AssessmentScreen() {
  const reviewMode = useSession((s) => s.reviewMode);
  const currentParticipant = useSession((s) => s.currentParticipant);
  const answers = useSession((s) => s.answers);
  const recordAnswer = useSession((s) => s.recordAnswer);
  const toggleDealbreaker = useSession((s) => s.toggleDealbreaker);
  const finishParticipant = useSession((s) => s.finishParticipant);
  const nameA = useSession((s) => s.nameA);
  const nameB = useSession((s) => s.nameB);

  const questions = useMemo(() => getActiveQuestions(reviewMode), [reviewMode]);
  const [index, setIndex] = useState(0);

  const participantName =
    currentParticipant === 'a'
      ? nameA || ar.defaultNameA
      : nameB || ar.defaultNameB;

  const q = questions[index];
  const current = answers[currentParticipant][q.id];
  const selectedValue = current?.value;
  const flagged = current?.flaggedDealbreaker ?? false;
  const isLast = index === questions.length - 1;
  const answered = selectedValue !== undefined;

  const goNext = () => {
    if (!answered) return;
    if (isLast) {
      finishParticipant();
    } else {
      setIndex((i) => i + 1);
    }
  };

  const goPrev = () => setIndex((i) => Math.max(0, i - 1));

  return (
    <div className="stack">
      <div className="stack-sm">
        <h2 style={{ margin: 0 }}>{ar.assessmentForA(participantName)}</h2>
        <ProgressBar current={index + 1} total={questions.length} label={ar.progress} />
      </div>

      <QuestionCard
        key={q.id}
        question={q}
        index={index}
        total={questions.length}
        selectedValue={selectedValue}
        flagged={flagged}
        onSelect={(v) => recordAnswer(q.id, v)}
        onToggleFlag={() => toggleDealbreaker(q.id)}
      />

      {!answered && <p className="muted small center">{ar.answerRequired}</p>}

      <div className="btn-row between">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={goPrev}
          disabled={index === 0}
        >
          → {ar.previous}
        </button>
        <button type="button" className="btn btn-primary" onClick={goNext} disabled={!answered}>
          {isLast ? ar.finish : ar.next} ←
        </button>
      </div>
    </div>
  );
}
