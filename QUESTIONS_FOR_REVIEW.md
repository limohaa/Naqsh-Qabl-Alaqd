# Naqsh — Question Bank for Owner Review

**Status:** All questions below ship as `status: 'DRAFT'`. They are **excluded from
the production build** and only render when the app is opened with `?review=1`.

**How to approve:** review each item, then in `src/data/questions.ts` change the
question's `status` from `'DRAFT'` to `'APPROVED'`. Only `APPROVED` questions enter
the production scoring path. You may also edit text, weights, options, axis
assignment, and the `isDealbreakerCandidate` flag before approving.

**Context:** Moroccan Muslim pre-aqd. Questions are descriptive ("how important is X
to you"), never prescriptive fiqh rulings. English glosses are for the reviewer only
and are not shown to users.

**Legend:**
- **Type:** `likert5` (5-point scale), `binary` (yes/no), `choice` (multiple options).
- **Weight:** intra-axis relative weight.
- **DB?:** dealbreaker-candidate — user may flag it; a flagged + divergent answer
  surfaces as a conflict regardless of overall score.

Axis weights (relative, normalized at runtime) live in `src/data/axes.ts`:
deen 5 · family 4 · finance 4 · children 4 · communication 4 · roles 3 ·
lifestyle 2 · mobility 2.

---

## المحور: الدين والممارسة (deen) — *Faith & practice*

| ID | Type | Weight | DB? | السؤال (AR) | EN gloss | Rationale |
|----|------|--------|-----|-------------|----------|-----------|
| deen-01 | likert5 (importance) | 2 | ✅ | ما مدى أهمية التزام شريك حياتك بالصلوات الخمس في وقتها؟ | How important is it that your spouse observes the five daily prayers on time? | Practical observance is a core marker of religious compatibility. |
| deen-02 | likert5 (agreement) | 2 | ✅ | إلى أي حد ترغب أن يكون الدين هو المرجع الأول في قرارات الأسرة الكبرى؟ | To what extent should religion be the primary reference for major family decisions? | Measures the place of religious reference in decisions, no fiqh detail. |
| deen-03 | likert5 (importance) | 1 | ❌ | ما مدى أهمية أن تشاركا معًا في طلب العلم الشرعي أو حضور الدروس؟ | How important is it to seek religious knowledge / attend lessons together? | Shared religious growth is a closeness factor. |
| deen-04 | likert5 (agreement) | 1 | ❌ | هل تتوقع تقاربًا في المذهب أو طريقة الممارسة الدينية بينكما؟ | Do you expect alignment in school of thought / mode of practice? | Practice differences can create daily friction; descriptive, not judgmental. |
| deen-05 | likert5 (importance) | 2 | ✅ | ما مدى أهمية الحرص على أن يكون مصدر الدخل والمعاملات في إطار حلال؟ | How important is it that income and dealings stay within a halal framework? | Links faith to financial conduct — a frequent practical friction point. |

## المحور: الأسرة والأصهار والسكن (family) — *Family, in-laws & housing*

| ID | Type | Weight | DB? | السؤال (AR) | EN gloss | Rationale |
|----|------|--------|-----|-------------|----------|-----------|
| family-01 | choice | 2 | ✅ | ما هو ترتيب السكن الذي تفضله بعد الزواج؟ | What living arrangement do you prefer after marriage? *(with family / near family / independent same city / independent far)* | Housing is among the earliest sources of conflict with in-laws. |
| family-02 | likert5 (importance) | 2 | ✅ | ما مدى أهمية أن يكون للأهل دور في قرارات بيت الزوجية؟ | How important is it that parents have a role in marital-home decisions? | Measures boundaries of family involvement — sensitive in-context. |
| family-03 | likert5 (agreement) | 2 | ❌ | ما مدى استعدادك لرعاية والدَي شريك حياتك عند الحاجة؟ | How willing are you to care for your spouse's parents when needed? | Caring for parents is an expected duty; clarifying expectations avoids clashes. |
| family-04 | likert5 (importance) | 1 | ❌ | ما مدى أهمية زيارة الأهل بشكل منتظم بالنسبة لك؟ | How important is regular family visiting to you? | Frequency of keeping family ties shapes the weekly rhythm. |

## المحور: المال والإنفاق (finance) — *Finances*

| ID | Type | Weight | DB? | السؤال (AR) | EN gloss | Rationale |
|----|------|--------|-----|-------------|----------|-----------|
| finance-01 | likert5 (importance) | 2 | ✅ | ما مدى أهمية الشفافية الكاملة بينكما في الأمور المالية؟ | How important is full financial transparency between you? | Lack of financial transparency is a leading cause of lost trust. |
| finance-02 | choice | 1 | ❌ | كيف تميل إلى إدارة مال الأسرة؟ | How do you prefer to manage family money? *(joint / separate+shared / fully separate)* | Money-management style reveals expectations of financial independence. |
| finance-03 | likert5 (spend↔save) | 1 | ❌ | ما مدى ميلك إلى الادخار مقابل الإنفاق على نمط حياة مريح؟ | Saving vs. spending on a comfortable lifestyle? | Divergent spending habits are a daily friction source. |
| finance-04 | likert5 (importance) | 2 | ✅ | ما مدى أهمية تجنّب القروض الربوية في تمويل مشاريع الأسرة؟ | How important is avoiding riba-based loans for family projects? | Riba is a matter of principle for many; phrased as personal importance. |
| finance-05 | likert5 (agreement) | 1 | ❌ | هل تتوقع أن تعمل الزوجة وتساهم ماليًا إن رغبت؟ | Do you expect the wife to work / contribute financially if she wishes? | Work & contribution expectations intersect roles and finances. |

## المحور: الأبناء والتربية (children) — *Children & parenting*

| ID | Type | Weight | DB? | السؤال (AR) | EN gloss | Rationale |
|----|------|--------|-----|-------------|----------|-----------|
| children-01 | likert5 (desire) | 2 | ✅ | ما مدى رغبتك في إنجاب الأطفال؟ | How much do you desire to have children? | Desire for children is among the clearest compatibility/divergence factors. |
| children-02 | choice | 1 | ❌ | متى تفضل البدء في إنجاب الأطفال؟ | When do you prefer to start having children? *(soon / 1–2 yrs / after stability / undecided)* | Timing needs an early agreement. |
| children-03 | likert5 (importance) | 2 | ✅ | ما مدى أهمية التربية الدينية بوصفها أساس تنشئة الأبناء؟ | How important is religious upbringing as the basis of raising children? | Parenting approach (religious) is a core axis in-context. |
| children-04 | choice | 1 | ❌ | ما نوع التعليم الذي تفضله لأبنائك؟ | What schooling do you prefer for your children? *(public / private / religious / depends)* | Choice of schooling is a long-term shared decision. |

## المحور: الأدوار والتوقعات الزوجية (roles) — *Roles & expectations*

| ID | Type | Weight | DB? | السؤال (AR) | EN gloss | Rationale |
|----|------|--------|-----|-------------|----------|-----------|
| roles-01 | likert5 (agreement) | 2 | ❌ | ما مدى موافقتك على تقاسم الأعمال المنزلية بمرونة بين الطرفين؟ | Do you agree on flexibly sharing household chores? | Chore-sharing expectations are a common daily friction. |
| roles-02 | likert5 (importance) | 1 | ❌ | ما مدى أهمية وضوح أدوار كل طرف ومسؤولياته قبل الزواج؟ | How important is clarity of each party's roles before marriage? | Up-front clarity reduces mismatched implicit expectations. |
| roles-03 | likert5 (agreement) | 1 | ❌ | هل تتوقع أن تتولى الزوجة الجزء الأكبر من رعاية الأطفال؟ | Do you expect the wife to handle most childcare? | Surfaces expectations on the division of childcare. |
| roles-04 | likert5 (agreement) | 2 | ❌ | ما مدى دعمك لطموح شريك حياتك المهني أو الدراسي بعد الزواج؟ | How much do you support your spouse's career/study ambition after marriage? | Mutual support of ambition links to long-term satisfaction. |

## المحور: التواصل وحل الخلاف (communication) — *Communication & conflict*

| ID | Type | Weight | DB? | السؤال (AR) | EN gloss | Rationale |
|----|------|--------|-----|-------------|----------|-----------|
| communication-01 | likert5 (agreement) | 2 | ❌ | عند الخلاف، ما مدى ميلك إلى الحوار الهادئ بدل الصمت أو التصعيد؟ | In conflict, do you lean to calm dialogue vs. silence/escalation? | Conflict-handling style strongly predicts stability. |
| communication-02 | likert5 (importance) | 1 | ❌ | ما مدى أهمية الاستعانة بطرف موثوق (كالأهل أو مستشار) عند تعذّر الحل؟ | How important is involving a trusted party (family/counselor) when stuck? | Agreeing on a mediation mechanism prevents escalation. |
| communication-03 | likert5 (agreement) | 2 | ❌ | ما مدى ارتياحك للتعبير الصريح عن مشاعرك واحتياجاتك؟ | How comfortable are you expressing feelings/needs openly? | Ability to express openly underpins mutual understanding. |
| communication-04 | likert5 (agreement) | 1 | ❌ | هل ترى أن المصارحة المبكرة بالمشكلات أفضل من تأجيلها؟ | Is addressing problems early better than postponing? | Timing of addressing problems affects their accumulation. |

## المحور: نمط الحياة والصحة (lifestyle) — *Lifestyle & health*

| ID | Type | Weight | DB? | السؤال (AR) | EN gloss | Rationale |
|----|------|--------|-----|-------------|----------|-----------|
| lifestyle-01 | likert5 (importance) | 1 | ❌ | ما مدى أهمية الاهتمام بالصحة والعادات الغذائية في حياتكما؟ | How important is attention to health/diet in your life? | Health habits shape the shared lifestyle. |
| lifestyle-02 | likert5 (importance) | 2 | ✅ | ما مدى أهمية إجراء الفحوصات الطبية قبل الزواج؟ | How important are pre-marriage medical check-ups? | Pre-marriage medical screening is an important, legitimate precaution. |
| lifestyle-03 | likert5 (quiet↔social) | 1 | ❌ | ما مدى تفضيلك لحياة اجتماعية نشطة مقابل حياة هادئة منزلية؟ | Active social life vs. quiet home life? | Social-orientation differences affect the daily rhythm. |
| lifestyle-04 | likert5 (importance) | 1 | ❌ | ما مدى أهمية حدود الخصوصية في استخدام وسائل التواصل ومشاركة تفاصيل البيت؟ | How important are privacy boundaries on social media / sharing home details? | Digital-privacy boundaries are a modern friction topic. |

## المحور: التنقل والطموح (mobility) — *Mobility & ambitions*

| ID | Type | Weight | DB? | السؤال (AR) | EN gloss | Rationale |
|----|------|--------|-----|-------------|----------|-----------|
| mobility-01 | likert5 (agreement) | 1 | ❌ | ما مدى استعدادك للانتقال إلى مدينة أخرى من أجل العمل أو الدراسة؟ | How willing are you to relocate to another city for work/study? | Willingness to relocate domestically affects the shared career path. |
| mobility-02 | likert5 (agreement) | 2 | ✅ | ما مدى انفتاحك على الهجرة أو الإقامة خارج البلد مستقبلًا؟ | How open are you to emigration / living abroad in future? | Emigration can be a fundamental fork in the life path. |
| mobility-03 | likert5 (importance) | 1 | ❌ | ما مدى أهمية القرب من الأهل عند اختيار مكان الإقامة؟ | How important is proximity to family when choosing where to live? | Overlaps with family but specifically about location choice. |
| mobility-04 | binary | 1 | ❌ | هل لديك طموح لمواصلة الدراسة أو تطوير مسارك المهني بعد الزواج؟ | Do you have ambition to continue study / develop your career after marriage? | Flags presence of developmental ambition that may need coordination. |

---

**Total drafted:** 32 questions across 8 axes.

### Reviewer checklist
- [ ] Arabic phrasing is dignified and clear for families.
- [ ] No content presupposes pre-marital intimacy, cohabitation, or dating norms.
- [ ] No question states a fiqh ruling; all are descriptive of personal importance.
- [ ] Axis assignment and weights reflect your priorities.
- [ ] Dealbreaker candidates are the right ones.
- [ ] Flip approved items `DRAFT` → `APPROVED` in `src/data/questions.ts`.
