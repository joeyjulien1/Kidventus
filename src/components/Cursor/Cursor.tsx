import { useEffect, useRef } from 'react';
import { gsap, MQ } from '../../lib/gsap';
import './Cursor.css';

const INTERACTIVE = 'a, button, label, input, select, textarea, [role="button"], .balloon__pop, .bub';
const COLORS = ['#fcd871', '#ff8ac8', '#5daedd', '#c8f04b'];

/**
 * A soft ring that trails the (still visible) system cursor, grows over
 * anything clickable and sheds a few sparkles when you move fast.
 * Desktop + fine pointer + motion allowed only.
 */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const sparks = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia(`${MQ.finePointer} and ${MQ.motion}`);
    if (!mq.matches || !ring.current || !sparks.current) return;
    const el = ring.current;
    const layer = sparks.current;
    document.documentElement.classList.add('has-cursor');

    const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3' });
    let lastX = 0;
    let lastY = 0;
    let lastSpark = 0;

    const spark = (x: number, y: number) => {
      const s = document.createElement('span');
      s.className = 'cursor-spark';
      s.style.left = `${x}px`;
      s.style.top = `${y}px`;
      s.style.background = COLORS[(Math.random() * COLORS.length) | 0];
      s.style.setProperty('--dx', `${(Math.random() - 0.5) * 40}px`);
      layer.appendChild(s);
      s.addEventListener('animationend', () => s.remove(), { once: true });
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      el.classList.add('is-on');
      xTo(e.clientX);
      yTo(e.clientY);
      const speed = Math.hypot(e.clientX - lastX, e.clientY - lastY);
      const now = performance.now();
      if (speed > 26 && now - lastSpark > 45 && layer.childElementCount < 14) {
        spark(e.clientX, e.clientY);
        lastSpark = now;
      }
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onOver = (e: PointerEvent) => {
      const t = e.target as Element | null;
      el.classList.toggle('is-hover', !!t?.closest?.(INTERACTIVE));
    };
    const onDown = () => el.classList.add('is-down');
    const onUp = () => el.classList.remove('is-down');
    const onLeave = () => el.classList.remove('is-on');

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      document.documentElement.classList.remove('has-cursor');
    };
  }, []);

  return (
    <>
      <div className="cursor-ring" ref={ring} aria-hidden="true" />
      <div className="cursor-sparks" ref={sparks} aria-hidden="true" />
    </>
  );
}
