import { useState } from 'react';
import LeaderboardTable from '../components/leaderboard/LeaderboardTable';
import DepartmentFilter from '../components/leaderboard/DepartmentFilter';

/**
 * LeaderboardPage — Real-time ranked player leaderboard.
 */
export default function LeaderboardPage() {
  const [department, setDepartment] = useState(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">🏆 Leaderboard</h1>
          <p className="text-sm text-text-secondary mt-1">
            Real-time global rankings
          </p>
        </div>
        <DepartmentFilter value={department} onChange={setDepartment} />
      </div>

      {/* Table */}
      <LeaderboardTable department={department} />
    </div>
  );
}
