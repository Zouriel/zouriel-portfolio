import info from './info.json';

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

const service = info.militaryService;

const courseGlyphByTitle: Record<string, MilitaryCourse['glyph']> = {
  'Marine Corps Basic Course': 'corps',
  'MCMAP — Tan Belt': 'belt',
  'Rescue Swimming — Bronze': 'medal-bronze',
  'Rescue Swimming — Silver': 'medal-silver',
};

export const militaryData: MilitaryPageData = {
  branch: service.branch,
  branchShort: service.branchShort,
  period: service.period,
  rank: service.rank,
  rankShort: service.rankShort,
  qualification: service.qualification,
  qualificationAwards: service.qualificationAwards,
  bftScore: service.basicFitnessTest.score,
  bftMax: service.basicFitnessTest.max,
  bftPercent: service.basicFitnessTest.percent,
  summary: service.summary,
  pillars: service.pillars.map((p) => ({
    word: p.word.toUpperCase(),
    meaning: p.meaning,
  })),
  courses: service.courses.map((c) => ({
    title: c.title,
    org: c.org,
    detail: c.detail,
    glyph: courseGlyphByTitle[c.title] ?? 'corps',
  })),
};
