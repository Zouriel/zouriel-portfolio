import info from './info.json';

// Types keep things honest and make refactors painless.
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

export const devPageData: DevPageData = {
  headline: 'Development',
  subhead: info.taglines.development,
  summary: `Full-stack engineer with a military-honed bias for clarity, reliability, and execution. 
     I design and build web platforms end-to-end—from crisp Angular front-ends to robust .NET 
     and Node services—deploying with containerized workflows and pragmatic CI/CD.`,

  skillGroups: [
    {
      title: 'Languages',
      items: info.portfolioSkillRatings.languages as SkillItem[],
    },
    {
      title: 'Front-End',
      items: info.portfolioSkillRatings.frontEnd as SkillItem[],
    },
    {
      title: 'Back-End',
      items: info.portfolioSkillRatings.backEnd as SkillItem[],
    },
    {
      title: 'Data & Infra',
      items: info.portfolioSkillRatings.dataAndInfra as SkillItem[],
    },
  ],

  tools: [
    'Git & GitHub',
    'GitHub Actions',
    'CI/CD',
    'VS Code',
    'Postman',
    'Swagger / OpenAPI',
  ],
};
