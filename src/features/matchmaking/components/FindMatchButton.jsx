import { motion } from 'framer-motion';
import { useAuthStore } from '../../../stores/useAuthStore';
import { useMatchmakingStore } from '../../../stores/useMatchmakingStore';
import { usePresenceStore } from '../../../stores/usePresenceStore';
import { ACTIVITY_STATUS } from '../../../lib/constants';

/**
 * Combat Initiation Trigger CTA
 * Invokes serverless handshake queues adhering to RBAC authentication parameters.
 */
export const FindMatchButton = () => {
  const profile = useAuthStore((s) => s.profile);
  const isSearching = useMatchmakingStore((s) => s.isSearching);
  const joinQueue = useMatchmakingStore((s) => s.joinQueue);
  const updateStatus = usePresenceStore((s) => s.updateStatus);

  const handleClick = () => {
    if (!profile || isSearching) return;
    updateStatus(ACTIVITY_STATUS.SEARCHING);
    // Explicitly inject user's associated organization scope mapping
    joinQueue(profile.id, profile.department, profile.elo_rating, profile.organization_id);
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={isSearching || !profile}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="relative w-full py-6 rounded-2xl font-display font-bold text-xl
                 bg-gradient-to-r from-primary via-secondary to-accent
                 text-white shadow-2xl shadow-primary/30
                 hover:shadow-primary/50 transition-shadow duration-300
                 disabled:opacity-50 disabled:cursor-not-allowed
                 overflow-hidden cursor-pointer"
    >
      {/* Shimmer overlay */}
      <div className="absolute inset-0 animate-shimmer opacity-30" />

      {/* Pulsing ring */}
      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.2, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 rounded-2xl border-2 border-white/20"
      />

      <span className="relative z-10 flex items-center justify-center gap-3">
        <span className="text-2xl">⚔️</span>
        Find Duel
        <span className="text-2xl">⚔️</span>
      </span>
    </motion.button>
  );
};

export default FindMatchButton;
