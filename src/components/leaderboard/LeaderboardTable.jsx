import useRealtimeData from '../../hooks/useRealtimeData';
import LeaderboardRow from './LeaderboardRow';
import Spinner from '../ui/Spinner';

/**
 * LeaderboardTable — Ranked player table with real-time updates.
 */
export default function LeaderboardTable({ department = null }) {
  const { data: players, loading } = useRealtimeData('profiles', {
    orderBy: { column: 'elo_rating', ascending: false },
    limit: 50,
  });

  const filtered = department
    ? players.filter((p) => p.department === department)
    : players;

  if (loading) return <Spinner className="py-12" size="lg" />;

  if (filtered.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted">No players found</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-4 space-y-1">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
        <div className="w-8 text-center">#</div>
        <div className="w-10" />
        <div className="flex-1">Player</div>
        <div className="hidden sm:block w-24">Tier</div>
        <div className="hidden md:block w-32">Record</div>
        <div className="w-16 text-right">ELO</div>
      </div>

      {/* Rows */}
      {filtered.map((player, i) => (
        <LeaderboardRow key={player.id} player={player} rank={i + 1} />
      ))}
    </div>
  );
}
