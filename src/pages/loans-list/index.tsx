import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import FilterTabs from './components/FilterTabs';
import SearchBar from './components/SearchBar';
import LoansTable from './components/LoansTable';
import Pagination from './components/Pagination';
import BulkActions from './components/BulkActions';
import { handleLogout as logout } from '../../utils/auth';
import { Loan, LoanFilter, LoanStats, PaginationInfo } from './types';

const LoansListPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<LoanFilter>({
    type: 'All',
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

  // Mock loans data
  const mockLoans: Loan[] = [
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
      id: "LN002",
      borrowerName: "Priya Sharma",
      borrowerEmail: "priya.sharma@email.com",
      borrowerPhone: "+91 87654 32109",
      borrowerAddress: "456 Park Street, Mumbai, Maharashtra 400001",
      loanType: "Vehicle",
      amount: 800000,
      status: "Accepted",
      nextDueDate: "2024-02-20",
      interestRate: 10.8,
      term: 60,
      createdDate: "2024-01-08"
    },
    {
      id: "LN003",
      borrowerName: "Amit Patel",
      borrowerEmail: "amit.patel@email.com",
      borrowerPhone: "+91 76543 21098",
      borrowerAddress: "789 Ring Road, Ahmedabad, Gujarat 380001",
      loanType: "Business",
      amount: 2000000,
      status: "Initiated",
      nextDueDate: "2024-02-25",
      interestRate: 14.2,
      term: 84,
      createdDate: "2024-01-05"
    },
    {
      id: "LN004",
      borrowerName: "Sunita Reddy",
      borrowerEmail: "sunita.reddy@email.com",
      borrowerPhone: "+91 65432 10987",
      borrowerAddress: "321 Tank Bund Road, Hyderabad, Telangana 500001",
      loanType: "Medical",
      amount: 300000,
      status: "Started",
      nextDueDate: "2024-02-18",
      interestRate: 11.5,
      term: 24,
      createdDate: "2024-01-12"
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
    },
    {
      id: "LN006",
      borrowerName: "Meera Joshi",
      borrowerEmail: "meera.joshi@email.com",
      borrowerPhone: "+91 43210 98765",
      borrowerAddress: "987 FC Road, Pune, Maharashtra 411001",
      loanType: "Vehicle",
      amount: 1200000,
      status: "Started",
      nextDueDate: "2024-02-22",
      interestRate: 9.8,
      term: 72,
      createdDate: "2024-01-15"
    },
    {
      id: "LN007",
      borrowerName: "Arjun Nair",
      borrowerEmail: "arjun.nair@email.com",
      borrowerPhone: "+91 32109 87654",
      borrowerAddress: "147 Marine Drive, Kochi, Kerala 682001",
      loanType: "Business",
      amount: 1500000,
      status: "Accepted",
      nextDueDate: "2024-02-28",
      interestRate: 15.5,
      term: 60,
      createdDate: "2024-01-20"
    },
    {
      id: "LN008",
      borrowerName: "Kavya Iyer",
      borrowerEmail: "kavya.iyer@email.com",
      borrowerPhone: "+91 21098 76543",
      borrowerAddress: "258 Anna Salai, Chennai, Tamil Nadu 600001",
      loanType: "Medical",
      amount: 450000,
      status: "Initiated",
      nextDueDate: "2024-03-05",
      interestRate: 12.0,
      term: 30,
      createdDate: "2024-01-18"
    }
  ];

  // Filter and sort loans
  const filteredLoans = useMemo(() => {
    let filtered = mockLoans;

    // Filter by type
    if (filter.type !== 'All') {
      filtered = filtered.filter(loan => loan.loanType === filter.type);
    }

    // Filter by search
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filtered = filtered.filter(loan =>
        loan.borrowerName.toLowerCase().includes(searchLower) ||
        loan.loanType.toLowerCase().includes(searchLower) ||
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
  }, [filter]);

  // Paginate loans
  const paginatedLoans = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    return filteredLoans.slice(startIndex, endIndex);
  }, [filteredLoans, pagination.currentPage, pagination.itemsPerPage]);

  // Calculate stats
  const stats: LoanStats = useMemo(() => {
    return {
      total: mockLoans.length,
      personal: mockLoans.filter(loan => loan.loanType === 'Personal').length,
      vehicle: mockLoans.filter(loan => loan.loanType === 'Vehicle').length,
      business: mockLoans.filter(loan => loan.loanType === 'Business').length,
      medical: mockLoans.filter(loan => loan.loanType === 'Medical').length
    };
  }, []);

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
    // Mock export functionality
    const dataStr = JSON.stringify(filteredLoans, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `loans-export-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleBulkExport = () => {
    const selectedLoanData = mockLoans.filter(loan => selectedLoans.includes(loan.id));
    const dataStr = JSON.stringify(selectedLoanData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `selected-loans-export-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedLoans.length} selected loan(s)?`)) {
      // Mock delete functionality
      console.log('Deleting loans:', selectedLoans);
      setSelectedLoans([]);
    }
  };

  const handleBulkStatusUpdate = (status: string) => {
    if (window.confirm(`Update status of ${selectedLoans.length} selected loan(s) to ${status}?`)) {
      // Mock status update functionality
      console.log('Updating loan status:', { loanIds: selectedLoans, status });
      setSelectedLoans([]);
    }
  };

  const handleLogout = () => {
    logout(navigate);
  };

  return (
    <>
      <Helmet>
        <title>Loans List - LoanTracker</title>
        <meta name="description" content="Manage and track all loans with comprehensive filtering, sorting, and bulk operations." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header user={currentUser} onLogout={handleLogout} />
        
        <main className="pt-16">
          <div className="max-w-screen-2xl mx-auto px-6 py-8">
            {/* Page Header */}
            <div className="mb-8">
              <Breadcrumb />
              <div className="mt-4">
                <h1 className="text-3xl font-semibold text-foreground">
                  Loans Management
                </h1>
                <p className="text-muted-foreground mt-2">
                  Track and manage all loans across different types and statuses
                </p>
              </div>
            </div>

            {/* Filter Tabs */}
            <FilterTabs
              filter={filter}
              stats={stats}
              onFilterChange={handleFilterChange}
            />

            {/* Search and Actions */}
            <SearchBar
              filter={filter}
              onFilterChange={handleFilterChange}
              onExport={handleExport}
            />

            {/* Bulk Actions */}
            <BulkActions
              selectedCount={selectedLoans.length}
              onClearSelection={() => setSelectedLoans([])}
              onBulkExport={handleBulkExport}
              onBulkDelete={handleBulkDelete}
              onBulkStatusUpdate={handleBulkStatusUpdate}
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
                  No loans found
                </h3>
                <p className="text-muted-foreground mb-6">
                  {filter.search || filter.type !== 'All' ?'Try adjusting your search or filter criteria.' :'Get started by adding your first loan.'}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default LoansListPage;