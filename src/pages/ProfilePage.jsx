import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/useAuthStore';
import { getTierFromRating } from '../lib/utils';
import { RankBadge } from '../features/dashboard/components/RankBadge';
import { RecentMatches } from '../features/dashboard/components/RecentMatches';
import { EloChart } from '../features/dashboard/components/EloChart';
import { AnimatedNumber } from '../components/ui/AnimatedNumber';

/**
 * ProfilePage — User profile with full stats and match history.
 */
export const ProfilePage = () => {
  const profile = useAuthStore((s) => s.profile);

  if (!profile) return null;

  const tier = getTierFromRating(profile.elo_rating);
  const winRate = profile.total_matches > 0
    ? Math.round((profile.wins / profile.total_matches) * 100)
    : 0;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Profile Header Block */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8 text-center"
      >
        {/* Glowing Badge Avatar */}
        <div
          className="w-24 h-24 rounded-full mx-auto flex items-center justify-center text-4xl font-bold mb-4"
          style={{
            background: `linear-gradient(135deg, ${tier.color}60, ${tier.color}20)`,
            border: `3px solid ${tier.color}`,
            boxShadow: `0 0 30px ${tier.color}30`,
          }}
        >
          {profile.username?.charAt(0)?.toUpperCase()}
        </div>

        <h1 className="text-2xl font-bold font-display text-text-primary">
          {profile.username}
        </h1>
        <p className="text-sm text-text-secondary mt-1">{profile.department}</p>

        {/* Dynamic Telemetry Stats Matrix */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          {[
            { label: 'ELO', value: profile.elo_rating, color: tier.color },
            { label: 'Wins', value: profile.wins, color: '#22c55e' },
            { label: 'Losses', value: profile.losses, color: '#ef4444' },
            { label: 'Win Rate', value: winRate, suffix: '%', color: '#6366f1' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-xs text-text-muted">{stat.label}</p>
              <p className="text-xl font-bold font-display" style={{ color: stat.color }}>
                <AnimatedNumber value={stat.value} suffix={stat.suffix || ''} />
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Embedded Telemetry Tracking Widgets */}
      <RankBadge elo={profile.elo_rating} />

      <EloChart />

      <RecentMatches />
    </div>
  );
};

export default ProfilePage;
