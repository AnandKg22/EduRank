import StatsCards from '../components/dashboard/StatsCards';
import RecentMatches from '../components/dashboard/RecentMatches';
import EloChart from '../components/dashboard/EloChart';
import FindMatchButton from '../components/matchmaking/FindMatchButton';
import MatchmakingOverlay from '../components/matchmaking/MatchmakingOverlay';

/**
 * DashboardPage — Main landing page with stats, quick play, and match history.
 */
export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-sm text-text-secondary mt-1">Your combat overview</p>
      </div>

      {/* Stats */}
      <StatsCards />

      {/* Find Match */}
      <FindMatchButton />

      {/* Charts & History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EloChart />
        <RecentMatches />
      </div>

      {/* Matchmaking Overlay */}
      <MatchmakingOverlay />
    </div>
  );
}
