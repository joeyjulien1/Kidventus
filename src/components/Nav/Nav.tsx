import { useCallback, useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from 'react';
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from '../../lib/gsap';
import { NAV_LINKS, PHONES, SITE, type NavId } from '../../config/site';
import { waLink } from '../../lib/whatsapp';
import { goToSection } from '../../lib/navigation';
import { Logo } from '../Logo/Logo';
import { CloseIcon, InstagramIcon, WhatsAppIcon } from '../icons';
import './Nav.css';

export function Nav() {
  const navRef = useRef<HTMLElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<NavId | null>('home');
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [indicator, setIndicator] = useState<{ x: number; w: number } | null>(null);

  /* ---------- Scroll state: compact bar, hide on scroll down, progress, active section ---------- */
  useGSAP(() => {
    let lastY = window.scrollY;
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const y = self.scroll();
        setScrolled(y > 40);
        if (Math.abs(y - lastY) > 6) {
          setHidden(y > window.innerHeight * 0.7 && self.direction === 1);
          lastY = y;
        }
        progressRef.current?.style.setProperty('--p', self.progress.toFixed(4));
      },
    });

    // Active section: the last one whose top has reached its line on screen.
    // About Us starts underneath the hero, so it only counts once the star portal has filled the screen.
    const ORDER: { id: string; nav: NavId | null; line: number }[] = [
      { id: 'home', nav: 'home', line: 1 },
      { id: 'about', nav: 'about', line: 0.02 },
      { id: 'shows', nav: 'shows', line: 0.4 },
      { id: 'gallery', nav: 'gallery', line: 0.4 },
      { id: 'booking', nav: null, line: 0.4 },
      { id: 'contact', nav: 'contact', line: 0.4 },
    ];
    let frame = 0;
    const updateActive = () => {
      frame = 0;
      let current: NavId | null = 'home';
      for (const sec of ORDER) {
        const el = document.getElementById(sec.id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * sec.line) current = sec.nav;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(updateActive);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    updateActive();
    return () => {
      st.kill();
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  /* ---------- Sliding active indicator ---------- */
  const measureIndicator = useCallback(() => {
    const list = linksRef.current;
    const link = active ? list?.querySelector<HTMLElement>(`[data-id="${active}"]`) : null;
    setIndicator(link ? { x: link.offsetLeft, w: link.offsetWidth } : null);
  }, [active]);

  useLayoutEffect(() => {
    measureIndicator();
  }, [measureIndicator]);

  useEffect(() => {
    window.addEventListener('resize', measureIndicator);
    document.fonts?.ready.then(measureIndicator);
    return () => window.removeEventListener('resize', measureIndicator);
  }, [measureIndicator]);

  /* ---------- Mobile menu ---------- */
  useEffect(() => {
    const main = document.getElementById('main');
    const footer = document.querySelector('footer');
    main?.toggleAttribute('inert', open);
    footer?.toggleAttribute('inert', open);
    document.documentElement.classList.toggle('menu-open', open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useGSAP(
    () => {
      const menu = menuRef.current;
      const burger = burgerRef.current;
      if (!menu || !burger) return;
      const reduce = prefersReducedMotion();
      const r = burger.getBoundingClientRect();
      const origin = `${r.left + r.width / 2}px ${r.top + r.height / 2}px`;
      if (open) {
        gsap.set(menu, { visibility: 'visible' });
        if (reduce) {
          gsap.set(menu, { clipPath: 'none', opacity: 1 });
        } else {
          gsap
            .timeline()
            .fromTo(menu, { clipPath: `circle(0px at ${origin})` }, { clipPath: `circle(150vmax at ${origin})`, duration: 0.7, ease: 'power3.inOut' })
            .fromTo(menu.querySelectorAll('.menu__item'), { y: 50, opacity: 0, rotate: 4 }, { y: 0, opacity: 1, rotate: 0, stagger: 0.06, duration: 0.6, ease: 'back.out(1.6)' }, 0.25)
            .fromTo(menu.querySelectorAll('.menu__foot > *'), { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.5 }, 0.45);
        }
        menu.querySelector<HTMLElement>('.menu__link')?.focus({ preventScroll: true });
      } else if (menu.style.visibility === 'visible') {
        const done = () => {
          gsap.set(menu, { visibility: 'hidden' });
        };
        if (reduce) done();
        else gsap.to(menu, { clipPath: `circle(0px at ${origin})`, duration: 0.5, ease: 'power3.inOut', onComplete: done });
      }
    },
    { dependencies: [open] },
  );

  const go = (id: string) => (e: MouseEvent) => {
    e.preventDefault();
    const wasOpen = open;
    setOpen(false);
    if (wasOpen) {
      burgerRef.current?.focus({ preventScroll: true });
      window.setTimeout(() => goToSection(id), prefersReducedMotion() ? 0 : 280);
    } else {
      goToSection(id);
    }
  };

  const classes = ['nav', scrolled && 'is-scrolled', hidden && !open && 'is-hidden', open && 'is-open'].filter(Boolean).join(' ');

  return (
    <>
      <header className={classes} ref={navRef}>
        <nav className="nav__bar" aria-label="Main">
          <a className="nav__brand" href="#home" onClick={go('home')} aria-label="Kidventus — back to top">
            <Logo className="nav__logo" decorative eager live />
          </a>

          <div className="nav__links-wrap" ref={linksRef}>
            <span
              className="nav__indicator"
              aria-hidden="true"
              style={indicator ? { transform: `translateX(${indicator.x}px)`, width: indicator.w, opacity: 1 } : { opacity: 0 }}
            />
            <ul className="nav__links" role="list">
            {NAV_LINKS.map((l) => (
              <li key={l.id}>
                <a
                  className={`nav__link${active === l.id ? ' is-active' : ''}`}
                  data-id={l.id}
                  href={`#${l.id}`}
                  onClick={go(l.id)}
                  aria-current={active === l.id ? 'true' : undefined}
                >
                  {l.label}
                </a>
              </li>
            ))}
            </ul>
          </div>

          <a className="btn btn--sm nav__cta" href={waLink()} target="_blank" rel="noopener noreferrer">
            <span className="btn__icon">
              <WhatsAppIcon />
            </span>
            <span className="nav__cta-label">Book on WhatsApp</span>
            <span className="nav__cta-short">Book</span>
            <span className="sr-only">(opens WhatsApp)</span>
          </a>

          <button
            ref={burgerRef}
            className="nav__burger"
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="nav__burger-lines" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>

          <span className="nav__progress" ref={progressRef} aria-hidden="true" />
        </nav>
      </header>

      <div
        id="mobile-menu"
        ref={menuRef}
        className="menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        style={{ visibility: 'hidden' }}
        inert={!open}
      >
        <button className="menu__close" type="button" onClick={() => setOpen(false)} aria-label="Close menu">
          <CloseIcon />
        </button>
        <ul className="menu__list" role="list">
          {NAV_LINKS.map((l, i) => (
            <li key={l.id} className="menu__item">
              <a className={`menu__link${active === l.id ? ' is-active' : ''}`} href={`#${l.id}`} onClick={go(l.id)}>
                <span className="menu__num">0{i + 1}</span>
                {l.label}
              </a>
            </li>
          ))}
          <li className="menu__item">
            <a className="menu__link" href="#booking" onClick={go('booking')}>
              <span className="menu__num">06</span>
              How to Book
            </a>
          </li>
        </ul>
        <div className="menu__foot">
          <a className="btn btn--lg menu__wa" href={waLink()} target="_blank" rel="noopener noreferrer">
            <span className="btn__icon">
              <WhatsAppIcon />
            </span>
            Book on WhatsApp
            <span className="sr-only">(opens WhatsApp)</span>
          </a>
          <p className="menu__phones">
            {PHONES.map((p) => (
              <a key={p.id} href={`tel:${p.tel}`}>
                {p.intl}
              </a>
            ))}
          </p>
          <a className="menu__ig" href={SITE.instagram.brand.url} target="_blank" rel="noopener noreferrer">
            <InstagramIcon /> {SITE.instagram.brand.handle}
          </a>
        </div>
      </div>
    </>
  );
}
