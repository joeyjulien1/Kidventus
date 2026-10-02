/**
 * Adds a scene's scroll-linked "while you're here" animation to the master Shows timeline.
 * @param at  timeline position where the scene becomes visible
 * @param dur how long the scene stays on stage
 */
export type SceneHold = (tl: gsap.core.Timeline, scene: HTMLElement, at: number, dur: number) => void;

export const PLUM = '#5c2468';

/**
 * Places a layer by its box in the 600 × 600 artwork space (the artwork is always square).
 *
 * Every scene is drawn as a stack of layers: big static drawings, plus small separate pieces for
 * anything that moves. Moving whole layers (transform/opacity only) lets the GPU animate them
 * without repainting the artwork, which keeps scrolling smooth on phones.
 */
export const box = (x: number, y: number, w: number, h: number) => ({
  left: `${x / 6}%`,
  top: `${y / 6}%`,
  width: `${w / 6}%`,
  height: `${h / 6}%`,
});

/** Position-only variant (size set in CSS) */
export const at = (x: number, y: number) => ({ left: `${x / 6}%`, top: `${y / 6}%` });
