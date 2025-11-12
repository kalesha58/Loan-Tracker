import React from 'react';

import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/ui/AppIcon';
import { LoanSummary } from '../types';

interface SummaryCardsProps {
  summaryData: LoanSummary[];
}

const SummaryCards = ({ summaryData }: SummaryCardsProps) => {
  const navigate = useNavigate();

  const handleCardClick = (loanType: string) => {
    if (loanType === 'Personal') {
      navigate('/personal-loans');
    }
  };
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {summaryData.map((item, index) => (
        <div
          key={index}
          onClick={() => handleCardClick(item.type)}
          className={`group relative bg-card rounded-xl border border-border/50 p-6 shadow-sm hover:shadow-lg hover:border-border transition-all duration-300 overflow-hidden ${
            item.type === 'Personal' ? 'cursor-pointer' : ''
          }`}
        >
          {/* Subtle gradient overlay on hover */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
            style={{ 
              background: `linear-gradient(135deg, ${item.color} 0%, transparent 100%)`
            }}
          />
          
          <div className="relative">
            <div className="flex items-start justify-between mb-5">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300"
                style={{ 
                  backgroundColor: `${item.color}15`,
                  border: `1px solid ${item.color}20`
                }}
              >
                <Icon
                  name={item.icon}
                  size={26}
                  color={item.color}
                />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-foreground">
                  {item.count}
                </div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Loans
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">
                {item.type} Loans
              </h3>
              <div className="text-xl font-bold text-foreground">
                {formatCurrency(item.totalAmount)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;

