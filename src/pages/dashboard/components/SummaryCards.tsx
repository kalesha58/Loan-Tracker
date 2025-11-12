import React from 'react';

import Icon from '../../../components/ui/AppIcon';
import { LoanSummary } from '../types';

interface SummaryCardsProps {
  summaryData: LoanSummary[];
}

const SummaryCards = ({ summaryData }: SummaryCardsProps) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {summaryData.map((item, index) => (
        <div
          key={index}
          className="bg-card rounded-lg border border-border p-6 shadow-card hover:shadow-modal transition-smooth"
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${item.color}15` }}
            >
              <Icon
                name={item.icon}
                size={24}
                color={item.color}
              />
            </div>
            <div className="text-right">
              <div className="text-2xl font-semibold text-foreground">
                {item.count}
              </div>
              <div className="text-sm text-muted-foreground">
                Loans
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              {item.type} Loans
            </h3>
            <div className="text-lg font-semibold text-foreground">
              {formatCurrency(item.totalAmount)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;

