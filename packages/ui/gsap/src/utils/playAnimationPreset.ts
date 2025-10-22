import gsap from 'gsap';

import type { AnimationPreset } from './animationRegistry';

/**
 * Runs the animation preset against elements scoped by their `data-anim` attribute.
 * Returns a cleanup function that will kill the created tweens.
 */
export const playAnimationPreset = (
  root: HTMLElement,
  preset: AnimationPreset,
) => {
  const tweens: gsap.core.Tween[] = [];

  Object.entries(preset).forEach(([key, steps]) => {
    const elements = root.querySelectorAll<HTMLElement>(`[data-anim="${key}"]`);

    if (!elements.length) {
      return;
    }

    const fromVars = steps.from ?? {};
    const toVars = steps.to ?? {};

    gsap.killTweensOf(elements);
    const tween = gsap.fromTo(elements, fromVars, {
      ...toVars,
      overwrite: 'auto',
    });

    tweens.push(tween);
  });

  return () => {
    tweens.forEach((tween) => tween.kill());
  };
};
