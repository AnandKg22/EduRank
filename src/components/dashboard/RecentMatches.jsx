import { motion } from 'framer-motion';
import useRealtimeData from '../../hooks/useRealtimeData';
import useAuthStore from '../../stores/useAuthStore';
import { formatRelativeTime } from '../../lib/utils';
import Spinner from '../ui/Spinner';

const resultColors = {
  win: 'text-success',
  loss: 'text-danger',
  draw: 'text-warning',
  forfeit_win: 'text-accent',
};

const resultLabels = {
  win: 'Victory',
  loss: 'Defeat',
  draw: 'Draw',
  forfeit_win: 'Forfeit Win',
};

export default function RecentMatches() {
  const user = useAuthStore((s) => s.user);

  const { data: matches, loading } = useRealtimeData('match_history', {
    filter: user ? { column: 'user_id', value: user.id } : null,
    orderBy: { column: 'played_at', ascending: false },
    limit: 10,
  });

  if (loading) return <Spinner className="py-8" />;

  return (
    <div className="glass rounded-xl p-5">
      <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
        Recent Battles
      </h3>

      {matches.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-text-muted text-sm">No battles yet. Find your first duel!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {matches.map((match, i) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-surface-light/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold ${resultColors[match.result]}`}>
                  {resultLabels[match.result]}
                </span>
                <span className="text-sm text-text-primary">
                  vs {match.opponent_name || 'Unknown'}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm font-mono text-text-secondary">
                  {match.score} - {match.opponent_score}
                </span>
                <span
                  className={`text-xs font-semibold ${
                    match.elo_change >= 0 ? 'text-success' : 'text-danger'
                  }`}
                >
                  {match.elo_change >= 0 ? '+' : ''}
                  {match.elo_change}
                </span>
                <span className="text-[10px] text-text-muted hidden sm:block">
                  {formatRelativeTime(match.played_at)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
