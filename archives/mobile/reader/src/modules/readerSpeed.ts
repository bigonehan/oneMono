const MIN_SPEED = 20;
const MAX_SPEED = 120;
const MIN_DELAY_MS = 20;
const MAX_DELAY_MS = 120;

export const getReaderDelayMs = (speedValue: number): number => {
  const clampedSpeed = Math.min(MAX_SPEED, Math.max(MIN_SPEED, speedValue));
  return MAX_DELAY_MS - (clampedSpeed - MIN_SPEED);
};
