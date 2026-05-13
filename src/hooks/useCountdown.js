import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../stores/useGameStore';
import { MATCH_CONFIG } from '../lib/constants';

/**
 * High-Performance RAF Countdown Hook
 * Dispatches framerate-independent subsecond updates to leaf components.
 */
export const useCountdown = (isActive, onTimeUp) => {
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);
  const setTimeRemaining = useGameStore((s) => s.setTimeRemaining);

  const start = useCallback(() => {
    startTimeRef.current = Date.now();

    const tick = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const remaining = Math.max(0, MATCH_CONFIG.SECONDS_PER_QUESTION - elapsed);

      setTimeRemaining(remaining);

      if (remaining <= 0) {
        if (onTimeUp) onTimeUp();
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [onTimeUp, setTimeRemaining]);

  const stop = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    stop();
    setTimeRemaining(MATCH_CONFIG.SECONDS_PER_QUESTION);
    if (isActive) {
      start();
    }
  }, [isActive, start, stop, setTimeRemaining]);

  useEffect(() => {
    if (isActive) {
      start();
    } else {
      stop();
    }

    return () => stop();
  }, [isActive, start, stop]);

  return { reset, stop };
};

export default useCountdown;
