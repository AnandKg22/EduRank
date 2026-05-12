import { motion } from 'framer-motion';
import useGameStore from '../../stores/useGameStore';
import useAuthStore from '../../stores/useAuthStore';
import AnimatedNumber from '../ui/AnimatedNumber';
import { getTierFromRating } from '../../lib/utils';

/**
 * ScoreBoard — Live side-by-side score comparison during battle.
 */
export default function ScoreBoard() {
  const profile = useAuthStore((s) => s.profile);
  const myScore = useGameStore((s) => s.myScore);
  const opponentScore = useGameStore((s) => s.opponentScore);
  const opponentName = useGameStore((s) => s.opponentName);
  const opponentTier = useGameStore((s) => s.opponentTier);

  const myTier = profile ? getTierFromRating(profile.elo_rating) : null;
  const oppTier = getTierFromRating(
    typeof opponentTier === 'string'
      ? 1000 // fallback
      : opponentTier || 1000
  );

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between">
        {/* Player */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-lg font-bold">
            {profile?.username?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">
              {profile?.username || 'You'}
            </p>
            <p className="text-xs text-text-muted">
              {myTier?.icon} {myTier?.name}
            </p>
          </div>
        </div>

        {/* Scores */}
        <div className="flex items-center gap-4">
          <motion.div
            key={myScore}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.3 }}
            className="text-3xl font-bold font-[Orbitron] text-primary"
          >
            <AnimatedNumber value={myScore} />
          </motion.div>

          <span className="text-text-muted text-xl font-light">vs</span>

          <motion.div
            key={opponentScore}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.3 }}
            className="text-3xl font-bold font-[Orbitron] text-danger"
          >
            <AnimatedNumber value={opponentScore} />
          </motion.div>
        </div>

        {/* Opponent */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-text-primary">
              {opponentName || 'Opponent'}
            </p>
            <p className="text-xs text-text-muted">
              {oppTier?.icon} {oppTier?.name}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-danger to-warning flex items-center justify-center text-lg font-bold">
            {opponentName?.charAt(0)?.toUpperCase() || '?'}
          </div>
        </div>
      </div>
    </div>
  );
}
