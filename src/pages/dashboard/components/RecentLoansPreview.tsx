import React from 'react';

import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/ui/AppIcon';
import Button from '../../../components/ui/Button';
import { RecentLoan } from '../types';

interface RecentLoansPreviewProps {
  loans: RecentLoan[];
}

const RecentLoansPreview = ({ loans }: RecentLoansPreviewProps) => {
  const navigate = useNavigate();

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string, color: string) => {
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border`}
        style={{
          backgroundColor: `${color}10`,
          color: color,
          borderColor: `${color}30`
        }}
      >
        {status}
      </span>
    );
  };

  const handleViewLoan = (loanId: string) => {
    navigate(`/loan-details?id=${loanId}`);
  };

  const handleViewAllLoans = () => {
    navigate('/loans-list');
  };

  return (
    <div className="bg-card rounded-xl border border-border/50 shadow-sm">
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-foreground">
              Recent Loans
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Latest loan applications and updates
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewAllLoans}
            iconName="ArrowRight"
            iconPosition="right"
            iconSize={16}
            className="hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            View All
          </Button>
        </div>
      </div>
      <div className="divide-y divide-border/50">
        {loans.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Icon name="FileText" size={32} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">No recent loans</p>
            <p className="text-sm text-muted-foreground mt-1">New loans will appear here</p>
          </div>
        ) : (
          loans.map((loan) => (
            <div
              key={loan.id}
              className="p-5 hover:bg-muted/30 transition-all duration-200 cursor-pointer group"
              onClick={() => handleViewLoan(loan.id)}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <h4 className="text-base font-semibold text-foreground truncate">
                      {loan.borrowerName}
                    </h4>
                    {getStatusBadge(loan.status, loan.statusColor)}
                  </div>
                  <div className="flex items-center gap-5 text-sm text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1.5">
                      <Icon name="Hash" size={14} className="text-muted-foreground/70" />
                      <span className="font-medium">{loan.id}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Icon name="Tag" size={14} className="text-muted-foreground/70" />
                      <span>{loan.type}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Icon name="Calendar" size={14} className="text-muted-foreground/70" />
                      <span>Due: {formatDate(loan.nextDueDate)}</span>
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xl font-bold text-foreground">
                      {formatCurrency(loan.amount)}
                    </div>
                  </div>
                  <Icon 
                    name="ChevronRight" 
                    size={18} 
                    className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all duration-200" 
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentLoansPreview;

