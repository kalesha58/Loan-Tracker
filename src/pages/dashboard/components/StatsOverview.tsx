import React from 'react';

import Icon from '../../../components/ui/AppIcon';
import { DashboardStats } from '../types';

interface StatsOverviewProps {
  stats: DashboardStats;
}

const StatsOverview = ({ stats }: StatsOverviewProps) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const statsItems = [
    {
      label: 'Total Loans',
      value: stats.totalLoans.toString(),
      icon: 'FileText',
      color: '#2563EB',
      bgColor: '#2563EB15'
    },
    {
      label: 'Total Portfolio',
      value: formatCurrency(stats.totalAmount),
      icon: 'DollarSign',
      color: '#10B981',
      bgColor: '#10B98115'
    },
    {
      label: 'Active Loans',
      value: stats.activeLoans.toString(),
      icon: 'TrendingUp',
      color: '#F59E0B',
      bgColor: '#F59E0B15'
    },
    {
      label: 'Pending Documents',
      value: stats.pendingDocuments.toString(),
      icon: 'Clock',
      color: '#EF4444',
      bgColor: '#EF444415'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statsItems.map((item, index) => (
        <div
          key={index}
          className="bg-card rounded-lg border border-border p-4 shadow-card"
        >
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: item.bgColor }}
            >
              <Icon
                name={item.icon}
                size={20}
                color={item.color}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-lg font-semibold text-foreground truncate">
                {item.value}
              </div>
              <div className="text-sm text-muted-foreground">
                {item.label}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;

