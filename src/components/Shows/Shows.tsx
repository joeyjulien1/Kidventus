import { useRef, useState, type ComponentType } from 'react';
import { gsap, ScrollTrigger, useGSAP, MQ } from '../../lib/gsap';
import { fromToEach, primeTimeline } from '../../lib/anim';
import { scrollToTarget, requestShowBooking } from '../../lib/navigation';
import { showLink } from '../../lib/whatsapp';
import { SHOWS, type ShowId } from '../../config/shows';
import { MEDIA } from '../../config/media';
import { CalendarIcon, CheckIcon, ShowGlyph, WhatsAppIcon } from '../icons';
import { BirthdayArt, birthdayHold } from './scenes/BirthdayArt';
import { BubbleArt, bubbleHold } from './scenes/BubbleArt';
import { ScienceArt, scienceHold } from './scenes/ScienceArt';
import { TheaterArt, theaterHold } from './scenes/TheaterArt';
import { TeensArt, teensHold } from './scenes/TeensArt';
import type { SceneHold } from './scenes/types';
import './Shows.css';

const ART: Record<ShowId, { Art: ComponentType; hold: SceneHold }> = {
  birthday: { Art: BirthdayArt, hold: birthdayHold },
  bubble: { Art: BubbleArt, hold: bubbleHold },
  science: { Art: ScienceArt, hold: scienceHold },
  theater: { Art: TheaterArt, hold: theaterHold },
  teens: { Art: TeensArt, hold: teensHold },
};

/* Timeline rhythm (in timeline seconds; the whole thing is scrubbed by scroll) */
const LEAD = 0.4;
const HOLD = 1;
const TRANS = 1;
const TAIL = 0.35;
const N = SHOWS.length;
const transitionAt = (i: number) => LEAD + HOLD + (i - 1) * (TRANS + HOLD);
const settledAt = (i: number) => (i === 0 ? 0 : transitionAt(i) + TRANS);
const TOTAL = transitionAt(N - 1) + TRANS + HOLD + TAIL;
const ALL_SCENES = (1 << N) - 1;
/** Small overlap so a scene is already visible a hair before it starts to show (both directions). */
const EDGE = 0.08;

/** Which scenes are on screen at timeline time `t` (bit mask) and which one is "current". */
function stageAt(t: number) {
  let active = 0;
  for (let i = 1; i < N; i++) if (t >= transitionAt(i) + TRANS * 0.5) active = i;
  let live = 0;
  for (let i = 0; i < N; i++) {
    const from = i === 0 ? -Infinity : transitionAt(i) - EDGE; // starts being revealed
    const until = i === N - 1 ? Infinity : settledAt(i + 1) + EDGE; // fully covered by the next one
    if (t >= from && t <= until) live |= 1 << i;
  }
  return { active, live };
}

export function Shows() {
  const root = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const [liveMask, setLiveMask] = useState(ALL_SCENES);
  const [staged, setStaged] = useState(false);
  const activeRef = useRef(0);
  const liveRef = useRef(ALL_SCENES);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add({ motion: MQ.motion, mobile: MQ.mobile }, (ctx) => {
        if (!ctx.conditions?.motion) return;
        const mobile = !!ctx.conditions.mobile;
        setStaged(true);
        const track = q('.shows__track')[0] as HTMLElement;
        const scenes = q('.scene') as HTMLElement[];
        const part = (el: HTMLElement, sel: string) => Array.from(el.querySelectorAll<HTMLElement>(sel));

        const tl = gsap.timeline({ defaults: { ease: 'none' } });

        // Scene 0 hold
        ART[SHOWS[0].id].hold(tl, scenes[0], 0, LEAD + HOLD);

        for (let i = 1; i < N; i++) {
          const show = SHOWS[i];
          const scene = scenes[i];
          const prev = scenes[i - 1];
          const at = transitionAt(i);

          tl.fromTo(scene, { clipPath: show.reveal.from }, { clipPath: show.reveal.to, duration: TRANS, ease: 'power2.inOut' }, at)
            .fromTo(part(scene, '.scene__art-inner'), { scale: 1.3, rotation: i % 2 ? 4 : -4 }, { scale: 1, rotation: 0, duration: TRANS * 1.1, ease: 'power2.out' }, at)
            // Plain opacity (not autoAlpha): GSAP records the "before" state when a tween first runs,
            // and a scene that is still hidden would be recorded (and later restored) as invisible.
            .fromTo(
              part(prev, '.scene__panel'),
              { y: 0, opacity: 1 },
              { y: -70, opacity: 0, duration: TRANS * 0.5, ease: 'power1.in', immediateRender: false },
              at,
            )
            .fromTo(
              part(prev, '.scene__art-inner'),
              { scale: 1, rotation: 0, opacity: 1 },
              { scale: 0.82, opacity: 0.4, duration: TRANS, ease: 'power1.in', immediateRender: false },
              at,
            );

          fromToEach(tl, part(scene, '.scene__title .line__in'), { yPercent: 115 }, { yPercent: 0, duration: TRANS * 0.45, ease: 'power3.out' }, at + TRANS * 0.42, 0.06);
          fromToEach(
            tl,
            part(scene, '.scene__reveal'),
            { y: 34, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: TRANS * 0.4, ease: 'power2.out' },
            at + TRANS * 0.55,
            0.05,
          );

          ART[show.id].hold(tl, scene, at + TRANS * 0.5, TRANS * 0.5 + HOLD);
        }
        tl.to({}, { duration: TAIL }, TOTAL - TAIL);

        // Everything (current scene, which scenes are painted, rail progress) follows the time the
        // timeline has actually rendered, so what is visible always matches the animation.
        const fills = q('.rail__fill') as HTMLElement[];
        const sync = () => {
          const time = tl.time();
          const { active: a, live } = stageAt(time);
          if (a !== activeRef.current) {
            activeRef.current = a;
            setActive(a);
          }
          if (live !== liveRef.current) {
            liveRef.current = live;
            setLiveMask(live);
          }
          const start = a === 0 ? 0 : transitionAt(a) + TRANS * 0.5;
          const end = a === N - 1 ? TOTAL : transitionAt(a + 1) + TRANS * 0.5;
          // transform on the one bar that is showing (a CSS variable on the rail would restyle every tab)
          const fill = fills[a];
          if (fill) fill.style.transform = `scaleX(${gsap.utils.clamp(0, 1, (time - start) / (end - start)).toFixed(3)})`;
        };
        tl.eventCallback('onUpdate', sync);

        const st = ScrollTrigger.create({
          trigger: track,
          start: 'top top',
          end: 'bottom bottom',
          animation: tl,
          // light smoothing: responsive to the finger/wheel without drifting after you stop
          scrub: mobile ? 0.25 : 0.4,
        });
        stRef.current = st;
        sync();
        // After load: initialise every tween, and lay out + draw every scene once while they are
        // still masked off-screen, so the first scroll through the shows has no first-time work.
        let warm = 0;
        const unprime = primeTimeline(tl, () => {
          liveRef.current = ALL_SCENES;
          setLiveMask(ALL_SCENES);
          warm = requestAnimationFrame(() => {
            warm = requestAnimationFrame(() => {
              liveRef.current = -1;
              sync();
            });
          });
        });

        // First scene arrives as the section scrolls into view
        const enter = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: root.current, start: 'top 85%', end: 'top 5%', scrub: mobile ? 0.25 : 0.4 },
        });
        enter.fromTo(part(scenes[0], '.scene__art-inner'), { yPercent: 18, scale: 0.85 }, { yPercent: 0, scale: 1, duration: 1 }, 0);
        fromToEach(enter, part(scenes[0], '.scene__title .line__in'), { yPercent: 115 }, { yPercent: 0, duration: 0.45 }, 0.25, 0.08);
        fromToEach(enter, part(scenes[0], '.scene__reveal'), { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.35 }, 0.4, 0.06);
        fromToEach(enter, q('.shows__hud, .shows__rail'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.6);
        const unprimeEnter = primeTimeline(enter);

        return () => {
          unprime();
          unprimeEnter();
          cancelAnimationFrame(warm);
          setStaged(false);
          stRef.current = null;
          activeRef.current = 0;
          liveRef.current = ALL_SCENES;
          setActive(0);
          setLiveMask(ALL_SCENES);
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  const jumpTo = (i: number) => {
    const st = stRef.current;
    if (!st) {
      document.getElementById(`show-${SHOWS[i].id}`)?.scrollIntoView();
      return;
    }
    const t = i === 0 ? LEAD * 0.5 : settledAt(i) + 0.05;
    scrollToTarget(st.start + (t / TOTAL) * (st.end - st.start));
  };

  return (
    <section id="shows" ref={root} className={`shows${staged ? ' is-staged' : ''}`} aria-labelledby="shows-title">
      <div className="shows__track" style={{ ['--n' as string]: N }}>
        <div className="shows__sticky">
          <div className="shows__hud">
            <h2 className="shows__title" id="shows-title">
              <span className="kicker">Our Shows</span>
            </h2>
            <p className="shows__count" aria-live="polite">
              <span className="sr-only">Showing </span>
              <span className="shows__count-now">{String(active + 1).padStart(2, '0')}</span>
              <span aria-hidden="true"> / </span>
              <span className="sr-only"> of </span>
              {String(N).padStart(2, '0')}
            </p>
          </div>

          <div className="shows__stage">
            {SHOWS.map((show, i) => {
              const { Art } = ART[show.id];
              const media = MEDIA.shows[show.id];
              const isActive = !staged || i === active;
              const isLive = !staged || ((liveMask >> i) & 1) === 1;
              return (
                <article
                  key={show.id}
                  id={`show-${show.id}`}
                  className={`scene scene--${show.id}${isLive ? ' is-live' : ''}`}
                  aria-labelledby={`show-${show.id}-title`}
                  inert={!isActive}
                  data-index={i}
                >
                  <div className="scene__art" aria-hidden="true">
                    <div className="scene__art-inner">
                      <Art />
                    </div>
                  </div>

                  {media && (
                    <figure className="scene__media scene__reveal">
                      {media.video ? (
                        <video src={media.video} poster={media.poster} muted loop playsInline autoPlay preload="none" aria-label={media.alt} />
                      ) : (
                        <img src={media.image} alt={media.alt} loading="lazy" decoding="async" />
                      )}
                    </figure>
                  )}

                  <div className="scene__panel">
                    <p className="scene__kicker scene__reveal">
                      <span className="scene__num">{String(i + 1).padStart(2, '0')}</span>
                      <ShowGlyph id={show.id} className="scene__glyph" />
                      {show.short}
                    </p>
                    <h3 className="scene__title display" id={`show-${show.id}-title`}>
                      {show.name.split(' ').map((word, w) => (
                        <span className="line" key={w}>
                          <span className="line__in">{word}</span>
                        </span>
                      ))}
                    </h3>
                    <p className="scene__tagline display scene__reveal">{show.tagline}</p>
                    <p className="scene__desc scene__reveal">{show.description}</p>
                    <ul className="scene__tags scene__reveal" role="list">
                      {show.highlights.map((h) => (
                        <li key={h}>
                          <CheckIcon className="scene__tag-icon" />
                          {h}
                        </li>
                      ))}
                    </ul>
                    <div className="scene__ctas scene__reveal">
                      <a className="btn" href={showLink(show.id)} target="_blank" rel="noopener noreferrer">
                        <span className="btn__icon">
                          <WhatsAppIcon />
                        </span>
                        Book This Show
                        <span className="sr-only">: {show.name} (opens WhatsApp)</span>
                      </a>
                      <button className="btn btn--ghost scene__plan" type="button" onClick={() => requestShowBooking(show.id)}>
                        <span className="btn__icon btn__icon--plain">
                          <CalendarIcon />
                        </span>
                        Add date &amp; place
                        <span className="sr-only"> for {show.name}</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <nav className="shows__rail" ref={railRef} aria-label="Choose a show">
            <ol role="list">
              {SHOWS.map((show, i) => (
                <li key={show.id}>
                  <button
                    type="button"
                    className={`rail__btn${i === active ? ' is-active' : ''}${i < active ? ' is-done' : ''}`}
                    aria-current={i === active ? 'step' : undefined}
                    onClick={() => jumpTo(i)}
                  >
                    <ShowGlyph id={show.id} className="rail__glyph" />
                    <span className="rail__label">
                      <span className="rail__num">{String(i + 1).padStart(2, '0')}</span> {show.short}
                    </span>
                    <span className="sr-only"> — {show.name}</span>
                    <span className="rail__bar" aria-hidden="true">
                      <span className="rail__fill" />
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
    </section>
  );
}
