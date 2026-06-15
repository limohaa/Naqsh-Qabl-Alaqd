import type { AlignmentBand } from '../features/scoring/engine';
import styles from './Badge.module.css';

export function DraftBadge({ label }: { label: string }) {
  return <span className={styles.draft}>⚠ {label}</span>;
}

const bandIcon: Record<AlignmentBand, string> = {
  high: '●',
  medium: '◐',
  low: '○',
};

export function BandPill({ band, label }: { band: AlignmentBand; label: string }) {
  return (
    <span className={`${styles.pill} bandbg-${band}`}>
      <span aria-hidden="true">{bandIcon[band]}</span>
      {label}
    </span>
  );
}
