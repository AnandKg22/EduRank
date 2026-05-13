import { motion } from 'framer-motion';

/**
 * AI Opponent Introduction Screen
 * Visualizes simulated serverless peer matches with proportional telemetry indicators.
 */
export const BotFallback = ({ bot }) => {
  if (!bot) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-4"
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="text-6xl"
      >
        {bot.avatar_url || '🤖'}
      </motion.div>

      <div>
        <p className="text-sm text-text-muted">AI Opponent</p>
        <h3 className="text-xl font-bold font-display text-accent text-glow-accent">
          {bot.username}
        </h3>
        <p className="text-sm text-text-secondary mt-1">
          {bot.elo_rating} ELO • {bot.department}
        </p>
      </div>

      <div className="glass rounded-lg px-4 py-2 inline-block">
        <p className="text-xs text-text-muted">
          ⚠️ Local segment sandbox pairing — Dynamic scaling adjustments applied.
        </p>
      </div>
    </motion.div>
  );
};

export default BotFallback;
