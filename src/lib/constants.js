/* ═══════════════════════════════════════════════════════════════
   EduRank Constants
   ═══════════════════════════════════════════════════════════════ */

// ── Tier Definitions ──
export const TIERS = [
  { name: 'Bronze',   min: 0,    max: 1099, color: '#cd7f32', label: 'Bronze',   icon: '🥉' },
  { name: 'Silver',   min: 1100, max: 1299, color: '#c0c0c0', label: 'Silver',   icon: '🥈' },
  { name: 'Gold',     min: 1300, max: 1499, color: '#ffd700', label: 'Gold',     icon: '🥇' },
  { name: 'Platinum', min: 1500, max: 1799, color: '#e5e4e2', label: 'Platinum', icon: '💎' },
  { name: 'Diamond',  min: 1800, max: 9999, color: '#00ffff', label: 'Diamond',  icon: '👑' },
];

// ── Match Config ──
export const MATCH_CONFIG = {
  QUESTIONS_PER_MATCH: 15,
  SECONDS_PER_QUESTION: 20,
  SPEED_BONUS_THRESHOLD: 10, // seconds remaining to get bonus
  BASE_POINTS: 100,
  SPEED_BONUS_MAX: 50,
  BOT_SEARCH_TIMEOUT: 30, // seconds before bot fallback
  FORFEIT_GRACE_PERIOD: 5, // seconds before forfeit on disconnect
  FORCED_PROGRESSION_TIMEOUT: 25, // seconds before forced next question
};

// ── ELO Config ──
export const ELO_CONFIG = {
  K_FACTOR: 32,
  DEFAULT_RATING: 1000,
};

// ── Bot Names ──
export const BOT_NAMES = [
  { name: 'CircuitBot',    avatar: '🤖' },
  { name: 'ByteGhost',     avatar: '👻' },
  { name: 'VoltAgent',     avatar: '⚡' },
  { name: 'NeuroNode',     avatar: '🧠' },
  { name: 'QuantumPulse',  avatar: '💫' },
  { name: 'SiliconSage',   avatar: '🔮' },
  { name: 'LogicLord',     avatar: '♟️' },
  { name: 'OhmOracle',     avatar: '🌀' },
];

// ── Departments ──
export const DEPARTMENTS = [
  'Computer Science',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electronics & Communication',
  'Information Technology',
  'Chemical Engineering',
  'General Science',
];

// ── Activity Statuses ──
export const ACTIVITY_STATUS = {
  IDLE: 'idle',
  SEARCHING: 'searching',
  BATTLING: 'battling',
};

// ── Battle Statuses ──
export const BATTLE_STATUS = {
  PREPARING: 'preparing',
  ACTIVE: 'active',
  FINISHED: 'finished',
  FORFEITED: 'forfeited',
};
