import { memo, useCallback, type PointerEvent } from 'react';
import { seeded } from '../../../lib/random';
import { PLUM, type SceneHold } from './types';
import './BubbleArt.css';

const rand = seeded(42);
const BUBBLES = Array.from({ length: 11 }, (_, i) => ({
  x: 4 + ((i * 9.1 + rand() * 6) % 92),
  size: 8 + rand() * 13,
  dur: 7 + rand() * 6,
  delay: -rand() * 12,
  sway: 2.6 + rand() * 2,
}));

const WAND_STAR = 'M100 14C106 62 122 78 170 84 122 90 106 106 100 154 94 106 78 90 30 84 78 78 94 62 100 14Z';

const DROPS = Array.from({ length: 7 }, (_, i) => (i * 360) / 7);

function popBubble(el: HTMLElement) {
  if (el.classList.contains('is-popped')) return;
  el.classList.add('is-popped');
  window.setTimeout(() => {
    el.classList.remove('is-popped');
    const rise = el.querySelector<HTMLElement>('.bub__rise');
    if (rise) {
      // restart the rise from the bottom
      rise.style.animation = 'none';
      void rise.offsetHeight;
      rise.style.animation = '';
      rise.style.animationDelay = '0s';
    }
  }, 650);
}

export const BubbleArt = memo(function BubbleArt() {
  const onPop = useCallback((e: PointerEvent<HTMLSpanElement>) => popBubble(e.currentTarget), []);

  return (
    <div className="art art--bubble">
      <div className="bub__giant">
        <div className="bub__jelly">
          <span className="bub__film">
            <span className="bub__film-spin" />
          </span>
          <img className="bub__star" src="/brand/kidventus-star-1.svg" alt="" draggable={false} loading="eager" />
        </div>
      </div>

      <svg className="bub__wand" viewBox="0 0 200 280" aria-hidden="true" focusable="false">
        <rect x="93" y="150" width="14" height="128" rx="7" fill="#5daedd" stroke={PLUM} strokeWidth="5" transform="rotate(-14 100 210)" />
        <path d={WAND_STAR} fill="url(#bub-film)" stroke={PLUM} strokeWidth="14" strokeLinejoin="round" />
        <path d={WAND_STAR} fill="none" stroke="#ff8ac8" strokeWidth="5" strokeLinejoin="round" />
        <defs>
          <linearGradient id="bub-film" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ff9ad5" stopOpacity="0.35" />
            <stop offset="0.5" stopColor="#9fe9ff" stopOpacity="0.25" />
            <stop offset="1" stopColor="#fff3a0" stopOpacity="0.35" />
          </linearGradient>
        </defs>
      </svg>

      <div className="bub__field">
        {BUBBLES.map((b, i) => (
          <span key={i} className="bub" style={{ left: `${b.x}%`, width: `${b.size}%` }} onPointerDown={onPop}>
            <span className="bub__rise" style={{ animationDuration: `${b.dur}s`, animationDelay: `${b.delay}s` }}>
              <span className="bub__sway" style={{ animationDuration: `${b.sway}s` }}>
                <span className="bub__ball" />
                {DROPS.map((a) => (
                  <span key={a} className="bub__drop" style={{ ['--a' as string]: `${a}deg` }} />
                ))}
              </span>
            </span>
          </span>
        ))}
      </div>

      <p className="bub__hint" aria-hidden="true">
        Pop the bubbles!
        <svg viewBox="0 0 60 40">
          <path d="M4 6c18 2 34 12 44 28m0 0-12-3m12 3 1-12" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </p>
    </div>
  );
});

export const bubbleHold: SceneHold = (tl, scene, at, dur) => {
  tl.fromTo(scene.querySelector('.bub__wand'), { rotation: -20, y: 40 }, { rotation: 18, y: 0, duration: dur, transformOrigin: '50% 100%' }, at)
    .fromTo(scene.querySelector('.bub__giant'), { scale: 0.86 }, { scale: 1.06, duration: dur }, at);
};
