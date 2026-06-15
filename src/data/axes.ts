import type { Axis } from '../types';

// Axis architecture for the Moroccan Muslim pre-aqd context.
// Weights are relative; the scoring engine normalizes them at runtime so the
// owner can re-balance freely without the numbers needing to sum to anything.
export const AXES: Axis[] = [
  {
    id: 'deen',
    labelAr: 'الدين والممارسة',
    labelFr: 'Foi et pratique',
    weight: 5,
    description: 'العقيدة، الالتزام بالعبادات، ومكانة الدين في قرارات الحياة اليومية.',
  },
  {
    id: 'family',
    labelAr: 'الأسرة والأصهار والسكن',
    labelFr: 'Famille et logement',
    weight: 4,
    description: 'العلاقة بالأهل والأصهار، حدود التدخل، وترتيبات السكن بعد الزواج.',
  },
  {
    id: 'finance',
    labelAr: 'المال والإنفاق',
    labelFr: 'Finances',
    weight: 4,
    description: 'الإنفاق، الادخار، النفقة، والشفافية المالية بإطار حلال.',
  },
  {
    id: 'children',
    labelAr: 'الأبناء والتربية',
    labelFr: 'Enfants et éducation',
    weight: 4,
    description: 'الرغبة في الإنجاب، توقيته، ومنهج التربية والتعليم.',
  },
  {
    id: 'roles',
    labelAr: 'الأدوار والتوقعات الزوجية',
    labelFr: 'Rôles conjugaux',
    weight: 3,
    description: 'توزيع المسؤوليات داخل البيت وتوقعات كل طرف من الآخر.',
  },
  {
    id: 'communication',
    labelAr: 'التواصل وحل الخلاف',
    labelFr: 'Communication',
    weight: 4,
    description: 'أسلوب الحوار، إدارة الغضب، وطريقة حل الخلافات.',
  },
  {
    id: 'lifestyle',
    labelAr: 'نمط الحياة والصحة',
    labelFr: 'Mode de vie et santé',
    weight: 2,
    description: 'العادات اليومية، الصحة، والخصوصية والانفتاح الاجتماعي.',
  },
  {
    id: 'mobility',
    labelAr: 'التنقل والطموح',
    labelFr: 'Mobilité et ambitions',
    weight: 2,
    description: 'الاستعداد للانتقال أو الهجرة، والطموحات المهنية والتعليمية.',
  },
];

export const AXIS_BY_ID: Readonly<Record<string, Axis>> = Object.freeze(
  Object.fromEntries(AXES.map((a) => [a.id, a])),
);
