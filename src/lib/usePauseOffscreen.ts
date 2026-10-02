import { useEffect, type RefObject } from 'react';

/**
 * Adds `.is-offscreen` to an element while it is outside the viewport,
 * pausing its decorative CSS loops (see base.css).
 */
export function usePauseOffscreen(ref: RefObject<HTMLElement | null>, rootMargin = '120px') {
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      ([entry]) => el.classList.toggle('is-offscreen', !entry.isIntersecting),
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);
}
