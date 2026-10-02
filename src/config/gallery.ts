/* ---------- Video reel (real Kidventus clips, cropped to 4:5) ---------- */

export interface Reel {
  id: string;
  title: string;
  tag: string;
  blurb: string;
  src: string;
  poster: string;
}

export const REELS: Reel[] = [
  {
    id: 'tannourine',
    title: 'Tannourine Street Festival',
    tag: 'Stage show',
    blurb: 'We rocked Tannourine — characters, music and a crowd that never stopped dancing.',
    src: '/media/gallery/kidventus-tannourine-festival.mp4',
    poster: '/media/gallery/kidventus-tannourine-festival.jpg',
  },
  {
    id: 'kian-science',
    title: 'Kian’s 6th Birthday',
    tag: 'Science birthday',
    blurb: 'A whole adventure — a picnic with friends, our epic science show and some explosive fun.',
    src: '/media/gallery/kidventus-kian-science-birthday.mp4',
    poster: '/media/gallery/kidventus-kian-science-birthday.jpg',
  },
  {
    id: 'glow',
    title: 'Let’s Glow!',
    tag: 'Glow party',
    blurb: 'Glow-in-the-dark face painting, neon vibes and the ultimate snow experience.',
    src: '/media/gallery/kidventus-glow-party.mp4',
    poster: '/media/gallery/kidventus-glow-party.jpg',
  },
  {
    id: 'little-royals',
    title: 'Little Royals',
    tag: 'Princess birthday',
    blurb: 'Even toddlers can be part of the magic — princesses, games and little dreams coming true.',
    src: '/media/gallery/kidventus-little-royals.mp4',
    poster: '/media/gallery/kidventus-little-royals.jpg',
  },
  {
    id: 'team',
    title: 'Team Gathering',
    tag: 'Behind the magic',
    blurb: "Our summer team night and founder Carl's birthday — foam, sparklers and the crew behind every show.",
    src: '/media/gallery/kidventus-team-gathering.mp4',
    poster: '/media/gallery/kidventus-team-gathering.jpg',
  },
];
