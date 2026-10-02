# Kidventus — website

Scroll-driven brand site for **Kidventus** (kids' entertainment & events, Lebanon — by Carl Mansour).
Built with React + TypeScript + Vite, animated with GSAP ScrollTrigger. All bookings go through
WhatsApp — there is no payment or checkout anywhere on the site.

## Run it

```bash
npm install
npm run dev          # http://localhost:5173
npm run dev:phone    # same, reachable from a phone on the same Wi‑Fi (http://<this-PC-IP>:5173)
npm run build        # production build → dist/
npm run preview      # serve the production build locally
```

## Page flow

Home (hero, zooms into the logo star) → About Us (yellow "inside the star" world) → Our Shows
(sticky stage, one scene per show) → Gallery (video reel) → How to Book (WhatsApp builder) → Contact → Footer.

## Where to change things

| What | File |
| --- | --- |
| Phone numbers, Instagram links, nav labels | `src/config/site.ts` |
| Show names, descriptions, highlights, WhatsApp wording | `src/config/shows.ts` |
| Gallery videos (title, tag, caption, file) | `src/config/gallery.ts` |
| Optional clip/photo per show, hero background video | `src/config/media.ts` |
| WhatsApp message template | `src/lib/whatsapp.ts` |
| Colors & fonts | `src/styles/tokens.css` |

### Videos

Gallery clips live in `public/media/gallery/`. They are cropped to 4:5 (Instagram post size),
640×800, H.264 with AAC audio, and each has a matching `.jpg` poster. To add or swap a clip,
export it the same way and update `REELS` in `src/config/gallery.ts`.
Clips autoplay muted (browser rule) when the reel is on screen and play one after another;
visitors tap **Tap for sound** to hear them, with a gentle fade in/out between clips.

## Before going live

- Set `VITE_SITE_URL` in `.env` to the real domain (e.g. `https://www.example.com`) so social
  previews (WhatsApp/Instagram/Facebook link cards) get an absolute image URL.
- Deploy the `dist/` folder to any static host (Vercel, Netlify, Cloudflare Pages…).

## Accessibility & motion

- Respects `prefers-reduced-motion`: scroll animations, pinning and autoplay are switched off and
  everything is shown as a normal, readable page.
- Keyboard: skip link, focus styles, arrow keys in the video reel, Esc closes the mobile menu.
