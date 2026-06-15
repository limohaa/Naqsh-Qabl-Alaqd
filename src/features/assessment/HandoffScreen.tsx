import { useSession } from '../../app/store';
import { ar } from '../../lib/i18n/strings';
import styles from './HandoffScreen.module.css';

export function HandoffScreen() {
  const nameB = useSession((s) => s.nameB);
  const proceed = useSession((s) => s.proceedAfterHandoff);
  const targetName = nameB || ar.defaultNameB;

  return (
    <div className="stack center">
      <div className={`card ${styles.card}`}>
        <div className={styles.icon} aria-hidden="true">
          🔒
        </div>
        <h2>{ar.handoffTitle}</h2>
        <p className={styles.body}>{ar.handoffBody(targetName)}</p>
        <p className="muted small">{ar.privacyNote}</p>
        <button type="button" className="btn btn-primary" onClick={proceed}>
          {ar.handoffReady} ←
        </button>
      </div>
    </div>
  );
}
