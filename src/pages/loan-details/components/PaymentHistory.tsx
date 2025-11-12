import React, { useState } from 'react';

import Icon from '../../../components/ui/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { PaymentRecord } from '../types';

interface PaymentHistoryProps {
  payments: PaymentRecord[];
  onRecordPayment: (payment: Omit<PaymentRecord, 'id'>) => void;
}

const PaymentHistory = ({ payments, onRecordPayment }: PaymentHistoryProps) => {
  const [showRecordForm, setShowRecordForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    paymentMethod: '',
    transactionId: '',
    principalAmount: '',
    interestAmount: '',
  });

  const paymentMethods = [
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'upi', label: 'UPI' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'cash', label: 'Cash' },
    { value: 'online', label: 'Online Payment' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-success bg-success/10 border-success/20';
      case 'pending':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'failed':
        return 'text-destructive bg-destructive/10 border-destructive/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
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
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPayment: Omit<PaymentRecord, 'id'> = {
      amount: parseFloat(formData.amount),
      paymentDate: new Date(),
      paymentMethod: formData.paymentMethod,
      transactionId: formData.transactionId,
      status: 'completed',
      principalAmount: parseFloat(formData.principalAmount),
      interestAmount: parseFloat(formData.interestAmount),
      remainingBalance: 0, // This would be calculated based on loan details
    };

    onRecordPayment(newPayment);
    setShowRecordForm(false);
    setFormData({
      amount: '',
      paymentMethod: '',
      transactionId: '',
      principalAmount: '',
      interestAmount: '',
    });
  };

  const totalPaid = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-success/5 border border-success/20 rounded-lg p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="TrendingUp" size={18} className="sm:w-5 sm:h-5 text-success" />
            <span className="text-xs sm:text-sm font-medium text-success">Total Paid</span>
          </div>
          <p className="text-xl sm:text-2xl font-semibold text-foreground break-words">
            {formatCurrency(totalPaid)}
          </p>
        </div>
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Calendar" size={18} className="sm:w-5 sm:h-5 text-primary" />
            <span className="text-xs sm:text-sm font-medium text-primary">Total Payments</span>
          </div>
          <p className="text-xl sm:text-2xl font-semibold text-foreground">
            {payments.filter(p => p.status === 'completed').length}
          </p>
        </div>
        <div className="bg-warning/5 border border-warning/20 rounded-lg p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Clock" size={18} className="sm:w-5 sm:h-5 text-warning" />
            <span className="text-xs sm:text-sm font-medium text-warning">Pending</span>
          </div>
          <p className="text-xl sm:text-2xl font-semibold text-foreground">
            {payments.filter(p => p.status === 'pending').length}
          </p>
        </div>
      </div>

      {/* Record Payment Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <h3 className="text-base sm:text-lg font-semibold text-foreground">Payment History</h3>
        <Button
          variant="default"
          iconName="Plus"
          iconPosition="left"
          onClick={() => setShowRecordForm(true)}
          className="w-full sm:w-auto"
        >
          Record Payment
        </Button>
      </div>

      {/* Record Payment Form */}
      {showRecordForm && (
        <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-foreground">Record New Payment</h4>
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={() => setShowRecordForm(false)}
            />
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Input
              label="Payment Amount"
              type="number"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
            <Select
              label="Payment Method"
              options={paymentMethods}
              value={formData.paymentMethod}
              onChange={(value) => setFormData({ ...formData, paymentMethod: value as string })}
              placeholder="Select payment method"
              required
            />
            <Input
              label="Transaction ID"
              type="text"
              placeholder="Enter transaction ID"
              value={formData.transactionId}
              onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
              required
            />
            <Input
              label="Principal Amount"
              type="number"
              placeholder="Principal portion"
              value={formData.principalAmount}
              onChange={(e) => setFormData({ ...formData, principalAmount: e.target.value })}
              required
            />
            <Input
              label="Interest Amount"
              type="number"
              placeholder="Interest portion"
              value={formData.interestAmount}
              onChange={(e) => setFormData({ ...formData, interestAmount: e.target.value })}
              required
            />
            <div className="sm:col-span-2 flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
              <Button type="submit" variant="default" className="w-full sm:w-auto">
                Record Payment
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowRecordForm(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Payments List */}
      <div className="space-y-3">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="bg-card border border-border rounded-lg p-3 sm:p-4 hover:shadow-card transition-shadow"
          >
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="CreditCard" size={20} className="text-primary" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                    <h4 className="font-medium text-base sm:text-lg text-foreground">
                      {formatCurrency(payment.amount)}
                    </h4>
                    <div className={`px-2 py-0.5 sm:py-1 rounded text-xs font-medium border flex-shrink-0 ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </div>
                  </div>
                  
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                    {payment.paymentMethod} • {formatDate(payment.paymentDate)}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-muted-foreground">
                    <span>Principal: {formatCurrency(payment.principalAmount)}</span>
                    <span>Interest: {formatCurrency(payment.interestAmount)}</span>
                    <span className="truncate">TXN: {payment.transactionId}</span>
                  </div>
                </div>
              </div>
              <div className="pl-[52px] sm:pl-14">
                <p className="text-xs sm:text-sm font-medium text-foreground">
                  Balance: {formatCurrency(payment.remainingBalance)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {payments.length === 0 && (
        <div className="text-center py-12">
          <Icon name="CreditCard" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            No Payments Recorded
          </h3>
          <p className="text-muted-foreground">
            Record the first payment to start tracking payment history.
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;

