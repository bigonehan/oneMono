import { animationRegistry } from '../utils/animationRegistry';
import type { AnimationPreset } from '../utils/animationRegistry';

export const showFromZeroAlpha: AnimationPreset = {
  pane: {
    from: { autoAlpha: 0, y: 32 },
    to: { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power2.out' },
  },
  title: {
    from: { autoAlpha: 0, y: 24 },
    to: { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.1 },
  },
  description: {
    from: { autoAlpha: 0, y: 24 },
    to: { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.2 },
  },
  button: {
    from: { autoAlpha: 0, y: 16 },
    to: { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: 0.3 },
  },
};

animationRegistry.register('showFromZeroAlpha', showFromZeroAlpha);
