import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import usePresence from '../../hooks/usePresence';

/**
 * AppShell — Main authenticated layout with sidebar + top nav + content area.
 */
export const AppShell = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Initialize persistent online telemetry metrics tracking
  usePresence();

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      {/* Dynamic Drawer Navigation Panel */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Workspace Frame */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto bg-gradient-radial">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppShell;
