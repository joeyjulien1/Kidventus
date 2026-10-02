import type { JSX, SVGProps } from 'react';
import type { ShowId } from '../config/shows';

type IconProps = SVGProps<SVGSVGElement>;

const base = (props: IconProps) => ({
  'aria-hidden': true as const,
  focusable: false as const,
  ...props,
});

export function WhatsAppIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...base(props)}>
      <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.01Zm-7.01 15.24h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.22-8.24 8.22Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.12-1.04-.38-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.43.06-.66.31-.22.25-.86.85-.86 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29Z" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...base(props)}>
      <rect x="3" y="3" width="18" height="18" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...base(props)}>
      <path d="M21 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 1.1 4.2 2 2 0 0 1 3.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L7.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" {...base(props)}>
      <path d="M4 12h15M13 5.5 19.5 12 13 18.5" />
    </svg>
  );
}

export function ArrowDownIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" {...base(props)}>
      <path d="M12 4v15M5.5 13 12 19.5 18.5 13" />
    </svg>
  );
}

export function ChevronIcon({ dir = 'right', ...props }: IconProps & { dir?: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" {...base(props)}>
      <path d={dir === 'right' ? 'M9 5l7 7-7 7' : 'M15 5l-7 7 7 7'} />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" {...base(props)}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...base(props)}>
      <rect x="3" y="4.5" width="18" height="16.5" rx="3.5" />
      <path d="M3 9.5h18M8 2.5v4M16 2.5v4" />
    </svg>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...base(props)}>
      <path d="M12 21.5s-7-6.1-7-11.7a7 7 0 0 1 14 0c0 5.6-7 11.7-7 11.7Z" />
      <circle cx="12" cy="9.8" r="2.6" />
    </svg>
  );
}

export function SparkleIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...base(props)}>
      <path d="M12 0C12.6 7.5 16.5 11.4 24 12 16.5 12.6 12.6 16.5 12 24 11.4 16.5 7.5 12.6 0 12 7.5 11.4 11.4 7.5 12 0Z" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...base(props)}>
      <path d="M4.5 12.5 10 18 19.5 6.5" />
    </svg>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...base(props)}>
      <rect x="4.5" y="10.5" width="15" height="10.5" rx="2.5" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

/* ---------- Show sticker icons (brand illustration style: plum outline + flat fills) ---------- */

const PLUM = '#5c2468';
const sw = { stroke: PLUM, strokeWidth: 3.2, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

export function CakeGlyph(props: IconProps) {
  return (
    <svg viewBox="0 0 64 64" {...base(props)}>
      <path d="M32 6c3 4 3 7 0 9-3-2-3-5 0-9Z" fill="#ff8a2b" {...sw} strokeWidth={2.4} />
      <rect x="29.5" y="15" width="5" height="10" rx="1.5" fill="#fcd871" {...sw} strokeWidth={2.4} />
      <rect x="16" y="25" width="32" height="13" rx="4" fill="#5daedd" {...sw} />
      <rect x="9" y="37" width="46" height="18" rx="5" fill="#ff8ac8" {...sw} />
      <path d="M9.5 42c4 0 4 4 7.5 4s3.6-4 7.5-4 3.6 5 7.5 5 3.6-5 7.5-5 3.6 4 7.5 4 4-4 7.5-4" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <path d="M6 56h52" {...sw} fill="none" />
    </svg>
  );
}

export function BubblesGlyph(props: IconProps) {
  return (
    <svg viewBox="0 0 64 64" {...base(props)}>
      <circle cx="26" cy="34" r="18" fill="#bfe8ff" {...sw} />
      <path d="M17 27a10 10 0 0 1 8-6" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" />
      <circle cx="47" cy="17" r="9" fill="#ffd6ec" {...sw} />
      <circle cx="49" cy="45" r="6.5" fill="#fff2b8" {...sw} />
      <path d="M43 13.5a4 4 0 0 1 3-2" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

export function FlaskGlyph(props: IconProps) {
  return (
    <svg viewBox="0 0 64 64" {...base(props)}>
      <path d="M25 7h14M27 7v15L12.5 49a5 5 0 0 0 4.4 7.4h30.2a5 5 0 0 0 4.4-7.4L37 22V7" fill="#e9f7ff" {...sw} />
      <path d="M18.6 38h26.8l6.7 11.8a4 4 0 0 1-3.5 6H15.4a4 4 0 0 1-3.5-6Z" fill="#c8f04b" stroke="none" />
      <path d="M27 7v15L12.5 49a5 5 0 0 0 4.4 7.4h30.2a5 5 0 0 0 4.4-7.4L37 22V7" fill="none" {...sw} />
      <circle cx="28" cy="46" r="3" fill="#fff" />
      <circle cx="37" cy="49" r="2" fill="#fff" />
      <circle cx="33" cy="30" r="2.4" fill="#5daedd" />
      <circle cx="39" cy="17" r="2" fill="#f0388f" />
    </svg>
  );
}

export function MasksGlyph(props: IconProps) {
  return (
    <svg viewBox="0 0 64 64" {...base(props)}>
      <g transform="rotate(14 42 30)">
        <path d="M30 14c8-3 18-3 24 0 1 14-3 26-12 28-9-2-13-14-12-28Z" fill="#5daedd" {...sw} />
        <path d="M36 25l4 1M46 26l4-1M37 35c3-3 7-3 10 0" fill="none" {...sw} strokeWidth={2.6} />
      </g>
      <g transform="rotate(-12 22 34)">
        <path d="M8 18c8-3 18-3 24 0 1 14-3 26-12 28-9-2-13-14-12-28Z" fill="#fcd871" {...sw} />
        <path d="M13 28c1.5-2 4-2 5.5 0M22 28c1.5-2 4-2 5.5 0M14 35c3 4 9 4 12 0" fill="none" {...sw} strokeWidth={2.6} />
      </g>
    </svg>
  );
}

export function DiscoGlyph(props: IconProps) {
  return (
    <svg viewBox="0 0 64 64" {...base(props)}>
      <path d="M32 3v10" {...sw} />
      <circle cx="32" cy="35" r="21" fill="#c9b6ff" {...sw} />
      <path d="M13 29h38M11.5 38h41M15 47h34M32 14c-7 6-7 36 0 42M32 14c7 6 7 36 0 42M21.5 17c-6 9-6 27 0 36M42.5 17c6 9 6 27 0 36" fill="none" stroke={PLUM} strokeWidth="1.8" opacity="0.55" />
      <path d="M21 24h6v5h-6zM36 33h6v5h-6z" fill="#fff" />
      <path d="M52 9c.4 3 1.6 4.2 4.6 4.6-3 .4-4.2 1.6-4.6 4.6-.4-3-1.6-4.2-4.6-4.6 3-.4 4.2-1.6 4.6-4.6Z" fill="#fcd871" stroke={PLUM} strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

export function SparkGlyph(props: IconProps) {
  return (
    <svg viewBox="0 0 64 64" {...base(props)}>
      <path d="M32 6c1.6 14 9.6 22 24 25.5C41.6 35 33.6 43 32 58 30.4 43 22.4 35 8 31.5 22.4 28 30.4 20 32 6Z" fill="#fcd871" {...sw} />
    </svg>
  );
}

export const SHOW_GLYPHS: Record<ShowId, (p: IconProps) => JSX.Element> = {
  birthday: CakeGlyph,
  bubble: BubblesGlyph,
  science: FlaskGlyph,
  theater: MasksGlyph,
  teens: DiscoGlyph,
};

export function ShowGlyph({ id, ...props }: IconProps & { id: ShowId }) {
  const Glyph = SHOW_GLYPHS[id];
  return <Glyph {...props} />;
}

export function PlayIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...base(props)}>
      <path d="M8 5.2v13.6a1 1 0 0 0 1.5.86l11-6.8a1 1 0 0 0 0-1.72l-11-6.8A1 1 0 0 0 8 5.2Z" />
    </svg>
  );
}

export function PauseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...base(props)}>
      <rect x="6" y="4.5" width="4.2" height="15" rx="1.4" />
      <rect x="13.8" y="4.5" width="4.2" height="15" rx="1.4" />
    </svg>
  );
}

export function SoundIcon({ muted = false, ...props }: IconProps & { muted?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...base(props)}>
      <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4Z" fill="currentColor" />
      {muted ? <path d="M16 9.5l5 5M21 9.5l-5 5" /> : <path d="M15.5 9a4 4 0 0 1 0 6M18.2 6.5a7.6 7.6 0 0 1 0 11" />}
    </svg>
  );
}
