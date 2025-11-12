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
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`}
        style={{
          backgroundColor: `${color}15`,
          color: color
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
    <div className="bg-card rounded-lg border border-border shadow-card">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            Recent Loans
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewAllLoans}
            iconName="ArrowRight"
            iconPosition="right"
            iconSize={16}
          >
            View All
          </Button>
        </div>
      </div>
      <div className="divide-y divide-border">
        {loans.length === 0 ? (
          <div className="p-6 text-center">
            <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No recent loans</p>
          </div>
        ) : (
          loans.map((loan) => (
            <div
              key={loan.id}
              className="p-4 hover:bg-muted/50 transition-smooth cursor-pointer"
              onClick={() => handleViewLoan(loan.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-sm font-medium text-foreground truncate">
                      {loan.borrowerName}
                    </h4>
                    {getStatusBadge(loan.status, loan.statusColor)}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center space-x-1">
                      <Icon name="Hash" size={14} />
                      <span>{loan.id}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Icon name="Tag" size={14} />
                      <span>{loan.type}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Icon name="Calendar" size={14} />
                      <span>Due: {formatDate(loan.nextDueDate)}</span>
                    </span>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-lg font-semibold text-foreground">
                    {formatCurrency(loan.amount)}
                  </div>
                  <Icon name="ChevronRight" size={16} className="text-muted-foreground ml-auto" />
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

