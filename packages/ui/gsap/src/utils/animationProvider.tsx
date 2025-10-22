import { createContext, useContext, useMemo } from 'react';
import type { PropsWithChildren } from 'react';

import { AnimationRegistry, animationRegistry } from './animationRegistry';

export type AnimationContextValue = {
  registry: AnimationRegistry;
  enabled: boolean;
};

const AnimationContext = createContext<AnimationContextValue>({
  registry: animationRegistry,
  enabled: false,
});

export type AnimationProviderProps = PropsWithChildren<{
  enabled?: boolean;
  registry?: AnimationRegistry;
}>;

export const AnimationProvider = ({
  children,
  enabled = true,
  registry = animationRegistry,
}: AnimationProviderProps) => {
  const value = useMemo(() => ({ registry, enabled }), [registry, enabled]);

  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimationContext = () => useContext(AnimationContext);
