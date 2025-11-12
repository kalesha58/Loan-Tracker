import React, { useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';
import Icon from './AppIcon';
import Button from './Button';

interface User {
  name: string;
  email: string;
  role: string;
}

interface HeaderProps {
  user?: User;
  onLogout?: () => void;
}

const Header = ({ user, onLogout }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'Home',
      tooltip: 'Portfolio Overview'
    },
    {
      label: 'Loans',
      path: '/loans-list',
      icon: 'FileText',
      tooltip: 'Manage All Loans'
    }
  ];

  const isActivePath = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    setIsUserDropdownOpen(false);
    onLogout?.();
  };

  if (location.pathname === '/login') {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-1000 bg-card border-b border-border">
      <div className="max-w-screen-2xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-3 transition-hover hover:opacity-80"
            >
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <Icon name="DollarSign" size={20} color="white" />
              </div>
              <span className="text-xl font-semibold text-foreground">
                LoanTracker
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-hover ${
                  isActivePath(item.path)
                    ? 'text-primary bg-primary/10' :'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                title={item.tooltip}
              >
                <Icon name={item.icon} size={16} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* User Account & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* User Dropdown */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-hover"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-primary-foreground">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-medium text-foreground">
                      {user.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {user.role}
                    </div>
                  </div>
                  <Icon name="ChevronDown" size={16} />
                </button>

                {/* User Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-md shadow-modal z-1002">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          navigate('/profile');
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-hover"
                      >
                        <Icon name="User" size={16} className="mr-3" />
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          navigate('/settings');
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-hover"
                      >
                        <Icon name="Settings" size={16} className="mr-3" />
                        Settings
                      </button>
                      <div className="border-t border-border my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-hover"
                      >
                        <Icon name="LogOut" size={16} className="mr-3" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-hover"
            >
              <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute left-0 right-0 top-16 bg-card border-b border-border shadow-modal z-1001">
            <nav className="px-6 py-4 space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center w-full space-x-3 px-3 py-3 rounded-md text-sm font-medium transition-hover ${
                    isActivePath(item.path)
                      ? 'text-primary bg-primary/10' :'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={item.icon} size={18} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Backdrop for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-1000 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Backdrop for user dropdown */}
      {isUserDropdownOpen && (
        <div
          className="fixed inset-0 z-1001"
          onClick={() => setIsUserDropdownOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;

