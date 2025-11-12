export type LoanStatus = 'Initiated' | 'Accepted' | 'Started' | 'Ended';

export interface Loan {
  id: string;
  borrowerName: string;
  borrowerEmail: string;
  borrowerPhone: string;
  borrowerAddress: string;
  loanType: 'Personal' | 'Vehicle' | 'Business' | 'Medical';
  amount: number;
  status: LoanStatus;
  nextDueDate: string;
  interestRate: number;
  term: number;
  createdDate: string;
}

export interface LoanFilter {
  type: 'All' | 'Personal' | 'Vehicle' | 'Business' | 'Medical';
  search: string;
  sortBy: keyof Loan;
  sortOrder: 'asc' | 'desc';
}

export interface LoanStats {
  total: number;
  personal: number;
  vehicle: number;
  business: number;
  medical: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface TableColumn {
  key: keyof Loan | 'actions';
  label: string;
  sortable: boolean;
  width?: string;
}

