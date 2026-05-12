export type ProjectCategory =
  | 'fullstack'
  | 'frontend'
  | 'backend'
  | 'desktop'
  | 'infra'
  | 'experiment';

export interface Project {
  name: string;
  tagline: string;
  description: string;
  stack: string[];
  category: ProjectCategory;
  language: string;
  accent: string;
  year: string;
  repo?: string;
  live?: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    name: 'Kuri',
    tagline: 'Ministry of Higher Education national portal',
    description:
      'The largest project I have shipped on — a national platform serving the Maldives Ministry of Higher Education. Built as a full-stack engineer on the team, with a Next.js / React Student Portal on the front and a Laravel / PHP backend powering the ministry-wide workflows behind it.',
    stack: ['Next.js', 'React', 'TypeScript', 'Laravel', 'PHP', 'Auth.js', 'Tailwind', 'Cloudflare'],
    category: 'fullstack',
    language: 'Next.js · Laravel',
    accent: '#f59e0b',
    year: '2026',
    live: 'https://kuri.gov.mv',
    featured: true,
  },
  {
    name: 'Lektrus',
    tagline: 'Teaching platform · LMS · tutoring marketplace',
    description:
      'A live product at lektrus.com — part classroom-flow companion, part LMS for higher-ed cohorts, part tutoring marketplace. Server-rendered Angular front-end on Express, .NET back-end, deployed via Docker and fronted by Caddy.',
    stack: ['Angular SSR', '.NET', 'C#', 'Express', 'Docker', 'Caddy', 'Tailwind'],
    category: 'fullstack',
    language: 'Angular · .NET',
    accent: '#a78bfa',
    year: '2026',
    live: 'https://lektrus.com',
    repo: 'https://github.com/Zouriel/classFlow',
    featured: true,
  },
  {
    name: 'MOTCA Domain',
    tagline: 'Ministry of Transport — domain platform',
    description:
      'A three-part platform — orchestrated Docker Compose stack, .NET API with EF Core migrations and seeding, and an Angular + Tailwind web app — delivering operational tooling for transport & civil aviation workflows.',
    stack: ['Angular', '.NET', 'EF Core', 'TypeScript', 'Tailwind', 'Docker Compose'],
    category: 'fullstack',
    language: 'Angular · .NET',
    accent: '#fb7185',
    year: '2026',
    repo: 'https://github.com/Zouriel/motca-domain',
  },
  {
    name: 'IMS — Inventory Management',
    tagline: 'Full-stack inventory system',
    description:
      'Angular front-end paired with a .NET back-end. Role-aware UI, validated DTOs, JWT auth and Swagger-documented REST endpoints for warehouse operations.',
    stack: ['Angular', 'SCSS', '.NET', 'C#', 'JWT', 'Swagger'],
    category: 'fullstack',
    language: 'Angular · .NET',
    accent: '#22d3ee',
    year: '2025',
    repo: 'https://github.com/Zouriel/IMS-FrontEnd',
    featured: true,
  },
  {
    name: 'Taskerr',
    tagline: 'Task-routing platform — Go + Angular',
    description:
      'A Go backend (with WebSocket layer and Air live-reload) paired with an Angular front-end — a lean, language-mixed system exploring clean adapter boundaries and real-time updates.',
    stack: ['Go', 'WebSockets', 'Angular', 'TypeScript', 'Air'],
    category: 'fullstack',
    language: 'Go · Angular',
    accent: '#34d399',
    year: '2025',
    repo: 'https://github.com/Zouriel/taskerr_backend',
    featured: true,
  },
  {
    name: 'Joali Backend',
    tagline: 'Resort-operations service in .NET',
    description:
      'A C# service backing hospitality workflows — booking, guest records, and operations endpoints with EF Core, clean DTOs, and a clear controller surface.',
    stack: ['.NET', 'C#', 'EF Core'],
    category: 'backend',
    language: 'C#',
    accent: '#60a5fa',
    year: '2025',
    repo: 'https://github.com/Zouriel/JoaliBackend',
  },
  {
    name: 'ECom Shop',
    tagline: 'Vue storefront on a Django backend',
    description:
      'A full-stack e-commerce build — Django + Python on the server, Vue on the storefront. Catalog, cart, and order flows wired across a Python REST layer.',
    stack: ['Vue', 'Django', 'Python', 'SQLite'],
    category: 'fullstack',
    language: 'Vue · Django',
    accent: '#22d3ee',
    year: '2025',
    repo: 'https://github.com/Zouriel/ECom_Shop',
  },
  {
    name: 'UI Monitor',
    tagline: 'WPF desktop sentinel',
    description:
      'A native Windows utility (WPF + C#) that watches selected screen regions and raises an audible alarm overlay when something changes — built as a daily-driver instrument for catching regressions before they ship.',
    stack: ['C#', 'WPF', 'XAML', '.NET'],
    category: 'desktop',
    language: 'C# · WPF',
    accent: '#f97316',
    year: '2025',
    repo: 'https://github.com/Zouriel/ui-monitor',
  },
  {
    name: 'AuthClient',
    tagline: 'OAuth client reference in Angular',
    description:
      'A reference Angular client wired against a custom OAuth server — token lifecycle, route guards, and clean interceptor patterns.',
    stack: ['Angular', 'TypeScript', 'OAuth2'],
    category: 'frontend',
    language: 'Angular',
    accent: '#facc15',
    year: '2025',
    repo: 'https://github.com/Zouriel/AuthClient1',
  },
  {
    name: 'zouriel.dev',
    tagline: 'This portfolio.',
    description:
      'The site you are reading. Angular 20, Tailwind v4, hand-rolled canvas constellations, magnetic cursor, scroll-driven cinema. No framework crutch — taste is the system.',
    stack: ['Angular 20', 'Tailwind v4', 'Canvas', 'Web Animations API'],
    category: 'frontend',
    language: 'TypeScript',
    accent: '#d23045',
    year: '2026',
    repo: 'https://github.com/Zouriel/zouriel-portfolio',
    featured: true,
  },
];

export const projectCategories: { key: ProjectCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All Works' },
  { key: 'fullstack', label: 'Full-Stack' },
  { key: 'frontend', label: 'Front-End' },
  { key: 'backend', label: 'Back-End' },
  { key: 'desktop', label: 'Desktop' },
  { key: 'experiment', label: 'Experiments' },
];
