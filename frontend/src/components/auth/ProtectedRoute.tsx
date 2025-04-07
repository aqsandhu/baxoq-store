import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface ProtectedRouteProps {
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requireAdmin = false }) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If route requires admin and user is not admin, redirect to home
  if (requireAdmin && !user?.isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  // If authenticated and has right permissions, render the protected route
  return <Outlet />;
};

export default ProtectedRoute; 