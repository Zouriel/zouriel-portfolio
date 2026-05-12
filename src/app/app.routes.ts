import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Zouriel · Mohamed Imdaah',
    loadComponent: () => import('./pages/home-page').then((m) => m.HomePage),
  },
  {
    path: 'projects',
    title: 'Works · Zouriel',
    loadComponent: () =>
      import('./pages/projects-page').then((m) => m.ProjectsPage),
  },
  {
    path: 'development',
    title: 'Stack · Zouriel',
    loadComponent: () =>
      import('./pages/development-page').then((m) => m.DevelopmentPage),
  },
  {
    path: 'work',
    title: 'Experience · Zouriel',
    loadComponent: () =>
      import('./pages/work-experience').then((m) => m.WorkExperiencePage),
  },
  {
    path: 'academics',
    title: 'Academic · Zouriel',
    loadComponent: () =>
      import('./pages/education.page').then((m) => m.EducationPage),
  },
  {
    path: 'military',
    title: 'Service · Zouriel',
    loadComponent: () =>
      import('./pages/military-page').then((m) => m.MilitaryPage),
  },

  {
    path: '404',
    title: 'Not Found · Zouriel',
    loadComponent: () => import('./pages/home-page').then((m) => m.HomePage),
  },
  { path: '**', redirectTo: '404' },
];
