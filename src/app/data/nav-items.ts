export type NavKey =
  | 'home'
  | 'dev'
  | 'work'
  | 'academics'
  | 'military'
  | 'athletics';

export interface NavItem {
  route: string;
  label: string;
  icon: NavKey;
  exact?: boolean;
}

export const NavItems: NavItem[] = [
  { route: '/', label: 'Home', icon: 'home', exact: true },
  { route: '/development', label: 'Development', icon: 'dev' },
  { route: '/work', label: 'Work Experience', icon: 'work' },
  { route: '/academics', label: 'Academic', icon: 'academics' },
  // { route: '/military', label: 'Military', icon: 'military' },
  // { route: '/athletics', label: 'Athletic Achievements', icon: 'athletics' },
];

export const NavigationConfig = NavItems;
