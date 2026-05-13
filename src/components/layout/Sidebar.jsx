import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { OnlineSidebar } from '../../features/presence/components/OnlineSidebar';

const navItems = [
  { to: '/', label: 'Dashboard', icon: '🏠' },
  { to: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
  { to: '/profile', label: 'Profile', icon: '👤' },
];

/**
 * Sidebar — Navigation sidebar with route links and online users panel.
 */
export const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Core Container */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 glass-strong border-r border-surface-lighter/50
          flex flex-col transition-transform duration-300
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Mobile Header Branding */}
        <div className="h-16 flex items-center px-6 border-b border-surface-lighter/30 lg:hidden">
          <span className="text-xl font-bold font-display text-primary">
            ⚡ EduRank
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? 'bg-primary/15 text-primary-light glow-primary border border-primary/20'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-light'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Online Presence Scope Panel */}
        <div className="border-t border-surface-lighter/30 p-3">
          <OnlineSidebar />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
