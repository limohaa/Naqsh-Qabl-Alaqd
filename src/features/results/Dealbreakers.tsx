import { ar } from '../../lib/i18n/strings';
import type { Question, SessionResult } from '../../types';
import styles from './Dealbreakers.module.css';

interface Props {
  result: SessionResult;
  questions: Question[];
  nameA: string;
  nameB: string;
}

export function Dealbreakers({ result, questions, nameA, nameB }: Props) {
  const byId = new Map(questions.map((q) => [q.id, q]));
  const conflicts = result.dealbreakerConflicts;

  return (
    <section className="stack-sm">
      <h2>{ar.dealbreakers}</h2>
      {conflicts.length === 0 ? (
        <div className={`card ${styles.empty}`}>
          <span aria-hidden="true">✓</span> {ar.noDealbreakers}
        </div>
      ) : (
        <ul className={styles.list}>
          {conflicts.map((c) => {
            const q = byId.get(c.questionId);
            const flaggedNames = c.flaggedBy
              .map((p) => (p === 'a' ? nameA : nameB))
              .join('، ');
            return (
              <li key={c.questionId} className={`card ${styles.item}`}>
                <div className={styles.itemHead} aria-hidden="true">
                  ⚠
                </div>
                <div className="stack-sm">
                  <strong>{q?.textAr ?? c.questionId}</strong>
                  <span className="small muted">
                    {ar.dealbreakerFlaggedBy}: {flaggedNames}
                  </span>
                  <span className="small">{c.note}</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
