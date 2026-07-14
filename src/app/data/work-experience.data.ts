import info from './info.json';

export type ExperienceType = 'work' | 'lecturer';

export type ExperienceItem = {
  type: ExperienceType;
  org: string;
  role: string;
  location?: string;
  period: string;
  summary?: string; // one-line context
  highlights: string[]; // action + outcome phrasing
  stack?: string[]; // tech / domains / tools
};

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

// "YYYY-MM" -> "Mon YYYY"; "present" -> "Present"; "YYYY" -> "YYYY".
function formatDate(value: string): string {
  if (!value) return '';
  if (value.toLowerCase() === 'present') return 'Present';

  const [year, month] = value.split('-');
  if (month) {
    const index = Number(month) - 1;
    const name = MONTHS[index];
    if (name) return `${name} ${year}`;
  }
  return year;
}

function formatPeriod(startDate: string, endDate: string): string {
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  if (start && end) return `${start} — ${end}`;
  return start || end;
}

export const workExperienceData: ExperienceItem[] = [...info.experience]
  // Newest-first: descending string compare on "YYYY-MM" startDate.
  .sort((a, b) => b.startDate.localeCompare(a.startDate))
  .map((entry): ExperienceItem => ({
    type: entry.role.includes('Lecturer') ? 'lecturer' : 'work',
    org: entry.organization,
    role: entry.role,
    location: entry.location,
    period: formatPeriod(entry.startDate, entry.endDate),
    summary: entry.summary,
    highlights: entry.responsibilities,
    stack: entry.stack,
  }));
