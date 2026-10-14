import { useEffect, useState } from "react";

// Gentle start and stop, like a car pulling away and braking.
const smoothstep = (t: number) => t * t * (3 - 2 * t);

/**
 * Counts from 0 to 100 over `duration` ms. Change `runKey` to start again.
 */
export function useSimulatedProgress(duration = 4200, runKey = 0) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame: number;
    let start: number | null = null;

    const tick = (now: number) => {
      start ??= now;
      const t = Math.min((now - start) / duration, 1);
      setProgress(smoothstep(t) * 100);
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [duration, runKey]);

  return progress;
}
