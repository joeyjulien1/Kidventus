import { prefersReducedMotion } from './gsap';

/**
 * Tiny dependency-free confetti burst on a shared, click-through canvas.
 * The canvas is only attached while particles are alive.
 */

type Shape = 'rect' | 'circle' | 'star';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  size: number;
  color: string;
  shape: Shape;
  life: number;
  maxLife: number;
  wobble: number;
}

export interface BurstOptions {
  x: number;
  y: number;
  count?: number;
  /** Direction in degrees (0 = right, -90 = up) */
  angle?: number;
  /** Cone width in degrees */
  spread?: number;
  power?: number;
  gravity?: number;
  colors?: string[];
  shapes?: Shape[];
  scale?: number;
}

export const BRAND_COLORS = ['#FCD871', '#5DAEDD', '#975397', '#F0388F', '#FF8A2B', '#C8F04B', '#ffffff'];

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let particles: Particle[] = [];
let raf = 0;
let dpr = 1;
let gravityScale = 1;

function resize() {
  if (!canvas) return;
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
}

function ensureCanvas() {
  if (canvas) return;
  canvas = document.createElement('canvas');
  canvas.className = 'confetti-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  Object.assign(canvas.style, {
    position: 'fixed',
    inset: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: '90',
  });
  document.body.appendChild(canvas);
  ctx = canvas.getContext('2d');
  resize();
  window.addEventListener('resize', resize);
}

function teardown() {
  window.removeEventListener('resize', resize);
  canvas?.remove();
  canvas = null;
  ctx = null;
}

function drawStar(c: CanvasRenderingContext2D, r: number) {
  c.beginPath();
  c.moveTo(0, -r);
  c.quadraticCurveTo(0, 0, r, 0);
  c.quadraticCurveTo(0, 0, 0, r);
  c.quadraticCurveTo(0, 0, -r, 0);
  c.quadraticCurveTo(0, 0, 0, -r);
  c.fill();
}

function loop() {
  if (!ctx || !canvas) return;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  particles = particles.filter((p) => p.life < p.maxLife);
  for (const p of particles) {
    p.life++;
    p.vx *= 0.985;
    p.vy = p.vy * 0.985 + 0.22 * gravityScale;
    p.x += p.vx + Math.sin(p.life * 0.1 + p.wobble) * 0.6;
    p.y += p.vy;
    p.rot += p.vr;
    const fade = 1 - Math.max(0, (p.life - p.maxLife * 0.7) / (p.maxLife * 0.3));
    ctx.save();
    ctx.globalAlpha = fade;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    if (p.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, p.size * 0.45, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.shape === 'star') {
      drawStar(ctx, p.size * 0.7);
    } else {
      // flip effect: squash the rect along its rotation
      ctx.scale(1, Math.abs(Math.cos(p.life * 0.18 + p.wobble)) * 0.8 + 0.2);
      ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66);
    }
    ctx.restore();
  }

  if (particles.length) {
    raf = requestAnimationFrame(loop);
  } else {
    raf = 0;
    teardown();
  }
}

export function burst({
  x,
  y,
  count = 80,
  angle = -90,
  spread = 70,
  power = 13,
  gravity = 1,
  colors = BRAND_COLORS,
  shapes = ['rect', 'rect', 'circle', 'star'],
  scale = 1,
}: BurstOptions) {
  if (typeof window === 'undefined' || prefersReducedMotion()) return;
  ensureCanvas();
  gravityScale = gravity;
  const cap = window.innerWidth < 700 ? Math.round(count * 0.6) : count;
  for (let i = 0; i < cap; i++) {
    const a = ((angle + (Math.random() - 0.5) * spread) * Math.PI) / 180;
    const v = power * (0.45 + Math.random() * 0.75);
    particles.push({
      x,
      y,
      vx: Math.cos(a) * v,
      vy: Math.sin(a) * v,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      size: (7 + Math.random() * 7) * scale,
      color: colors[(Math.random() * colors.length) | 0],
      shape: shapes[(Math.random() * shapes.length) | 0],
      life: 0,
      maxLife: 90 + Math.random() * 70,
      wobble: Math.random() * 10,
    });
  }
  if (particles.length > 400) particles.splice(0, particles.length - 400);
  if (!raf) raf = requestAnimationFrame(loop);
}

/** Burst from the center of an element. */
export function burstFrom(el: Element, opts: Partial<BurstOptions> = {}) {
  const r = el.getBoundingClientRect();
  burst({ x: r.left + r.width / 2, y: r.top + r.height / 2, ...opts });
}
