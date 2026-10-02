/**
 * fromTo() for several elements, one tween each, offset by `each`.
 * (A single staggered fromTo inside a scrubbed timeline only primes the first
 * target's start state; individual tweens prime every element immediately.)
 */
export function fromToEach(
  tl: gsap.core.Timeline,
  targets: Element[] | NodeListOf<Element>,
  from: gsap.TweenVars,
  to: gsap.TweenVars,
  at: number,
  each = 0,
) {
  Array.from(targets).forEach((el, i) => {
    tl.fromTo(el, { ...from }, { ...to }, at + i * each);
  });
  return tl;
}

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

/**
 * Plays a scroll-scrubbed timeline to the end and back once, right after load (in idle time).
 * Every tween reads its start values up front, so the first scroll through a section is as smooth
 * as the tenth (otherwise each tween forces a style read the first time the playhead reaches it).
 * Runs synchronously, so nothing in between is ever painted. Returns a cancel function.
 */
export function primeTimeline(tl: gsap.core.Timeline, after?: () => void) {
  const w = window as IdleWindow;
  let done = false;
  const run = () => {
    if (done) return;
    done = true;
    const p = tl.progress();
    tl.progress(1, true).progress(p, true);
    after?.();
  };
  const id = w.requestIdleCallback ? w.requestIdleCallback(run, { timeout: 1500 }) : window.setTimeout(run, 500);
  return () => {
    done = true;
    if (w.cancelIdleCallback) w.cancelIdleCallback(id);
    else window.clearTimeout(id);
  };
}
