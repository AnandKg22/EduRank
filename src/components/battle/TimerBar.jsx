import { motion } from 'framer-motion';
import useGameStore from '../../stores/useGameStore';
import { MATCH_CONFIG } from '../../lib/constants';

/**
 * TimerBar — Animated countdown bar for the current question.
 */
export default function TimerBar() {
  const timeRemaining = useGameStore((s) => s.timeRemaining);
  const total = MATCH_CONFIG.SECONDS_PER_QUESTION;
  const fraction = timeRemaining / total;

  // Color transitions: green → yellow → red
  const getColor = () => {
    if (fraction > 0.5) return '#22c55e';
    if (fraction > 0.25) return '#f59e0b';
    return '#ef4444';
  };

  const isUrgent = fraction <= 0.25;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-muted">Time</span>
        <motion.span
          animate={isUrgent ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.5, repeat: isUrgent ? Infinity : 0 }}
          className="text-sm font-mono font-bold"
          style={{ color: getColor() }}
        >
          {Math.ceil(timeRemaining)}s
        </motion.span>
      </div>

      <div className="h-2 rounded-full bg-surface-lighter overflow-hidden">
        <motion.div
          className="h-full rounded-full transition-colors duration-500"
          style={{
            width: `${fraction * 100}%`,
            backgroundColor: getColor(),
            boxShadow: isUrgent ? `0 0 10px ${getColor()}` : 'none',
          }}
        />
      </div>
    </div>
  );
}
