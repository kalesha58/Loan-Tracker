import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import SearchBar from '../loans-list/components/SearchBar';
import LoansTable from '../loans-list/components/LoansTable';
import Pagination from '../loans-list/components/Pagination';
import { handleLogout as logout } from '../../utils/auth';
import { Loan, LoanFilter, PaginationInfo } from '../loans-list/types';

const PersonalLoansPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<LoanFilter>({
    type: 'Personal',
    search: '',
    sortBy: 'createdDate',
    sortOrder: 'desc'
  });

  const [selectedLoans, setSelectedLoans] = useState<string[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 25
  });

  // Mock user data
  const currentUser = {
    name: "Sarah Johnson",
    email: "sarah.johnson@loantracker.com",
    role: "Loan Officer"
  };

  // Get loans from localStorage or use mock data
  const getLoans = (): Loan[] => {
    const storedLoans = localStorage.getItem('personalLoans');
    if (storedLoans) {
      try {
        return JSON.parse(storedLoans);
      } catch {
        return [];
      }
    }
    
    // Return mock personal loans
    return [
      {
        id: "LN001",
        borrowerName: "Rajesh Kumar",
        borrowerEmail: "rajesh.kumar@email.com",
        borrowerPhone: "+91 98765 43210",
        borrowerAddress: "123 MG Road, Bangalore, Karnataka 560001",
        loanType: "Personal",
        amount: 500000,
        status: "Started",
        nextDueDate: "2024-02-15",
        interestRate: 12.5,
        term: 36,
        createdDate: "2024-01-10"
      },
      {
        id: "LN005",
        borrowerName: "Vikram Singh",
        borrowerEmail: "vikram.singh@email.com",
        borrowerPhone: "+91 54321 09876",
        borrowerAddress: "654 Civil Lines, Delhi, Delhi 110001",
        loanType: "Personal",
        amount: 750000,
        status: "Ended",
        nextDueDate: "2024-03-01",
        interestRate: 13.0,
        term: 48,
        createdDate: "2024-01-03"
      }
    ];
  };

  const [loans, setLoans] = useState<Loan[]>(getLoans());

  // Refresh loans from localStorage when component mounts or when returning from add page
  useEffect(() => {
    setLoans(getLoans());
  }, []);

  // Filter and sort loans
  const filteredLoans = useMemo(() => {
    let filtered = loans.filter(loan => loan.loanType === 'Personal');

    // Filter by search
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filtered = filtered.filter(loan =>
        loan.borrowerName.toLowerCase().includes(searchLower) ||
        loan.id.toLowerCase().includes(searchLower)
      );
    }

    // Sort loans
    filtered.sort((a, b) => {
      const aValue = a[filter.sortBy];
      const bValue = b[filter.sortBy];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return filter.sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return filter.sortOrder === 'asc' 
          ? aValue - bValue
          : bValue - aValue;
      }
      
      return 0;
    });

    return filtered;
  }, [loans, filter]);

  // Paginate loans
  const paginatedLoans = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    return filteredLoans.slice(startIndex, endIndex);
  }, [filteredLoans, pagination.currentPage, pagination.itemsPerPage]);

  // Update pagination when filtered loans change
  useEffect(() => {
    const totalPages = Math.ceil(filteredLoans.length / pagination.itemsPerPage);
    setPagination(prev => ({
      ...prev,
      totalPages,
      totalItems: filteredLoans.length,
      currentPage: Math.min(prev.currentPage, totalPages || 1)
    }));
  }, [filteredLoans.length, pagination.itemsPerPage]);

  const handleFilterChange = (newFilter: Partial<LoanFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    setSelectedLoans([]);
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setPagination(prev => ({
      ...prev,
      itemsPerPage,
      currentPage: 1
    }));
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(filteredLoans, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `personal-loans-export-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleLogout = () => {
    logout(navigate);
  };


  return (
    <>
      <Helmet>
        <title>Personal Loans - LoanTracker</title>
        <meta name="description" content="Manage and track all personal loans with comprehensive filtering and sorting." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header user={currentUser} onLogout={handleLogout} />
        
        <main className="pt-16">
          <div className="max-w-screen-2xl mx-auto px-6 py-8">
            {/* Page Header */}
            <div className="mb-8">
              <Breadcrumb />
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-semibold text-foreground">
                    Personal Loans
                  </h1>
                  <p className="text-muted-foreground mt-2">
                    Track and manage all personal loan applications
                  </p>
                </div>
                <Button
                  variant="default"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={() => navigate('/personal-loans/add')}
                >
                  Add Personal Loan
                </Button>
              </div>
            </div>

            {/* Search and Actions */}
            <SearchBar
              filter={filter}
              onFilterChange={handleFilterChange}
              onExport={handleExport}
            />

            {/* Loans Table */}
            <LoansTable
              loans={paginatedLoans}
              filter={filter}
              onFilterChange={handleFilterChange}
              selectedLoans={selectedLoans}
              onSelectionChange={setSelectedLoans}
            />

            {/* Pagination */}
            {filteredLoans.length > 0 && (
              <Pagination
                pagination={pagination}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            )}

            {/* Empty State */}
            {filteredLoans.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No personal loans found
                </h3>
                <p className="text-muted-foreground mb-6">
                  {filter.search ? 'Try adjusting your search criteria.' : 'Get started by adding your first personal loan.'}
                </p>
                <Button
                  variant="default"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={() => navigate('/personal-loans/add')}
                >
                  Add Personal Loan
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default PersonalLoansPage;

