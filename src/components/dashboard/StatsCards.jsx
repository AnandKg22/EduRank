import { motion } from 'framer-motion';
import Card from '../ui/Card';
import AnimatedNumber from '../ui/AnimatedNumber';
import RankBadge from './RankBadge';
import useAuthStore from '../../stores/useAuthStore';
import { getWinRate } from '../../lib/utils';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function StatsCards() {
  const profile = useAuthStore((s) => s.profile);

  if (!profile) return null;

  const winRate = profile.total_matches > 0
    ? Math.round((profile.wins / profile.total_matches) * 100)
    : 0;

  const stats = [
    {
      label: 'ELO Rating',
      value: profile.elo_rating,
      icon: '⚡',
      gradient: 'from-primary to-secondary',
      glowClass: 'shadow-primary/20',
    },
    {
      label: 'Win Rate',
      value: winRate,
      suffix: '%',
      icon: '🎯',
      gradient: 'from-success to-accent',
      glowClass: 'shadow-success/20',
    },
    {
      label: 'Total Wins',
      value: profile.wins,
      icon: '🏆',
      gradient: 'from-warning to-danger',
      glowClass: 'shadow-warning/20',
    },
    {
      label: 'Matches Played',
      value: profile.total_matches,
      icon: '⚔️',
      gradient: 'from-accent to-primary',
      glowClass: 'shadow-accent/20',
    },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {stats.map((stat) => (
        <motion.div key={stat.label} variants={item}>
          <Card className={`relative overflow-hidden shadow-lg ${stat.glowClass}`} hoverable>
            {/* Gradient accent bar */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient}`} />

            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-text-muted uppercase tracking-wider">
                  {stat.label}
                </p>
                <div className="mt-2 text-2xl font-bold text-text-primary">
                  <AnimatedNumber value={stat.value} suffix={stat.suffix || ''} />
                </div>
              </div>
              <span className="text-2xl">{stat.icon}</span>
            </div>
          </Card>
        </motion.div>
      ))}

      {/* Rank card - full width on small */}
      <motion.div variants={item} className="sm:col-span-2 lg:col-span-4">
        <RankBadge elo={profile.elo_rating} />
      </motion.div>
    </motion.div>
  );
}
