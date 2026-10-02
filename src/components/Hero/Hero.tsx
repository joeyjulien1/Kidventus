import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP, MQ } from '../../lib/gsap';
import { burst } from '../../lib/confetti';
import { seeded } from '../../lib/random';
import { waLink } from '../../lib/whatsapp';
import { goToSection } from '../../lib/navigation';
import { usePauseOffscreen } from '../../lib/usePauseOffscreen';
import { MEDIA } from '../../config/media';
import { Logo, LOGO_STAR_ORIGIN } from '../Logo/Logo';
import { BalloonSvg, type BalloonColor } from '../Balloon/Balloon';
import { ArrowDownIcon, WhatsAppIcon } from '../icons';
import './Hero.css';

interface BalloonSpec {
  x: number;
  y: number;
  /** vertical position on phones (keeps the copy clear) */
  my?: number;
  size: number;
  color: BalloonColor;
  depth: number;
  tilt: number;
  delay: number;
  desktopOnly?: boolean;
}

const BALLOONS: BalloonSpec[] = [
  { x: 7, y: 60, my: 93, size: 150, color: 'pink', depth: 1, tilt: -8, delay: 0 },
  { x: 17, y: 20, size: 92, color: 'blue', depth: 0.5, tilt: 7, delay: -2.2, desktopOnly: true },
  { x: 86, y: 16, my: 13, size: 118, color: 'yellow', depth: 0.7, tilt: 9, delay: -1.1 },
  { x: 93, y: 56, my: 95, size: 168, color: 'purple', depth: 1.15, tilt: 6, delay: -3.3 },
  { x: 76, y: 82, size: 104, color: 'orange', depth: 0.8, tilt: -5, delay: -0.6, desktopOnly: true },
  { x: 25, y: 86, size: 86, color: 'lime', depth: 0.6, tilt: 11, delay: -2.8, desktopOnly: true },
];

const SHAPES = [
  { kind: 'sphere', x: 13, y: 38, size: 58, tone: 'magenta', depth: 0.7, desktopOnly: true },
  { kind: 'ring', x: 79, y: 36, size: 86, tone: 'sun', depth: 0.9, desktopOnly: true },
  { kind: 'pill', x: 21, y: 80, size: 84, tone: 'blue', depth: 0.55, desktopOnly: true },
  { kind: 'squiggle', x: 82, y: 66, size: 96, tone: 'lime', depth: 0.75, desktopOnly: true },
  { kind: 'sphere', x: 87, y: 79, size: 30, tone: 'blue', depth: 0.4 },
  { kind: 'sphere', x: 40, y: 14, size: 22, tone: 'sun', depth: 0.3, desktopOnly: true },
] as const;

const rand = seeded(7);
const SPARKS = Array.from({ length: 40 }, () => ({
  x: rand() * 100,
  y: rand() * 92,
  s: 6 + rand() * 14,
  d: rand() * -4,
  t: 2.2 + rand() * 2.6,
}))
  // keep the reading area around the logo and copy clear
  .filter((p) => !(p.x > 24 && p.x < 76 && p.y > 18 && p.y < 86))
  .slice(0, 24);

export function Hero() {
  const root = useRef<HTMLElement>(null);
  usePauseOffscreen(root);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      /* ---------- Entrance (plays once on load) ---------- */
      mm.add(MQ.motion, () => {
        const logo = q('.hero__logo-zoom')[0] as HTMLElement;
        const tl = gsap.timeline({ delay: 0.1 });
        tl.from(q('.hero__sky'), { opacity: 0, duration: 1.1, ease: 'power1.out' })
          .from(q('.hero__beam'), { opacity: 0, duration: 1.6, stagger: 0.2 }, 0.1)
          .from(q('.hero__ring'), { yPercent: 40, opacity: 0, duration: 1.4 }, 0.1)
          .from(q('.hero__spark'), { scale: 0, opacity: 0, duration: 0.6, stagger: { each: 0.025, from: 'random' }, ease: 'back.out(3)' }, 0.3)
          .from(q('.hero__logo .kv-logo__word'), { scale: 0.35, opacity: 0, rotate: -6, transformOrigin: '50% 70%', duration: 1.2, ease: 'elastic.out(1, 0.55)' }, 0.35)
          .from(q('.hero__logo .kv-logo__star'), { scale: 0, rotate: -180, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'back.out(2.2)' }, 0.65)
          .add(() => {
            const r = logo.getBoundingClientRect();
            if (r.bottom > 0) {
              burst({ x: r.left + r.width * LOGO_STAR_ORIGIN.x, y: r.top + r.height * LOGO_STAR_ORIGIN.y, count: 70, spread: 120, power: 14, angle: -80 });
            }
          }, 0.95)
          .fromTo(q('.hero__ribbon'), { clipPath: 'inset(0% 50% 0% 50%)' }, { clipPath: 'inset(-30% -20% -45% -20%)', duration: 0.8, ease: 'power3.inOut' }, 0.95)
          .from(q('.hero__eyebrow'), { y: 18, opacity: 0, duration: 0.7 }, 1)
          .from(q('.hero__lede'), { y: 22, opacity: 0, duration: 0.8 }, 1.1)
          .from(q('.hero__ctas > *'), { y: 26, opacity: 0, scale: 0.9, duration: 0.7, stagger: 0.1, ease: 'back.out(2)' }, 1.2)
          .from(q('.balloon__rise'), { y: () => window.innerHeight * 0.95, duration: 2.4, stagger: 0.09, ease: 'power2.out' }, 0.15)
          .from(q('.hero__shape'), { scale: 0, opacity: 0, duration: 1, stagger: 0.08, ease: 'back.out(1.8)' }, 0.5)
          .from(q('.hero__cue'), { opacity: 0, y: -10, duration: 0.6 }, 1.7)
          .call(() => q('.hero__logo .kv-logo')[0]?.classList.add('kv-logo--live'));
      });

      /* ---------- Scroll: fly away, then zoom into the star ---------- */
      mm.add(MQ.motion, () => {
        const track = q('.hero__track')[0] as HTMLElement;
        const sticky = q('.hero__sticky')[0] as HTMLElement;
        const zoom = q('.hero__logo-zoom')[0] as HTMLElement;

        // Star centre inside the sticky stage (layout box — ignores running transforms)
        const measure = () => {
          let x = 0;
          let y = 0;
          let el: HTMLElement | null = zoom;
          while (el && el !== sticky) {
            x += el.offsetLeft;
            y += el.offsetTop;
            el = el.offsetParent as HTMLElement | null;
          }
          return {
            sx: x + zoom.offsetWidth * LOGO_STAR_ORIGIN.x,
            sy: y + zoom.offsetHeight * LOGO_STAR_ORIGIN.y,
            w: sticky.offsetWidth,
            h: sticky.offsetHeight,
          };
        };

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: track, start: 'top top', end: 'bottom bottom', scrub: 0.6, invalidateOnRefresh: true },
        });
        tl.to(q('.hero__fade'), { y: -46, autoAlpha: 0, stagger: 0.03, duration: 0.3, ease: 'power1.in' }, 0)
          .to(q('.hero__cue'), { autoAlpha: 0, duration: 0.08 }, 0)
          .to(
            q('.balloon__fly'),
            {
              y: (_i, el: HTMLElement) => -window.innerHeight * (0.75 + Number(el.dataset.depth) * 0.7),
              x: (_i, el: HTMLElement) => (Number(el.dataset.x) < 50 ? -1 : 1) * 60 * Number(el.dataset.depth),
              rotation: (_i, el: HTMLElement) => (Number(el.dataset.x) < 50 ? -12 : 12),
              duration: 0.9,
              ease: 'power1.in',
            },
            0,
          )
          .to(
            q('.hero__shape-fly'),
            {
              x: (_i, el: HTMLElement) => (Number(el.dataset.x) - 50) * 6,
              y: (_i, el: HTMLElement) => (Number(el.dataset.y) - 50) * 5,
              scale: 1.8,
              autoAlpha: 0,
              duration: 0.75,
              ease: 'power1.in',
            },
            0,
          )
          .to(q('.hero__beams'), { autoAlpha: 0, duration: 0.45 }, 0.15)
          .to(q('.hero__sparks'), { scale: 1.4, autoAlpha: 0, duration: 0.7 }, 0.15)
          .to(q('.hero__ring'), { yPercent: 30, autoAlpha: 0, duration: 0.5 }, 0.1)
          .to(
            zoom,
            {
              x: () => {
                const m = measure();
                return m.w / 2 - m.sx;
              },
              y: () => {
                const m = measure();
                return m.h / 2 - m.sy;
              },
              scale: 7,
              duration: 0.95,
              ease: 'power2.in',
            },
            0.08,
          )
          .fromTo(
            q('.hero__portal-wrap'),
            {
              '--pr': '0%',
              '--pe': '0px',
              '--px': () => {
                const m = measure();
                return `${Math.round((m.sx / m.w) * 1000) / 10}%`;
              },
              '--py': () => {
                const m = measure();
                return `${Math.round((m.sy / m.h) * 1000) / 10}%`;
              },
            },
            { '--pr': '80%', '--pe': '22px', '--px': '50%', '--py': '50%', duration: 0.42, ease: 'power2.in' },
            0.6,
          )
          .to({}, { duration: 0.12 });

        // Hand over to the About section (same yellow) once the hero has fully scrolled through
        ScrollTrigger.create({
          trigger: track,
          start: 'bottom bottom',
          onEnter: () => gsap.set(sticky, { autoAlpha: 0 }),
          onLeaveBack: () => gsap.set(sticky, { autoAlpha: 1 }),
        });
      });

      /* ---------- Pointer: balloons & shapes drift with depth, balloons dodge the cursor ---------- */
      mm.add(`${MQ.motion} and ${MQ.finePointer}`, () => {
        const sticky = q('.hero__sticky')[0] as HTMLElement;
        const nudges = q('.balloon__nudge') as HTMLElement[];
        const shapes = q('.hero__shape-par') as HTMLElement[];
        const logoTilt = q('.hero__logo-tilt')[0] as HTMLElement;
        const mk = (el: HTMLElement, d = 1) => ({
          el,
          d,
          x: gsap.quickTo(el, 'x', { duration: 1, ease: 'power3' }),
          y: gsap.quickTo(el, 'y', { duration: 1, ease: 'power3' }),
        });
        const balloonMovers = nudges.map((el) => mk(el, Number(el.dataset.depth)));
        const shapeMovers = shapes.map((el) => mk(el, Number(el.dataset.depth)));
        const logoX = gsap.quickTo(logoTilt, 'x', { duration: 1.2, ease: 'power3' });
        const logoY = gsap.quickTo(logoTilt, 'y', { duration: 1.2, ease: 'power3' });
        const logoR = gsap.quickTo(logoTilt, 'rotation', { duration: 1.2, ease: 'power3' });

        let frame = 0;
        let px = 0;
        let py = 0;
        const update = () => {
          frame = 0;
          const nx = px / window.innerWidth - 0.5;
          const ny = py / window.innerHeight - 0.5;
          for (const m of balloonMovers) {
            let tx = -nx * 70 * m.d;
            let ty = -ny * 40 * m.d;
            const r = m.el.getBoundingClientRect();
            const cx = r.left + r.width / 2 - (gsap.getProperty(m.el, 'x') as number);
            const cy = r.top + r.height * 0.35 - (gsap.getProperty(m.el, 'y') as number);
            const dx = cx - px;
            const dy = cy - py;
            const dist = Math.hypot(dx, dy);
            const radius = 220;
            if (dist < radius && dist > 0) {
              const push = ((radius - dist) / radius) * 90;
              tx += (dx / dist) * push;
              ty += (dy / dist) * push;
            }
            m.x(tx);
            m.y(ty);
          }
          for (const m of shapeMovers) {
            m.x(-nx * 90 * m.d);
            m.y(-ny * 60 * m.d);
          }
          logoX(nx * 16);
          logoY(ny * 10);
          logoR(nx * 2);
        };
        const onMove = (e: PointerEvent) => {
          px = e.clientX;
          py = e.clientY;
          if (!frame) frame = requestAnimationFrame(update);
        };
        sticky.addEventListener('pointermove', onMove);
        return () => {
          sticky.removeEventListener('pointermove', onMove);
          cancelAnimationFrame(frame);
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  const popBalloon = (el: HTMLElement) => {
    if (el.dataset.popping) return;
    el.dataset.popping = '1';
    const r = el.getBoundingClientRect();
    burst({ x: r.left + r.width / 2, y: r.top + r.height * 0.33, count: 28, spread: 360, power: 7, shapes: ['circle', 'rect', 'star'] });
    gsap
      .timeline({ onComplete: () => delete el.dataset.popping })
      .to(el, { scale: 1.22, duration: 0.08, ease: 'power1.out' })
      .to(el, { scale: 0, opacity: 0, duration: 0.12, ease: 'power2.in' })
      .set(el, { y: 220 }, '+=1.6')
      .to(el, { y: 0, scale: 1, opacity: 1, duration: 1.6, ease: 'power2.out' });
  };

  return (
    <section id="home" ref={root} className="hero" aria-label="Welcome to Kidventus">
      <div className="hero__track">
        <div className="hero__sticky">
          <div className="hero__sky" aria-hidden="true">
            {MEDIA.hero?.video && (
              <video className="hero__video" src={MEDIA.hero.video} poster={MEDIA.hero.poster} autoPlay muted loop playsInline preload="metadata" />
            )}
          </div>

          <div className="hero__beams" aria-hidden="true">
            <span className="hero__beam hero__beam--l" />
            <span className="hero__beam hero__beam--r" />
          </div>

          <div className="hero__ring" aria-hidden="true">
            <div className="hero__ring-tilt">
              <div className="hero__ring-disc" />
            </div>
          </div>

          <div className="hero__sparks" aria-hidden="true">
            {SPARKS.map((s, i) => (
              <span
                key={i}
                className="hero__spark"
                style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, animationDelay: `${s.d}s`, animationDuration: `${s.t}s` }}
              />
            ))}
          </div>

          <div className="hero__shapes" aria-hidden="true">
            {SHAPES.map((s, i) => (
              <div
                key={i}
                className={`hero__shape-fly${'desktopOnly' in s && s.desktopOnly ? ' is-desktop' : ''}`}
                data-x={s.x}
                data-y={s.y}
                style={{ left: `${s.x}%`, top: `${s.y}%` }}
              >
                <div className="hero__shape-par" data-depth={s.depth}>
                  <div className="hero__shape-bob">
                    <div
                      className={`hero__shape hero__shape--${s.kind} tone-${s.tone}`}
                      style={{
                        width: s.size,
                        height: s.kind === 'pill' ? s.size * 0.42 : s.kind === 'squiggle' ? s.size * 0.4 : s.size,
                        marginLeft: -s.size / 2,
                        marginTop: -(s.kind === 'pill' ? s.size * 0.42 : s.kind === 'squiggle' ? s.size * 0.4 : s.size) / 2,
                      }}
                    >
                      {s.kind === 'squiggle' && (
                        <svg viewBox="0 0 100 40">
                          <path d="M6 20c10-16 19-16 29 0s19 16 29 0 19-16 29 0" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hero__content">
            <p className="hero__eyebrow hero__fade">Kids Entertainment &amp; Events · Lebanon</p>

            <h1 className="hero__title">
              <span className="hero__logo">
                <span className="hero__logo-tilt">
                  <span className="hero__logo-zoom">
                    <Logo eager />
                  </span>
                </span>
              </span>
              <span className="hero__ribbon hero__fade">
                <span className="hero__ribbon-text">Let the magic begin!</span>
              </span>
            </h1>

            <p className="hero__lede hero__fade">
              Birthday shows, bubble magic, science adventures, kids theater and teen parties — we turn every
              celebration into an adventure kids never forget.
            </p>

            <div className="hero__ctas hero__fade">
              <a
                className="btn btn--white btn--lg"
                href="#shows"
                onClick={(e) => {
                  e.preventDefault();
                  goToSection('shows');
                }}
              >
                Explore Our Shows
                <span className="btn__icon btn__icon--plain">
                  <ArrowDownIcon />
                </span>
              </a>
              <a className="btn btn--lg" href={waLink()} target="_blank" rel="noopener noreferrer">
                <span className="btn__icon">
                  <WhatsAppIcon />
                </span>
                Book Your Event
                <span className="sr-only">(opens WhatsApp)</span>
              </a>
            </div>
          </div>

          <div className="hero__balloons" aria-hidden="true">
            {BALLOONS.map((b, i) => (
              <div
                key={i}
                className={`balloon${b.desktopOnly ? ' is-desktop' : ''}`}
                style={{ left: `${b.x}%`, ['--y' as string]: `${b.y}%`, ['--my' as string]: `${b.my ?? b.y}%`, ['--size' as string]: `${b.size}px` }}
              >
                <div className="balloon__fly" data-depth={b.depth} data-x={b.x}>
                  <div className="balloon__rise">
                    <div className="balloon__nudge" data-depth={b.depth}>
                      <div className="balloon__pop" onClick={(e) => popBalloon(e.currentTarget)}>
                        <div className="balloon__float" style={{ animationDelay: `${b.delay}s`, ['--tilt' as string]: `${b.tilt}deg` }}>
                          <BalloonSvg color={b.color} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hero__cue" aria-hidden="true">
            <span className="hero__cue-label">Scroll to begin the adventure</span>
            <span className="hero__cue-dot">
              <ArrowDownIcon />
            </span>
          </div>

          <div className="hero__portal-wrap" aria-hidden="true">
            <div className="hero__portal-edge" />
            <div className="hero__portal-rim" />
            <div className="hero__portal" />
          </div>
        </div>
      </div>
    </section>
  );
}
