import { useRef } from 'react';
import { gsap, useGSAP, MQ } from '../../lib/gsap';
import { SITE } from '../../config/site';
import { InstagramIcon } from '../icons';
import { Reel } from './Reel';
import './Gallery.css';

export function Gallery() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          q('.gallery__title .line__in'),
          { yPercent: 115 },
          {
            yPercent: 0,
            duration: 1,
            stagger: 0.1,
            ease: 'power4.out',
            scrollTrigger: { trigger: q('.gallery__head')[0], start: 'top 80%', toggleActions: 'play none none reverse' },
          },
        );
        gsap.fromTo(
          q('.gallery__ig > *'),
          { y: 30, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.1, scrollTrigger: { trigger: q('.gallery__ig')[0], start: 'top 90%' } },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="gallery" ref={root} className="gallery" aria-labelledby="gallery-title">
      <div className="gallery__glow" aria-hidden="true" />

      <header className="gallery__head wrap">
        <p className="kicker gallery__kicker">Gallery</p>
        <h2 className="gallery__title display" id="gallery-title">
          <span className="line">
            <span className="line__in">Real moments.</span>
          </span>
          <span className="line">
            <span className="line__in gallery__title-pop">Real magic.</span>
          </span>
        </h2>
        <p className="gallery__lede">Straight from our events — press play, turn the sound on, and watch the magic happen.</p>
      </header>

      <Reel />

      <div className="gallery__ig wrap">
        <p>There’s a lot more where these came from.</p>
        <a className="btn btn--white btn--lg" href={SITE.instagram.brand.url} target="_blank" rel="noopener noreferrer">
          <span className="btn__icon btn__icon--ig">
            <InstagramIcon />
          </span>
          Follow {SITE.instagram.brand.handle}
          <span className="sr-only">on Instagram (opens in a new tab)</span>
        </a>
      </div>
    </section>
  );
}
