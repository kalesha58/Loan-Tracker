export interface DashboardStats {
  totalLoans: number;
  totalAmount: number;
  activeLoans: number;
  pendingDocuments: number;
}

export interface LoanSummary {
  type: string;
  count: number;
  totalAmount: number;
  icon: string;
  color: string;
}

export interface ChartData {
  name: string;
  value: number;
  color: string;
}

export interface TrendData {
  month: string;
  amount: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  timestamp: Date;
  isRead: boolean;
}

export interface RecentLoan {
  id: string;
  borrowerName: string;
  type: string;
  amount: number;
  status: string;
  statusColor: string;
  nextDueDate: string;
}

