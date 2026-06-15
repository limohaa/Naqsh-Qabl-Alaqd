import { AXIS_BY_ID } from '../../data/axes';
import { gapBand } from '../scoring/engine';
import { ar } from '../../lib/i18n/strings';
import { BandPill } from '../../components/Badge';
import type { SessionResult } from '../../types';
import styles from './AxisBreakdown.module.css';

interface Props {
  result: SessionResult;
  nameA: string;
  nameB: string;
}

const gapLabel: Record<'high' | 'medium' | 'low', string> = {
  high: ar.legendHigh,
  medium: ar.legendMedium,
  low: ar.legendLow,
};

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className={styles.barRow}>
      <span className={styles.barLabel}>{label}</span>
      <div className={styles.barTrack}>
        <div className={styles.barFill} style={{ inlineSize: `${value}%`, background: color }} />
      </div>
      <span className={styles.barValue}>{value}%</span>
    </div>
  );
}

export function AxisBreakdown({ result, nameA, nameB }: Props) {
  return (
    <section className="stack">
      <h2>{ar.axisBreakdown}</h2>
      <div className={styles.grid}>
        {result.perAxis.map((ax) => {
          const axis = AXIS_BY_ID[ax.axis];
          const band = gapBand(ax.gap);
          const noData = !result.isSolo && ax.answeredBoth === 0;
          return (
            <div key={ax.axis} className={`card ${styles.axisCard}`}>
              <div className={styles.head}>
                <h3 style={{ margin: 0 }}>{axis?.labelAr ?? ax.axis}</h3>
                {!result.isSolo &&
                  (noData ? (
                    <span className="small muted">{ar.noGapData}</span>
                  ) : (
                    <BandPill band={band} label={gapLabel[band]} />
                  ))}
              </div>
              <p className="muted small" style={{ margin: 0 }}>
                {axis?.description}
              </p>
              <div className={styles.bars}>
                <ScoreBar label={nameA} value={ax.scoreA} color="var(--c-primary)" />
                {!result.isSolo && (
                  <ScoreBar label={nameB} value={ax.scoreB} color="var(--c-accent)" />
                )}
              </div>
              {!result.isSolo && !noData && (
                <div className={`${styles.gapNote} band-${band}`}>
                  {ar.axisGap}: {ax.gap}%
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
