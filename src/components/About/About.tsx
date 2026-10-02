import { Fragment, useRef } from 'react';
import { gsap, useGSAP, MQ } from '../../lib/gsap';
import { goToSection } from '../../lib/navigation';
import { primeTimeline } from '../../lib/anim';
import { usePauseOffscreen } from '../../lib/usePauseOffscreen';
import { SHOWS } from '../../config/shows';
import { SITE } from '../../config/site';
import { ArrowDownIcon, InstagramIcon, ShowGlyph, SparkleIcon } from '../icons';
import type { ShowId } from '../../config/shows';
import './About.css';

type Tone = 'pink' | 'blue' | 'plum';

const COPY = 'Every party is a [story|pink]. We make every kid the [hero|blue] of it — with shows, characters, music and a whole lot of [magic|plum].';

const WORDS: { text: string; tone?: Tone; trail?: string }[] = COPY.split(' ').map((raw) => {
  const m = raw.match(/^\[(.+)\|(\w+)\](.*)$/);
  return m ? { text: m[1], tone: m[2] as Tone, trail: m[3] } : { text: raw };
});

/**
 * Where each show sticker floats (percent of the stage) before they all line up
 * in a row under the sentence. Kept clear of the text block on every screen size.
 */
const SCATTER = {
  desktop: [
    { x: 10, y: 22, r: -16 },
    { x: 89, y: 18, r: 14 },
    { x: 8, y: 66, r: 10 },
    { x: 92, y: 62, r: -12 },
    { x: 50, y: 9, r: 8 },
  ],
  mobile: [
    { x: 14, y: 14, r: -16 },
    { x: 86, y: 12, r: 14 },
    { x: 12, y: 80, r: 10 },
    { x: 88, y: 78, r: -12 },
    { x: 50, y: 7, r: 8 },
  ],
};

const VALUES = [
  {
    title: 'Creativity & imagination',
    text: 'Original themes, characters and ideas that spark kids’ imaginations — no copy-paste parties.',
    glyph: 'theater' as ShowId,
  },
  {
    title: 'Every age, every stage',
    text: 'From toddlers’ birthdays and nursery events to school shows and teen parties.',
    glyph: 'bubble' as ShowId,
  },
  {
    title: 'Moments to remember',
    text: 'Every event is built around the birthday star and the big “wow” moments everyone talks about after.',
    glyph: 'birthday' as ShowId,
  },
  {
    title: 'Professional entertainment',
    text: 'A dedicated team that runs the fun from start to finish — so you can actually enjoy the party.',
    glyph: 'teens' as ShowId,
  },
];

const MARQUEE_A = ['Birthdays', 'Schools', 'Nurseries', 'Festivals', 'Private events'];
const MARQUEE_B = ['Toddlers', 'Kids', 'Tweens', 'Teens'];

function MarqueeRow({ words, outline = false, className }: { words: string[]; outline?: boolean; className: string }) {
  const items = [...words, ...words, ...words];
  return (
    <div className={`about__marquee ${className}${outline ? ' is-outline' : ''}`} aria-hidden="true">
      {items.map((w, i) => (
        <span key={i} className="about__marquee-item">
          {w}
          <SparkleIcon className="about__marquee-spark" />
        </span>
      ))}
    </div>
  );
}

export function About() {
  const root = useRef<HTMLElement>(null);
  usePauseOffscreen(root);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      /* ---------- Manifesto: words light up as you scroll, stickers drift ---------- */
      mm.add(MQ.motion, () => {
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: q('.manifesto__track')[0],
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.5,
          },
        });

        tl.fromTo(q('.manifesto__kicker'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.12 }, 0);
        (q('.mf-word') as HTMLElement[]).forEach((word, i) => {
          tl.fromTo(word, { opacity: 0.14 }, { opacity: 1, duration: 0.08 }, 0.06 + i * 0.03);
        });
        q('.mf-pill').forEach((pill) => {
          const index = (q('.mf-word') as HTMLElement[]).indexOf(pill.closest('.mf-word') as HTMLElement);
          const at = 0.06 + index * 0.03;
          tl.fromTo(pill.querySelector('.mf-pill__bg'), { scaleX: 0 }, { scaleX: 1, duration: 0.06, ease: 'back.out(2)' }, at)
            .fromTo(pill, { color: '#1f0a3d' }, { color: '#fff', duration: 0.04 }, at + 0.01)
            .fromTo(pill.querySelector('.mf-pill__spark'), { scale: 0, rotation: -90 }, { scale: 1, rotation: 0, duration: 0.06, ease: 'back.out(3)' }, at + 0.03);
        });
        // Stickers start scattered around the sentence, drift gently, then line up in a row beneath it
        const sticky = q('.manifesto__sticky')[0] as HTMLElement;
        const scatter = () => (window.matchMedia(MQ.mobile).matches ? SCATTER.mobile : SCATTER.desktop);
        const offset = (el: HTMLElement, i: number, axis: 'x' | 'y') => {
          const s = scatter()[i];
          const row = el.offsetParent as HTMLElement;
          const restX = row.offsetLeft + el.offsetLeft + el.offsetWidth / 2;
          const restY = row.offsetTop + el.offsetTop + el.offsetHeight / 2;
          return axis === 'x' ? (s.x / 100) * sticky.offsetWidth - restX : (s.y / 100) * sticky.offsetHeight - restY;
        };
        (q('.mf-sticker') as HTMLElement[]).forEach((el, i) => {
          tl.fromTo(
            el,
            { x: () => offset(el, i, 'x'), y: () => offset(el, i, 'y'), rotation: () => scatter()[i].r, scale: 1.1 },
            { x: 0, y: 0, rotation: 0, scale: 1, duration: 0.35, ease: 'power2.inOut' },
            0.92 + i * 0.03,
          );
        });
        (q('.mf-drift') as HTMLElement[]).forEach((el, i) => {
          tl.fromTo(el, { y: 0, rotation: 0 }, { y: i % 2 ? -36 : 30, rotation: i % 2 ? 12 : -10, duration: 0.9 }, 0).to(
            el,
            { y: 0, rotation: 0, duration: 0.3, ease: 'power2.inOut' },
            0.92,
          );
        });
        tl.fromTo(q('.manifesto__outro'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.15 }, 1.2)
          .to({}, { duration: 0.12 });
        return primeTimeline(tl);
      });

      /* ---------- Details: reveal rows, slide the marquee with scroll ---------- */
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          q('.about__heading .line__in'),
          { yPercent: 115 },
          { yPercent: 0, duration: 1, stagger: 0.1, ease: 'power4.out', scrollTrigger: { trigger: q('.about__heading')[0], start: 'top 82%' } },
        );
        gsap.fromTo(
          q('.about__story > p, .about__founder'),
          { y: 30, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.12, scrollTrigger: { trigger: q('.about__story')[0], start: 'top 78%' } },
        );
        q('.value').forEach((row) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 85%' } });
          tl.fromTo(row.querySelector('.value__rule'), { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'power3.inOut' })
            .fromTo(row.querySelector('.value__glyph'), { scale: 0, rotation: -40 }, { scale: 1, rotation: 0, duration: 0.6, ease: 'back.out(2.2)' }, 0.2)
            .fromTo(row.querySelectorAll('.value__num, .value__body'), { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.08 }, 0.25);
        });
        gsap.fromTo(q('.about__marquee--a'), { xPercent: 0 }, { xPercent: -24, ease: 'none', scrollTrigger: { trigger: q('.about__marquees')[0], start: 'top bottom', end: 'bottom top', scrub: true } });
        gsap.fromTo(q('.about__marquee--b'), { xPercent: -30 }, { xPercent: -6, ease: 'none', scrollTrigger: { trigger: q('.about__marquees')[0], start: 'top bottom', end: 'bottom top', scrub: true } });

      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="about" className="manifesto about" ref={root} aria-labelledby="about-title">
      {/* ---------- Chapter 1: the manifesto ---------- */}
      <div className="manifesto__track">
        <div className="manifesto__sticky">
          <div className="manifesto__inner">
            <p className="manifesto__kicker kicker">About us · Welcome to the Kidventus world</p>
            <h2 className="manifesto__text display" id="about-title">
              {WORDS.map((w, i) => (
                <Fragment key={i}>
                  <span className="mf-word">
                    {w.tone ? (
                      <>
                        <span className={`mf-pill mf-pill--${w.tone}`}>
                          <span className="mf-pill__bg" aria-hidden="true" />
                          <span className="mf-pill__label">{w.text}</span>
                          <SparkleIcon className="mf-pill__spark" />
                        </span>
                        {w.trail}
                      </>
                    ) : (
                      w.text
                    )}
                  </span>{' '}
                </Fragment>
              ))}
            </h2>
          </div>

          <div className="manifesto__row">
            <ul className="manifesto__stickers" role="list" aria-label="Our five shows">
              {SHOWS.map((s) => (
                <li key={s.id} className="mf-sticker">
                  <span className="mf-drift">
                    <span className="mf-bob">
                      <ShowGlyph id={s.id} className="mf-sticker__glyph" />
                    </span>
                  </span>
                  <span className="sr-only">{s.name}</span>
                </li>
              ))}
            </ul>
            <p className="manifesto__outro">
              <strong>5 shows.</strong> Endless smiles.
            </p>
          </div>
        </div>
      </div>

      {/* ---------- Chapter 2: who we are ---------- */}
      <div className="about__details wrap">
        <div className="about__story">
          <h3 className="about__heading display">
            <span className="line">
              <span className="line__in">Made for kids.</span>
            </span>
            <span className="line">
              <span className="line__in about__heading-alt">Planned with parents.</span>
            </span>
          </h3>
          <p>
            Kidventus is a kids’ entertainment and events team in Lebanon, founded and led by <strong>Carl Mansour</strong>. We bring
            shows, characters, games and music to birthdays, schools, nurseries, festivals and celebrations of every size.
          </p>
          <p>
            Every event is shaped around your child, your space and your plans — then brought to life by a team that genuinely loves
            making kids smile.
          </p>
          <a className="about__founder" href={SITE.instagram.owner.url} target="_blank" rel="noopener noreferrer">
            <img className="about__badge" src="/brand/kidventus-badge.png" alt="" width="56" height="56" loading="lazy" />
            <span>
              <strong>Kidventus by Carl Mansour</strong>
              <span className="about__founder-handle">
                <InstagramIcon /> {SITE.instagram.owner.handle}
              </span>
            </span>
            <span className="sr-only">(opens Instagram in a new tab)</span>
          </a>
        </div>

        <ol className="about__values" role="list">
          {VALUES.map((v, i) => (
            <li key={v.title} className="value">
              <span className="value__rule" aria-hidden="true" />
              <span className="value__num">{String(i + 1).padStart(2, '0')}</span>
              <span className="value__glyph" aria-hidden="true">
                <ShowGlyph id={v.glyph} />
              </span>
              <span className="value__body">
                <strong>{v.title}</strong>
                <span>{v.text}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="about__marquees">
        <MarqueeRow words={MARQUEE_A} className="about__marquee--a" />
        <MarqueeRow words={MARQUEE_B} className="about__marquee--b" outline />
      </div>

      {/* ---------- Lead-in to the shows ---------- */}
      <div className="about__lead">
        <a
          className="about__lead-text"
          href="#shows"
          onClick={(e) => {
            e.preventDefault();
            goToSection('shows');
          }}
        >
          <strong>Meet our shows</strong> <ArrowDownIcon />
        </a>
      </div>
      <div className="about__scallop" aria-hidden="true" />
    </section>
  );
}
