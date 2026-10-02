import { forwardRef } from 'react';
import './Logo.css';

interface LogoProps {
  className?: string;
  /** Render as a decorative element (when a text label sits next to it) */
  decorative?: boolean;
  /** Gentle idle twinkle on the stars */
  live?: boolean;
  /** Load eagerly (hero / nav) */
  eager?: boolean;
}

/**
 * The Kidventus logo, vectorised from the official artwork and split into
 * the wordmark + three stars so each part can be animated independently.
 */
export const Logo = forwardRef<HTMLSpanElement, LogoProps>(function Logo(
  { className = '', decorative = false, live = false, eager = false },
  ref,
) {
  const loading = eager ? 'eager' : 'lazy';
  return (
    <span
      ref={ref}
      className={`kv-logo${live ? ' kv-logo--live' : ''} ${className}`}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : 'Kidventus'}
      aria-hidden={decorative || undefined}
    >
      <img className="kv-logo__word" src="/brand/kidventus-word.svg" alt="" draggable={false} loading={loading} decoding="async" />
      <img className="kv-logo__star kv-logo__star--3" src="/brand/kidventus-star-3.svg" alt="" draggable={false} loading={loading} />
      <img className="kv-logo__star kv-logo__star--2" src="/brand/kidventus-star-2.svg" alt="" draggable={false} loading={loading} />
      <img className="kv-logo__star kv-logo__star--1" src="/brand/kidventus-star-1.svg" alt="" draggable={false} loading={loading} />
    </span>
  );
});

/** Big star centre, as a fraction of the logo box (used as a zoom origin). */
export const LOGO_STAR_ORIGIN = { x: 0.2338, y: 0.3422 };
