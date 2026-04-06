import { create } from "zustand";

type HelloStore = {
  count: number;
  addCount: () => void;
  resetCount: () => void;
};

export const useHelloStore = create<HelloStore>((set) => ({
  count: 1,
  addCount: () => set((state) => ({ count: state.count + 1 })),
  resetCount: () => set({ count: 1 }),
}));
