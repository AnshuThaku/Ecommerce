import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * <ProtectedRoute roles={['super-admin', 'admin']} />
 * 
 * - Not logged in → /login
 * - Logged in but wrong role → /unauthorized
 * - OK → renders children
 */
export default function ProtectedRoute({ children, roles = [] }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
