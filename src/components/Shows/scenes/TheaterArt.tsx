import { memo } from 'react';
import { MasksGlyph } from '../../icons';
import { PLUM, type SceneHold } from './types';
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
  return pts;
})();

function Curtain({ side }: { side: 'l' | 'r' }) {
  const d =
    side === 'l'
      ? 'M70 120H302V474Q272 492 244 474Q214 494 184 474Q152 494 122 474Q96 490 70 478Z'
      : 'M530 120H298V474Q328 492 356 474Q386 494 416 474Q448 494 478 474Q504 490 530 478Z';
  return (
    <g className={`ta-curtain ta-curtain--${side}`}>
      <path d={d} fill="url(#ta-folds)" />
      <path d={d} fill="none" stroke={PLUM} strokeWidth="6" strokeLinejoin="round" />
    </g>
  );
}

export const TheaterArt = memo(function TheaterArt() {
  return (
    <div className="art art--theater">
      <svg className="art__svg" viewBox="0 0 600 600" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="ta-fold-grad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#e3304c" />
            <stop offset="0.5" stopColor="#9c1230" />
            <stop offset="1" stopColor="#e3304c" />
          </linearGradient>
          <pattern id="ta-folds" width="44" height="20" patternUnits="userSpaceOnUse">
            <rect width="44" height="20" fill="url(#ta-fold-grad)" />
          </pattern>
          <radialGradient id="ta-glow" cx="50%" cy="58%" r="55%">
            <stop offset="0" stopColor="#7b3fe4" stopOpacity="0.85" />
            <stop offset="1" stopColor="#2a0838" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Stage box */}
        <rect x="70" y="120" width="460" height="360" fill="#2a0838" />
        <rect x="70" y="120" width="460" height="360" fill="url(#ta-glow)" />
        <path d="M70 440H530L572 540H28Z" fill="#e08a3c" stroke={PLUM} strokeWidth="5" strokeLinejoin="round" />
        {[150, 220, 300, 380, 450].map((x) => (
          <path key={x} d={`M${x} 440L${300 + (x - 300) * 1.4} 540`} stroke="#b8612a" strokeWidth="4" />
        ))}
        <rect x="24" y="538" width="552" height="26" rx="6" fill="#b8612a" stroke={PLUM} strokeWidth="5" />

        {/* Spotlight + performer */}
        <path className="ta-beam" d="M276 112h48l112 352H164Z" fill="#fff6d6" opacity="0.16" />
        <ellipse className="ta-pool" cx="300" cy="458" rx="130" ry="20" fill="#fff6d6" opacity="0.32" />
        <ellipse cx="300" cy="458" rx="54" ry="9" fill={PLUM} opacity="0.4" />
        <g className="ta-star">
          <g className="ta-star__bob">
            <image href="/brand/kidventus-star-1.svg" x="222" y="282" width="156" height="159" />
          </g>
        </g>

        {/* Curtains (open with scroll) */}
        <Curtain side="l" />
        <Curtain side="r" />

        {/* Valance */}
        <path d={SCALLOPS} fill="#c81d3a" stroke={PLUM} strokeWidth="6" strokeLinejoin="round" />
        <path d="M58 140H542" stroke="#ffc94a" strokeWidth="7" />

        {/* Gold proscenium with marquee bulbs */}
        <path d="M40 584V100Q40 40 100 40H500Q560 40 560 100V584" fill="none" stroke={PLUM} strokeWidth="48" />
        <path d="M40 584V100Q40 40 100 40H500Q560 40 560 100V584" fill="none" stroke="#ffc94a" strokeWidth="36" />
        {BULBS.map(([x, y], i) => (
          <circle key={i} className={`ta-bulb${i % 2 ? ' ta-bulb--alt' : ''}`} cx={x} cy={y} r="7.5" fill="#fff6c9" stroke={PLUM} strokeWidth="2.5" />
        ))}

        {/* Masks crest */}
        <circle cx="300" cy="44" r="44" fill="#fff" stroke={PLUM} strokeWidth="6" />
        <MasksGlyph x="262" y="6" width="76" height="76" />

        {/* Footlights */}
        {[90, 160, 230, 300, 370, 440, 510].map((x, i) => (
          <g key={x}>
            <ellipse className="ta-foot" cx={x} cy="538" rx="22" ry="12" fill="#fff6c9" opacity="0.45" style={{ animationDelay: `${i * -0.3}s` }} />
            <path d={`M${x - 13} 540a13 13 0 0 1 26 0Z`} fill="#fcd871" stroke={PLUM} strokeWidth="3" />
          </g>
        ))}
      </svg>
    </div>
  );
});

export const theaterHold: SceneHold = (tl, scene, at, dur) => {
  tl.fromTo(scene.querySelector('.ta-curtain--l'), { scaleX: 1 }, { scaleX: 0.3, svgOrigin: '70 300', duration: dur * 0.55, ease: 'power2.inOut' }, at + dur * 0.08)
    .fromTo(scene.querySelector('.ta-curtain--r'), { scaleX: 1 }, { scaleX: 0.3, svgOrigin: '530 300', duration: dur * 0.55, ease: 'power2.inOut' }, at + dur * 0.08)
    .fromTo(scene.querySelectorAll('.ta-beam, .ta-pool'), { opacity: 0 }, { opacity: (i: number) => (i ? 0.32 : 0.16), duration: dur * 0.3 }, at + dur * 0.3)
    .fromTo(scene.querySelector('.ta-star'), { scale: 0, rotation: -120 }, { scale: 1, rotation: 0, svgOrigin: '300 360', duration: dur * 0.3, ease: 'back.out(2)' }, at + dur * 0.4);
};
