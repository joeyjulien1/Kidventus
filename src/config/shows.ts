export type ShowId = 'birthday' | 'bubble' | 'science' | 'theater' | 'teens';

export interface Show {
  id: ShowId;
  /** Display name */
  name: string;
  /** Short label for tabs & chips */
  short: string;
  /** How the show is named inside the WhatsApp message ("I'm interested in booking …") */
  messageName: string;
  tagline: string;
  description: string;
  highlights: string[];
  /** Clip-path the scene is revealed from when it enters the stage */
  reveal: { from: string; to: string };
}

export const SHOWS: Show[] = [
  {
    id: 'birthday',
    name: 'Birthday Shows',
    short: 'Birthdays',
    messageName: 'a Birthday Show',
    tagline: 'Birthdays, but bigger.',
    description:
      'Colorful celebrations packed with energetic entertainment, performers, games and music — all built around the birthday star, so every guest goes home with a story to tell.',
    highlights: ['Energetic hosts & performers', 'Games, music & dancing', 'Built around your child'],
    reveal: { from: 'inset(0% 0% 0% 0%)', to: 'inset(0% 0% 0% 0%)' },
  },
  {
    id: 'bubble',
    name: 'Bubble Show',
    short: 'Bubbles',
    messageName: 'the Bubble Show',
    tagline: 'A world made of bubbles.',
    description:
      'Giant bubbles, clouds of floating bubbles and shimmering rainbow colors — a dreamy, hands-on show where kids chase, catch and gasp at every pop.',
    highlights: ['Giant bubbles', 'Floating bubble clouds', 'Interactive & hands-on'],
    reveal: { from: 'circle(0% at 68% 55%)', to: 'circle(150% at 68% 55%)' },
  },
  {
    id: 'science',
    name: 'Science Show',
    short: 'Science',
    messageName: 'the Science Show',
    tagline: 'Experiments that go WOW.',
    description:
      'An exciting scientific adventure full of experiments, colorful reactions and big “whoa!” moments — entertainment that sneaks in a little learning.',
    highlights: ['Live experiments', 'Colorful reactions', 'Fun meets learning'],
    reveal: {
      from: 'inset(100% 0% 0% 0% round 50% 50% 0% 0%)',
      to: 'inset(0% 0% 0% 0% round 0% 0% 0% 0%)',
    },
  },
  {
    id: 'theater',
    name: 'Kids Theater',
    short: 'Theater',
    messageName: 'a Kids Theater show',
    tagline: 'Curtains up, imaginations on.',
    description:
      "Theatrical performances with characters, storytelling and interactive moments — kids don't just watch the story, they become part of it.",
    highlights: ['Characters & costumes', 'Storytelling', 'Audience participation'],
    reveal: { from: 'inset(0% 50% 0% 50%)', to: 'inset(0% 0% 0% 0%)' },
  },
  {
    id: 'teens',
    name: 'Teens Parties',
    short: 'Teens',
    messageName: 'a Teens Party',
    tagline: 'Turn it up for teens.',
    description:
      'Modern party experiences with music, lighting and high energy — tailored to teenagers, so it feels like their night, not a kids’ party.',
    highlights: ['Music & lighting', 'Themed party nights', 'High-energy hosts'],
    reveal: {
      from: 'polygon(0% 0%, 0% 0%, -40% 100%, -40% 100%)',
      to: 'polygon(0% 0%, 140% 0%, 100% 100%, -40% 100%)',
    },
  },
];

export const SHOW_BY_ID = Object.fromEntries(SHOWS.map((s) => [s.id, s])) as Record<ShowId, Show>;
