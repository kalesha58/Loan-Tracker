import React from 'react';

import Icon from '../../../components/ui/AppIcon';
import { LoanDetails } from '../types';

interface LoanHeaderProps {
  loan: LoanDetails;
}

const LoanHeader = ({ loan }: LoanHeaderProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Initiated':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Accepted':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Started':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Ended':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLoanTypeIcon = (type: string) => {
    switch (type) {
      case 'Personal':
        return 'User';
      case 'Vehicle':
        return 'Car';
      case 'Business':
        return 'Building';
      case 'Medical':
        return 'Heart';
      default:
        return 'FileText';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 sm:gap-6">
        {/* Left Section - Basic Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name={getLoanTypeIcon(loan.loanType)} size={20} className="sm:w-6 sm:h-6 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-semibold text-foreground truncate">
                  Loan #{loan.id}
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {loan.loanType} Loan
                </p>
              </div>
            </div>
            <div className={`px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border flex-shrink-0 ${getStatusColor(loan.status)}`}>
              {loan.status}
            </div>
          </div>

          {/* Borrower Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Borrower</p>
              <p className="font-medium text-sm sm:text-base text-foreground truncate">{loan.borrowerName}</p>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">{loan.borrowerEmail}</p>
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Contact</p>
              <p className="font-medium text-sm sm:text-base text-foreground">{loan.borrowerPhone}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Applied: {formatDate(loan.applicationDate)}
              </p>
            </div>
          </div>
        </div>

        {/* Right Section - Financial Details */}
        <div className="w-full lg:w-80">
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <div className="text-center p-3 sm:p-4 bg-muted/50 rounded-lg">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Loan Amount</p>
              <p className="text-base sm:text-xl font-semibold text-foreground break-words">
                {formatCurrency(loan.amount)}
              </p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-muted/50 rounded-lg">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Monthly EMI</p>
              <p className="text-base sm:text-xl font-semibold text-foreground break-words">
                {formatCurrency(loan.monthlyEMI)}
              </p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-muted/50 rounded-lg">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Interest Rate</p>
              <p className="text-sm sm:text-lg font-semibold text-foreground">
                {loan.interestRate}% p.a.
              </p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-muted/50 rounded-lg">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Term</p>
              <p className="text-sm sm:text-lg font-semibold text-foreground">
                {loan.term} months
              </p>
            </div>
          </div>
          {loan.nextDueDate && (
            <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex items-center gap-2">
                <Icon name="Calendar" size={14} className="sm:w-4 sm:h-4 text-warning flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-warning-foreground truncate">
                  Next Due: {formatDate(loan.nextDueDate)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanHeader;

