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
          className="group bg-card rounded-xl border border-border/50 p-5 shadow-sm hover:shadow-md hover:border-border transition-all duration-300"
        >
          <div className="flex flex-col space-y-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300"
              style={{ 
                backgroundColor: item.bgColor,
                border: `1px solid ${item.color}20`
              }}
            >
              <Icon
                name={item.icon}
                size={22}
                color={item.color}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-2xl font-bold text-foreground truncate mb-1">
                {item.value}
              </div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
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

