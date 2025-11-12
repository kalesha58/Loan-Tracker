import React from 'react';

import { Loan } from '../types';

interface StatusBadgeProps {
  status: Loan['status'];
  className?: string;
}

const StatusBadge = ({ status, className = '' }: StatusBadgeProps) => {
  const getStatusConfig = (status: Loan['status']) => {
    switch (status) {
      case 'Initiated':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          label: 'Initiated'
        };
      case 'Accepted':
        return {
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          label: 'Accepted'
        };
      case 'Started':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          label: 'Started'
        };
      case 'Ended':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          label: 'Ended'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          label: status
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color} ${className}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;

