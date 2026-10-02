import { useCallback, useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from 'react';
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from '../../lib/gsap';
import { NAV_LINKS, PHONES, SITE, type NavId } from '../../config/site';
import { waLink } from '../../lib/whatsapp';
import { focusSection, goToSection, isAutoScrolling, jumpTo } from '../../lib/navigation';
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
    // Active section = the last one whose top has reached its line on screen. About Us starts
    // underneath the hero, so it only counts once the star portal has filled the screen.
    const ORDER: { id: string; nav: NavId; line: number }[] = [
      { id: 'home', nav: 'home', line: 1 },
      { id: 'about', nav: 'about', line: 0.02 },
      { id: 'shows', nav: 'shows', line: 0.4 },
      { id: 'gallery', nav: 'gallery', line: 0.4 },
      { id: 'contact', nav: 'contact', line: 0.4 },
    ];
    // Section positions are measured only when layout changes (ScrollTrigger refresh), never per frame
    let marks: { nav: NavId; y: number }[] = [];
    const measure = () => {
      marks = ORDER.map((sec) => {
        const el = document.getElementById(sec.id);
        return { nav: sec.nav, y: el ? el.getBoundingClientRect().top + window.scrollY - window.innerHeight * sec.line : Infinity };
      });
    };
    measure();
    ScrollTrigger.addEventListener('refresh', measure);

    // Remember what we last told React, so a scroll frame only re-renders when something changed
    let lastY = window.scrollY;
    let isScrolled = false;
    let isHidden = false;
    let current: NavId = 'home';
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const y = self.scroll();
        if (y > 40 !== isScrolled) {
          isScrolled = y > 40;
          setScrolled(isScrolled);
        }
        if (Math.abs(y - lastY) > 6) {
          // keep the bar visible when a link moved the page (menu, logo, "Back to top")
          const hide = !isAutoScrolling() && y > window.innerHeight * 0.7 && self.direction === 1;
          if (hide !== isHidden) {
            isHidden = hide;
            setHidden(hide);
          }
          lastY = y;
        }
        if (progressRef.current) progressRef.current.style.transform = `scaleX(${self.progress.toFixed(4)})`;
        let next: NavId = 'home';
        for (const m of marks) if (y >= m.y) next = m.nav;
        if (next !== current) {
          current = next;
          setActive(next);
        }
      },
    });
    return () => {
      st.kill();
      ScrollTrigger.removeEventListener('refresh', measure);
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
        // Closed with the X button or Escape: hand focus back to the burger
        if (menu.contains(document.activeElement)) burger.focus({ preventScroll: true });
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
    if (!open) {
      goToSection(id);
      return;
    }
    // The menu covers the whole screen: unlock scrolling, jump to the section behind it,
    // then close the menu so the destination is revealed (instant and reliable on phones).
    document.documentElement.classList.remove('menu-open');
    document.getElementById('main')?.removeAttribute('inert');
    document.querySelector('footer')?.removeAttribute('inert');
    requestAnimationFrame(() => {
      jumpTo(id);
      focusSection(id);
      setOpen(false);
    });
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
