import { memo } from 'react';
import { PLUM, at, box, type SceneHold } from './types';
import './ScienceArt.css';

const FLASK = 'M258 160h84v16h-10v104l116 190c15 25-3 56-32 56H184c-29 0-47-31-32-56l116-190V176h-10Z';

/** Foam cloud above the flask neck (y already includes the +60 drop) */
const FOAM = [
  { cx: 300, cy: 180, r: 52, c: '#ff8ac8' },
  { cx: 246, cy: 152, r: 46, c: '#c8f04b' },
  { cx: 356, cy: 148, r: 48, c: '#fcd871' },
  { cx: 300, cy: 112, r: 52, c: '#fff' },
  { cx: 208, cy: 106, r: 38, c: '#ff8ac8' },
  { cx: 394, cy: 100, r: 38, c: '#c8f04b' },
  { cx: 254, cy: 68, r: 36, c: '#fcd871' },
  { cx: 348, cy: 62, r: 38, c: '#ff8ac8' },
  { cx: 300, cy: 30, r: 32, c: '#fff' },
];

const INNER_BUBBLES = [
  { x: 240, s: 18, d: 0 },
  { x: 290, s: 12, d: -0.8 },
  { x: 330, s: 22, d: -1.6 },
  { x: 365, s: 14, d: -0.4 },
  { x: 270, s: 10, d: -2.1 },
  { x: 315, s: 16, d: -1.2 },
];

const SPARKS: [number, number, number][] = [
  [520, 330, 40],
  [430, 420, 28],
  [80, 280, 32],
  [560, 470, 24],
];

export const ScienceArt = memo(function ScienceArt() {
  return (
    <div className="art art--science">
      {/* Atom — turned by scroll */}
      <svg className="sa-atom art__layer" viewBox="400 76 160 148" style={box(400, 76, 160, 148)} aria-hidden="true" focusable="false">
        <circle cx="480" cy="150" r="16" fill="#f0388f" stroke={PLUM} strokeWidth="4" />
        <ellipse cx="480" cy="150" rx="70" ry="24" fill="none" stroke="#fff" strokeWidth="4" opacity="0.85" />
        <ellipse cx="480" cy="150" rx="70" ry="24" fill="none" stroke="#fff" strokeWidth="4" opacity="0.85" transform="rotate(60 480 150)" />
        <ellipse cx="480" cy="150" rx="70" ry="24" fill="none" stroke="#fff" strokeWidth="4" opacity="0.85" transform="rotate(-60 480 150)" />
        <circle cx="550" cy="150" r="8" fill="#fcd871" stroke={PLUM} strokeWidth="3" />
        <circle cx="445" cy="210" r="8" fill="#c8f04b" stroke={PLUM} strokeWidth="3" />
        <circle cx="445" cy="90" r="8" fill="#5daedd" stroke={PLUM} strokeWidth="3" />
      </svg>

      {/* Lightning doodle */}
      <svg className="sa-zap art__layer" viewBox="78 64 74 130" style={box(78, 64, 74, 130)} aria-hidden="true" focusable="false">
        <path d="M118 70l-34 62h30l-20 56 52-74h-30l22-44Z" fill="#fcd871" stroke={PLUM} strokeWidth="5" strokeLinejoin="round" />
      </svg>

      {/* Foam eruption — grows out of the neck with scroll */}
      <svg className="sa-foam art__layer" viewBox="165 -6 272 242" style={box(165, -6, 272, 242)} aria-hidden="true" focusable="false">
        {FOAM.map((f, i) => (
          <circle key={i} cx={f.cx} cy={f.cy} r={f.r} fill={f.c} stroke={PLUM} strokeWidth="5" />
        ))}
      </svg>

      {/* Test-tube rack + flask (static drawing) */}
      <svg className="art__svg" viewBox="0 0 600 600" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id="sa-flask">
            <path d={FLASK} />
          </clipPath>
          <linearGradient id="sa-liquid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#c8f04b" />
            <stop offset="1" stopColor="#31e0c8" />
          </linearGradient>
        </defs>

        <g>
          {[
            { x: 70, c: '#f0388f', h: 70 },
            { x: 112, c: '#fcd871', h: 50 },
            { x: 154, c: '#5daedd', h: 86 },
          ].map((t) => (
            <g key={t.x}>
              <path d={`M${t.x - 15} 380v116a15 15 0 0 0 30 0V380`} fill="rgba(255,255,255,0.22)" />
              <path d={`M${t.x - 15} ${512 - t.h}h30v${t.h - 16}a15 15 0 0 1-30 0Z`} fill={t.c} />
              <path d={`M${t.x - 15} 380v116a15 15 0 0 0 30 0V380`} fill="none" stroke={PLUM} strokeWidth="5" />
              <rect x={t.x - 20} y="372" width="40" height="12" rx="4" fill="#fff" stroke={PLUM} strokeWidth="4" />
            </g>
          ))}
          <rect x="38" y="452" width="150" height="22" rx="6" fill="#ff8a2b" stroke={PLUM} strokeWidth="5" />
          <rect x="46" y="474" width="14" height="70" rx="4" fill="#ff8a2b" stroke={PLUM} strokeWidth="5" />
          <rect x="166" y="474" width="14" height="70" rx="4" fill="#ff8a2b" stroke={PLUM} strokeWidth="5" />
        </g>

        <path d={FLASK} fill="rgba(255,255,255,0.2)" />
        <g clipPath="url(#sa-flask)">
          <path d="M120 396c30-12 60-12 90 0s60 12 90 0 60-12 90 0 60 12 90 0V560H120Z" fill="url(#sa-liquid)" />
        </g>
        <path d={FLASK} fill="none" stroke={PLUM} strokeWidth="7" strokeLinejoin="round" />
        <path d="M236 330l-46 76" stroke="#fff" strokeWidth="10" strokeLinecap="round" opacity="0.7" />
        <path d="M300 236v40" stroke="#fff" strokeWidth="8" strokeLinecap="round" opacity="0.5" />
      </svg>

      {/* Bubbles rising through the liquid */}
      {INNER_BUBBLES.map((b, i) => (
        <span
          key={i}
          className="sa-bubble"
          style={{ ...at(b.x, 500), width: `${b.s / 6}%`, animationDelay: `${b.d}s` }}
          aria-hidden="true"
        />
      ))}

      {SPARKS.map(([x, y, s], i) => (
        <span
          key={i}
          className="art-spark"
          style={{ ...at(x, y), width: `${s / 6}%`, background: i % 2 ? '#c8f04b' : '#fff', animationDelay: `${i * -0.6}s` }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
});

export const scienceHold: SceneHold = (tl, scene, at, dur) => {
  tl.fromTo(
    scene.querySelector('.sa-foam'),
    { scale: 0, transformOrigin: '49.6% 76.9%' },
    { scale: 1, duration: dur * 0.5, ease: 'back.out(1.4)' },
    at + dur * 0.15,
  ).fromTo(scene.querySelector('.sa-atom'), { rotation: 0, transformOrigin: '50% 50%' }, { rotation: 120, duration: dur }, at);
};
