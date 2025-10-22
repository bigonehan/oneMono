import type { TweenVars } from 'gsap';

export type AnimationSteps = {
  from?: TweenVars;
  to?: TweenVars;
};

export type AnimationPreset = Record<string, AnimationSteps>;

export class AnimationRegistry {
  private readonly animations = new Map<string, AnimationPreset>();

  register(componentName: string, preset: AnimationPreset) {
    if (!componentName) {
      throw new Error('AnimationRegistry.register requires a component name');
    }

    this.animations.set(componentName, preset);
  }

  get(componentName: string) {
    return this.animations.get(componentName);
  }

  has(componentName: string) {
    return this.animations.has(componentName);
  }

  clear() {
    this.animations.clear();
  }
}

export const animationRegistry = new AnimationRegistry();
