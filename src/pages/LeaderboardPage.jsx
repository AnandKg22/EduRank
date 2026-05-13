import { useState } from 'react';
import { LeaderboardTable } from '../features/leaderboard/components/LeaderboardTable';
import { DepartmentFilter } from '../features/leaderboard/components/DepartmentFilter';

/**
 * Leaderboard Master Shell Module
 * Coordinates filter controls with real-time ranking stream providers.
 */
export const LeaderboardPage = () => {
  const [department, setDepartment] = useState(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">🏆 Leaderboard</h1>
          <p className="text-sm text-text-secondary mt-1">
            Real-time multi-tenant rankings
          </p>
        </div>
        <DepartmentFilter value={department} onChange={setDepartment} />
      </div>

      {/* Table */}
      <LeaderboardTable department={department} />
    </div>
  );
};

export default LeaderboardPage;
