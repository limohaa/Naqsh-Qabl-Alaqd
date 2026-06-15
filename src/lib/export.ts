import type { Axis, Question, SessionMode, SessionResult } from '../types';
import { AXIS_BY_ID } from '../data/axes';

// Client-side export. Builds a Blob and triggers a download. No upload, ever.

export interface ExportPayload {
  generatedAt: string;
  mode: SessionMode;
  nameA: string;
  nameB?: string;
  result: SessionResult;
  axes: Axis[];
  questions: Question[];
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Revoke on the next tick so the download has a chance to start.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

function dateStamp(): string {
  return new Date().toISOString().slice(0, 10);
}

export function downloadJson(payload: ExportPayload): void {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json;charset=utf-8',
  });
  triggerDownload(blob, `naqsh-${dateStamp()}.json`);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function buildHtmlSheet(payload: ExportPayload): string {
  const { mode, nameA, nameB, result } = payload;
  const isSolo = result.isSolo;

  const axisRows = result.perAxis
    .map((ax) => {
      const axis = AXIS_BY_ID[ax.axis];
      const label = axis ? escapeHtml(axis.labelAr) : escapeHtml(ax.axis);
      if (isSolo) {
        return `<tr><td>${label}</td><td>${ax.scoreA}%</td></tr>`;
      }
      return `<tr><td>${label}</td><td>${ax.scoreA}%</td><td>${ax.scoreB}%</td><td>${ax.gap}%</td></tr>`;
    })
    .join('\n');

  const dealbreakers =
    result.dealbreakerConflicts.length === 0
      ? '<p>لا توجد تعارضات في الشروط الأساسية.</p>'
      : `<ul>${result.dealbreakerConflicts
          .map((c) => `<li><strong>${escapeHtml(c.questionId)}</strong> — ${escapeHtml(c.note)}</li>`)
          .join('')}</ul>`;

  const header = isSolo
    ? `<p>وضع: فردي — ${escapeHtml(nameA)}</p>`
    : `<p>وضع: ${mode === 'facilitator' ? 'بإشراف ميسّر' : 'للطرفين'} — ${escapeHtml(
        nameA,
      )} و${escapeHtml(nameB ?? '')}</p>`;

  const overall = isSolo
    ? ''
    : `<div class="overall"><span>نسبة التوافق العامة</span><strong>${result.overallAlignment}%</strong></div>`;

  const tableHead = isSolo
    ? '<tr><th>المحور</th><th>الدرجة</th></tr>'
    : '<tr><th>المحور</th><th>الطرف الأول</th><th>الطرف الثاني</th><th>التباين</th></tr>';

  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>نقش — ورقة النتائج</title>
<style>
  :root { color-scheme: light; }
  body { font-family: "IBM Plex Sans Arabic", "Segoe UI", Tahoma, sans-serif; background:#f7f4ef; color:#1c2b2b; margin:0; padding:2rem; line-height:1.8; }
  .sheet { max-inline-size: 50rem; margin-inline:auto; background:#fff; padding:2rem; border-radius:14px; box-shadow:0 1px 3px rgba(0,0,0,.08); }
  h1 { color:#0f3d3e; margin-block-start:0; }
  .overall { display:flex; justify-content:space-between; align-items:center; background:#0f3d3e; color:#fff; padding:1rem 1.25rem; border-radius:10px; margin-block:1.5rem; font-size:1.1rem; }
  .overall strong { font-size:1.6rem; }
  table { inline-size:100%; border-collapse:collapse; margin-block:1rem; }
  th, td { padding:.6rem .75rem; text-align:start; border-block-end:1px solid #e5e0d8; }
  th { background:#f0ece4; }
  .muted { color:#5d6b6b; font-size:.9rem; }
  @media print { body { background:#fff; padding:0; } .sheet { box-shadow:none; } }
</style>
</head>
<body>
  <div class="sheet">
    <h1>نقش — ورقة النتائج</h1>
    ${header}
    <p class="muted">أُنشئت في ${escapeHtml(payload.generatedAt)} — هذه الورقة وُلّدت على جهازك ولم تُرفع لأي خادم.</p>
    ${overall}
    <h2>تفصيل المحاور</h2>
    <table>
      <thead>${tableHead}</thead>
      <tbody>
${axisRows}
      </tbody>
    </table>
    <h2>نقاط حرجة للحوار</h2>
    ${dealbreakers}
    <p class="muted">نقش — أداة للتأمل والحوار قبل العقد، ولا تُغني عن المشورة والاستخارة.</p>
  </div>
</body>
</html>`;
}

export function downloadHtml(payload: ExportPayload): void {
  const blob = new Blob([buildHtmlSheet(payload)], { type: 'text/html;charset=utf-8' });
  triggerDownload(blob, `naqsh-${dateStamp()}.html`);
}
