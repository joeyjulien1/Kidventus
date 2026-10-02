import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react';
import { gsap, useGSAP, MQ, prefersReducedMotion } from '../../lib/gsap';
import { fromToEach } from '../../lib/anim';
import { burstFrom } from '../../lib/confetti';
import { usePauseOffscreen } from '../../lib/usePauseOffscreen';
import { REELS } from '../../config/gallery';
import { ChevronIcon, PauseIcon, PlayIcon, SoundIcon } from '../icons';
import './Reel.css';

const N = REELS.length;
/** "A little bit of sound": comfortable max volume, faded in/out around each clip */
const MAX_VOLUME = 0.55;
const FADE = 0.9;

/** Bulb positions (percent) around the marquee frame */
const BULBS = (() => {
  const pts: { x: number; y: number }[] = [];
  const across = 7;
  const down = 9;
  for (let i = 0; i < across; i++) pts.push({ x: (i / (across - 1)) * 100, y: 0 });
  for (let i = 1; i < down; i++) pts.push({ x: 100, y: (i / (down - 1)) * 100 });
  for (let i = across - 2; i >= 0; i--) pts.push({ x: (i / (across - 1)) * 100, y: 100 });
  for (let i = down - 2; i >= 1; i--) pts.push({ x: 0, y: (i / (down - 1)) * 100 });
  return pts;
})();

/**
 * Fan geometry for a card `k` places away from the front card
 * (k = 0 front, ±1 beside it, ±2 peeking out behind those).
 */
function fanTarget(k: number, mobile: boolean) {
  const side = Math.sign(k);
  const depth = Math.abs(k);
  if (depth === 0) return { xPercent: 0, yPercent: 0, scale: 1, rotation: 0, autoAlpha: 1 };
  if (depth === 1) return { xPercent: side * (mobile ? 60 : 84), yPercent: 5, scale: mobile ? 0.64 : 0.7, rotation: side * 6, autoAlpha: 1 };
  return {
    xPercent: side * (mobile ? 60 : 146),
    yPercent: 10,
    scale: mobile ? 0.5 : 0.54,
    rotation: side * 10,
    autoAlpha: mobile ? 0 : depth === 2 ? 0.9 : 0,
  };
}

export function Reel() {
  const root = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const segs = useRef<(HTMLSpanElement | null)[]>([]);
  const firstLayout = useRef(true);
  const swipe = useRef<{ x: number; y: number } | null>(null);

  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(() => prefersReducedMotion());
  const [sound, setSound] = useState(false);
  const [docHidden, setDocHidden] = useState(false);

  usePauseOffscreen(root);

  /** Signed distance from the front card, wrapping around the deck */
  const offsetOf = useCallback(
    (i: number) => {
      const d = (i - active + N) % N;
      return d <= N / 2 ? d : d - N;
    },
    [active],
  );

  const goTo = useCallback((next: number, celebrate = false) => {
    const i = (next + N) % N;
    const v = videos.current[i];
    if (v) {
      try {
        v.currentTime = 0;
      } catch {
        /* metadata not loaded yet */
      }
    }
    setActive(i);
    if (celebrate && stageRef.current) burstFrom(stageRef.current, { count: 36, spread: 100, power: 12 });
  }, []);

  /* ---------- Card positions: a fanned deck around the marquee ---------- */
  const layout = useCallback(
    (animate: boolean) => {
      const mobile = window.matchMedia(MQ.mobile).matches;
      cards.current.forEach((card, i) => {
        const deal = card?.parentElement;
        if (!card) return;
        const k = offsetOf(i);
        const target = fanTarget(k, mobile);
        const z = 10 - Math.abs(k) * 2 - (k > 0 ? 1 : 0);
        if (!animate || prefersReducedMotion()) {
          gsap.set(card, target);
          if (deal) deal.style.zIndex = String(z);
          return;
        }
        // z-index lives on the wrapper: its entrance transform makes it a stacking context
        if (k === 0 && deal) deal.style.zIndex = String(z);
        else gsap.delayedCall(0.28, () => {
          if (deal) deal.style.zIndex = String(z);
        });
        gsap.to(card, {
          ...target,
          duration: 0.95,
          ease: k === 0 ? 'back.out(1.5)' : 'power3.out',
          overwrite: 'auto',
        });
      });
    },
    [offsetOf],
  );

  useGSAP(
    () => {
      layout(!firstLayout.current);
      firstLayout.current = false;
    },
    { scope: root, dependencies: [active] },
  );

  useEffect(() => {
    const mq = window.matchMedia(MQ.mobile);
    const onChange = () => layout(false);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [layout]);

  /* ---------- Scroll entrance: deal the cards out of a pile, light the bulbs ---------- */
  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const mobile = window.matchMedia(MQ.mobile).matches;
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: stageRef.current, start: 'top 100%', end: 'top 30%', scrub: 0.6 },
        });
        const deals = q('.reel__deal') as HTMLElement[];
        const tilts = [-4, 9, -13, 6, -8, 12];
        deals.forEach((el, i) => {
          // start every card stacked on the front slot, then deal it out to its place in the fan
          const k = (() => {
            const d = i % N;
            return d <= N / 2 ? d : d - N;
          })();
          const fan = fanTarget(k, mobile);
          tl.fromTo(
            el,
            { xPercent: -fan.xPercent, y: () => window.innerHeight * 0.32, rotation: tilts[i % tilts.length], scale: 0.82 },
            { xPercent: 0, y: 0, rotation: 0, scale: 1, duration: 1, ease: 'power2.out' },
            0.15 + i * 0.1,
          );
        });
        tl.fromTo(q('.reel__frame'), { scale: 0.9, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.6 }, 0);
        fromToEach(tl, q('.reel__bulb'), { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.15 }, 0.2, 0.025);
        tl.fromTo(q('.reel__sign'), { y: -70, rotation: -16, autoAlpha: 0 }, { y: 0, rotation: -4, autoAlpha: 1, duration: 0.5, ease: 'back.out(2)' }, 0.75);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  /* ---------- Visibility ---------- */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const io = new IntersectionObserver(([e]) => setInView(e.intersectionRatio >= 0.5), { threshold: [0, 0.5, 1] });
    io.observe(stage);
    const onVis = () => setDocHidden(document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  /* ---------- Playback: only the front card plays, the rest wait ---------- */
  useEffect(() => {
    videos.current.forEach((v, i) => {
      if (v && i !== active && !v.paused) v.pause();
    });
    const v = videos.current[active];
    if (!v) return;
    const shouldPlay = inView && !paused && !docHidden;
    if (shouldPlay) {
      if (v.preload !== 'auto') v.preload = 'auto';
      v.muted = !sound;
      if (sound) v.volume = 0;
      v.play().catch(() => {
        // Autoplay blocked (e.g. low-power mode) — fall back to a tap-to-play state
        setPaused(true);
      });
      // warm up the next clip
      const next = videos.current[(active + 1) % N];
      if (next && next.preload === 'none') next.preload = 'metadata';
    } else if (!v.paused) {
      v.pause();
    }
  }, [active, inView, paused, sound, docHidden]);

  /* ---------- Progress bars + gentle sound fades ---------- */
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const tick = () => {
      const v = videos.current[active];
      if (v && v.duration) {
        const t = v.currentTime;
        const d = v.duration;
        segs.current[active]?.style.setProperty('--p', (t / d).toFixed(4));
        if (sound && !v.muted) {
          const fade = Math.max(0, Math.min(1, t / FADE, (d - t) / FADE));
          v.volume = MAX_VOLUME * fade;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, inView, sound]);

  const toggleSound = () => {
    const next = !sound;
    setSound(next);
    const v = videos.current[active];
    if (v) {
      v.muted = !next;
      if (next && paused) setPaused(false);
    }
  };

  const onPointerDown = (e: PointerEvent) => {
    swipe.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: PointerEvent) => {
    const s = swipe.current;
    swipe.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(e.clientY - s.y)) goTo(active + (dx < 0 ? 1 : -1));
  };

  const reel = REELS[active];

  return (
    <div
      className="reel"
      ref={root}
      role="region"
      aria-roledescription="carousel"
      aria-label="Kidventus video reel"
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') goTo(active + 1);
        if (e.key === 'ArrowLeft') goTo(active - 1);
      }}
    >
      <div className="reel__stage" ref={stageRef} onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
        <div className="reel__frame" aria-hidden="true">
          <span className="reel__bulbs">
            {BULBS.map((b, i) => (
              <span key={i} className="reel__bulb" style={{ left: `${b.x}%`, top: `${b.y}%`, animationDelay: `${(i % 4) * -0.25}s` }} />
            ))}
          </span>
        </div>

        <p className="reel__sign" aria-hidden="true">
          <span>Now showing</span>
        </p>

        {REELS.map((r, i) => {
          const isActive = i === active;
          return (
            <div key={r.id} className="reel__deal">
              <div
                ref={(el) => {
                  cards.current[i] = el;
                }}
                className={`reel__card${isActive ? ' is-active' : ''}`}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${N}: ${r.title}`}
              >
                <video
                  ref={(el) => {
                    videos.current[i] = el;
                  }}
                  className="reel__video"
                  src={r.src}
                  poster={r.poster}
                  muted
                  playsInline
                  preload={i === 0 ? 'metadata' : 'none'}
                  onEnded={() => goTo(active + 1, true)}
                  onPlaying={(e) => e.currentTarget.parentElement?.classList.add('has-frames')}
                  aria-label={`${r.title} — ${r.blurb}`}
                  tabIndex={-1}
                />
                {/* keeps the thumbnail up until real frames arrive (no black card while buffering) */}
                <img className="reel__poster" src={r.poster} alt="" aria-hidden="true" loading={i < 3 ? 'eager' : 'lazy'} decoding="async" />
                <span className="reel__shade" aria-hidden="true" />

                {isActive && (
                  <div className="reel__segs" aria-hidden="true">
                    {REELS.map((s, k) => (
                      <span key={s.id} className="reel__seg">
                        <span
                          className="reel__seg-fill"
                          ref={(el) => {
                            segs.current[k] = el;
                          }}
                          style={{ ['--p' as string]: k < active ? 1 : 0 }}
                        />
                      </span>
                    ))}
                  </div>
                )}

                <p className="reel__tag" aria-hidden="true">
                  {r.tag}
                </p>

                {isActive ? (
                  <button type="button" className={`reel__sound${sound ? ' is-on' : ''}`} onClick={toggleSound} aria-pressed={sound}>
                    <SoundIcon muted={!sound} />
                    <span>{sound ? 'Sound on' : 'Tap for sound'}</span>
                  </button>
                ) : (
                  <button type="button" className="reel__pick" onClick={() => goTo(i)}>
                    <span className="reel__pick-icon">
                      <PlayIcon />
                    </span>
                    <span className="sr-only">Play {r.title}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="reel__stub" aria-live="polite">
        <div className="reel__stub-inner" key={reel.id}>
          <p className="reel__stub-meta">
            <span className="reel__count">
              {String(active + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
            </span>
            {reel.tag}
          </p>
          <h3 className="reel__title display">{reel.title}</h3>
          <p className="reel__blurb">{reel.blurb}</p>
        </div>
      </div>

      <div className="reel__controls">
        <button type="button" className="reel__ctrl" onClick={() => goTo(active - 1)} aria-label="Previous video">
          <ChevronIcon dir="left" />
        </button>
        <button type="button" className="reel__ctrl reel__ctrl--main" onClick={() => setPaused((p) => !p)} aria-label={paused ? 'Play' : 'Pause'}>
          {paused ? <PlayIcon /> : <PauseIcon />}
        </button>
        <button type="button" className="reel__ctrl" onClick={() => goTo(active + 1)} aria-label="Next video">
          <ChevronIcon dir="right" />
        </button>
      </div>
    </div>
  );
}
