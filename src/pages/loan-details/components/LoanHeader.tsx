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
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left Section - Basic Info */}
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name={getLoanTypeIcon(loan.loanType)} size={24} className="text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                Loan #{loan.id}
              </h1>
              <p className="text-muted-foreground">
                {loan.loanType} Loan
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(loan.status)}`}>
              {loan.status}
            </div>
          </div>

          {/* Borrower Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Borrower</p>
              <p className="font-medium text-foreground">{loan.borrowerName}</p>
              <p className="text-sm text-muted-foreground">{loan.borrowerEmail}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Contact</p>
              <p className="font-medium text-foreground">{loan.borrowerPhone}</p>
              <p className="text-sm text-muted-foreground">
                Applied: {formatDate(loan.applicationDate)}
              </p>
            </div>
          </div>
        </div>

        {/* Right Section - Financial Details */}
        <div className="lg:w-80">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Loan Amount</p>
              <p className="text-xl font-semibold text-foreground">
                {formatCurrency(loan.amount)}
              </p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Monthly EMI</p>
              <p className="text-xl font-semibold text-foreground">
                {formatCurrency(loan.monthlyEMI)}
              </p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Interest Rate</p>
              <p className="text-lg font-semibold text-foreground">
                {loan.interestRate}% p.a.
              </p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Term</p>
              <p className="text-lg font-semibold text-foreground">
                {loan.term} months
              </p>
            </div>
          </div>
          {loan.nextDueDate && (
            <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex items-center gap-2">
                <Icon name="Calendar" size={16} className="text-warning" />
                <span className="text-sm font-medium text-warning-foreground">
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

