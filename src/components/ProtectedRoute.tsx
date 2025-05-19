import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'nurse' | 'patient')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { currentUser, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user role is allowed
  if (allowedRoles && currentUser && !allowedRoles.includes(currentUser.role as any)) {
    // Redirect based on role
    if (currentUser.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (currentUser.role === 'nurse') {
      return <Navigate to="/nurse/dashboard" replace />;
    } else {
      return <Navigate to="/patient/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;