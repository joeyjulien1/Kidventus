import { memo, type CSSProperties } from 'react';
import { seeded } from '../../../lib/random';
import { BalloonSvg } from '../../Balloon/Balloon';
import { PLUM, at, box, type SceneHold } from './types';
import './BirthdayArt.css';

/* ---------- Pre-computed geometry (600 × 600 artwork space) ---------- */

const RAYS = Array.from({ length: 12 }, (_, k) => {
  const a1 = (k * 30 * Math.PI) / 180;
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
  { x: 70, y: 250, c: '#fcd871', round: false, r: 20 },
  { x: 540, y: 230, c: '#5daedd', round: true, r: 0 },
  { x: 520, y: 360, c: '#fff', round: false, r: -30 },
  { x: 92, y: 360, c: '#c8f04b', round: true, r: 0 },
  { x: 470, y: 150, c: '#fff', round: true, r: 0 },
  { x: 140, y: 170, c: '#ff8a2b', round: false, r: 45 },
  { x: 40, y: 450, c: '#fff', round: false, r: 10 },
  { x: 575, y: 430, c: '#fcd871', round: false, r: -20 },
];

const CANDLES = [232, 266, 300, 334, 368];

export const BirthdayArt = memo(function BirthdayArt() {
  return (
    <div className="art art--birthday">
      {/* Sunburst — its own layer, turned by scroll */}
      <svg className="ba-rays art__svg" viewBox="0 0 600 600" aria-hidden="true" focusable="false">
        <path d={RAYS} fill="#fff" opacity="0.13" />
      </svg>

      {/* Bunting — one layer that sways */}
      <svg className="ba-bunting art__layer" viewBox="-14 40 628 134" style={box(-14, 40, 628, 134)} aria-hidden="true" focusable="false">
        <path d="M-10 54Q300 190 610 54" fill="none" stroke={PLUM} strokeWidth="4" />
        {BUNTING.map((f, i) => (
          <path
            key={i}
            d="M-19 0H19L0 44Z"
            transform={`translate(${f.x.toFixed(1)} ${f.y.toFixed(1)}) rotate(${f.angle.toFixed(1)})`}
            fill={f.color}
            stroke={PLUM}
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
        ))}
      </svg>

      {CONFETTI.map((c, i) => (
        <span
          key={i}
          className={`ba-confetti${c.round ? ' ba-confetti--round' : ''}`}
          style={{ ...at(c.x, c.y), ['--c' as string]: c.c, ['--r' as string]: `${c.r}deg`, animationDelay: `${i * -0.4}s` } as CSSProperties}
          aria-hidden="true"
        />
      ))}

      {/* Cake, gifts & candles (static drawing) + flames as separate flickering pieces */}
      <div className="ba-cake-wrap">
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

          <ellipse cx="300" cy="545" rx="240" ry="20" fill={PLUM} opacity="0.22" />

          <g>
            <rect x="52" y="436" width="100" height="92" rx="8" fill="#ff8ac8" stroke={PLUM} strokeWidth="5" />
            <rect x="94" y="436" width="16" height="92" fill="#fcd871" stroke={PLUM} strokeWidth="4" />
            <rect x="44" y="418" width="116" height="26" rx="7" fill="#f0388f" stroke={PLUM} strokeWidth="5" />
            <rect x="94" y="418" width="16" height="26" fill="#fcd871" stroke={PLUM} strokeWidth="4" />
            <path d="M102 418c-22-28-46-10-30 2 8 6 20 2 30-2Zm0 0c22-28 46-10 30 2-8 6-20 2-30-2Z" fill="#fcd871" stroke={PLUM} strokeWidth="4" strokeLinejoin="round" />
          </g>
          <g>
            <rect x="456" y="456" width="92" height="72" rx="8" fill="#c8f04b" stroke={PLUM} strokeWidth="5" />
            <rect x="494" y="456" width="16" height="72" fill="#f0388f" stroke={PLUM} strokeWidth="4" />
            <rect x="449" y="440" width="106" height="24" rx="7" fill="#a8d43a" stroke={PLUM} strokeWidth="5" />
            <rect x="494" y="440" width="16" height="24" fill="#f0388f" stroke={PLUM} strokeWidth="4" />
            <path d="M502 440c-18-24-40-8-26 2 7 5 17 2 26-2Zm0 0c18-24 40-8 26 2-7 5-17 2-26-2Z" fill="#f0388f" stroke={PLUM} strokeWidth="4" strokeLinejoin="round" />
          </g>

          <ellipse cx="300" cy="528" rx="212" ry="28" fill="#fff" stroke={PLUM} strokeWidth="5" />

          <rect x="150" y="392" width="300" height="136" rx="22" fill="#fff4fa" />
          <g clipPath="url(#ba-tier-bottom)">
            <path d={PINK_FROSTING} fill="#ff74b8" />
            {SPRINKLES.map((s, i) => (
              <rect
                key={i}
                x={s.x - 6}
                y={s.y - 2.5}
                width="12"
                height="5"
                rx="2.5"
                fill={s.c === '#ffffff' ? '#5daedd' : s.c}
                transform={`rotate(${s.r.toFixed(0)} ${s.x.toFixed(1)} ${s.y.toFixed(1)})`}
              />
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

          {CANDLES.map((x) => (
            <g key={x}>
              <rect x={x - 7} y="226" width="14" height="58" rx="4" fill="url(#ba-stripes)" stroke={PLUM} strokeWidth="3.5" />
              <path d={`M${x} 226v-10`} stroke={PLUM} strokeWidth="3" strokeLinecap="round" />
            </g>
          ))}
        </svg>

        {CANDLES.map((x, i) => (
          <svg
            key={x}
            className="ba-flame art__layer"
            viewBox={`${x - 15} 174 30 50`}
            style={{ ...box(x - 15, 174, 30, 50), animationDelay: `${i * -0.17}s` }}
            aria-hidden="true"
            focusable="false"
          >
            <path d={`M${x} 178c9 13 13 22 13 29a13 13 0 0 1-26 0c0-7 4-16 13-29Z`} fill="#ff8a2b" stroke={PLUM} strokeWidth="3" strokeLinejoin="round" />
            <path d={`M${x} 196c4 6 6 10 6 13a6 6 0 0 1-12 0c0-3 2-7 6-13Z`} fill="#fff3a0" />
          </svg>
        ))}
      </div>

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
  tl.fromTo(scene.querySelector('.ba-rays'), { rotation: 0, transformOrigin: '50% 56.667%' }, { rotation: 45, duration: dur }, at)
    .fromTo(scene.querySelectorAll('.ba-balloon'), { y: 0 }, { y: (i: number) => -30 - i * 18, duration: dur }, at)
    .fromTo(scene.querySelector('.ba-cake-wrap'), { yPercent: 0 }, { yPercent: -1.5, duration: dur }, at);
};
