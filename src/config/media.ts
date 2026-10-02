import type { ShowId } from './shows';

/**
 * Real Kidventus photos & videos.
 *
 * Drop files into /public/media and reference them here — the site picks them up
 * automatically. Anything left as `null` / missing falls back to the illustrated artwork.
 *
 *   hero:  a short (8–15s), muted, looping clip shown behind the hero, e.g. '/media/hero-loop.mp4'
 *   shows: one clip or photo per show, shown in a "magic window" inside its scene
 *   team:  a team photo shown in the About section
 *
 * Videos: MP4 (H.264), 720p, ideally under 4 MB each. Always add a `poster` (JPG/WebP) too.
 */
export interface MediaClip {
  video?: string;
  poster?: string;
  image?: string;
  alt: string;
}

export const MEDIA: {
  hero: MediaClip | null;
  shows: Partial<Record<ShowId, MediaClip>>;
  team: MediaClip | null;
} = {
  hero: null,
  shows: {
    // bubble: { video: '/media/shows/bubble.mp4', poster: '/media/shows/bubble.jpg', alt: 'Kids playing with giant bubbles at a Kidventus Bubble Show' },
  },
  team: null,
};
