import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, DrawSVGPlugin, useGSAP);

ScrollTrigger.config({ ignoreMobileResize: true });
gsap.defaults({ ease: 'power3.out' });

/** Media queries shared by every animated component. */
export const MQ = {
  motion: '(prefers-reduced-motion: no-preference)',
  reduced: '(prefers-reduced-motion: reduce)',
  desktop: '(min-width: 900px)',
  mobile: '(max-width: 899.98px)',
  finePointer: '(hover: hover) and (pointer: fine)',
} as const;

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia(MQ.reduced).matches;

export { gsap, ScrollTrigger, useGSAP };
