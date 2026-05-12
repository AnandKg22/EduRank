import { motion } from 'framer-motion';
import useGameStore from '../../stores/useGameStore';

/**
 * OpponentStatus — Shows whether the opponent has answered the current question.
 */
export default function OpponentStatus() {
  const opponentAnswerSubmitted = useGameStore((s) => s.opponentAnswerSubmitted);
  const opponentName = useGameStore((s) => s.opponentName);

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-text-muted">
        {opponentName || 'Opponent'}:
      </span>
      {opponentAnswerSubmitted ? (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-xs font-semibold text-success flex items-center gap-1"
        >
          ✓ Answered
        </motion.span>
      ) : (
        <span className="text-xs text-text-muted flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
          Thinking...
        </span>
      )}
    </div>
  );
}
