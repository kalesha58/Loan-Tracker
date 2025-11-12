export interface LoanDetails {
  id: string;
  borrowerName: string;
  borrowerEmail: string;
  borrowerPhone: string;
  borrowerAddress: string;
  loanType: 'Personal' | 'Vehicle' | 'Business' | 'Medical';
  amount: number;
  status: 'Initiated' | 'Accepted' | 'Started' | 'Ended';
  interestRate: number;
  term: number;
  monthlyEMI: number;
  applicationDate: Date;
  approvalDate?: Date;
  disbursementDate?: Date;
  maturityDate?: Date;
  nextDueDate?: Date;
  totalInterest?: number;
  totalAmount?: number;
  remainingAmount?: number;
}

export interface InternalComment {
  id: string;
  author: string;
  authorRole: string;
  content: string;
  timestamp: Date;
  isPrivate: boolean;
}

export interface LoanDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  status: 'verified' | 'pending' | 'rejected';
  uploadDate: Date;
  thumbnailUrl?: string;
}

export interface PaymentRecord {
  id: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: string;
  transactionId: string;
  status: 'completed' | 'pending' | 'failed';
  principalAmount: number;
  interestAmount: number;
  remainingBalance: number;
}

export interface WorkflowStep {
  id: string | number;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
  completedDate?: Date;
}

export interface TabSection {
  id: string;
  label: string;
  icon: string;
  count?: number;
}

