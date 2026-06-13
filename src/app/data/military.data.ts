import { runtimeContent } from './_runtime';

export interface MilitaryCourse {
  title: string;
  org: string;
  glyph: 'belt' | 'medal-bronze' | 'medal-silver' | 'corps';
  detail?: string;
}

export interface MilitaryPageData {
  branch: string;
  branchShort: string;
  period: string;
  rank: string;
  rankShort: string;
  qualification: string;
  qualificationAwards: number;
  bftScore: string;
  bftMax: string;
  bftPercent: number;
  summary: string;
  pillars: { word: string; meaning: string }[];
  courses: MilitaryCourse[];
}

const MILITARY_FALLBACK: MilitaryPageData = {
  branch: 'Maldives National Defense Force — Marine Corps',
  branchShort: 'MNDF Marine Corps',
  period: 'Mar 2016 — 2022',
  rank: 'Lance Corporal',
  rankShort: 'LCpl',
  qualification: 'Expert',
  qualificationAwards: 3,
  bftScore: '280+',
  bftMax: '300',
  bftPercent: 93,
  summary:
    'Six years in uniform. Trained to operate under load, to lead small teams, to make calm decisions when conditions are not. Carried forward as a habit, not a memory.',
  pillars: [
    { word: 'DISCIPLINE', meaning: 'standards held when no one is watching' },
    { word: 'COMPOSURE', meaning: 'calm under load, clarity in chaos' },
    { word: 'TEAM', meaning: 'mission before self, peer before mission' },
    { word: 'EXECUTE', meaning: 'finish what you start, debrief what you finish' },
  ],
  courses: [
    {
      title: 'Marine Corps Basic Course',
      org: 'MNDF Marine Corps',
      glyph: 'corps',
      detail: 'foundational warfighting · drill · field ops',
    },
    {
      title: 'MCMAP — Tan Belt',
      org: 'Marine Corps Martial Arts Program',
      glyph: 'belt',
      detail: 'fundamental techniques · close combat',
    },
    {
      title: 'Rescue Swimming — Bronze',
      org: 'MNDF Marine Corps',
      glyph: 'medal-bronze',
      detail: 'open-water rescue · survival swim',
    },
    {
      title: 'Rescue Swimming — Silver',
      org: 'MNDF Marine Corps',
      glyph: 'medal-silver',
      detail: 'advanced rescue · towing · endurance',
    },
  ],
};

export const militaryData: MilitaryPageData = new Proxy(MILITARY_FALLBACK, {
  get(target, prop) {
    const live = runtimeContent.military;
    return (live ?? target)[prop as keyof MilitaryPageData];
  },
});
