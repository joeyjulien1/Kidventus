import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { gsap, useGSAP, MQ } from '../../lib/gsap';
import { fromToEach } from '../../lib/anim';
import { burstFrom } from '../../lib/confetti';
import { onShowBookingRequest } from '../../lib/navigation';
import { buildMessage, cleanText, waLink } from '../../lib/whatsapp';
import { PHONES } from '../../config/site';
import { SHOWS, type ShowId } from '../../config/shows';
import { CalendarIcon, CheckIcon, LockIcon, PinIcon, ShowGlyph, SparkleIcon, WhatsAppIcon } from '../icons';
import './Booking.css';

type Choice = ShowId | 'unsure';

const STEPS = [
  { title: 'Choose your show', text: 'Pick a favorite from our shows — or ask us to help you choose.', icon: SparkleIcon },
  { title: 'Message us on WhatsApp', text: 'Tap a button below. Your message is already written for you.', icon: WhatsAppIcon },
  { title: 'Share the details', text: 'Tell us the date, the location and what you have in mind.', icon: CalendarIcon },
  { title: 'Confirm with our team', text: 'We confirm everything with you directly. No online payment, ever.', icon: CheckIcon },
];

const AREAS = [
  'Beirut',
  'Achrafieh',
  'Hamra',
  'Jounieh',
  'Kaslik',
  'Byblos (Jbeil)',
  'Batroun',
  'Tripoli',
  'Metn',
  'Baabda',
  'Aley',
  'Chouf',
  'Zahle',
  'Saida',
  'Tyre',
  'Broummana',
  'Dbayeh',
  'Zalka',
  'Antelias',
  'Tannourine',
];

/* Road through the four stops (x = column centres, y = badge centres) */
const STOPS: [number, number][] = [
  [-20, 92],
  [150, 60],
  [450, 104],
  [750, 56],
  [1050, 100],
  [1220, 70],
];
const ROAD = (() => {
  let d = `M${STOPS[0][0]} ${STOPS[0][1]}`;
  for (let i = 0; i < STOPS.length - 1; i++) {
    const p0 = STOPS[Math.max(0, i - 1)];
    const p1 = STOPS[i];
    const p2 = STOPS[i + 1];
    const p3 = STOPS[Math.min(STOPS.length - 1, i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0]} ${p2[1]}`;
  }
  return d;
})();

function todayISO() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

export function Booking() {
  const root = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [show, setShow] = useState<Choice>('unsure');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [flash, setFlash] = useState(0);

  const message = useMemo(
    () => buildMessage({ show: show === 'unsure' ? null : show, date, location: cleanText(location) }),
    [show, date, location],
  );

  // "Add date & place" buttons in the Shows stage preselect a show here
  useEffect(
    () =>
      onShowBookingRequest((id) => {
        setShow(id);
        setFlash((f) => f + 1);
      }),
    [],
  );

  useGSAP(
    () => {
      if (!flash) return;
      gsap.fromTo(root.current!.querySelector('.pick.is-selected .pick__card'), { scale: 0.8, rotation: -6 }, { scale: 1, rotation: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)', delay: 0.6 });
    },
    { scope: root, dependencies: [flash] },
  );

  /* ---------- Scroll: the road draws itself and each stop pops in ---------- */
  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add({ motion: MQ.motion, desktop: MQ.desktop }, (ctx) => {
        if (!ctx.conditions?.motion) return;
        const path = q(ctx.conditions.desktop ? '.steps__road--h .steps__road-line' : '.steps__road--v .steps__road-line')[0];
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: q('.steps')[0], start: 'top 78%', end: 'bottom 55%', scrub: 0.6 },
        });
        if (path) tl.fromTo(path, { drawSVG: '0%' }, { drawSVG: '100%', duration: 1 }, 0);
        (q('.step') as HTMLElement[]).forEach((step, i) => {
          const at = 0.05 + i * 0.25;
          tl.fromTo(step.querySelector('.step__badge'), { scale: 0, rotation: -60 }, { scale: 1, rotation: 0, duration: 0.15, ease: 'back.out(2.5)' }, at).fromTo(
            step.querySelectorAll('.step__title, .step__text'),
            { y: 24, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.15 },
            at + 0.04,
          );
        });

        gsap.fromTo(
          q('.booking__title .line__in'),
          { yPercent: 115 },
          { yPercent: 0, duration: 1, stagger: 0.1, ease: 'power4.out', scrollTrigger: { trigger: q('.booking__head')[0], start: 'top 80%' } },
        );
        const b = gsap.timeline({ scrollTrigger: { trigger: q('.builder')[0], start: 'top 75%' } });
        b.fromTo(q('.builder__form'), { y: 60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9 });
        b.fromTo(q('.phone'), { y: 120, rotation: 8, autoAlpha: 0 }, { y: 0, rotation: 3, autoAlpha: 1, duration: 1.1, ease: 'back.out(1.4)' }, 0.15);
        fromToEach(b, q('.pick'), { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4 }, 0.3, 0.05);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const celebrate = (e: MouseEvent<HTMLElement>) => burstFrom(e.currentTarget, { count: 60, spread: 90, power: 13 });

  return (
    <section id="booking" ref={root} className="booking" aria-labelledby="booking-title" data-theme="booking">
      <div className="wrap">
        <header className="booking__head">
          <p className="kicker booking__kicker">How to book</p>
          <h2 className="booking__title display" id="booking-title">
            <span className="line">
              <span className="line__in">Booking is as easy as</span>
            </span>
            <span className="line">
              <span className="line__in booking__title-nums">
                1<span>·</span>2<span>·</span>3<span>·</span>4
              </span>
            </span>
          </h2>
          <p className="booking__lede">
            No online payments, no forms to submit. Pick a show, message us on WhatsApp and our team takes it from there.
          </p>
        </header>

        <div className="steps">
          <svg className="steps__road steps__road--h" viewBox="0 0 1200 160" aria-hidden="true">
            <path className="steps__road-bed" d={ROAD} />
            <path className="steps__road-line" d={ROAD} />
          </svg>
          <svg className="steps__road steps__road--v" viewBox="0 0 60 1000" preserveAspectRatio="none" aria-hidden="true">
            <path className="steps__road-bed" d="M30 0C60 120 0 240 30 360S60 600 30 720 0 900 30 1000" />
            <path className="steps__road-line" d="M30 0C60 120 0 240 30 360S60 600 30 720 0 900 30 1000" />
          </svg>
          <ol className="steps__list" role="list">
            {STEPS.map((s, i) => (
              <li key={s.title} className="step">
                <span className="step__badge" aria-hidden="true">
                  <span className="step__num">{i + 1}</span>
                  <s.icon className="step__icon" />
                </span>
                <h3 className="step__title">{s.title}</h3>
                <p className="step__text">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="builder" id="plan">
          <form
            ref={formRef}
            className="builder__form"
            onSubmit={(e) => {
              e.preventDefault();
              window.open(waLink(message, PHONES[0]), '_blank', 'noopener,noreferrer');
            }}
            aria-describedby="builder-privacy"
          >
            <h3 className="builder__title display">Plan your event in 10 seconds</h3>

            <fieldset className="builder__field">
              <legend>
                <span className="builder__step">1</span> Which show?
              </legend>
              <div className="picks">
                {SHOWS.map((s) => (
                  <label key={s.id} className={`pick${show === s.id ? ' is-selected' : ''}`}>
                    <input type="radio" name="show" value={s.id} checked={show === s.id} onChange={() => setShow(s.id)} />
                    <span className="pick__card">
                      <ShowGlyph id={s.id} className="pick__glyph" />
                      <span className="pick__name">{s.name}</span>
                      <CheckIcon className="pick__check" />
                    </span>
                  </label>
                ))}
                <label className={`pick pick--unsure${show === 'unsure' ? ' is-selected' : ''}`}>
                  <input type="radio" name="show" value="unsure" checked={show === 'unsure'} onChange={() => setShow('unsure')} />
                  <span className="pick__card">
                    <span className="pick__glyph pick__glyph--q" aria-hidden="true">
                      ?
                    </span>
                    <span className="pick__name">Not sure yet</span>
                    <CheckIcon className="pick__check" />
                  </span>
                </label>
              </div>
            </fieldset>

            <div className="builder__row">
              <div className="builder__input">
                <label htmlFor="kv-date">
                  <span className="builder__step">2</span> Preferred date <em>(optional)</em>
                </label>
                <span className="builder__control">
                  <CalendarIcon className="builder__icon" />
                  <input id="kv-date" type="date" min={todayISO()} value={date} onChange={(e) => setDate(e.target.value)} />
                </span>
              </div>
              <div className="builder__input">
                <label htmlFor="kv-location">
                  <span className="builder__step">3</span> Location <em>(optional)</em>
                </label>
                <span className="builder__control">
                  <PinIcon className="builder__icon" />
                  <input
                    id="kv-location"
                    type="text"
                    list="kv-areas"
                    maxLength={80}
                    autoComplete="off"
                    placeholder="e.g. Beirut, Jounieh, Zahle…"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </span>
                <datalist id="kv-areas">
                  {AREAS.map((a) => (
                    <option key={a} value={a} />
                  ))}
                </datalist>
              </div>
            </div>

            <div className="builder__send">
              <p className="builder__send-label">
                <span className="builder__step">4</span> Send it to either number:
              </p>
              <div className="builder__buttons">
                {PHONES.map((p, i) => (
                  <a
                    key={p.id}
                    className={`btn btn--lg${i ? ' btn--white' : ''}`}
                    href={waLink(message, p)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={celebrate}
                  >
                    <span className="btn__icon">
                      <WhatsAppIcon />
                    </span>
                    {p.intl}
                    <span className="sr-only">— open WhatsApp with your message</span>
                  </a>
                ))}
              </div>
            </div>

            <p className="builder__privacy" id="builder-privacy">
              <LockIcon />
              Nothing you type here is saved or sent anywhere — it simply fills in your WhatsApp message.
            </p>
          </form>

          <figure className="phone" aria-label="Preview of your WhatsApp message">
            <div className="phone__screen">
              <div className="phone__bar">
                <img src="/brand/kidventus-badge.png" alt="" width="40" height="40" />
                <span>
                  <strong>Kidventus</strong>
                  <small>{PHONES[0].intl}</small>
                </span>
              </div>
              <div className="phone__chat">
                <p className="phone__day">Today</p>
                <div className="phone__bubble" key={show}>
                  <p>{message}</p>
                  <span className="phone__meta" aria-hidden="true">
                    now <CheckIcon /> <CheckIcon />
                  </span>
                </div>
              </div>
              <a className="phone__input" href={waLink(message, PHONES[0])} target="_blank" rel="noopener noreferrer" onClick={celebrate}>
                <span>Tap to open WhatsApp</span>
                <span className="phone__send" aria-hidden="true">
                  <WhatsAppIcon />
                </span>
                <span className="sr-only">(opens WhatsApp with this message)</span>
              </a>
            </div>
            <figcaption className="sr-only">This is exactly the message that will open in WhatsApp.</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
