import { TIERS, ELO_CONFIG, MATCH_CONFIG, BOT_NAMES } from './constants';

/* ═══════════════════════════════════════════════════════════════
   ELO Calculation
   ═══════════════════════════════════════════════════════════════ */

/**
 * Calculate new ELO ratings for both players after a match.
 * @param {number} ratingA - Player A's current ELO
 * @param {number} ratingB - Player B's current ELO
 * @param {number} scoreA - 1 for win, 0.5 for draw, 0 for loss
 * @returns {{ newRatingA: number, newRatingB: number, deltaA: number, deltaB: number }}
 */
export function calculateElo(ratingA, ratingB, scoreA) {
  const K = ELO_CONFIG.K_FACTOR;
  const expectedA = 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
  const expectedB = 1 - expectedA;
  const scoreB = 1 - scoreA;

  const deltaA = Math.round(K * (scoreA - expectedA));
  const deltaB = Math.round(K * (scoreB - expectedB));

  return {
    newRatingA: Math.max(0, ratingA + deltaA),
    newRatingB: Math.max(0, ratingB + deltaB),
    deltaA,
    deltaB,
  };
}

/* ═══════════════════════════════════════════════════════════════
   Tier Utilities
   ═══════════════════════════════════════════════════════════════ */

/**
 * Get tier info from an ELO rating.
 */
export function getTierFromRating(elo) {
  return TIERS.find((t) => elo >= t.min && elo <= t.max) || TIERS[0];
}

/**
 * Get the tier name for a given ELO.
 */
export function getTierName(elo) {
  return getTierFromRating(elo).name;
}

/* ═══════════════════════════════════════════════════════════════
   Score Utilities
   ═══════════════════════════════════════════════════════════════ */

/**
 * Calculate speed bonus points based on remaining time.
 * @param {number} timeRemaining - Seconds left when the answer was submitted.
 * @returns {number} Bonus points (0 if answered after the threshold).
 */
export function calculateSpeedBonus(timeRemaining) {
  if (timeRemaining >= MATCH_CONFIG.SPEED_BONUS_THRESHOLD) {
    const fraction =
      (timeRemaining - MATCH_CONFIG.SPEED_BONUS_THRESHOLD) /
      (MATCH_CONFIG.SECONDS_PER_QUESTION - MATCH_CONFIG.SPEED_BONUS_THRESHOLD);
    return Math.round(MATCH_CONFIG.SPEED_BONUS_MAX * fraction);
  }
  return 0;
}

/**
 * Calculate total points for a correct answer.
 */
export function calculateAnswerPoints(timeRemaining, isCorrect) {
  if (!isCorrect) return 0;
  return MATCH_CONFIG.BASE_POINTS + calculateSpeedBonus(timeRemaining);
}

/* ═══════════════════════════════════════════════════════════════
   Formatting Utilities
   ═══════════════════════════════════════════════════════════════ */

/**
 * Format seconds into MM:SS string.
 */
export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

/**
 * Format a date relative to now (e.g., "2h ago", "3d ago").
 */
export function formatRelativeTime(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

/**
 * Get a random bot from the list.
 */
export function getRandomBot() {
  return BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)];
}

/**
 * Generate a UUID v4.
 */
export function generateId() {
  return crypto.randomUUID();
}

/**
 * Win rate as a percentage string.
 */
export function getWinRate(wins, total) {
  if (total === 0) return '0%';
  return `${Math.round((wins / total) * 100)}%`;
}
