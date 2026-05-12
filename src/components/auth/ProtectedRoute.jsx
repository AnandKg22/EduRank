import { Navigate } from 'react-router-dom';
import useAuthStore from '../../stores/useAuthStore';
import Spinner from '../ui/Spinner';

/**
 * ProtectedRoute — Redirects to /login if not authenticated.
 */
export default function ProtectedRoute({ children }) {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-surface">
        <div className="text-center space-y-4">
          <Spinner size="xl" />
          <p className="text-text-secondary text-sm animate-pulse">Loading arena...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
