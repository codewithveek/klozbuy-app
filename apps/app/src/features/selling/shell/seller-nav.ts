import type { IconName } from '@klozbuy/ui';

export type SellerSection =
  | 'overview'
  | 'listings'
  | 'leads'
  | 'requests'
  | 'reviews'
  | 'boosts'
  | 'profile'
  | 'verification'
  | 'new';

export interface SellerNavItem {
  key: SellerSection;
  label: string;
  icon: IconName;
  /** Path under /sell/:shopId. */
  path: string;
}

export const SELLER_NAV: SellerNavItem[] = [
  { key: 'overview', label: 'Overview', icon: 'chart', path: '' },
  { key: 'listings', label: 'Listings', icon: 'tag', path: '/listings' },
  { key: 'leads', label: 'Leads', icon: 'chat', path: '/leads' },
  { key: 'requests', label: 'Buyer requests', icon: 'megaphone', path: '/requests' },
  { key: 'reviews', label: 'Reviews', icon: 'star', path: '/reviews' },
  { key: 'boosts', label: 'Boosts', icon: 'zap', path: '/boosts' },
  { key: 'profile', label: 'Shop profile', icon: 'store', path: '/profile' },
  { key: 'verification', label: 'Verification', icon: 'shield-check', path: '/verification' },
];

export const sellerHref = (shopId: string, path: string) => `/sell/${shopId}${path}`;
