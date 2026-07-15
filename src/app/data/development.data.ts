// Stack/skills data, sourced from info.json's evidence-based `technicalSkills`
// (1–10 levels derived from repo evidence — see info.json meta.skillLevelScale).
import info from './info.json';

export type Proficiency = 'Learning' | 'Working' | 'Advanced' | 'Expert';

export type SkillItem = {
  name: string;
  level: Proficiency;
  score: number; // 1–10 evidence-based level
  years?: number;
  note?: string;
};

export type SkillGroup = {
  title: string;
  items: SkillItem[];
};

export type ProjectItem = {
  name: string;
  tagline: string;
  period?: string;
  stack: string[];
  bullets: string[];
  link?: string;
};

export type DevPageData = {
  headline: string;
  subhead: string;
  summary: string;
  skillGroups: SkillGroup[];
  tools: string[];
};

/** Map the evidence-based 1–10 level to a proficiency label. */
const labelFor = (n: number): Proficiency =>
  n >= 9 ? 'Expert' : n >= 7 ? 'Advanced' : n >= 5 ? 'Working' : 'Learning';

const toGroup = (
  title: string,
  arr: ReadonlyArray<{ name: string; level: number }>,
): SkillGroup => ({
  title,
  items: arr.map((s) => ({ name: s.name, score: s.level, level: labelFor(s.level) })),
});

const ts = info.technicalSkills;

export const devPageData: DevPageData = {
  headline: 'Development',
  subhead: info.taglines.development,
  summary: info.profile,

  skillGroups: [
    toGroup('AI / ML', ts.aiMl),
    toGroup('Languages', ts.languages),
    toGroup('Back-End & Frameworks', ts.backendAndFrameworks),
    toGroup('Front-End', ts.frontend),
    toGroup('Data & DevOps', ts.dataAndDevOps),
  ],

  tools: [
    'Git & GitHub',
    'GitHub Actions',
    'CI/CD',
    'Docker',
    'Ansible',
    'Postman',
    'Swagger / OpenAPI',
  ],
};
