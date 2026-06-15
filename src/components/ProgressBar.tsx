import styles from './ProgressBar.module.css';

interface Props {
  current: number; // 1-based
  total: number;
  label: string;
}

export function ProgressBar({ current, total, label }: Props) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div className={styles.wrap}>
      <div className={styles.row}>
        <span>{label}</span>
        <span>
          {current} / {total}
        </span>
      </div>
      <div
        className={styles.track}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={current}
      >
        <div className={styles.fill} style={{ inlineSize: `${pct}%` }} />
      </div>
    </div>
  );
}
