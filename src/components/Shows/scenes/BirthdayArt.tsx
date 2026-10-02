import { memo } from 'react';
import { seeded } from '../../../lib/random';
import { BalloonSvg } from '../../Balloon/Balloon';
import { PLUM, type SceneHold } from './types';
import './BirthdayArt.css';

/* ---------- Pre-computed geometry ---------- */

const RAYS = Array.from({ length: 12 }, (_, k) => {
  const a1 = ((k * 30) * Math.PI) / 180;
  const a2 = ((k * 30 + 15) * Math.PI) / 180;
  const R = 470;
  const [cx, cy] = [300, 340];
  return `M${cx} ${cy}L${(cx + R * Math.cos(a1)).toFixed(1)} ${(cy + R * Math.sin(a1)).toFixed(1)}L${(cx + R * Math.cos(a2)).toFixed(1)} ${(cy + R * Math.sin(a2)).toFixed(1)}Z`;
}).join('');

const FLAG_COLORS = ['#fcd871', '#5daedd', '#ffffff', '#c8f04b', '#ff8a2b', '#975397'];
const BUNTING = Array.from({ length: 11 }, (_, i) => {
  const t = 0.06 + (i / 10) * 0.88;
  const p0 = [-10, 54];
  const c = [300, 190];
  const p1 = [610, 54];
  const x = (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * c[0] + t ** 2 * p1[0];
  const y = (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * c[1] + t ** 2 * p1[1];
  const dx = 2 * (1 - t) * (c[0] - p0[0]) + 2 * t * (p1[0] - c[0]);
  const dy = 2 * (1 - t) * (c[1] - p0[1]) + 2 * t * (p1[1] - c[1]);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  return { x, y, angle, color: FLAG_COLORS[i % FLAG_COLORS.length] };
});

function frosting(x0: number, x1: number, top: number, base: number, seed: number) {
  const r = seeded(seed);
  let d = `M${x0} ${top}H${x1}V${base}`;
  let x = x1;
  while (x > x0 + 14) {
    const flat = 6 + r() * 14;
    x = Math.max(x0, x - flat);
    d += `H${x.toFixed(1)}`;
    const w = Math.min(x - x0, 16 + r() * 18);
    if (w < 8) break;
    const h = 12 + r() * 30;
    const nx = x - w;
    d += `C${x.toFixed(1)} ${(base + h).toFixed(1)} ${nx.toFixed(1)} ${(base + h).toFixed(1)} ${nx.toFixed(1)} ${base}`;
    x = nx;
  }
  return `${d}H${x0}Z`;
}

const PINK_FROSTING = frosting(146, 454, 380, 418, 3);
const YELLOW_FROSTING = frosting(191, 409, 270, 300, 11);

const rand = seeded(21);
const SPRINKLES = Array.from({ length: 18 }, () => ({
  x: 172 + rand() * 256,
  y: 452 + rand() * 60,
  r: rand() * 180,
  c: FLAG_COLORS[(rand() * FLAG_COLORS.length) | 0],
}));

const CONFETTI = [
  { x: 70, y: 250, c: '#fcd871', s: 'r', r: 20 },
  { x: 540, y: 230, c: '#5daedd', s: 'c', r: 0 },
  { x: 520, y: 360, c: '#fff', s: 'r', r: -30 },
  { x: 92, y: 360, c: '#c8f04b', s: 'c', r: 0 },
  { x: 470, y: 150, c: '#fff', s: 'c', r: 0 },
  { x: 140, y: 170, c: '#ff8a2b', s: 'r', r: 45 },
  { x: 40, y: 450, c: '#fff', s: 'r', r: 10 },
  { x: 575, y: 430, c: '#fcd871', s: 'r', r: -20 },
];

const CANDLES = [232, 266, 300, 334, 368];

export const BirthdayArt = memo(function BirthdayArt() {
  return (
    <div className="art art--birthday">
      <svg className="art__svg" viewBox="0 0 600 600" aria-hidden="true" focusable="false">
        <defs>
          <pattern id="ba-stripes" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(40)">
            <rect width="10" height="10" fill="#fff" />
            <rect width="4" height="10" fill="#ff74b8" />
          </pattern>
          <clipPath id="ba-tier-bottom">
            <rect x="150" y="392" width="300" height="136" rx="22" />
          </clipPath>
          <clipPath id="ba-tier-top">
            <rect x="195" y="282" width="210" height="118" rx="20" />
          </clipPath>
        </defs>

        <path className="ba-rays" d={RAYS} fill="#fff" opacity="0.13" />

        <g className="ba-bunting">
          <path d="M-10 54Q300 190 610 54" fill="none" stroke={PLUM} strokeWidth="4" />
          {BUNTING.map((f, i) => (
            <g key={i} transform={`translate(${f.x.toFixed(1)} ${f.y.toFixed(1)}) rotate(${f.angle.toFixed(1)})`}>
              <path className="ba-flag" d="M-19 0H19L0 44Z" fill={f.color} stroke={PLUM} strokeWidth="3.5" strokeLinejoin="round" style={{ animationDelay: `${i * -0.25}s` }} />
            </g>
          ))}
        </g>

        {CONFETTI.map((c, i) =>
          c.s === 'c' ? (
            <circle key={i} className="ba-confetti" cx={c.x} cy={c.y} r="7" fill={c.c} stroke={PLUM} strokeWidth="2.5" style={{ animationDelay: `${i * -0.4}s` }} />
          ) : (
            <rect key={i} className="ba-confetti" x={c.x - 9} y={c.y - 5} width="18" height="10" rx="2" fill={c.c} stroke={PLUM} strokeWidth="2.5" transform={`rotate(${c.r} ${c.x} ${c.y})`} style={{ animationDelay: `${i * -0.4}s` }} />
          ),
        )}

        <ellipse cx="300" cy="545" rx="240" ry="20" fill={PLUM} opacity="0.22" />

        {/* Gifts */}
        <g className="ba-gift ba-gift--l">
          <rect x="52" y="436" width="100" height="92" rx="8" fill="#ff8ac8" stroke={PLUM} strokeWidth="5" />
          <rect x="94" y="436" width="16" height="92" fill="#fcd871" stroke={PLUM} strokeWidth="4" />
          <rect x="44" y="418" width="116" height="26" rx="7" fill="#f0388f" stroke={PLUM} strokeWidth="5" />
          <rect x="94" y="418" width="16" height="26" fill="#fcd871" stroke={PLUM} strokeWidth="4" />
          <path d="M102 418c-22-28-46-10-30 2 8 6 20 2 30-2Zm0 0c22-28 46-10 30 2-8 6-20 2-30-2Z" fill="#fcd871" stroke={PLUM} strokeWidth="4" strokeLinejoin="round" />
        </g>
        <g className="ba-gift ba-gift--r">
          <rect x="456" y="456" width="92" height="72" rx="8" fill="#c8f04b" stroke={PLUM} strokeWidth="5" />
          <rect x="494" y="456" width="16" height="72" fill="#f0388f" stroke={PLUM} strokeWidth="4" />
          <rect x="449" y="440" width="106" height="24" rx="7" fill="#a8d43a" stroke={PLUM} strokeWidth="5" />
          <rect x="494" y="440" width="16" height="24" fill="#f0388f" stroke={PLUM} strokeWidth="4" />
          <path d="M502 440c-18-24-40-8-26 2 7 5 17 2 26-2Zm0 0c18-24 40-8 26 2-7 5-17 2-26-2Z" fill="#f0388f" stroke={PLUM} strokeWidth="4" strokeLinejoin="round" />
        </g>

        {/* Cake */}
        <g className="ba-cake">
          <ellipse cx="300" cy="528" rx="212" ry="28" fill="#fff" stroke={PLUM} strokeWidth="5" />

          <rect x="150" y="392" width="300" height="136" rx="22" fill="#fff4fa" />
          <g clipPath="url(#ba-tier-bottom)">
            <path d={PINK_FROSTING} fill="#ff74b8" />
            {SPRINKLES.map((s, i) => (
              <rect key={i} x={s.x - 6} y={s.y - 2.5} width="12" height="5" rx="2.5" fill={s.c === '#ffffff' ? '#5daedd' : s.c} transform={`rotate(${s.r.toFixed(0)} ${s.x.toFixed(1)} ${s.y.toFixed(1)})`} />
            ))}
          </g>
          <rect x="150" y="392" width="300" height="136" rx="22" fill="none" stroke={PLUM} strokeWidth="5" />

          <rect x="195" y="282" width="210" height="118" rx="20" fill="#5daedd" />
          <g clipPath="url(#ba-tier-top)">
            <path d={YELLOW_FROSTING} fill="#fcd871" />
            {[226, 266, 306, 346, 386].map((x, i) => (
              <circle key={x} cx={x} cy={i % 2 ? 360 : 372} r="7" fill="#fff" opacity="0.9" />
            ))}
          </g>
          <rect x="195" y="282" width="210" height="118" rx="20" fill="none" stroke={PLUM} strokeWidth="5" />

          {CANDLES.map((x, i) => (
            <g key={x} className="ba-candle">
              <rect x={x - 7} y="226" width="14" height="58" rx="4" fill="url(#ba-stripes)" stroke={PLUM} strokeWidth="3.5" />
              <path d={`M${x} 226v-10`} stroke={PLUM} strokeWidth="3" strokeLinecap="round" />
              <g className="ba-flame" style={{ animationDelay: `${i * -0.17}s` }}>
                <path d={`M${x} 178c9 13 13 22 13 29a13 13 0 0 1-26 0c0-7 4-16 13-29Z`} fill="#ff8a2b" stroke={PLUM} strokeWidth="3" strokeLinejoin="round" />
                <path d={`M${x} 196c4 6 6 10 6 13a6 6 0 0 1-12 0c0-3 2-7 6-13Z`} fill="#fff3a0" />
              </g>
            </g>
          ))}
        </g>
      </svg>

      <div className="ba-balloons">
        <div className="ba-balloon ba-balloon--1">
          <div className="ba-balloon__float">
            <BalloonSvg color="yellow" outlined />
          </div>
        </div>
        <div className="ba-balloon ba-balloon--2">
          <div className="ba-balloon__float">
            <BalloonSvg color="blue" outlined />
          </div>
        </div>
        <div className="ba-balloon ba-balloon--3">
          <div className="ba-balloon__float">
            <BalloonSvg color="purple" outlined />
          </div>
        </div>
      </div>
    </div>
  );
});

export const birthdayHold: SceneHold = (tl, scene, at, dur) => {
  tl.fromTo(scene.querySelector('.ba-rays'), { rotation: 0 }, { rotation: 45, svgOrigin: '300 340', duration: dur }, at)
    .fromTo(scene.querySelectorAll('.ba-balloon'), { y: 0 }, { y: (i: number) => -30 - i * 18, duration: dur }, at)
    .fromTo(scene.querySelector('.ba-cake'), { y: 0 }, { y: -8, duration: dur }, at);
};
