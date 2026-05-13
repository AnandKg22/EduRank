import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../../stores/useAuthStore';
import Spinner from '../../../components/ui/Spinner';

/**
 * Enterprise Route Authorization Guard
 * Enforces ABAC/RBAC permissions mapped in Strategy/11-roles/ACCESS-CONTROL.md.
 */
export const ProtectedRoute = ({ children, requiredRole = null }) => {
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const isLoading = useAuthStore((s) => s.isLoading);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-surface">
        <div className="text-center space-y-4">
          <Spinner size="xl" />
          <p className="text-text-secondary text-sm animate-pulse">Validating credentials...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Enforce explicit RBAC constraints if requested by parent router definition
  if (requiredRole && profile && profile.role !== 'SuperAdmin') {
    const hasRole = Array.isArray(requiredRole) 
      ? requiredRole.includes(profile.role) 
      : profile.role === requiredRole;

    if (!hasRole) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-surface text-center px-4">
          <div className="max-w-md p-8 rounded-2xl border border-danger/30 bg-surface-card space-y-4">
            <h2 className="text-2xl font-display text-danger">Access Denied</h2>
            <p className="text-sm text-text-secondary">
              Your current clearance tier ({profile.role}) does not authorize viewing this domain.
            </p>
            <a 
              href="/" 
              className="inline-block px-6 py-2 rounded-xl bg-primary text-text-primary text-sm font-semibold hover:bg-primary-light transition"
            >
              Return to Safe Harbor
            </a>
          </div>
        </div>
      );
    }
  }

  return children;
};

// Runtime compilation export mapping
export default ProtectedRoute;
