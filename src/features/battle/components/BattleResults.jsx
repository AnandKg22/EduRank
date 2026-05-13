import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../../stores/useGameStore';
import { useMatchmakingStore } from '../../../stores/useMatchmakingStore';
import AnimatedNumber from '../../../components/ui/AnimatedNumber';
import Button from '../../../components/ui/Button';

const resultConfig = {
  win: { title: 'VICTORY!', emoji: '🏆', color: 'text-success', glow: 'text-glow' },
  loss: { title: 'DEFEAT', emoji: '💀', color: 'text-danger', glow: '' },
  draw: { title: 'DRAW', emoji: '🤝', color: 'text-warning', glow: '' },
  forfeit_win: { title: 'FORFEIT WIN', emoji: '🚪', color: 'text-accent', glow: 'text-glow-accent' },
};

/**
 * Isolated Peer Match Concluding Screen
 * Presents ELO rating adjustments weightings securely mapped to tenant profile boundaries.
 */
export const BattleResults = () => {
  const result = useGameStore((s) => s.result);
  const myScore = useGameStore((s) => s.myScore);
  const opponentScore = useGameStore((s) => s.opponentScore);
  const eloDelta = useGameStore((s) => s.eloDelta);
  const opponentName = useGameStore((s) => s.opponentName);
  const resetGame = useGameStore((s) => s.reset);
  const resetMatchmaking = useMatchmakingStore((s) => s.reset);
  const navigate = useNavigate();

  if (!result) return null;

  const config = resultConfig[result] || resultConfig.draw;

  const handleDashboard = () => {
    resetGame();
    resetMatchmaking();
    navigate('/');
  };

  const handlePlayAgain = () => {
    resetGame();
    resetMatchmaking();
    navigate('/');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-surface/95 backdrop-blur-lg"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15, delay: 0.2 }}
        className="text-center space-y-6 glass rounded-3xl p-10 max-w-md w-full mx-4"
      >
        {/* Result Emoji */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 1.5, repeat: 2 }}
          className="text-7xl"
        >
          {config.emoji}
        </motion.div>

        {/* Title */}
        <h1 className={`text-4xl font-bold font-display ${config.color} ${config.glow}`}>
          {config.title}
        </h1>

        {/* Final Score */}
        <div className="glass rounded-xl p-4">
          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              <p className="text-xs text-text-muted">You</p>
              <p className="text-2xl font-bold text-primary font-display">
                <AnimatedNumber value={myScore} />
              </p>
            </div>
            <span className="text-2xl text-text-muted">—</span>
            <div className="text-center">
              <p className="text-xs text-text-muted">{opponentName}</p>
              <p className="text-2xl font-bold text-danger font-display">
                <AnimatedNumber value={opponentScore} />
              </p>
            </div>
          </div>
        </div>

        {/* ELO Change */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="space-y-1"
        >
          <p className="text-xs text-text-muted">Rating Change</p>
          <p
            className={`text-3xl font-bold font-display ${
              eloDelta >= 0 ? 'text-success' : 'text-danger'
            }`}
          >
            {eloDelta >= 0 ? '+' : ''}
            <AnimatedNumber value={eloDelta} />
          </p>
        </motion.div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button variant="ghost" onClick={handleDashboard} fullWidth>
            Dashboard
          </Button>
          <Button variant="primary" onClick={handlePlayAgain} fullWidth>
            Play Again
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BattleResults;
