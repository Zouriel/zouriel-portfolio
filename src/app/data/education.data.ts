import info from './info.json';

export type EducationItem = {
  degree: string; // e.g., BSc (Hons) in Computer Science – First Class
  institution: string; // e.g., UWE Bristol (via Villa College)
  location?: string;
  period: string; // e.g., 2022 — Sep 2025
  result?: string; // e.g., First Class Honours, GPA, awards
  highlights?: string[]; // bullets about capstone, focus areas, roles
  coursework?: string[]; // selected modules
};

export type CertificateItem = {
  title: string;
  issuer: string;
  location?: string;
  date: string; // month/year or range
  notes?: string[]; // optional bullets
  category?: 'Certification' | 'Training' | 'License';
};

export type EducationPageData = {
  headline: string;
  subhead: string;
  summary: string;
  education: EducationItem[];
  certifications: CertificateItem[];
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

// Turns "YYYY" into itself and "YYYY-MM" into "Mon YYYY". Empty -> "".
function formatDatePart(value: string): string {
  if (!value) return '';
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (match) {
    const year = match[1];
    const monthIndex = Number(match[2]) - 1;
    const month = MONTHS[monthIndex];
    if (month) return `${month} ${year}`;
  }
  return value;
}

// Builds a period string from a start and end value, e.g. "2022 — Sep 2025".
function formatPeriod(startYear: string, endDate: string): string {
  const start = formatDatePart(startYear);
  const end = formatDatePart(endDate);
  if (!start && !end) return '—';
  if (start && end) return `${start} — ${end}`;
  return start || end;
}

// Certificate dates: "YYYY-MM" -> "Mon YYYY"; leaves "" and "Active" as-is.
function formatCertDate(value: string): string {
  return formatDatePart(value);
}

export const educationPageData: EducationPageData = {
  headline: 'Education',
  subhead: info.taglines.education,
  summary:
    'Formal study paired with hands-on, mission-ready training. A developer with a field-tested mindset—precise under pressure, methodical by habit.',

  education: info.education.map(
    (item): EducationItem => ({
      degree: item.qualification,
      institution: item.institution,
      location: item.location,
      period: formatPeriod(item.startYear, item.endDate),
      result: item.result || undefined,
      coursework: (item as { coursework?: string[] }).coursework || undefined,
    }),
  ),

  certifications: info.certifications.map((item) => ({
    title: item.title,
    issuer: item.issuer,
    date: formatCertDate(item.date),
    category: item.category,
  })) as CertificateItem[],
};
