export interface NavItem {
  to: string;
  label: string;
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Home' },
  { to: '/index', label: 'Explore the Index' },
  { to: '/about', label: 'About the Index' },
  { to: '/resources', label: 'Resources' },
  { to: '/contribute', label: 'Contribute' },
];