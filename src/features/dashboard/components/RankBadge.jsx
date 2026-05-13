import { motion } from 'framer-motion';
import { getTierFromRating } from '../../../lib/utils';
import { TIERS } from '../../../lib/constants';

/**
 * RankBadge — Displays current tier with dynamic continuous vector tracking to next tier.
 */
export const RankBadge = ({ elo }) => {
  const tier = getTierFromRating(elo);
  const tierIndex = TIERS.findIndex((t) => t.name === tier.name);
  const nextTier = TIERS[tierIndex + 1];

  const progress = nextTier
    ? ((elo - tier.min) / (nextTier.min - tier.min)) * 100
    : 100;

  return (
    <div className="glass rounded-xl p-5">
      <div className="flex items-center gap-4">
        {/* Tier Icon */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-4xl"
        >
          {tier.icon}
        </motion.div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-lg font-bold font-display"
              style={{ color: tier.color }}
            >
              {tier.name}
            </span>
            <span className="text-xs text-text-muted px-2 py-0.5 rounded-full bg-surface-light">
              {tier.label}
            </span>
          </div>

          {/* Progress bar */}
          {nextTier && (
            <div className="space-y-1">
              <div className="h-2 rounded-full bg-surface-lighter overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(to right, ${tier.color}, ${nextTier.color})`,
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-text-muted">
                <span>{tier.min} ELO</span>
                <span>{nextTier.min} ELO → {nextTier.name}</span>
              </div>
            </div>
          )}

          {!nextTier && (
            <p className="text-xs text-accent">
              ✨ Maximum rank achieved! You are an Elite Diamond Champion.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RankBadge;
