import type { Question } from '../../types';
import { ar } from '../../lib/i18n/strings';
import { DraftBadge } from '../../components/Badge';
import styles from './QuestionCard.module.css';

interface Props {
  question: Question;
  index: number;
  total: number;
  selectedValue: number | undefined;
  flagged: boolean;
  onSelect: (value: number) => void;
  onToggleFlag: () => void;
}

export function QuestionCard({
  question,
  index,
  total,
  selectedValue,
  flagged,
  onSelect,
  onToggleFlag,
}: Props) {
  const answered = selectedValue !== undefined;
  return (
    <div className={`card ${styles.card}`}>
      <div className={styles.meta}>
        <span className="small muted">
          {ar.question} {index + 1} {ar.of} {total}
        </span>
        {question.status === 'DRAFT' && <DraftBadge label={ar.draftBadge} />}
      </div>

      <h2 className={styles.text}>{question.textAr}</h2>

      <div className={styles.options} role="radiogroup" aria-label={question.textAr}>
        {question.options.map((opt) => {
          const selected = selectedValue === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={selected}
              className={`${styles.option} ${selected ? styles.optionSelected : ''}`}
              onClick={() => onSelect(opt.value)}
            >
              <span className={styles.radio} aria-hidden="true" />
              <span>{opt.labelAr}</span>
            </button>
          );
        })}
      </div>

      {question.isDealbreakerCandidate && (
        <div className={styles.flagRow}>
          <label className={styles.flagLabel}>
            <input
              type="checkbox"
              checked={flagged}
              disabled={!answered}
              onChange={onToggleFlag}
            />
            <span>{ar.flagDealbreaker}</span>
          </label>
          <p className="muted small" style={{ margin: 0 }}>
            {ar.flagDealbreakerHint}
          </p>
        </div>
      )}
    </div>
  );
}
