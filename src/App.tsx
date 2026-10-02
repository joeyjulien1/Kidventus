import { useEffect } from 'react';
import { ScrollTrigger } from './lib/gsap';
import { Nav } from './components/Nav/Nav';
import { Hero } from './components/Hero/Hero';
import { About } from './components/About/About';
import { Shows } from './components/Shows/Shows';
import { Chapters } from './components/Chapters/Chapters';
import { Gallery } from './components/Gallery/Gallery';
import { Booking } from './components/Booking/Booking';
import { Contact } from './components/Contact/Contact';
import { Footer } from './components/Footer/Footer';
import { MobileCTA } from './components/MobileCTA/MobileCTA';
import { Cursor } from './components/Cursor/Cursor';

export default function App() {
  // Layout shifts once the web fonts and images arrive — re-measure every scroll animation.
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
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
        <Chapters>
          <Gallery />
          <Booking />
          <Contact />
        </Chapters>
      </main>
      <Footer />
      <MobileCTA />
      <Cursor />
    </>
  );
}
