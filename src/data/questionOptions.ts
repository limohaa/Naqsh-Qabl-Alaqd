import type { QuestionOption } from '../types';

// Reusable option sets so the question bank stays readable.

export const likertImportance: QuestionOption[] = [
  { value: 1, labelAr: 'غير مهم إطلاقًا' },
  { value: 2, labelAr: 'قليل الأهمية' },
  { value: 3, labelAr: 'متوسط' },
  { value: 4, labelAr: 'مهم' },
  { value: 5, labelAr: 'مهم جدًا' },
];

export const likertAgreement: QuestionOption[] = [
  { value: 1, labelAr: 'لا أوافق إطلاقًا' },
  { value: 2, labelAr: 'لا أوافق' },
  { value: 3, labelAr: 'محايد' },
  { value: 4, labelAr: 'أوافق' },
  { value: 5, labelAr: 'أوافق تمامًا' },
];

export const binaryYesNo: QuestionOption[] = [
  { value: 0, labelAr: 'لا' },
  { value: 1, labelAr: 'نعم' },
];
