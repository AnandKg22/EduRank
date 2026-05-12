import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import usePresence from '../../hooks/usePresence';

/**
 * AppShell — Main authenticated layout with sidebar + top nav + content area.
 */
export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Initialize presence tracking
  usePresence();

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
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
}
