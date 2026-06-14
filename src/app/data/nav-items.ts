export type NavKey =
  | 'home'
  | 'projects'
  | 'dev'
  | 'work'
  | 'academics'
  | 'military'
  | 'athletics';

export interface NavItem {
  route: string;
  label: string;
  icon: NavKey;
  index: string;
  exact?: boolean;
}

export const NavItems: NavItem[] = [
  { route: '/', label: 'Home', icon: 'home', index: '00', exact: true },
  { route: '/projects', label: 'Works', icon: 'projects', index: '01' },
  { route: '/development', label: 'Stack', icon: 'dev', index: '02' },
  { route: '/work', label: 'Experience', icon: 'work', index: '03' },
  { route: '/academics', label: 'Academic', icon: 'academics', index: '04' },
  { route: '/military', label: 'Service', icon: 'military', index: '05' },
];

export const NavigationConfig = NavItems;
