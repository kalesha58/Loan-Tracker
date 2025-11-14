import React from 'react';
import { Navigate } from 'react-router-dom';

import { isAuthenticated } from '../../utils/auth';

interface IPublicRouteProps {
  children: React.ReactElement;
}

const PublicRoute: React.FC<IPublicRouteProps> = ({ children }) => {
  const authenticated = isAuthenticated();

  // If user is already authenticated, redirect to dashboard
  if (authenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;

