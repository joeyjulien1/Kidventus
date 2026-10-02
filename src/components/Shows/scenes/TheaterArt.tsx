import { memo } from 'react';
import { MasksGlyph } from '../../icons';
import { PLUM, at, box, type SceneHold } from './types';
import './TheaterArt.css';

const SCALLOPS = (() => {
  let d = 'M58 108H542V150';
  const n = 9;
  const w = (542 - 58) / n;
  for (let i = 0; i < n; i++) {
    const x = 542 - i * w;
    d += `Q${(x - w / 2).toFixed(1)} 196 ${(x - w).toFixed(1)} 150`;
  }
  return `${d}Z`;
})();

const BULBS = (() => {
  const pts: [number, number][] = [];
  for (let y = 560; y >= 120; y -= 44) pts.push([40, y]);
  for (let x = 100; x <= 500; x += 44) pts.push([x, 40]);
  for (let y = 120; y <= 560; y += 44) pts.push([560, y]);
  return pts.filter(([x, y]) => !(y < 92 && x > 254 && x < 346)); // keep the crest clear
})();

const FOOTLIGHTS = [90, 160, 230, 300, 370, 440, 510];

const CURTAIN_L = 'M70 120H302V474Q272 492 244 474Q214 494 184 474Q152 494 122 474Q96 490 70 478Z';
const CURTAIN_R = 'M530 120H298V474Q328 492 356 474Q386 494 416 474Q448 494 478 474Q504 490 530 478Z';

function Curtain({ side }: { side: 'l' | 'r' }) {
  const id = `ta-folds-${side}`;
  const d = side === 'l' ? CURTAIN_L : CURTAIN_R;
  const x = side === 'l' ? 66 : 294;
  return (
    <svg className={`ta-curtain ta-curtain--${side} art__layer`} viewBox={`${x} 116 240 382`} style={box(x, 116, 240, 382)} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-g`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#e3304c" />
          <stop offset="0.5" stopColor="#9c1230" />
          <stop offset="1" stopColor="#e3304c" />
        </linearGradient>
        <pattern id={id} width="44" height="20" patternUnits="userSpaceOnUse">
          <rect width="44" height="20" fill={`url(#${id}-g)`} />
        </pattern>
      </defs>
      <path d={d} fill={`url(#${id})`} />
      <path d={d} fill="none" stroke={PLUM} strokeWidth="6" strokeLinejoin="round" />
    </svg>
  );
}

export const TheaterArt = memo(function TheaterArt() {
  return (
    <div className="art art--theater">
      {/* Stage (static) */}
      <svg className="art__svg" viewBox="0 0 600 600" aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id="ta-glow" cx="50%" cy="58%" r="55%">
            <stop offset="0" stopColor="#7b3fe4" stopOpacity="0.85" />
            <stop offset="1" stopColor="#2a0838" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x="70" y="120" width="460" height="360" fill="#2a0838" />
        <rect x="70" y="120" width="460" height="360" fill="url(#ta-glow)" />
        <path d="M70 440H530L572 540H28Z" fill="#e08a3c" stroke={PLUM} strokeWidth="5" strokeLinejoin="round" />
        {[150, 220, 300, 380, 450].map((x) => (
          <path key={x} d={`M${x} 440L${300 + (x - 300) * 1.4} 540`} stroke="#b8612a" strokeWidth="4" />
        ))}
        <rect x="24" y="538" width="552" height="26" rx="6" fill="#b8612a" stroke={PLUM} strokeWidth="5" />
        <ellipse cx="300" cy="458" rx="54" ry="9" fill={PLUM} opacity="0.4" />
      </svg>

      {/* Spotlight — fades up with scroll */}
      <svg className="ta-light art__svg" viewBox="0 0 600 600" aria-hidden="true" focusable="false">
        <path d="M276 112h48l112 352H164Z" fill="#fff6d6" opacity="0.16" />
        <ellipse cx="300" cy="458" rx="130" ry="20" fill="#fff6d6" opacity="0.32" />
      </svg>

      {/* The star of the show */}
      <div className="ta-star art__layer" style={box(222, 282, 156, 159)} aria-hidden="true">
        <div className="ta-star__bob">
          <img src="/brand/kidventus-star-1.svg" alt="" draggable={false} loading="eager" />
        </div>
      </div>

      {/* Curtains — each opens toward its side with scroll */}
      <Curtain side="l" />
      <Curtain side="r" />

      {/* Valance, gold proscenium and crest (static) */}
      <svg className="art__svg" viewBox="0 0 600 600" aria-hidden="true" focusable="false">
        <path d={SCALLOPS} fill="#c81d3a" stroke={PLUM} strokeWidth="6" strokeLinejoin="round" />
        <path d="M58 140H542" stroke="#ffc94a" strokeWidth="7" />
        <path d="M40 584V100Q40 40 100 40H500Q560 40 560 100V584" fill="none" stroke={PLUM} strokeWidth="48" />
        <path d="M40 584V100Q40 40 100 40H500Q560 40 560 100V584" fill="none" stroke="#ffc94a" strokeWidth="36" />
        <circle cx="300" cy="44" r="44" fill="#fff" stroke={PLUM} strokeWidth="6" />
        <MasksGlyph x="262" y="6" width="76" height="76" />
        {FOOTLIGHTS.map((x) => (
          <path key={x} d={`M${x - 13} 540a13 13 0 0 1 26 0Z`} fill="#fcd871" stroke={PLUM} strokeWidth="3" />
        ))}
      </svg>

      {/* Marquee bulbs & footlight glow (GPU-animated pieces) */}
      {BULBS.map(([x, y], i) => (
        <span key={i} className="ta-bulb" style={{ ...at(x, y), animationDelay: `${(i % 2) * -0.6}s` }} aria-hidden="true" />
      ))}
      {FOOTLIGHTS.map((x, i) => (
        <span key={x} className="ta-foot" style={{ ...at(x, 534), animationDelay: `${i * -0.3}s` }} aria-hidden="true" />
      ))}
    </div>
  );
});

export const theaterHold: SceneHold = (tl, scene, at, dur) => {
  tl.fromTo(
    scene.querySelector('.ta-curtain--l'),
    { scaleX: 1, transformOrigin: '1.7% 50%' },
    { scaleX: 0.3, duration: dur * 0.55, ease: 'power2.inOut' },
    at + dur * 0.08,
  )
    .fromTo(
      scene.querySelector('.ta-curtain--r'),
      { scaleX: 1, transformOrigin: '98.3% 50%' },
      { scaleX: 0.3, duration: dur * 0.55, ease: 'power2.inOut' },
      at + dur * 0.08,
    )
    .fromTo(scene.querySelector('.ta-light'), { opacity: 0 }, { opacity: 1, duration: dur * 0.3 }, at + dur * 0.3)
    .fromTo(
      scene.querySelector('.ta-star'),
      { scale: 0, rotation: -120, transformOrigin: '50% 50%' },
      { scale: 1, rotation: 0, duration: dur * 0.3, ease: 'back.out(2)' },
      at + dur * 0.4,
    );
};
