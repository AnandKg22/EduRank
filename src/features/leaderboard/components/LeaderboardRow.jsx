import { motion } from 'framer-motion';
import { getTierFromRating } from '../../../lib/utils';

const podiumColors = ['text-warning', 'text-text-secondary', 'text-tier-resistor'];
const podiumBg = [
  'bg-warning/10 border-warning/30',
  'bg-surface-lighter/50 border-surface-lighter',
  'bg-tier-resistor/10 border-tier-resistor/30',
];

/**
 * LeaderboardRow — Telemetry grid module visualizer.
 */
export const LeaderboardRow = ({ player, rank }) => {
  const tier = getTierFromRating(player.elo_rating);
  const isPodium = rank <= 3;
  const winRate =
    player.total_matches > 0
      ? Math.round((player.wins / player.total_matches) * 100)
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.03 }}
      className={`
        flex items-center gap-4 px-4 py-3 rounded-xl transition-all
        ${isPodium ? `border ${podiumBg[rank - 1]}` : 'hover:bg-surface-light/50'}
      `}
    >
      {/* Rank */}
      <div className={`w-8 text-center font-bold text-lg ${isPodium ? podiumColors[rank - 1] : 'text-text-muted'}`}>
        {rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : `#${rank}`}
      </div>

      {/* Avatar */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
        style={{
          background: `linear-gradient(135deg, ${tier.color}40, ${tier.color}20)`,
          border: `2px solid ${tier.color}50`,
        }}
      >
        {player.username?.charAt(0)?.toUpperCase()}
      </div>

      {/* Player Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text-primary truncate">{player.username}</p>
        <p className="text-xs text-text-muted">{player.department}</p>
      </div>

      {/* Tier */}
      <div className="hidden sm:flex items-center gap-1.5">
        <span className="text-sm">{tier.icon}</span>
        <span className="text-xs font-medium" style={{ color: tier.color }}>
          {tier.name}
        </span>
      </div>

      {/* Stats */}
      <div className="hidden md:flex items-center gap-4 text-xs text-text-secondary">
        <span>{player.wins}W / {player.losses}L</span>
        <span>{winRate}%</span>
      </div>

      {/* ELO */}
      <div className="text-right">
        <p className="text-sm font-bold font-display" style={{ color: tier.color }}>
          {player.elo_rating}
        </p>
        <p className="text-[10px] text-text-muted">ELO</p>
      </div>
    </motion.div>
  );
};

export default LeaderboardRow;
