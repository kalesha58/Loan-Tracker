import React from 'react';

import { LoanFilter, LoanStats } from '../types';

interface FilterTabsProps {
  filter: LoanFilter;
  stats: LoanStats;
  onFilterChange: (filter: Partial<LoanFilter>) => void;
}

const FilterTabs = ({ filter, stats, onFilterChange }: FilterTabsProps) => {
  const tabs = [
    { key: 'All' as const, label: 'All Loans', count: stats.total },
    { key: 'Personal' as const, label: 'Personal', count: stats.personal },
    { key: 'Vehicle' as const, label: 'Vehicle', count: stats.vehicle },
    { key: 'Business' as const, label: 'Business', count: stats.business },
    { key: 'Medical' as const, label: 'Medical', count: stats.medical }
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onFilterChange({ type: tab.key })}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-hover ${
            filter.type === tab.key
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
          }`}
        >
          <span>{tab.label}</span>
          <span className={`px-2 py-0.5 rounded-full text-xs ${
            filter.type === tab.key
              ? 'bg-primary-foreground/20 text-primary-foreground'
              : 'bg-background text-muted-foreground'
          }`}>
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;

