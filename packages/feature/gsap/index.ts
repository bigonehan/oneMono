import { gsap } from "gsap";

export const animate = (element: string) => {
  gsap.to(element, { rotation: 360, duration: 1 });
};
