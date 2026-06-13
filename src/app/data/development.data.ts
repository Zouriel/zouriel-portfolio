import { runtimeContent } from './_runtime';

export type Proficiency = 'Learning' | 'Working' | 'Advanced' | 'Expert';

export type SkillItem = {
  name: string;
  level: Proficiency;
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

const DEV_FALLBACK: DevPageData = {
  headline: 'Development',
  subhead: 'Systems that scale. Code that holds the line.',
  summary: `Full-stack engineer with a military-honed bias for clarity, reliability, and execution.
     I design and build web platforms end-to-end—from crisp Angular front-ends to robust .NET
     and Node services—deploying with containerized workflows and pragmatic CI/CD.`,
  skillGroups: [
    {
      title: 'Languages',
      items: [
        { name: 'TypeScript', level: 'Advanced', years: 3 },
        { name: 'JavaScript', level: 'Advanced', years: 3 },
        { name: 'C#', level: 'Advanced', years: 2 },
        { name: 'SQL (T-SQL / Postgres SQL)', level: 'Advanced', years: 2 },
        { name: 'PHP (Laravel)', level: 'Advanced', note: 'national portal backend' },
        { name: 'Go (Gin)', level: 'Working', years: 0.5 },
      ],
    },
    {
      title: 'Front-End',
      items: [
        { name: 'Angular', level: 'Advanced', years: 3, note: 'Angular 16–20, SSR' },
        { name: 'Next.js / React', level: 'Advanced', note: 'App Router, Auth.js' },
        { name: 'Tailwind CSS', level: 'Advanced' },
      ],
    },
    {
      title: 'Back-End',
      items: [
        { name: 'Laravel', level: 'Advanced', note: 'national-scale APIs' },
        { name: '.NET / ASP.NET', level: 'Advanced' },
        { name: 'Node / Express', level: 'Working' },
      ],
    },
    {
      title: 'Data & Infra',
      items: [
        { name: 'PostgreSQL', level: 'Advanced' },
        { name: 'SQL Server', level: 'Working' },
        { name: 'Docker', level: 'Working' },
        { name: 'MinIO (S3)', level: 'Working' },
      ],
    },
  ],
  tools: ['Git & GitHub', 'GitHub Actions', 'CI/CD', 'VS Code', 'Postman', 'Swagger / OpenAPI'],
};

export const devPageData: DevPageData = new Proxy(DEV_FALLBACK, {
  get(target, prop) {
    const live = runtimeContent.development;
    return (live ?? target)[prop as keyof DevPageData];
  },
});
