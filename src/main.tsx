import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tokens.css';
import './styles/base.css';
import App from './App';
import { ScrollTrigger } from './lib/gsap';

// Scroll-driven chapters look broken when the browser restores a mid-page position before the
// animations are measured, so a refresh always starts from the top (links with #section still work).
// ScrollTrigger remembers the browser's setting when it loads and puts it back after its first
// refresh, so the setting goes through its own API.
ScrollTrigger.clearScrollMemory('manual');
if (!location.hash) window.scrollTo(0, 0);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
