import { useState } from 'react';
import { useSession } from '../../app/store';
import { ar } from '../../lib/i18n/strings';
import { Toggle } from '../../components/Toggle';
import type { SessionMode } from '../../types';
import styles from './IntakeScreen.module.css';

const MODES: { id: SessionMode; label: string; desc: string; icon: string }[] = [
  { id: 'solo', label: ar.modeSolo, desc: ar.modeSoloDesc, icon: '🧭' },
  { id: 'couple', label: ar.modeCouple, desc: ar.modeCoupleDesc, icon: '🤝' },
  { id: 'facilitator', label: ar.modeFacilitator, desc: ar.modeFacilitatorDesc, icon: '🕌' },
];

export function IntakeScreen() {
  const mode = useSession((s) => s.mode);
  const setMode = useSession((s) => s.setMode);
  const nameA = useSession((s) => s.nameA);
  const nameB = useSession((s) => s.nameB);
  const setName = useSession((s) => s.setName);
  const persistEnabled = useSession((s) => s.persistEnabled);
  const setPersistEnabled = useSession((s) => s.setPersistEnabled);
  const clearSaved = useSession((s) => s.clearSaved);
  const beginSession = useSession((s) => s.beginSession);
  const reviewMode = useSession((s) => s.reviewMode);

  // Default highlight = Couple, per spec.
  const [cleared, setCleared] = useState(false);
  const effectiveMode = mode ?? 'couple';
  const showSecondName = effectiveMode !== 'solo';

  const handleClear = () => {
    clearSaved();
    setCleared(true);
  };

  return (
    <div className="stack">
      {reviewMode && <div className={styles.reviewBanner}>{ar.reviewModeBanner}</div>}

      <section className="stack-sm">
        <h2>{ar.chooseMode}</h2>
        <div className={styles.modeGrid} role="radiogroup" aria-label={ar.chooseMode}>
          {MODES.map((m) => {
            const selected = effectiveMode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                role="radio"
                aria-checked={selected}
                className={`${styles.modeCard} ${selected ? styles.selected : ''}`}
                onClick={() => setMode(m.id)}
              >
                <span className={styles.modeIcon} aria-hidden="true">
                  {m.icon}
                </span>
                <span className={styles.modeLabel}>{m.label}</span>
                <span className={styles.modeDesc}>{m.desc}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="card stack">
        <h3>{ar.optionalNames}</h3>
        <div className={styles.names}>
          <div className="field">
            <label htmlFor="nameA">{effectiveMode === 'solo' ? ar.participantSelf : ar.nameA}</label>
            <input
              id="nameA"
              type="text"
              value={nameA}
              onChange={(e) => setName('a', e.target.value)}
              autoComplete="off"
              placeholder={ar.defaultNameA}
            />
          </div>
          {showSecondName && (
            <div className="field">
              <label htmlFor="nameB">{ar.nameB}</label>
              <input
                id="nameB"
                type="text"
                value={nameB}
                onChange={(e) => setName('b', e.target.value)}
                autoComplete="off"
                placeholder={ar.defaultNameB}
              />
            </div>
          )}
        </div>
      </section>

      <section className="card stack-sm">
        <div className={styles.persistRow}>
          <div>
            <h3 style={{ marginBlockEnd: '0.25rem' }}>{ar.persistTitle}</h3>
            <p className="muted small" style={{ margin: 0 }}>
              {ar.persistDesc}
            </p>
          </div>
          <Toggle
            id="persist"
            checked={persistEnabled}
            onChange={setPersistEnabled}
            label={ar.persistTitle}
          />
        </div>
        <div className="btn-row">
          <span className="small muted">{persistEnabled ? ar.persistOn : ar.persistOff}</span>
          <button type="button" className="btn btn-ghost small" onClick={handleClear}>
            {ar.clearSaved}
          </button>
          {cleared && <span className="small band-high">✓ {ar.savedCleared}</span>}
        </div>
      </section>

      <div className="btn-row end">
        <button type="button" className="btn btn-primary" onClick={beginSession}>
          {ar.start} ←
        </button>
      </div>

      <p className="muted small center">
        {ar.privacyNote} {ar.offlineReady}
      </p>
    </div>
  );
}
