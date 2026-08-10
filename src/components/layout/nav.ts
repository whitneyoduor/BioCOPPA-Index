export interface NavItem {
  to: string;
  label: string;
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About the Index' },
  { to: '/domains', label: 'The Three Domains' },
  { to: '/methodology', label: 'Methodology' },
  { to: '/kenya', label: 'Kenya Pilot' },
  { to: '/users', label: 'Users' },
];
