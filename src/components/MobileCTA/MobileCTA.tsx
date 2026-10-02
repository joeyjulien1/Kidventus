import { useEffect, useState } from 'react';
import { waLink } from '../../lib/whatsapp';
import { WhatsAppIcon } from '../icons';
import './MobileCTA.css';

/** Zones that already have their own booking buttons (or a bottom rail) */
const BUSY = ['home', 'shows', 'booking', 'contact'];

export function MobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const busy = new Set<string>();
    const footer = document.querySelector('footer');
    const targets = [...BUSY.map((id) => document.getElementById(id)), footer].filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const key = e.target.id || 'footer';
          if (e.isIntersecting) busy.add(key);
          else busy.delete(key);
        });
        setVisible(busy.size === 0);
      },
      { rootMargin: '-35% 0px -35% 0px' },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <a
      className={`mobile-cta btn${visible ? ' is-visible' : ''}`}
      href={waLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-hidden={!visible}
      tabIndex={visible ? undefined : -1}
    >
      <span className="btn__icon">
        <WhatsAppIcon />
      </span>
      Book your event
      <span className="sr-only">(opens WhatsApp)</span>
    </a>
  );
}
