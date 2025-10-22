import { animationRegistry } from '../utils/animationRegistry';
import type { AnimationPreset } from '../utils/animationRegistry';

export const tweenAlpha: AnimationPreset = {
  title: {
    from: { alpha: 0 },
    to: { alpha: 1, duration: 0.8, ease: 'power2.out' },
  },
  description: {
    from: { alpha: 0 },
    to: { alpha: 1, duration: 0.8, ease: 'power2.out', delay: 0.1 },
  },
};

animationRegistry.register('tweenAlpha', tweenAlpha);
