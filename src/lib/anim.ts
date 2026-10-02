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
