import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Home • Zouriel',
    loadComponent: () => import('./pages/home-page').then((m) => m.HomePage),
  },
  {
    path: 'development',
    title: 'Development • Zouriel',
    loadComponent: () =>
      import('./pages/development-page').then((m) => m.DevelopmentPage),
  },
  {
    path: 'work',
    title: 'Work Experience • Zouriel',
    loadComponent: () =>
      import('./pages/work-experience').then((m) => m.WorkExperiencePage),
  },
  {
    path: 'academics',
    title: 'Academic Experience • Zouriel',
    loadComponent: () =>
      import('./pages/education.page').then((m) => m.EducationPage),
  },
  {
    path: 'military',
    title: 'Military • Zouriel',
    loadComponent: () => import('./pages/home-page').then((m) => m.HomePage),
  },
  {
    path: 'athletics',
    title: 'Athletic Achievements • Zouriel',
    loadComponent: () => import('./pages/home-page').then((m) => m.HomePage),
  },

  // optional: a tidy 404
  {
    path: '404',
    title: 'Not Found • Zouriel',
    loadComponent: () => import('./pages/home-page').then((m) => m.HomePage),
  },
  { path: '**', redirectTo: '404' },
];
