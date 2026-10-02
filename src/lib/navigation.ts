import { ScrollTrigger, prefersReducedMotion } from './gsap';
import type { ShowId } from '../config/shows';

/*
 * In-page navigation.
 *
 * A small requestAnimationFrame scroller instead of a tweening plugin: iOS Safari nudges the
 * scroll position by a few pixels while scrolling programmatically, which made "auto-kill"
 * heuristics cancel the scroll before it moved (menu links, logo and "Back to top" did nothing).
 * Long trips jump most of the way instantly and glide the last stretch, so we never race through
 * every scroll-driven animation in between.
 */

let frame = 0;
let detachInput: (() => void) | null = null;
let autoUntil = 0;

/** True while (and shortly after) the page is being scrolled by a link rather than by the user. */
export const isAutoScrolling = () => performance.now() < autoUntil;

function stopGlide() {
  cancelAnimationFrame(frame);
  frame = 0;
  detachInput?.();
  detachInput = null;
}

/** Scroll-scrubbed animations ease toward their new position; after a jump, finish that instantly. */
function settleScrubbedAnimations() {
  ScrollTrigger.update();
  ScrollTrigger.getAll().forEach((st) => {
    // only scrubbed triggers have a catch-up tween; others return nothing useful here
    const tween = st.getTween() as gsap.core.Tween | undefined | false;
    if (tween && typeof tween.progress === 'function') tween.progress(1);
  });
}

function resolveY(target: string | number): number | null {
  let y: number;
  if (typeof target === 'number') {
    y = target;
  } else {
    const el = document.getElementById(target);
    if (!el) return null;
    const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
    y = el.getBoundingClientRect().top + window.scrollY - margin;
  }
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return Math.round(Math.max(0, Math.min(max, y)));
}

/** Instantly move to a section (used behind the full-screen menu, and for reduced motion). */
export function jumpTo(target: string | number) {
  const y = resolveY(target);
  if (y === null) return;
  stopGlide();
  autoUntil = performance.now() + 500;
  window.scrollTo(0, y);
  settleScrubbedAnimations();
}

/** Smoothly scroll to a section (or an absolute y position). Respects reduced motion. */
export function scrollToTarget(target: string | number, onDone?: () => void) {
  const y = resolveY(target);
  if (y === null) return;
  stopGlide();

  if (prefersReducedMotion()) {
    window.scrollTo(0, y);
    onDone?.();
    return;
  }

  const vh = window.innerHeight;
  let from = window.scrollY;
  const far = Math.abs(y - from) > vh * 1.25;
  if (far) {
    // Jump to just before the destination, then glide in
    from = y - Math.sign(y - from) * vh * 0.75;
    window.scrollTo(0, from);
    settleScrubbedAnimations();
  }

  const delta = y - from;
  if (Math.abs(delta) < 2) {
    window.scrollTo(0, y);
    onDone?.();
    return;
  }

  const duration = far ? 700 : Math.min(1100, 500 + Math.abs(delta) * 0.45);
  autoUntil = performance.now() + duration + 400;
  const ease = far ? (t: number) => 1 - Math.pow(1 - t, 3) : (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const start = performance.now();

  // Any real user input takes over immediately
  const cancel = () => {
    autoUntil = 0;
    stopGlide();
  };
  const opts: AddEventListenerOptions = { passive: true };
  window.addEventListener('wheel', cancel, opts);
  window.addEventListener('touchstart', cancel, opts);
  window.addEventListener('keydown', cancel);
  detachInput = () => {
    window.removeEventListener('wheel', cancel);
    window.removeEventListener('touchstart', cancel);
    window.removeEventListener('keydown', cancel);
  };

  const step = (now: number) => {
    const p = Math.min(1, (now - start) / duration);
    window.scrollTo(0, from + delta * ease(p));
    if (p < 1) {
      frame = requestAnimationFrame(step);
    } else {
      frame = 0;
      detachInput?.();
      detachInput = null;
      onDone?.();
    }
  };
  frame = requestAnimationFrame(step);
}

/** Move keyboard focus to a section after arriving (without scrolling again). */
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
