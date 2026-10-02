import { memo } from 'react';
import { seeded } from '../../../lib/random';
import { PLUM, type SceneHold } from './types';
import './TeensArt.css';

const rand = seeded(5);
const FACET = 15;
const FACETS: { x: number; y: number; c: string }[] = [];
const FACET_COLORS = ['#efe6ff', '#c9b6ff', '#9b7be8', '#ffffff', '#ff9ad5', '#7fe8ff', '#b39bf0'];
for (let y = 58; y < 244; y += FACET) {
  for (let x = 196; x < 420; x += FACET) {
    FACETS.push({ x, y, c: FACET_COLORS[(rand() * FACET_COLORS.length) | 0] });
  }
}

const BEAMS = [
  { c: '#ff2bd6', a: -38 },
  { c: '#2bf0ff', a: -12 },
  { c: '#fcd871', a: 14 },
  { c: '#c8f04b', a: 40 },
];

const BARS = Array.from({ length: 10 }, (_, i) => ({ x: 128 + i * 35, d: -rand() * 1.2, s: 0.55 + rand() * 0.6 }));

const SPARKS = Array.from({ length: 10 }, () => ({ x: 40 + rand() * 520, y: 40 + rand() * 360, s: 0.4 + rand() * 0.6, d: -rand() * 2 }));

export const TeensArt = memo(function TeensArt() {
  return (
    <div className="art art--teens">
      <svg className="art__svg" viewBox="0 0 600 600" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id="tg-ball">
            <circle cx="300" cy="150" r="92" />
          </clipPath>
          <linearGradient id="tg-bar" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#ff2bd6" />
            <stop offset="1" stopColor="#2bf0ff" />
          </linearGradient>
          <radialGradient id="tg-fade-g" cx="50%" cy="55%" r="50%">
            <stop offset="0.55" stopColor="#fff" />
            <stop offset="1" stopColor="#000" />
          </radialGradient>
          <mask id="tg-fade" maskUnits="userSpaceOnUse" x="-200" y="0" width="1000" height="620">
            <rect x="-200" y="0" width="1000" height="620" fill="url(#tg-fade-g)" />
          </mask>
          <linearGradient id="tg-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ff2bd6" stopOpacity="0" />
            <stop offset="1" stopColor="#ff2bd6" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        {/* Synthwave floor */}
        <g className="tg-floor" stroke="url(#tg-floor)" strokeWidth="2.5" mask="url(#tg-fade)">
          {Array.from({ length: 15 }, (_, i) => {
            const x = -420 + i * 100;
            return <path key={i} d={`M300 330L${x} 600`} />;
          })}
          {[372, 392, 418, 452, 496, 552].map((y) => (
            <path key={y} d={`M0 ${y}H600`} />
          ))}
        </g>

        {/* Light beams */}
        <g className="tg-beams">
          {BEAMS.map((b, i) => (
            <path
              key={i}
              className="tg-beam"
              d="M300 150L250 640H350Z"
              fill={b.c}
              opacity="0.26"
              style={{ ['--a' as string]: `${b.a}deg`, animationDelay: `${i * -1.3}s` }}
            />
          ))}
        </g>

        {/* Speakers */}
        {[
          [22, 'l'],
          [488, 'r'],
        ].map(([x, side]) => (
          <g key={side as string}>
            <rect x={x as number} y="396" width="90" height="164" rx="12" fill="#1b0f33" stroke={PLUM} strokeWidth="5" />
            <rect x={x as number} y="396" width="90" height="164" rx="12" fill="none" stroke="#ff2bd6" strokeWidth="2" opacity="0.6" />
            <circle className="tg-woofer" cx={(x as number) + 45} cy="510" r="28" fill="#2c1a4f" stroke="#2bf0ff" strokeWidth="4" />
            <circle cx={(x as number) + 45} cy="510" r="9" fill="#2bf0ff" />
            <circle cx={(x as number) + 45} cy="436" r="14" fill="#2c1a4f" stroke="#ff2bd6" strokeWidth="3" />
          </g>
        ))}

        {/* Equalizer */}
        <g className="tg-eq">
          {BARS.map((b, i) => (
            <rect
              key={i}
              className="tg-bar"
              x={b.x}
              y="440"
              width="22"
              height="120"
              rx="6"
              fill="url(#tg-bar)"
              style={{ animationDelay: `${b.d}s`, animationDuration: `${b.s}s` }}
            />
          ))}
        </g>

        {/* Disco ball */}
        <g className="tg-ball">
          <path d="M300 -40V58" stroke="#c9b6ff" strokeWidth="4" />
          <circle cx="300" cy="150" r="92" fill="#9b7be8" />
          <g clipPath="url(#tg-ball)">
            <g className="tg-facets">
              {FACETS.map((f, i) => (
                <rect key={i} x={f.x} y={f.y} width={FACET - 2} height={FACET - 2} rx="2" fill={f.c} />
              ))}
            </g>
            <circle cx="300" cy="150" r="92" fill="none" stroke="#2c1a4f" strokeWidth="40" opacity="0.35" />
          </g>
          <circle cx="300" cy="150" r="92" fill="none" stroke={PLUM} strokeWidth="6" />
          <ellipse cx="266" cy="108" rx="24" ry="14" fill="#fff" opacity="0.85" transform="rotate(-30 266 108)" />
        </g>

        {SPARKS.map((s, i) => (
          <g key={i} transform={`translate(${s.x.toFixed(0)} ${s.y.toFixed(0)}) scale(${s.s.toFixed(2)})`}>
            <path className="tg-spark" d="M0-20C1-6 6-1 20 0 6 1 1 6 0 20-1 6-6 1-20 0-6-1-1-6 0-20Z" fill="#fff" style={{ animationDelay: `${s.d}s` }} />
          </g>
        ))}
      </svg>

      <p className="tg-neon">
        <span>Let’s</span> <span>party!</span>
      </p>
    </div>
  );
});

export const teensHold: SceneHold = (tl, scene, at, dur) => {
  tl.fromTo(scene.querySelector('.tg-ball'), { y: -260 }, { y: 0, duration: dur * 0.35, ease: 'bounce.out' }, at)
    .fromTo(scene.querySelector('.tg-beams'), { opacity: 0 }, { opacity: 1, duration: dur * 0.2 }, at + dur * 0.3)
    .fromTo(scene.querySelector('.tg-neon'), { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: dur * 0.15, ease: 'steps(4)' }, at + dur * 0.4);
};
