import { memo } from 'react';
import { PLUM, type SceneHold } from './types';
import './ScienceArt.css';

const FLASK = 'M258 160h84v16h-10v104l116 190c15 25-3 56-32 56H184c-29 0-47-31-32-56l116-190V176h-10Z';

const FOAM = [
  { cx: 300, cy: 120, r: 52, c: '#ff8ac8' },
  { cx: 246, cy: 92, r: 46, c: '#c8f04b' },
  { cx: 356, cy: 88, r: 48, c: '#fcd871' },
  { cx: 300, cy: 52, r: 52, c: '#fff' },
  { cx: 208, cy: 46, r: 38, c: '#ff8ac8' },
  { cx: 394, cy: 40, r: 38, c: '#c8f04b' },
  { cx: 254, cy: 8, r: 36, c: '#fcd871' },
  { cx: 348, cy: 2, r: 38, c: '#ff8ac8' },
  { cx: 300, cy: -30, r: 32, c: '#fff' },
];

const INNER_BUBBLES = [
  { x: 240, r: 9, d: 0 },
  { x: 290, r: 6, d: -0.8 },
  { x: 330, r: 11, d: -1.6 },
  { x: 365, r: 7, d: -0.4 },
  { x: 270, r: 5, d: -2.1 },
  { x: 315, r: 8, d: -1.2 },
];

export const ScienceArt = memo(function ScienceArt() {
  return (
    <div className="art art--science">
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

        {/* Orbit rings behind */}
        <g className="sa-atom">
          <circle cx="480" cy="150" r="16" fill="#f0388f" stroke={PLUM} strokeWidth="4" />
          <g className="sa-orbits">
            <ellipse cx="480" cy="150" rx="70" ry="24" fill="none" stroke="#fff" strokeWidth="4" opacity="0.85" />
            <ellipse cx="480" cy="150" rx="70" ry="24" fill="none" stroke="#fff" strokeWidth="4" opacity="0.85" transform="rotate(60 480 150)" />
            <ellipse cx="480" cy="150" rx="70" ry="24" fill="none" stroke="#fff" strokeWidth="4" opacity="0.85" transform="rotate(-60 480 150)" />
            <circle cx="550" cy="150" r="8" fill="#fcd871" stroke={PLUM} strokeWidth="3" />
            <circle cx="445" cy="210" r="8" fill="#c8f04b" stroke={PLUM} strokeWidth="3" />
            <circle cx="445" cy="90" r="8" fill="#5daedd" stroke={PLUM} strokeWidth="3" />
          </g>
        </g>

        {/* Lightning doodle */}
        <path className="sa-zap" d="M118 70l-34 62h30l-20 56 52-74h-30l22-44Z" fill="#fcd871" stroke={PLUM} strokeWidth="5" strokeLinejoin="round" />

        {/* Test tube rack */}
        <g className="sa-rack">
          {[
            { x: 70, c: '#f0388f', h: 70 },
            { x: 112, c: '#fcd871', h: 50 },
            { x: 154, c: '#5daedd', h: 86 },
          ].map((t, i) => (
            <g key={t.x} className="sa-tube" style={{ animationDelay: `${i * -0.7}s` }}>
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

        {/* Foam eruption (scroll-driven) */}
        <g className="sa-foam">
          {FOAM.map((f, i) => (
            <circle key={i} cx={f.cx} cy={f.cy + 60} r={f.r} fill={f.c} stroke={PLUM} strokeWidth="5" />
          ))}
        </g>

        {/* Flask */}
        <path d={FLASK} fill="rgba(255,255,255,0.2)" />
        <g clipPath="url(#sa-flask)">
          <g className="sa-liquid">
            <path d={`M60 400${"c40-14 80-14 120 0s80 14 120 0".repeat(4)}V560H60Z`} fill="url(#sa-liquid)" />
          </g>
          {INNER_BUBBLES.map((b, i) => (
            <circle key={i} className="sa-bubble" cx={b.x} cy="510" r={b.r} fill="#fff" opacity="0.85" style={{ animationDelay: `${b.d}s` }} />
          ))}
        </g>
        <path d={FLASK} fill="none" stroke={PLUM} strokeWidth="7" strokeLinejoin="round" />
        <path d="M236 330l-46 76" stroke="#fff" strokeWidth="10" strokeLinecap="round" opacity="0.7" />
        <path d="M300 236v40" stroke="#fff" strokeWidth="8" strokeLinecap="round" opacity="0.5" />

        {/* Sparkles */}
        {[
          [520, 330, 1],
          [430, 420, 0.7],
          [80, 280, 0.8],
          [560, 470, 0.6],
        ].map(([x, y, s], i) => (
          <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
            <path
              className="sa-spark"
              d="M0-20C1 -6 6-1 20 0 6 1 1 6 0 20-1 6-6 1-20 0-6-1-1-6 0-20Z"
              fill={i % 2 ? '#c8f04b' : '#fff'}
              style={{ animationDelay: `${i * -0.6}s` }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
});

export const scienceHold: SceneHold = (tl, scene, at, dur) => {
  const foam = scene.querySelectorAll('.sa-foam circle');
  foam.forEach((c, i) => {
    tl.fromTo(c, { scale: 0, y: 110 }, { scale: 1, y: 0, svgOrigin: '300 180', duration: dur * 0.45, ease: 'back.out(1.6)' }, at + dur * 0.15 + i * 0.05);
  });
  tl.fromTo(scene.querySelector('.sa-orbits'), { rotation: 0 }, { rotation: 120, svgOrigin: '480 150', duration: dur }, at);
};
