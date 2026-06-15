import { useSession } from '../../app/store';
import { AXES } from '../../data/axes';
import { ar } from '../../lib/i18n/strings';
import { downloadHtml, downloadJson, type ExportPayload } from '../../lib/export';
import type { ResultBundle } from './useResult';

export function ExportPanel({ bundle }: { bundle: ResultBundle }) {
  const mode = useSession((s) => s.mode) ?? 'couple';

  const buildPayload = (): ExportPayload => ({
    generatedAt: new Date().toLocaleString('ar'),
    mode,
    nameA: bundle.nameA,
    nameB: bundle.result.isSolo ? undefined : bundle.nameB,
    result: bundle.result,
    axes: AXES,
    questions: bundle.questions,
  });

  return (
    <section className="card stack-sm">
      <h2 style={{ margin: 0 }}>{ar.exportTitle}</h2>
      <p className="muted small" style={{ margin: 0 }}>
        {ar.exportNote}
      </p>
      <div className="btn-row">
        <button type="button" className="btn btn-secondary" onClick={() => downloadHtml(buildPayload())}>
          ⬇ {ar.exportHtml}
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => downloadJson(buildPayload())}>
          ⬇ {ar.exportJson}
        </button>
      </div>
    </section>
  );
}
