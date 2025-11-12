import React from 'react';

import Icon from '../../../components/ui/AppIcon';
import { IActivityLog } from '../types';

interface ActivityLogProps {
  activities: IActivityLog[];
}

const ActivityLog = ({ activities }: ActivityLogProps) => {
  const formatDate = (date: Date): string => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    }
  };

  const getActionIcon = (action: string): string => {
    if (action.toLowerCase().includes('login')) return 'LogIn';
    if (action.toLowerCase().includes('logout')) return 'LogOut';
    if (action.toLowerCase().includes('create') || action.toLowerCase().includes('add')) return 'Plus';
    if (action.toLowerCase().includes('update') || action.toLowerCase().includes('edit')) return 'Edit';
    if (action.toLowerCase().includes('delete') || action.toLowerCase().includes('remove')) return 'Trash2';
    if (action.toLowerCase().includes('approve')) return 'CheckCircle';
    if (action.toLowerCase().includes('reject')) return 'XCircle';
    if (action.toLowerCase().includes('view') || action.toLowerCase().includes('access')) return 'Eye';
    return 'Activity';
  };

  const getActionColor = (action: string): string => {
    if (action.toLowerCase().includes('login')) return 'text-success';
    if (action.toLowerCase().includes('logout')) return 'text-muted-foreground';
    if (action.toLowerCase().includes('create') || action.toLowerCase().includes('add')) return 'text-primary';
    if (action.toLowerCase().includes('update') || action.toLowerCase().includes('edit')) return 'text-warning';
    if (action.toLowerCase().includes('delete') || action.toLowerCase().includes('remove')) return 'text-destructive';
    if (action.toLowerCase().includes('approve')) return 'text-success';
    if (action.toLowerCase().includes('reject')) return 'text-destructive';
    return 'text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <Icon name="Activity" size={20} className="text-primary" />
        <h2 className="text-lg sm:text-xl font-semibold text-foreground">
          Activity Log
        </h2>
      </div>

      <div className="space-y-3">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Activity" size={48} className="mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No activity recorded</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 ${getActionColor(activity.action)}`}>
                <Icon name={getActionIcon(activity.action)} size={18} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 mb-1">
                  <h3 className="text-sm sm:text-base font-medium text-foreground">
                    {activity.action}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(activity.timestamp)}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                  {activity.description}
                </p>
                {(activity.ipAddress || activity.location) && (
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    {activity.ipAddress && (
                      <span className="flex items-center gap-1">
                        <Icon name="Globe" size={12} />
                        {activity.ipAddress}
                      </span>
                    )}
                    {activity.location && (
                      <span className="flex items-center gap-1">
                        <Icon name="MapPin" size={12} />
                        {activity.location}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityLog;

