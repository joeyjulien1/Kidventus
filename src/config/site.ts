export interface Phone {
  id: 'primary' | 'secondary';
  /** Local format shown on the page */
  display: string;
  /** International format shown on the page */
  intl: string;
  /** Digits only, used for wa.me links */
  wa: string;
  /** Used for tel: links */
  tel: string;
}

export const PHONES: Phone[] = [
  { id: 'primary', display: '81 274 578', intl: '+961 81 274 578', wa: '96181274578', tel: '+96181274578' },
  { id: 'secondary', display: '70 638 083', intl: '+961 70 638 083', wa: '96170638083', tel: '+96170638083' },
];

export const SITE = {
  name: 'Kidventus',
  owner: 'Carl Mansour',
  tagline: 'Kids Entertainment & Events',
  location: 'Lebanon',
  instagram: {
    brand: { handle: '@kidventus', url: 'https://www.instagram.com/kidventus/' },
    owner: { handle: '@carlmansour_', url: 'https://www.instagram.com/carlmansour_/' },
  },
} as const;

export const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About Us' },
  { id: 'shows', label: 'Our Shows' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'contact', label: 'Contact' },
] as const;

export type NavId = (typeof NAV_LINKS)[number]['id'];
