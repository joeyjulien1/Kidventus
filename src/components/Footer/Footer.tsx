import type { MouseEvent } from 'react';
import { NAV_LINKS, PHONES, SITE } from '../../config/site';
import { goToSection } from '../../lib/navigation';
import { waLink } from '../../lib/whatsapp';
import { Logo } from '../Logo/Logo';
import { ArrowDownIcon, InstagramIcon, WhatsAppIcon } from '../icons';
import './Footer.css';

const LINKS = NAV_LINKS;

export function Footer() {
  const go = (id: string) => (e: MouseEvent) => {
    e.preventDefault();
    goToSection(id);
  };

  return (
    <footer className="footer">
      <div className="footer__scallop" aria-hidden="true" />
      <div className="wrap footer__grid">
        <div className="footer__brand">
          <Logo className="footer__logo" live />
          <p>
            Kids entertainment &amp; events in {SITE.location}. Birthday shows, bubble shows, science shows, kids theater and teen
            parties.
          </p>
          <p className="footer__owner">
            Kidventus by <strong>{SITE.owner}</strong>
          </p>
        </div>

        <nav className="footer__col" aria-label="Footer">
          <h2 className="footer__heading">Explore</h2>
          <ul role="list">
            {LINKS.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} onClick={go(l.id)}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__col">
          <h2 className="footer__heading">Book on WhatsApp</h2>
          <ul role="list">
            {PHONES.map((p) => (
              <li key={p.id}>
                <a href={waLink(undefined, p)} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon /> {p.intl}
                  <span className="sr-only">(opens WhatsApp)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h2 className="footer__heading">Follow the fun</h2>
          <ul role="list">
            <li>
              <a href={SITE.instagram.brand.url} target="_blank" rel="noopener noreferrer">
                <InstagramIcon /> {SITE.instagram.brand.handle}
              </a>
            </li>
            <li>
              <a href={SITE.instagram.owner.url} target="_blank" rel="noopener noreferrer">
                <InstagramIcon /> {SITE.instagram.owner.handle}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="wrap footer__bottom">
        <p>© {new Date().getFullYear()} Kidventus. Bookings are confirmed directly with our team on WhatsApp — no online payments.</p>
        <a className="footer__top" href="#home" onClick={go('home')}>
          Back to top <ArrowDownIcon />
        </a>
      </div>
    </footer>
  );
}
