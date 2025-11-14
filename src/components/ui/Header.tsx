import React, { useState, useEffect } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';
import Icon from './AppIcon';
import Button from './Button';

interface User {
  name: string;
  email: string;
  role: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  timestamp: Date;
  isRead: boolean;
}

interface HeaderProps {
  user?: User;
  onLogout?: () => void;
  notifications?: Notification[];
  onMarkNotificationAsRead?: (id: string) => void;
  onMarkAllNotificationsAsRead?: () => void;
}

const Header = ({ 
  user, 
  onLogout, 
  notifications = [], 
  onMarkNotificationAsRead,
  onMarkAllNotificationsAsRead 
}: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Mock notifications if not provided
  const [mockNotifications, setMockNotifications] = useState<Notification[]>([]);
  
  useEffect(() => {
    if (notifications.length === 0) {
      const mock: Notification[] = [
        {
          id: "1",
          title: "Document Verification Complete",
          message: "Loan application LN001 documents have been successfully verified and approved.",
          type: "success",
          timestamp: new Date(Date.now() - 300000),
          isRead: false
        },
        {
          id: "2",
          title: "Payment Due Reminder",
          message: "Loan LN002 payment of ₹45,000 is due in 3 days. Please remind the borrower.",
          type: "warning",
          timestamp: new Date(Date.now() - 900000),
          isRead: false
        },
        {
          id: "3",
          title: "New Loan Application",
          message: "A new business loan application for ₹15,00,000 has been submitted by Rajesh Industries.",
          type: "info",
          timestamp: new Date(Date.now() - 1800000),
          isRead: true
        }
      ];
      setMockNotifications(mock);
    }
  }, [notifications.length]);

  const displayNotifications = notifications.length > 0 ? notifications : mockNotifications;
  const unreadCount = displayNotifications.filter(n => !n.isRead).length;

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

  const handleMarkAsRead = (id: string) => {
    if (onMarkNotificationAsRead) {
      onMarkNotificationAsRead(id);
    } else {
      setMockNotifications(prev =>
        prev.map(notification =>
          notification.id === id
            ? { ...notification, isRead: true }
            : notification
        )
      );
    }
  };

  const handleMarkAllAsRead = () => {
    if (onMarkAllNotificationsAsRead) {
      onMarkAllNotificationsAsRead();
    } else {
      setMockNotifications(prev =>
        prev.map(notification => ({ ...notification, isRead: true }))
      );
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return 'CheckCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'error':
        return 'XCircle';
      default:
        return 'Info';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'error':
        return 'text-destructive';
      default:
        return 'text-primary';
    }
  };

  const formatTime = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
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
          <div className="flex items-center space-x-3">
            {/* Notifications Bell Icon */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => {
                    setIsNotificationDropdownOpen(!isNotificationDropdownOpen);
                    setIsUserDropdownOpen(false);
                  }}
                  className="relative p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-hover"
                  aria-label="Notifications"
                >
                  <Icon name="Bell" size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-5 h-5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {isNotificationDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 md:w-96 bg-popover border border-border rounded-lg shadow-xl z-1002 max-h-[500px] flex flex-col">
                    {/* Header */}
                    <div className="p-4 border-b border-border flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          Notifications
                        </h3>
                        {unreadCount > 0 && (
                          <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllAsRead}
                          className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    {/* Notifications List */}
                    <div className="overflow-y-auto max-h-[400px]">
                      {displayNotifications.length === 0 ? (
                        <div className="p-8 text-center">
                          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                            <Icon name="Bell" size={24} className="text-muted-foreground" />
                          </div>
                          <p className="text-sm text-muted-foreground font-medium">No notifications</p>
                          <p className="text-xs text-muted-foreground mt-1">You're all caught up!</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-border">
                          {displayNotifications.map((notification) => (
                            <div
                              key={notification.id}
                              onClick={() => handleMarkAsRead(notification.id)}
                              className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer ${
                                !notification.isRead ? 'bg-primary/5' : ''
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                  notification.type === 'success' ? 'bg-success/10' :
                                  notification.type === 'warning' ? 'bg-warning/10' :
                                  notification.type === 'error' ? 'bg-destructive/10' :
                                  'bg-primary/10'
                                }`}>
                                  <Icon
                                    name={getNotificationIcon(notification.type)}
                                    size={16}
                                    className={getNotificationColor(notification.type)}
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2 mb-1">
                                    <h4 className="text-sm font-semibold text-foreground">
                                      {notification.title}
                                    </h4>
                                    {!notification.isRead && (
                                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                                    {notification.message}
                                  </p>
                                  <span className="text-xs text-muted-foreground">
                                    {formatTime(notification.timestamp)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

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

      {/* Backdrop for notification dropdown */}
      {isNotificationDropdownOpen && (
        <div
          className="fixed inset-0 z-1001"
          onClick={() => setIsNotificationDropdownOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;

