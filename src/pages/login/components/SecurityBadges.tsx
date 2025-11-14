import React from 'react';

import Icon from '../../../components/ui/AppIcon';
import { SecurityBadge } from '../types';

const SecurityBadges = () => {
  const securityBadges: SecurityBadge[] = [
    {
      id: '1',
      name: 'SSL Secured',
      icon: 'Shield',
      description: '256-bit SSL encryption'
    },
    {
      id: '2',
      name: 'Bank Grade Security',
      icon: 'Lock',
      description: 'Industry standard protection'
    },
    {
      id: '3',
      name: 'Data Protected',
      icon: 'ShieldCheck',
      description: 'Your information is safe'
    }
  ];

  return (
    <div className="mt-4 pt-4 border-t border-border/50 dark:border-slate-700/50">
      <div className="flex items-center justify-center gap-3">
        {securityBadges.map((badge) => (
          <div
            key={badge.id}
            className="flex items-center space-x-1.5"
            title={badge.description}
          >
            <Icon 
              name={badge.icon as any} 
              size={14} 
              className="text-success dark:text-emerald-400" 
            />
            <span className="text-[10px] font-medium text-muted-foreground dark:text-slate-400">
              {badge.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecurityBadges;

