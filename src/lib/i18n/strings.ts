import type { SessionMode } from '../../types';

// Arabic-first UI copy. French glosses provided where they add value; the app
// renders Arabic. Strings are centralized so tone stays consistent and dignified.

export const ar = {
  appName: 'نقش',
  appTagline: 'قبل العقد',
  appSubtitle: 'أداة خاصة لقياس التوافق قبل عقد الزواج',

  privacyNote: 'كل البيانات تبقى على جهازك. لا اتصال، ولا حساب، ولا إرسال لأي خادم.',
  offlineReady: 'يعمل دون اتصال بعد التحميل الأول.',

  // Intake
  chooseMode: 'اختر طريقة الاستخدام',
  modeSolo: 'فردي',
  modeSoloDesc: 'تأمل ذاتي لشخص واحد، دون مقارنة.',
  modeCouple: 'للطرفين',
  modeCoupleDesc: 'شخصان على الجهاز نفسه: يجيب الأول ثم يُسلَّم الجهاز للثاني.',
  modeFacilitator: 'بإشراف ولي/مستشار',
  modeFacilitatorDesc: 'يدير وليّ الأمر أو المستشار الجلسة على جهاز واحد لقراءة النتائج ومناقشتها.',

  optionalNames: 'الأسماء (اختيارية)',
  nameA: 'اسم الطرف الأول',
  nameB: 'اسم الطرف الثاني',
  participantSelf: 'أنت',
  defaultNameA: 'الطرف الأول',
  defaultNameB: 'الطرف الثاني',

  persistTitle: 'حفظ الإجابات على هذا الجهاز',
  persistDesc: 'لاستئناف الجلسة لاحقًا. معطّل افتراضيًا. يبقى الحفظ محليًا على جهازك فقط.',
  persistOn: 'مفعّل',
  persistOff: 'معطّل',
  clearSaved: 'حذف البيانات المحفوظة',
  savedCleared: 'تم حذف البيانات المحفوظة.',

  start: 'ابدأ',
  next: 'التالي',
  previous: 'السابق',
  finish: 'إنهاء',
  continue: 'متابعة',

  // Facilitator intro
  facilitatorIntroTitle: 'إرشادات الميسّر',
  facilitatorIntroBody:
    'ستدير جلسة هادئة ومحايدة. سيُجيب كل طرف على حدة، ثم تُعرض المقارنة لمناقشتها معًا. لا توجد إجابات «صحيحة» أو «خاطئة»؛ الهدف توضيح التوقعات قبل القرار.',

  // Assessment
  assessmentForA: (name: string) => `إجابات ${name}`,
  question: 'سؤال',
  of: 'من',
  progress: 'التقدّم',
  flagDealbreaker: 'اعتبره شرطًا أساسيًا لا أتنازل عنه',
  flagDealbreakerHint: 'سيُبرَز أي تباين كبير في هذا السؤال بشكل خاص.',
  answerRequired: 'يرجى اختيار إجابة للمتابعة.',
  draftBadge: 'مسودة — قيد المراجعة',
  reviewModeBanner: 'وضع المراجعة: تظهر أسئلة المسودة وتدخل في الحساب. لا تستخدمه للنتائج النهائية.',

  // Handoff
  handoffTitle: 'سلّم الجهاز الآن',
  handoffBody: (name: string) =>
    `تم حفظ إجابات الطرف الأول وإخفاؤها. سلّم الجهاز إلى ${name} ليبدأ الإجابة دون الاطّلاع على إجابات الآخر.`,
  handoffReady: 'أنا مستعد للبدء',

  // Results
  resultsTitle: 'النتائج',
  overallAlignment: 'نسبة التوافق العامة',
  soloResultsTitle: 'خريطتك الشخصية',
  soloResultsNote: 'هذه نظرة على أولوياتك عبر المحاور؛ لا توجد مقارنة في الوضع الفردي.',
  axisBreakdown: 'تفصيل المحاور',
  axisGap: 'حجم التباين',
  noGapData: 'لا توجد بيانات كافية لهذا المحور.',
  dealbreakers: 'نقاط حرجة تستوجب الحوار',
  noDealbreakers: 'لا توجد تعارضات في الشروط الأساسية التي تم وضعها.',
  dealbreakerFlaggedBy: 'وضعه شرطًا أساسيًا',
  talkingPoints: 'محاور للحوار',
  highGapPrompt: (axis: string) => `لاحظتما تباينًا في «${axis}». ناقشا توقعات كل طرف بهدوء.`,
  legendHigh: 'توافق مرتفع',
  legendMedium: 'توافق متوسط',
  legendLow: 'تباين يحتاج حوارًا',

  // Export
  exportTitle: 'حفظ ورقة النتائج',
  exportHtml: 'تنزيل ورقة قابلة للطباعة (HTML)',
  exportJson: 'تنزيل البيانات (JSON)',
  exportNote: 'يتم إنشاء الملف على جهازك مباشرة، دون أي رفع.',

  restart: 'جلسة جديدة',
  restartConfirm: 'بدء جلسة جديدة سيمسح الإجابات الحالية. هل تريد المتابعة؟',

  // Empty / gate
  noApprovedTitle: 'الأسئلة قيد المراجعة',
  noApprovedBody:
    'لم تُعتمد أي أسئلة للعرض بعد. تُراجَع محتويات بنك الأسئلة قبل نشرها. للمعاينة، افتح التطبيق مع المعامل review=1.',

  participantA: 'الطرف الأول',
  participantB: 'الطرف الثاني',
} as const;

export type Strings = typeof ar;

export function modeLabel(mode: SessionMode): string {
  switch (mode) {
    case 'solo':
      return ar.modeSolo;
    case 'couple':
      return ar.modeCouple;
    case 'facilitator':
      return ar.modeFacilitator;
  }
}
