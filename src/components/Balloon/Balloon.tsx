import { useId } from 'react';

export type BalloonColor = 'pink' | 'blue' | 'yellow' | 'purple' | 'orange' | 'lime' | 'magenta';

export const BALLOON_COLORS: Record<BalloonColor, { light: string; mid: string; dark: string }> = {
  pink: { light: '#ffd2e8', mid: '#ff74b8', dark: '#cf2d7f' },
  blue: { light: '#d8f0ff', mid: '#5daedd', dark: '#2a72a8' },
  yellow: { light: '#fff6c9', mid: '#fcd871', dark: '#dba32a' },
  purple: { light: '#ecd0f7', mid: '#a560c4', dark: '#652a83' },
  orange: { light: '#ffdcbc', mid: '#ff8a2b', dark: '#d3591a' },
  lime: { light: '#f3ffd0', mid: '#c8f04b', dark: '#86ad18' },
  magenta: { light: '#ffb0d6', mid: '#f0388f', dark: '#a8115a' },
};

interface BalloonSvgProps {
  color: BalloonColor;
  /** Sticker-style plum outline used inside the illustrated scenes */
  outlined?: boolean;
  className?: string;
}

/** A glossy, 3D-shaded balloon. viewBox is 100 × 170 (body + knot + string). */
export function BalloonSvg({ color, outlined = false, className }: BalloonSvgProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const c = BALLOON_COLORS[color];
  const body =
    'M50 4C79 4 96 28 96 56c0 32-24 56-44 61h-4C28 112 4 88 4 56 4 28 21 4 50 4Z';
  return (
    <svg className={className} viewBox="0 0 100 170" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`b${uid}`} cx="34%" cy="28%" r="78%">
          <stop offset="0" stopColor={c.light} />
          <stop offset="0.42" stopColor={c.mid} />
          <stop offset="1" stopColor={c.dark} />
        </radialGradient>
      </defs>
      <path
        d="M50 123c-8 12 8 21 0 32-5 7 3 11 0 15"
        fill="none"
        stroke={outlined ? '#5c2468' : 'rgba(255,255,255,0.75)'}
        strokeWidth={outlined ? 2.4 : 1.6}
        strokeLinecap="round"
      />
      <path d="M44 125l6-9 6 9c-4 2.5-8 2.5-12 0Z" fill={c.dark} stroke={outlined ? '#5c2468' : 'none'} strokeWidth="2.4" strokeLinejoin="round" />
      <path d={body} fill={`url(#b${uid})`} stroke={outlined ? '#5c2468' : 'none'} strokeWidth="4" />
      <ellipse cx="31" cy="33" rx="8.5" ry="16" transform="rotate(28 31 33)" fill="#fff" opacity="0.6" />
      <ellipse cx="25" cy="58" rx="3.2" ry="5" fill="#fff" opacity="0.38" />
    </svg>
  );
}
