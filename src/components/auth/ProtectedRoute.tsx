import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { isAuthenticated } from '../../utils/auth';

interface IProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<IProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const authenticated = isAuthenticated();

  if (!authenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;

