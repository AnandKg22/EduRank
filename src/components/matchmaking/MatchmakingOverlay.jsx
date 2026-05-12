import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useMatchmakingStore from '../../stores/useMatchmakingStore';
import usePresenceStore from '../../stores/usePresenceStore';
import { ACTIVITY_STATUS, MATCH_CONFIG } from '../../lib/constants';
import Button from '../ui/Button';

/**
 * MatchmakingOverlay — Full-screen overlay during opponent search.
 */
export default function MatchmakingOverlay() {
  const isSearching = useMatchmakingStore((s) => s.isSearching);
  const searchTime = useMatchmakingStore((s) => s.searchTime);
  const opponent = useMatchmakingStore((s) => s.opponent);
  const battleId = useMatchmakingStore((s) => s.battleId);
  const leaveQueue = useMatchmakingStore((s) => s.leaveQueue);
  const updateStatus = usePresenceStore((s) => s.updateStatus);
  const navigate = useNavigate();

  // Navigate to battle when match is found
  useEffect(() => {
    if (battleId && opponent) {
      updateStatus(ACTIVITY_STATUS.BATTLING);
      const timer = setTimeout(() => {
        navigate(`/battle/${battleId}`);
      }, 2000); // Show opponent info for 2s
      return () => clearTimeout(timer);
    }
  }, [battleId, opponent, navigate, updateStatus]);

  const handleCancel = () => {
    leaveQueue();
    updateStatus(ACTIVITY_STATUS.IDLE);
  };

  return (
    <AnimatePresence>
      {(isSearching || (battleId && opponent)) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-surface/95 backdrop-blur-lg"
        >
          <div className="text-center space-y-8">
            {/* Searching State */}
            {isSearching && !opponent && (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="space-y-6"
              >
                {/* Radar Animation */}
                <div className="relative w-48 h-48 mx-auto">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{
                        scale: [1, 2.5],
                        opacity: [0.5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.7,
                      }}
                      className="absolute inset-0 rounded-full border-2 border-primary/50"
                    />
                  ))}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl">⚔️</span>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold font-[Orbitron] text-text-primary">
                    Searching for Opponent
                  </h2>
                  <p className="text-text-secondary mt-2">
                    {searchTime}s / {MATCH_CONFIG.BOT_SEARCH_TIMEOUT}s
                  </p>

                  {/* Progress bar */}
                  <div className="w-64 mx-auto mt-4 h-1 rounded-full bg-surface-lighter overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-accent"
                      style={{
                        width: `${(searchTime / MATCH_CONFIG.BOT_SEARCH_TIMEOUT) * 100}%`,
                      }}
                    />
                  </div>

                  {searchTime > 15 && (
                    <p className="text-xs text-warning mt-3 animate-pulse">
                      Bot opponent arriving soon...
                    </p>
                  )}
                </div>

                <Button variant="ghost" onClick={handleCancel}>
                  Cancel Search
                </Button>
              </motion.div>
            )}

            {/* Match Found State */}
            {opponent && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 15 }}
                className="space-y-4"
              >
                <h2 className="text-3xl font-bold font-[Orbitron] text-success text-glow">
                  OPPONENT FOUND!
                </h2>

                <div className="glass rounded-2xl p-6 inline-block">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-danger to-warning flex items-center justify-center text-2xl font-bold">
                      {opponent.isBot
                        ? opponent.avatar_url
                        : opponent.username?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="text-left">
                      <p className="text-xl font-bold text-text-primary">
                        {opponent.username}
                      </p>
                      <p className="text-sm text-text-secondary">{opponent.department}</p>
                      <p className="text-sm font-semibold text-primary">
                        {opponent.elo_rating} ELO • {opponent.tier}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-text-muted animate-pulse">
                  Entering battle arena...
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
