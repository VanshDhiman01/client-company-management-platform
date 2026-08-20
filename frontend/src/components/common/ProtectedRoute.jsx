import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { UnauthorizedPage } from './UnauthorizedPage';

export const ProtectedRoute = ({ allowedRoles, children }) => {
  const { isLoggedIn, currentUser, isAuthLoading } = useApp();
  const location = useLocation();

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-sans">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-medium text-slate-300">Authenticating session...</span>
        </div>
      </div>
    );
  }

  // 1. Unauthenticated check -> Redirect to /login
  if (!isLoggedIn || !currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Role-Based Access Control (RBAC) check
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    return <UnauthorizedPage requiredRole={allowedRoles.join(', ')} />;
  }

  // 3. User is authenticated and has permitted role
  return <>{children}</>;
};
