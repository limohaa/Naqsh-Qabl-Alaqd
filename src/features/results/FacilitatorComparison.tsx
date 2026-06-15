import { AXIS_BY_ID } from '../../data/axes';
import { ar } from '../../lib/i18n/strings';
import { gapBand } from '../scoring/engine';
import { BandPill } from '../../components/Badge';
import type { SessionResult } from '../../types';
import styles from './FacilitatorComparison.module.css';

interface Props {
  result: SessionResult;
}

const gapLabel: Record<'high' | 'medium' | 'low', string> = {
  high: ar.legendHigh,
  medium: ar.legendMedium,
  low: ar.legendLow,
};

/**
 * Facilitator-oriented view: surfaces the largest gaps first with a neutral
 * talking-point prompt per high-gap axis, designed to be read aloud.
 */
export function FacilitatorComparison({ result }: Props) {
  const ranked = [...result.perAxis]
    .filter((a) => a.answeredBoth > 0)
    .sort((a, b) => b.gap - a.gap);

  return (
    <section className="stack-sm">
      <h2>{ar.talkingPoints}</h2>
      <ol className={styles.list}>
        {ranked.map((ax) => {
          const axis = AXIS_BY_ID[ax.axis];
          const band = gapBand(ax.gap);
          return (
            <li key={ax.axis} className={`card ${styles.item}`}>
              <div className={styles.head}>
                <strong>{axis?.labelAr ?? ax.axis}</strong>
                <BandPill band={band} label={gapLabel[band]} />
              </div>
              {band !== 'high' && (
                <p className="small" style={{ margin: 0 }}>
                  {ar.highGapPrompt(axis?.labelAr ?? ax.axis)}
                </p>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
