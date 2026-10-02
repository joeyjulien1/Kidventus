import { useEffect } from 'react';
import { ScrollTrigger } from './lib/gsap';
import { jumpTo } from './lib/navigation';
import { Nav } from './components/Nav/Nav';
import { Hero } from './components/Hero/Hero';
import { About } from './components/About/About';
import { Shows } from './components/Shows/Shows';
import { Gallery } from './components/Gallery/Gallery';
import { Booking } from './components/Booking/Booking';
import { Footer } from './components/Footer/Footer';
import { MobileCTA } from './components/MobileCTA/MobileCTA';
import { Cursor } from './components/Cursor/Cursor';

export default function App() {
  // Layout shifts once the web fonts and images arrive — re-measure every scroll animation.
  useEffect(() => {
    document.fonts?.ready.then(() => {
      ScrollTrigger.refresh();
      // Shared links like /#gallery land on their section once everything is measured
      const id = decodeURIComponent(location.hash.slice(1));
      if (id && document.getElementById(id)) jumpTo(id);
    });
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Shows />
        <Gallery />
        <Booking />
      </main>
      <Footer />
      <MobileCTA />
      <Cursor />
    </>
  );
}
