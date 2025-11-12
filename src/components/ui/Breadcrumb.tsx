import React from 'react';

import { useLocation, useNavigate } from 'react-router-dom';
import Icon from './AppIcon';

interface BreadcrumbItem {
  label: string;
  path: string;
  isActive?: boolean;
}

interface BreadcrumbProps {
  className?: string;
}

const Breadcrumb = ({ className = '' }: BreadcrumbProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Always start with Dashboard for authenticated routes
    if (location.pathname !== '/login') {
      breadcrumbs.push({
        label: 'Dashboard',
        path: '/dashboard',
        isActive: location.pathname === '/dashboard'
      });
    }

    // Handle specific routes
    if (pathSegments.includes('loans-list')) {
      breadcrumbs.push({
        label: 'Loans',
        path: '/loans-list',
        isActive: location.pathname === '/loans-list'
      });
    }

    if (pathSegments.includes('loan-details')) {
      if (!breadcrumbs.some(b => b.path === '/loans-list')) {
        breadcrumbs.push({
          label: 'Loans',
          path: '/loans-list',
          isActive: false
        });
      }
      
      // Extract loan ID from URL params or use generic label
      const loanId = new URLSearchParams(location.search).get('id') || 'Details';
      breadcrumbs.push({
        label: `Loan ${loanId}`,
        path: location.pathname,
        isActive: true
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't render breadcrumbs for login or simple dashboard view
  if (location.pathname === '/login' || breadcrumbs.length <= 1) {
    return null;
  }

  const handleNavigation = (path: string, isActive: boolean) => {
    if (!isActive) {
      navigate(path);
    }
  };

  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((item, index) => (
          <li key={item.path} className="flex items-center">
            {index > 0 && (
              <Icon 
                name="ChevronRight" 
                size={14} 
                className="mx-2 text-muted-foreground" 
              />
            )}
            
            {item.isActive ? (
              <span className="font-medium text-foreground">
                {item.label}
              </span>
            ) : (
              <button
                onClick={() => handleNavigation(item.path, item.isActive || false)}
                className="text-muted-foreground hover:text-foreground transition-hover"
              >
                {item.label}
              </button>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;

