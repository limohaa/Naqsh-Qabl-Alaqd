import { useSession } from '../../app/store';
import { ar } from '../../lib/i18n/strings';
import { alignmentBand } from '../scoring/engine';
import { useResult } from './useResult';
import { RadarPanel } from './RadarPanel';
import { AxisBreakdown } from './AxisBreakdown';
import { Dealbreakers } from './Dealbreakers';
import { FacilitatorComparison } from './FacilitatorComparison';
import { ExportPanel } from './ExportPanel';
import styles from './ResultsScreen.module.css';

function Legend() {
  return (
    <div className={styles.legend} aria-label={ar.axisGap}>
      <span className="bandbg-high" style={{ borderRadius: 999, padding: '0.2rem 0.6rem' }}>
        ● {ar.legendHigh}
      </span>
      <span className="bandbg-medium" style={{ borderRadius: 999, padding: '0.2rem 0.6rem' }}>
        ◐ {ar.legendMedium}
      </span>
      <span className="bandbg-low" style={{ borderRadius: 999, padding: '0.2rem 0.6rem' }}>
        ○ {ar.legendLow}
      </span>
    </div>
  );
}

export function ResultsScreen() {
  const bundle = useResult();
  const { result, nameA, nameB } = bundle;
  const mode = useSession((s) => s.mode);
  const reset = useSession((s) => s.reset);

  const isFacilitator = mode === 'facilitator';
  const band = alignmentBand(result.overallAlignment);

  const handleRestart = () => {
    if (window.confirm(ar.restartConfirm)) reset();
  };

  return (
    <div className="stack">
      <div className={styles.titleRow}>
        <h1 style={{ margin: 0 }}>{result.isSolo ? ar.soloResultsTitle : ar.resultsTitle}</h1>
        <Legend />
      </div>

      {result.isSolo ? (
        <p className="muted">{ar.soloResultsNote}</p>
      ) : (
        <div className={`${styles.overall} bandbg-${band}`}>
          <span>{ar.overallAlignment}</span>
          <strong>{result.overallAlignment}%</strong>
        </div>
      )}

      <RadarPanel result={result} nameA={nameA} nameB={nameB} />

      {!result.isSolo && (
        <Dealbreakers result={result} questions={bundle.questions} nameA={nameA} nameB={nameB} />
      )}

      {isFacilitator && !result.isSolo && <FacilitatorComparison result={result} />}

      <AxisBreakdown result={result} nameA={nameA} nameB={nameB} />

      <ExportPanel bundle={bundle} />

      <div className="btn-row end">
        <button type="button" className="btn btn-secondary" onClick={handleRestart}>
          {ar.restart}
        </button>
      </div>
    </div>
  );
}
