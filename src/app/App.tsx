import { useMemo } from 'react';
import { useSession } from './store';
import { getActiveQuestions } from '../data/questions';
import { ar } from '../lib/i18n/strings';
import { IntakeScreen } from '../features/intake/IntakeScreen';
import { FacilitatorIntro } from '../features/facilitator/FacilitatorIntro';
import { AssessmentScreen } from '../features/assessment/AssessmentScreen';
import { HandoffScreen } from '../features/assessment/HandoffScreen';
import { ResultsScreen } from '../features/results/ResultsScreen';

function EmptyGate() {
  return (
    <div className="card stack-sm center">
      <h2>{ar.noApprovedTitle}</h2>
      <p className="muted">{ar.noApprovedBody}</p>
    </div>
  );
}

export function App() {
  const phase = useSession((s) => s.phase);
  const reviewMode = useSession((s) => s.reviewMode);

  const hasQuestions = useMemo(() => getActiveQuestions(reviewMode).length > 0, [reviewMode]);

  const renderPhase = () => {
    if (phase === 'intake') return <IntakeScreen />;
    // Beyond intake we need an active question bank.
    if (!hasQuestions) return <EmptyGate />;
    switch (phase) {
      case 'facilitatorIntro':
        return <FacilitatorIntro />;
      case 'assessment':
        return <AssessmentScreen />;
      case 'handoff':
        return <HandoffScreen />;
      case 'results':
        return <ResultsScreen />;
      default:
        return <IntakeScreen />;
    }
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span className="brand-name">{ar.appName}</span>
          <span className="brand-sub">{ar.appTagline}</span>
        </div>
        <p className="subtitle">{ar.appSubtitle}</p>
      </header>
      <main className="container">{renderPhase()}</main>
      <footer className="app-footer">
        <p style={{ margin: 0 }}>{ar.privacyNote}</p>
      </footer>
    </div>
  );
}
