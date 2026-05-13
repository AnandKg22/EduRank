import { useAuthStore } from '../../stores/useAuthStore';
import { getTierFromRating } from '../../lib/utils';
import { OnlineCount } from '../../features/presence/components/OnlineCount';

/**
 * Navbar — Top navigation bar with user info, ELO, and online count.
 */
export const Navbar = ({ onMenuToggle }) => {
  const profile = useAuthStore((s) => s.profile);
  const signOut = useAuthStore((s) => s.signOut);
  const tier = profile ? getTierFromRating(profile.elo_rating) : null;

  return (
    <header className="glass-strong border-b border-surface-lighter/50 px-4 sm:px-6 h-16 flex items-center justify-between shrink-0 z-20">
      {/* Left: Menu + Branding */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-surface-light transition-colors text-text-secondary"
          id="menu-toggle"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          <h1 className="text-lg font-bold font-display text-primary">
            EduRank
          </h1>
        </div>
      </div>

      {/* Right: User Info + Online Count */}
      <div className="flex items-center gap-4">
        <OnlineCount />

        {profile && (
          <div className="flex items-center gap-3">
            {/* ELO Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-light/50">
              <span className="text-sm">{tier?.icon}</span>
              <span className="text-sm font-semibold" style={{ color: tier?.color }}>
                {profile.elo_rating}
              </span>
            </div>

            {/* User */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-bold">
                {profile.username?.charAt(0)?.toUpperCase()}
              </div>
              <span className="hidden md:block text-sm font-medium text-text-primary">
                {profile.username}
              </span>
            </div>

            {/* Sign out */}
            <button
              onClick={signOut}
              className="p-2 rounded-lg hover:bg-surface-light transition-colors text-text-muted hover:text-danger"
              title="Sign Out"
              id="sign-out-btn"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
