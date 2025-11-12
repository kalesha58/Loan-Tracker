import React from 'react';

import Icon from '../../../components/ui/AppIcon';
import { IProfileStats } from '../types';

interface ProfileStatsProps {
  stats: IProfileStats;
}

const ProfileStats = ({ stats }: ProfileStatsProps) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatTime = (hours: number): string => {
    if (hours < 24) {
      return `${Math.round(hours)}h`;
    }
    return `${Math.round(hours / 24)}d`;
  };

  const statsItems = [
    {
      label: 'Loans Processed',
      value: stats.totalLoansProcessed.toString(),
      icon: 'FileText',
      color: '#2563EB',
      bgColor: '#2563EB15'
    },
    {
      label: 'Amount Processed',
      value: formatCurrency(stats.totalAmountProcessed),
      icon: 'DollarSign',
      color: '#10B981',
      bgColor: '#10B98115'
    },
    {
      label: 'Avg Processing Time',
      value: formatTime(stats.averageProcessingTime),
      icon: 'Clock',
      color: '#F59E0B',
      bgColor: '#F59E0B15'
    },
    {
      label: 'Approval Rate',
      value: `${stats.approvalRate}%`,
      icon: 'TrendingUp',
      color: '#8B5CF6',
      bgColor: '#8B5CF615'
    },
    {
      label: 'Pending Tasks',
      value: stats.pendingTasks.toString(),
      icon: 'AlertCircle',
      color: '#EF4444',
      bgColor: '#EF444415'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
      <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-6">
        Performance Statistics
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {statsItems.map((item, index) => (
          <div
            key={index}
            className="bg-muted/30 rounded-lg p-3 sm:p-4 text-center"
          >
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3"
              style={{ backgroundColor: item.bgColor }}
            >
              <Icon
                name={item.icon}
                size={20}
                color={item.color}
              />
            </div>
            <div className="text-base sm:text-lg font-semibold text-foreground mb-1 truncate">
              {item.value}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileStats;

