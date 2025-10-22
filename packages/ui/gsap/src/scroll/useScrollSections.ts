'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

import '../presets';

import { animationRegistry } from '../utils/animationRegistry';
import { playAnimationPreset } from '../utils/playAnimationPreset';

export type ScrollDirection = 1 | -1;

export type ScrollSectionEnterPayload = {
  index: number;
  element: HTMLElement;
  animationKey?: string;
  direction: ScrollDirection;
};

export type UseScrollSectionsOptions = {
  /** CSS selector used to pick sections inside the container. Defaults to `section`. */
  sectionSelector?: string;
  /** The dataset key that stores the animation key. Defaults to `scrollAnim` → `data-scroll-anim`. */
  animationDatasetKey?: string;
  /** Animation key to fall back to when the section does not define one. */
  defaultAnimation?: string;
  /** Duration of the snap transition as ScrollTrigger settles into the next section. */
  snapDuration?: number;
  /** Callback invoked every time a section becomes active. */
  onSectionEnter?: (payload: ScrollSectionEnterPayload) => void;
};

let scrollTriggerRegistered = false;

const ensureScrollTrigger = () => {
  if (scrollTriggerRegistered) {
    return;
  }

  if (typeof window === 'undefined') {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  scrollTriggerRegistered = true;
};

const datasetValue = (element: HTMLElement, datasetKey: string) => {
  const normalized = datasetKey.replace(/-([a-z])/g, (_, char: string) => char.toUpperCase());
  return element.dataset[normalized as keyof DOMStringMap];
};

export const useScrollSections = (options: UseScrollSectionsOptions = {}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureScrollTrigger();

    if (typeof window === 'undefined') {
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    const sectionSelector = options.sectionSelector ?? 'section';
    const animationDatasetKey = options.animationDatasetKey ?? 'scrollAnim';

    const sections = Array.from(
      container.querySelectorAll<HTMLElement>(sectionSelector),
    );

    if (!sections.length) {
      return;
    }

    const animationCleanups = new Map<HTMLElement, () => void>();

    const handleEnter = (section: HTMLElement, index: number, direction: ScrollDirection) => {
      const animationKey =
        datasetValue(section, animationDatasetKey) ?? options.defaultAnimation;

      if (animationKey) {
        const preset = animationRegistry.get(animationKey);
        if (preset) {
          animationCleanups.get(section)?.();
          const cleanup = playAnimationPreset(section, preset);
          animationCleanups.set(section, cleanup);
        }
      }

      options.onSectionEnter?.({ index, direction, element: section, animationKey });
    };

    const triggers: ScrollTrigger[] = [];

    sections.forEach((section, index) => {
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => handleEnter(section, index, 1),
        onEnterBack: () => handleEnter(section, index, -1),
      });

      triggers.push(trigger);
    });

    const snapPoints = sections.length > 1 ? 1 / (sections.length - 1) : 0;

    const snappingTrigger = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: () => `+=${Math.max(container.scrollHeight - window.innerHeight, 0)}`,
      snap: {
        snapTo: (value: number) =>
          snapPoints === 0 ? 0 : Math.round(value / snapPoints) * snapPoints,
        duration: options.snapDuration ?? 0.6,
        ease: 'power1.inOut',
      },
    });

    ScrollTrigger.refresh();

    return () => {
      snappingTrigger.kill();
      triggers.forEach((trigger) => trigger.kill());
      animationCleanups.forEach((cleanup) => cleanup());
      animationCleanups.clear();
    };
  }, [
    options.animationDatasetKey,
    options.defaultAnimation,
    options.onSectionEnter,
    options.sectionSelector,
    options.snapDuration,
  ]);

  return { containerRef };
};
