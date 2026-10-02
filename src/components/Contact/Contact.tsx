import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP, MQ } from '../../lib/gsap';
import { burst } from '../../lib/confetti';
import { waLink } from '../../lib/whatsapp';
import { PHONES, SITE } from '../../config/site';
import { BalloonSvg } from '../Balloon/Balloon';
import { InstagramIcon, PhoneIcon, WhatsAppIcon } from '../icons';
import './Contact.css';

const WORDS = [
  { t: 'Let’s', tone: 'white' },
  { t: 'create', tone: 'star' },
  { t: 'unforgettable', tone: 'white' },
  { t: 'memories!', tone: 'blue' },
];

export function Contact() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const words = q('.cw') as HTMLElement[];
        gsap.set(words, { scale: 0.2, rotation: (i: number) => (i % 2 ? 14 : -14), autoAlpha: 0, y: 40 });
        ScrollTrigger.create({
          trigger: q('.contact__title')[0],
          start: 'top 78%',
          once: true,
          onEnter: () => {
            gsap.to(words, {
              scale: 1,
              rotation: (i: number) => [-3, 2, -2, 3][i] ?? 0,
              autoAlpha: 1,
              y: 0,
              duration: 0.9,
              stagger: 0.12,
              ease: 'back.out(2.2)',
              onComplete: () => {
                const r = q('.contact__title')[0].getBoundingClientRect();
                if (r.bottom > 0 && r.top < window.innerHeight) {
                  burst({ x: r.left + r.width * 0.2, y: r.top + r.height * 0.5, angle: -60, spread: 60, count: 70, power: 15 });
                  burst({ x: r.left + r.width * 0.8, y: r.top + r.height * 0.5, angle: -120, spread: 60, count: 70, power: 15 });
                }
              },
            });
          },
        });
        gsap.fromTo(
          q('.contact__lede, .contact__cta, .ticket, .contact__social'),
          { y: 40, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.1, scrollTrigger: { trigger: q('.contact__lede')[0], start: 'top 85%' } },
        );
        gsap.fromTo(q('.contact__balloon'), { y: 200 }, { y: -160, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="contact" ref={root} className="contact" aria-labelledby="contact-title">
      <div className="contact__balloons" aria-hidden="true">
        <div className="contact__balloon contact__balloon--l">
          <BalloonSvg color="yellow" outlined />
        </div>
        <div className="contact__balloon contact__balloon--r">
          <BalloonSvg color="blue" outlined />
        </div>
      </div>

      <div className="wrap contact__inner">
        <p className="kicker contact__kicker">Contact</p>
        <h2 className="contact__title display" id="contact-title">
          {WORDS.map((w) => (
            <span key={w.t} className={`cw cw--${w.tone}`}>
              {w.t}
            </span>
          ))}
        </h2>
        <p className="contact__lede">
          Tell us about your celebration — the date, the place, the birthday star — and we’ll bring the magic. Message us on
          WhatsApp or give us a call.
        </p>

        <a className="btn btn--lg contact__cta" href={waLink()} target="_blank" rel="noopener noreferrer">
          <span className="btn__icon">
            <WhatsAppIcon />
          </span>
          Book Your Event on WhatsApp
          <span className="sr-only">(opens WhatsApp)</span>
        </a>

        <ul className="tickets" role="list">
          {PHONES.map((p, i) => (
            <li key={p.id} className="ticket">
              <span className="ticket__label">Line {i + 1} · WhatsApp &amp; calls</span>
              <span className="ticket__number display">{p.intl}</span>
              <span className="ticket__actions">
                <a className="ticket__btn ticket__btn--wa" href={waLink(undefined, p)} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon /> WhatsApp
                  <span className="sr-only"> {p.intl} (opens WhatsApp)</span>
                </a>
                <a className="ticket__btn" href={`tel:${p.tel}`}>
                  <PhoneIcon /> Call
                  <span className="sr-only"> {p.intl}</span>
                </a>
              </span>
            </li>
          ))}
        </ul>

        <div className="contact__social">
          <a href={SITE.instagram.brand.url} target="_blank" rel="noopener noreferrer">
            <InstagramIcon />
            <span>
              <strong>{SITE.instagram.brand.handle}</strong> on Instagram
            </span>
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <a href={SITE.instagram.owner.url} target="_blank" rel="noopener noreferrer">
            <InstagramIcon />
            <span>
              <strong>{SITE.instagram.owner.handle}</strong> · founder Carl Mansour
            </span>
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </div>
    </section>
  );
}
