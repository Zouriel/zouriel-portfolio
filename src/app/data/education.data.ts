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

export const educationPageData: EducationPageData = {
  headline: 'Education',
  subhead: 'Computer Science · Technical Foundations · Operational Training',
  summary:
    'Formal study paired with hands-on, mission-ready training. A developer with a field-tested mindset—precise under pressure, methodical by habit.',

  education: [
    {
      degree: 'BSc (Hons) Computer Science — First Class Honours',
      institution:
        'University of the West of England (UWE Bristol), via Villa College',
      location: 'Malé, Maldives',
      period: '2022 — Sep 2025',
      result: 'First Class Honours',
      highlights: [
        'Delivered industry-oriented projects with clean code and reproducible builds.',
        'Focused on full-stack engineering (.NET, Angular, PostgreSQL), architecture, and testing.',
      ],
      coursework: [
        'Advanced Software Development',
        'Group Software Development Project',
        'Databases & SQL',
        'Networks & Security',
        'Algorithms & Data Structures',
      ],
    },
    {
      degree: 'Diploma in Computer Science',
      institution: 'Villa College / UWE Bristol',
      location: 'Malé, Maldives',
      period: '2022 — 2023',
      highlights: [
        'Core CS fundamentals, program design, and web development foundations.',
      ],
    },
    {
      degree: 'Certificate Level 3 in Information Technology',
      institution: 'CYRYX College',
      location: 'Malé, Maldives',
      period: 'Jan 2012 — Jun 2012',
      highlights: ['IT operations, systems use, and practical tooling.'],
    },
    {
      degree: 'Secondary Education (Grades 7–10)',
      institution: 'Islamic Arabic School',
      location: 'Malé, Maldives',
      period: '2009 — 2012',
    },
    {
      degree: 'Primary Education (Grades 1–6)',
      institution: 'Madrassath Saʻd bin Ubaadh',
      location: 'Madinah, Saudi Arabia',
      period: '—',
    },
  ],

  certifications: [
    {
      title: 'Basic Seamanship Training',
      issuer: 'Ministry of Transport & Shipping',
      location: 'Maldives',
      date: 'Jun 1994',
      notes: [
        'Knots & splices, collision prevention, lifeboats & liferafts',
        'Firefighting, survival at sea, first aid',
        'Basic engine room equipment & fittings',
      ],
      category: 'Training',
    },
    {
      title: 'Diesel Engine Repair & Maintenance',
      issuer: 'Airport Training — Hanimadhoo',
      location: 'Maldives',
      date: 'Nov 1998',
      category: 'Training',
    },
    {
      title: 'Airport Emergency Exercise',
      issuer: 'Kaadehdhoo Airport',
      location: 'Maldives',
      date: 'Mar 1999',
      category: 'Training',
    },
    {
      title: 'Global Reporting Format (GRF) Training',
      issuer: 'Kaadehdhoo Airport',
      date: 'Jun 2021',
      category: 'Training',
    },
    {
      title: 'Marine Corps Basic Course; MCMAP (tan belt)',
      issuer: 'Maldives National Defense Force',
      date: '—',
      category: 'Training',
    },
    {
      title: 'Rescue Swimming – Bronze & Silver',
      issuer: 'Maldives National Defense Force',
      date: '—',
      category: 'Training',
    },
    {
      title: 'Management Skills Training',
      issuer: 'Villa College — Corporate Training Division',
      date: 'Jun 20–21 (year per your record)',
      category: 'Training',
    },
    {
      title: 'Driver’s Licenses (A1, A0, B3, B4B1)',
      issuer: '—',
      date: 'Active',
      category: 'License',
    },
  ],
};
