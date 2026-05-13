import { useMemo } from 'react';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useRealtimeData } from '../../../hooks/useRealtimeData';
import { useAuthStore } from '../../../stores/useAuthStore';
import Spinner from '../../../components/ui/Spinner';

/**
 * EloChart — Area chart showing ELO rating progression over recent matches.
 * Aligned with Brand tokens (#6D28D9 Electric Violet).
 */
export const EloChart = () => {
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);

  const { data: history, isLoading } = useRealtimeData('match_history', {
    filter: user ? { column: 'user_id', value: user.id } : null,
    orderBy: { column: 'played_at', ascending: true },
    limit: 30,
  });

  const chartData = useMemo(() => {
    if (!history.length || !profile) return [];

    let elo = profile.elo_rating;
    const reversed = [...history].reverse();
    const eloPoints = reversed.map((m) => {
      const point = elo;
      elo -= m.elo_change;
      return point;
    });

    return history.map((m, i) => ({
      match: i + 1,
      elo: eloPoints[history.length - 1 - i],
      result: m.result,
    }));
  }, [history, profile]);

  if (isLoading) return <Spinner className="py-8" />;

  if (chartData.length < 2) {
    return (
      <div className="glass rounded-xl p-5">
        <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
          ELO Progression
        </h3>
        <div className="text-center py-8">
          <p className="text-text-muted text-sm">Play more matches to view your dynamic rating curve!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-5">
      <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
        ELO Progression
      </h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="eloGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6d28d9" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6d28d9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="match"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              domain={['auto', 'auto']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0b0b0f',
                border: '1px solid rgba(109, 40, 217, 0.2)',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#f1f5f9',
              }}
            />
            <Area
              type="monotone"
              dataKey="elo"
              stroke="#6d28d9"
              fill="url(#eloGradient)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#6d28d9' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EloChart;
