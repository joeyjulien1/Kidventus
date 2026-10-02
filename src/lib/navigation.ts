import { gsap, prefersReducedMotion } from './gsap';
import type { ShowId } from '../config/shows';

/** Smoothly scroll to a section (or an absolute y position). Respects reduced motion. */
export function scrollToTarget(target: string | number, onDone?: () => void) {
  const y =
    typeof target === 'number'
      ? target
      : (() => {
          const el = document.getElementById(target);
          if (!el) return null;
          const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
          return el.getBoundingClientRect().top + window.scrollY - margin;
        })();
  if (y === null) return;

  if (prefersReducedMotion()) {
    window.scrollTo(0, y);
    onDone?.();
    return;
  }
  const distance = Math.abs(window.scrollY - y);
  const duration = gsap.utils.clamp(0.7, 1.8, distance / 3200);
  gsap.to(window, {
    scrollTo: { y, autoKill: true },
    duration,
    ease: 'power3.inOut',
    overwrite: true,
    onComplete: onDone,
  });
}

/** Move keyboard focus to a section after jumping to it (without scrolling again). */
export function focusSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}

export function goToSection(id: string) {
  scrollToTarget(id, () => focusSection(id));
}

/* ---------- "Plan this show" → preselect a show in the booking builder ---------- */

const SELECT_EVENT = 'kv:select-show';

export function requestShowBooking(show: ShowId) {
  window.dispatchEvent(new CustomEvent<ShowId>(SELECT_EVENT, { detail: show }));
  goToSection('plan');
}

export function onShowBookingRequest(handler: (show: ShowId) => void) {
  const listener = (e: Event) => handler((e as CustomEvent<ShowId>).detail);
  window.addEventListener(SELECT_EVENT, listener);
  return () => window.removeEventListener(SELECT_EVENT, listener);
}
