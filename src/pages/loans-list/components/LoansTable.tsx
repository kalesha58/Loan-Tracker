import React from 'react';

import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/ui/AppIcon';
import Button from '../../../components/ui/Button';
import StatusBadge from './StatusBadge';
import { Loan, LoanFilter, TableColumn } from '../types';

interface LoansTableProps {
  loans: Loan[];
  filter: LoanFilter;
  onFilterChange: (filter: Partial<LoanFilter>) => void;
  selectedLoans: string[];
  onSelectionChange: (loanIds: string[]) => void;
}

const LoansTable = ({ loans, filter, onFilterChange, selectedLoans, onSelectionChange }: LoansTableProps) => {
  const navigate = useNavigate();

  const columns: TableColumn[] = [
    { key: 'id', label: 'Loan ID', sortable: true, width: '120px' },
    { key: 'borrowerName', label: 'Borrower', sortable: true },
    { key: 'loanType', label: 'Type', sortable: true, width: '100px' },
    { key: 'amount', label: 'Amount', sortable: true, width: '120px' },
    { key: 'status', label: 'Status', sortable: true, width: '120px' },
    { key: 'nextDueDate', label: 'Next Due', sortable: true, width: '120px' },
    { key: 'createdDate', label: 'Actions', sortable: false, width: '120px' }
  ];

  const handleSort = (column: keyof Loan) => {
    const newOrder = filter.sortBy === column && filter.sortOrder === 'asc' ? 'desc' : 'asc';
    onFilterChange({ sortBy: column, sortOrder: newOrder });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(loans.map(loan => loan.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectLoan = (loanId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedLoans, loanId]);
    } else {
      onSelectionChange(selectedLoans.filter(id => id !== loanId));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const handleViewDetails = (loanId: string) => {
    navigate(`/loan-details?id=${loanId}`);
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedLoans.length === loans.length && loans.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-border"
                />
              </th>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                  style={{ width: column.width }}
                >
                  {column.sortable ? (
                    <button
                      onClick={() => handleSort(column.key as keyof Loan)}
                      className="flex items-center space-x-1 hover:text-foreground transition-hover"
                    >
                      <span>{column.label}</span>
                      <Icon
                        name={
                          filter.sortBy === column.key
                            ? filter.sortOrder === 'asc' ?'ChevronUp' :'ChevronDown' :'ChevronsUpDown'
                        }
                        size={14}
                      />
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loans.map((loan) => (
              <tr key={loan.id} className="hover:bg-muted/30 transition-hover">
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedLoans.includes(loan.id)}
                    onChange={(e) => handleSelectLoan(loan.id, e.target.checked)}
                    className="rounded border-border"
                  />
                </td>
                <td className="px-4 py-4 text-sm font-medium text-foreground">
                  {loan.id}
                </td>
                <td className="px-4 py-4">
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {loan.borrowerName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {loan.borrowerEmail}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-foreground">
                  {loan.loanType}
                </td>
                <td className="px-4 py-4 text-sm font-medium text-foreground">
                  {formatCurrency(loan.amount)}
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={loan.status} />
                </td>
                <td className="px-4 py-4 text-sm text-foreground">
                  {formatDate(loan.nextDueDate)}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Eye"
                      onClick={() => handleViewDetails(loan.id)}
                      className="h-8 w-8 p-0"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Edit"
                      onClick={() => {/* Handle edit */}}
                      className="h-8 w-8 p-0"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-border">
        {loans.map((loan) => (
          <div key={loan.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedLoans.includes(loan.id)}
                  onChange={(e) => handleSelectLoan(loan.id, e.target.checked)}
                  className="rounded border-border"
                />
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {loan.id}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {loan.loanType}
                  </div>
                </div>
              </div>
              <StatusBadge status={loan.status} />
            </div>
            
            <div className="space-y-2 mb-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Borrower:</span>
                <span className="text-sm font-medium text-foreground">
                  {loan.borrowerName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Amount:</span>
                <span className="text-sm font-medium text-foreground">
                  {formatCurrency(loan.amount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Next Due:</span>
                <span className="text-sm text-foreground">
                  {formatDate(loan.nextDueDate)}
                </span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                iconName="Eye"
                iconPosition="left"
                onClick={() => handleViewDetails(loan.id)}
                className="flex-1"
              >
                View
              </Button>
              <Button
                variant="ghost"
                size="sm"
                iconName="Edit"
                onClick={() => {/* Handle edit */}}
                className="px-3"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoansTable;

