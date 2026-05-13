import { StatsCards } from '../features/dashboard/components/StatsCards';
import { RecentMatches } from '../features/dashboard/components/RecentMatches';
import { EloChart } from '../features/dashboard/components/EloChart';
import FindMatchButton from '../features/matchmaking/components/FindMatchButton';
import MatchmakingOverlay from '../features/matchmaking/components/MatchmakingOverlay';
import { AdminManagementPanel } from '../features/dashboard/components/AdminManagementPanel';

/**
 * Dashboard Landing Module
 * Incorporates isolated telemetry dashboards and combat quick-triggers.
 */
export const DashboardPage = () => {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-sm text-text-secondary mt-1">Your combat overview</p>
      </div>

      {/* Admin Operations Gateway */}
      <AdminManagementPanel />

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
};

export default DashboardPage;
