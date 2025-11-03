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

export const workExperienceData: ExperienceItem[] = [
  {
    type: 'work',
    org: 'Oxiqa Private Limited',
    role: 'Full-Stack Engineer',
    location: 'Malé, Maldives',
    period: 'Aug 2025 — Present',
    summary:
      'Delivering end-to-end features across multiple client projects with a focus on reliability, DX, and clean deployments.',
    highlights: [
      'Designed and shipped full-stack features from spec to production, owning API contracts, UI states, and rollout.',
      'Hardened auth/session flows, error boundaries, and network retries to reduce flaky UX and support load.',
      'Codified CI/CD steps (build, test, lint, preview, deploy) and environment conventions for smoother releases.',
      'Led cross-service integrations (file storage, notifications, payments) with clear adapters and test seams.',
    ],
    stack: [
      'Angular',
      'TypeScript',
      '.NET',
      'PostgreSQL',
      'Docker',
      'GitHub Actions',
      'OpenAPI',
      'Tailwind',
    ],
  },

  {
    type: 'work',
    org: 'Maldives Water and Sewerage Company (MWSC)',
    role: 'Software Developer',
    location: 'Malé, Maldives',
    period: 'Mar 2024 — Jul 2025',
    summary:
      'Modernised internal systems and interfaces; implemented secure authentication and maintainable REST services.',
    highlights: [
      'Implemented token-based authentication/authorisation with role-aware UI guards and API middleware.',
      'Built REST endpoints for inventory and HR workflows with clear DTOs, validation, and Swagger docs.',
      'Refactored legacy views into modular components and improved UX with responsive, accessible layouts.',
      'Partnered with UI/UX to streamline screens, reduce clicks on frequent tasks, and clarify error handling.',
    ],
    stack: [
      '.NET',
      'Angular',
      'SQL Server',
      'Tailwind',
      'Swagger/OpenAPI',
      'Identity/JWT',
    ],
  },

  {
    type: 'work',
    org: 'Maldives National Defense Force',
    role: 'Marine',
    location: 'Malé, Maldives',
    period: 'Mar 2016 — 2022',
    summary:
      'High-pressure environments, team leadership, and disciplined execution under operational constraints.',
    highlights: [
      'Mentored peers in fitness and readiness; reinforced team standards and debrief discipline.',
      'Supported incident response and de-escalation with clear comms and coordinated team movement.',
      'Completed Marine Corps basic course; progressed in MCMAP; achieved silver in rescue swimming.',
    ],
    stack: ['Leadership', 'Team Ops', 'Field Readiness', 'Comms Discipline'],
  },

  {
    type: 'work',
    org: 'ReefSand Maldives Pvt. Ltd.',
    role: 'IT Technician',
    location: 'Malé, Maldives',
    period: 'Jan 2014 — 2018',
    summary:
      'Resolved end-user issues, documented fixes, and delivered small web projects as a solo builder.',
    highlights: [
      'Diagnosed software/hardware issues and produced clear non-technical guidance for staff.',
      'Standardised troubleshooting notes and checklists to improve handovers and response time.',
      'Designed and delivered several small web projects as an independent contractor.',
    ],
    stack: ['Windows Admin', 'Helpdesk', 'Networking Basics', 'Web Essentials'],
  },

  // Lecturer entry (kept here so one source of truth; your page can filter by type)
  {
    type: 'lecturer',
    org: 'Villa College (UWE Bristol Partnership)',
    role: 'Lecturer — Computer Science (Part-Time)',
    location: 'Malé, Maldives',
    period: 'Oct 2025 — Present',
    summary:
      'Teaching and mentoring BSc students with a practical, industry-aligned approach.',
    highlights: [
      'Delivered lectures and labs for Advanced Software Development and Group Software Development Project.',
      'Designed weekly artifacts and assessments emphasising testing, git workflows, and documentation quality.',
      'Mentored teams on scoping, iteration planning, and presenting technical work to non-technical stakeholders.',
    ],
    stack: [
      'Angular',
      '.NET',
      'Git/GitHub',
      'CI/CD Basics',
      'Software Engineering Practices',
    ],
  },
];
