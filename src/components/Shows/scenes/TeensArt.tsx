import { memo, type CSSProperties } from 'react';
import { seeded } from '../../../lib/random';
import { PLUM, at, box, type SceneHold } from './types';
import './TeensArt.css';

const rand = seeded(5);

const BEAMS = [
  { c: '#ff2bd6', a: -38 },
  { c: '#2bf0ff', a: -12 },
  { c: '#fcd871', a: 14 },
  { c: '#c8f04b', a: 40 },
];

const BARS = Array.from({ length: 10 }, () => ({ d: -rand() * 1.2, s: 0.55 + rand() * 0.6 }));

const SPARKS = Array.from({ length: 10 }, () => ({ x: 40 + rand() * 520, y: 40 + rand() * 360, s: 16 + rand() * 24, d: -rand() * 2 }));

const SPEAKERS = [22, 488];

export const TeensArt = memo(function TeensArt() {
  return (
    <div className="art art--teens">
      {/* Synthwave floor (static) */}
      <svg className="tg-floor art__svg" viewBox="0 0 600 600" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="tg-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ff2bd6" stopOpacity="0" />
            <stop offset="1" stopColor="#ff2bd6" stopOpacity="0.85" />
          </linearGradient>
        </defs>
        <g stroke="url(#tg-floor)" strokeWidth="2.5">
          {Array.from({ length: 15 }, (_, i) => (
            <path key={i} d={`M300 330L${-420 + i * 100} 600`} />
          ))}
          {[372, 392, 418, 452, 496, 552].map((y) => (
            <path key={y} d={`M0 ${y}H600`} />
          ))}
        </g>
      </svg>

      {/* Light beams sweeping from the ball */}
      <div className="tg-beams" aria-hidden="true">
        {BEAMS.map((b, i) => (
          <span
            key={i}
            className="tg-beam"
            style={{ ['--a' as string]: `${b.a}deg`, ['--c' as string]: b.c, animationDelay: `${i * -1.3}s` } as CSSProperties}
          />
        ))}
      </div>

      {/* Speakers (static) */}
      <svg className="art__svg" viewBox="0 0 600 600" aria-hidden="true" focusable="false">
        {SPEAKERS.map((x) => (
          <g key={x}>
            <rect x={x} y="396" width="90" height="164" rx="12" fill="#1b0f33" stroke={PLUM} strokeWidth="5" />
            <rect x={x} y="396" width="90" height="164" rx="12" fill="none" stroke="#ff2bd6" strokeWidth="2" opacity="0.6" />
            <circle cx={x + 45} cy="436" r="14" fill="#2c1a4f" stroke="#ff2bd6" strokeWidth="3" />
          </g>
        ))}
      </svg>
      {SPEAKERS.map((x) => (
        <span key={x} className="tg-woofer" style={box(x + 45 - 30, 480, 60, 60)} aria-hidden="true" />
      ))}

      {/* Equalizer */}
      <div className="tg-eq" aria-hidden="true">
        {BARS.map((b, i) => (
          <span key={i} className="tg-bar" style={{ animationDelay: `${b.d}s`, animationDuration: `${b.s}s` }} />
        ))}
      </div>

      {/* Disco ball — drops in with scroll, facets spin on the GPU */}
      <div className="tg-ball" style={box(208, 58, 184, 184)} aria-hidden="true">
        <span className="tg-ball__clip">
          <span className="tg-facets" />
        </span>
        <span className="tg-ball__shine" />
      </div>

      {SPARKS.map((s, i) => (
        <span key={i} className="art-spark" style={{ ...at(s.x, s.y), width: `${s.s / 6}%`, animationDelay: `${s.d}s`, animationDuration: '1.8s' }} aria-hidden="true" />
      ))}

      <p className="tg-neon">
        <span>Let’s</span> <span>party!</span>
      </p>
    </div>
  );
});

export const teensHold: SceneHold = (tl, scene, at, dur) => {
  tl.fromTo(scene.querySelector('.tg-ball'), { yPercent: -170 }, { yPercent: 0, duration: dur * 0.35, ease: 'bounce.out' }, at)
    .fromTo(scene.querySelector('.tg-beams'), { opacity: 0 }, { opacity: 1, duration: dur * 0.2 }, at + dur * 0.3)
    .fromTo(scene.querySelector('.tg-neon'), { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: dur * 0.15, ease: 'steps(4)' }, at + dur * 0.4);
};
