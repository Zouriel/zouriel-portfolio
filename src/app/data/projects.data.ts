// Projects are sourced from ./projects.json (rich, detailed export). This module
// types that data, preserves the "live site" URLs the JSON doesn't carry, and
// derives a few convenience fields (year, flattened stack, featured) for the UI.
import rawProjects from './projects.json';

export type ProjectStatus = 'active' | 'completed' | (string & {});

export interface ProjectRepository {
  name: string;
  url: string;
  visibility: string;
}

export interface ProjectStack {
  frontend?: string[];
  backend?: string[];
  database?: string[];
  infrastructure?: string[];
  tools?: string[];
  other?: string[];
}

export interface Project {
  name: string;
  description: string;
  projectType: string;
  organization: string;
  client: string;
  industry: string;
  status: ProjectStatus;
  duration: { start: string; end: string };
  repositories: ProjectRepository[];
  stack: ProjectStack;
  role: string;
  teamSize: number;
  responsibilities: string[];
  myContributions: string[];
  majorFeatures: string[];
  architecture: string[];
  achievements: string[];
  metrics: { users: string; performance: string; scale: string };
  links: { website: string; demo: string; documentation: string };
  // ── preserved / derived (not in the source JSON) ──
  live?: string;
  year: string;
  yearRange: string;
  stackFlat: string[];
  featured: boolean;
}

/**
 * "Live site" URLs the detailed JSON export doesn't include. The first two are
 * carried over from the previous data source (Kuri → HEMS); the rest are
 * confirmed live from the current deploy topology.
 */
const LIVE_URLS: Record<string, string> = {
  'HEMS — Higher Education Management System': 'https://kuri.gov.mv',
  Lektrus: 'https://lektrus.com',
  'invites.blog': 'https://invites.blog',
  'Personal Portfolio': 'https://zouriel.com',
  'Angular UI Library': 'https://zouriel.com/uilib',
  VerifyPortal: 'https://verifyportal.lektrus.com',
};

const FEATURED = new Set<string>([
  'HEMS — Higher Education Management System',
  'zcoms',
  'VerifyPortal',
  'invites.blog',
  'Lektrus',
]);

const fmtYear = (d: string): string => (d && d !== 'present' ? d.slice(0, 4) : '');

interface RawProject extends Omit<Project, 'live' | 'year' | 'yearRange' | 'stackFlat' | 'featured'> {}

export const projects: Project[] = (rawProjects.projects as RawProject[]).map((p) => {
  const startY = fmtYear(p.duration?.start ?? '');
  const endY = p.duration?.end === 'present' ? 'Present' : fmtYear(p.duration?.end ?? '');
  const yearRange = startY && endY && endY !== startY ? `${startY} — ${endY}` : startY || endY;
  const stackFlat = Array.from(
    new Set(Object.values(p.stack ?? {}).flat().filter(Boolean) as string[]),
  );
  return {
    ...p,
    live: p.links?.website || LIVE_URLS[p.name] || undefined,
    year: endY === 'Present' ? 'Present' : startY,
    yearRange,
    stackFlat,
    featured: FEATURED.has(p.name),
  };
});

export type ProjectFilter = 'all' | 'active' | 'completed' | 'live';

export const projectFilters: { key: ProjectFilter; label: string }[] = [
  { key: 'all', label: 'All Works' },
  { key: 'live', label: 'Live' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
];
