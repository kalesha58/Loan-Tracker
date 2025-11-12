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
    <div className="mt-8 pt-6 border-t border-border">
      <div className="flex items-center justify-center space-x-6">
        {securityBadges.map((badge) => (
          <div
            key={badge.id}
            className="flex items-center space-x-2 text-muted-foreground"
            title={badge.description}
          >
            <Icon name={badge.icon} size={16} className="text-success" />
            <span className="text-xs font-medium">{badge.name}</span>
          </div>
        ))}
      </div>
      
      <p className="text-center text-xs text-muted-foreground mt-3">
        Your financial data is protected with enterprise-grade security
      </p>
    </div>
  );
};

export default SecurityBadges;

