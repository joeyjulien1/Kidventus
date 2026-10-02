/**
 * Adds a scene's scroll-linked "while you're here" animation to the master Shows timeline.
 * @param at  timeline position where the scene becomes visible
 * @param dur how long the scene stays on stage
 */
export type SceneHold = (tl: gsap.core.Timeline, scene: HTMLElement, at: number, dur: number) => void;

export const PLUM = '#5c2468';
