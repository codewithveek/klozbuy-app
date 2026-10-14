import type { IconName } from '@klozbuy/ui';

export type BuyerSection =
  'near' | 'services' | 'markets' | 'requests' | 'saved' | 'chats' | 'seller' | 'account';

export interface NavItem {
  key: BuyerSection;
  label: string;
  icon: IconName;
  href: string;
}

export const SIDE_NAV: NavItem[] = [
  { key: 'near', label: 'Near me', icon: 'compass', href: '/' },
  { key: 'services', label: 'Services', icon: 'wrench', href: '/services' },
  { key: 'markets', label: 'Markets', icon: 'market', href: '/markets' },
  { key: 'requests', label: 'Requests', icon: 'megaphone', href: '/requests' },
  { key: 'saved', label: 'Saved', icon: 'bookmark', href: '/saved' },
  { key: 'chats', label: 'Chats', icon: 'chat', href: '/chats' },
  { key: 'seller', label: 'Seller dashboard', icon: 'chart', href: '/sell' },
];

export const TABS: NavItem[] = [
  { key: 'near', label: 'Near me', icon: 'compass', href: '/' },
  { key: 'services', label: 'Services', icon: 'wrench', href: '/services' },
  { key: 'requests', label: 'Request', icon: 'plus', href: '/requests' },
  { key: 'saved', label: 'Saved', icon: 'heart', href: '/saved' },
  { key: 'account', label: 'Profile', icon: 'user', href: '/account' },
];
