import { useRef, type ReactNode } from 'react';
import { gsap, ScrollTrigger, useGSAP, MQ } from '../../lib/gsap';
import './Chapters.css';

/** Background colors the page melts through as each chapter scrolls in. */
const THEMES = [
  { id: 'gallery', bg: '#0f326f' },
  { id: 'booking', bg: '#0a2454' },
  { id: 'contact', bg: '#06183c' },
];

export function Chapters({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const el = ref.current!;
        el.classList.add('is-blending');
        el.style.backgroundColor = THEMES[0].bg;
        THEMES.slice(1).forEach((theme, i) => {
          const mix = gsap.utils.interpolate(THEMES[i].bg, theme.bg);
          ScrollTrigger.create({
            trigger: `#${theme.id}`,
            start: 'top 85%',
            end: 'top 25%',
            onUpdate: (self) => {
              el.style.backgroundColor = mix(self.progress);
            },
          });
        });
        return () => {
          el.classList.remove('is-blending');
          el.style.backgroundColor = '';
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div className="chapters" ref={ref}>
      {children}
    </div>
  );
}
