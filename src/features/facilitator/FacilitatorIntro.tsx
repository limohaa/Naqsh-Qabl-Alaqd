import { useSession } from '../../app/store';
import { ar } from '../../lib/i18n/strings';

export function FacilitatorIntro() {
  const proceed = useSession((s) => s.proceedFromFacilitatorIntro);
  return (
    <div className="stack">
      <div className="card stack">
        <h2>{ar.facilitatorIntroTitle}</h2>
        <p>{ar.facilitatorIntroBody}</p>
        <ul className="muted">
          <li>اجلسا في مكان هادئ، ويُجيب كل طرف على انفراد.</li>
          <li>لا تعلّق على الإجابات أثناء الجواب؛ اترك المناقشة لمرحلة النتائج.</li>
          <li>استخدم «محاور للحوار» في النتائج لفتح نقاش متوازن.</li>
        </ul>
      </div>
      <div className="btn-row end">
        <button type="button" className="btn btn-primary" onClick={proceed}>
          {ar.continue} ←
        </button>
      </div>
    </div>
  );
}
