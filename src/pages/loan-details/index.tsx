import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/ui/AppIcon';
import Button from '../../components/ui/Button';
import LoanHeader from './components/LoanHeader';
import WorkflowTimeline from './components/WorkflowTimeline';
import DocumentsSection from './components/DocumentsSection';
import PaymentHistory from './components/PaymentHistory';
import CommentsSection from './components/CommentsSection';
import { handleLogout as logout } from '../../utils/auth';
import {
  LoanDetails,
  WorkflowStep,
  LoanDocument,
  PaymentRecord,
  InternalComment,
  TabSection } from
'./types';

const LoanDetailsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const loanId = searchParams.get('id') || 'L001';

  const [activeTab, setActiveTab] = useState('documents');
  const [user] = useState({
    name: 'John Smith',
    email: 'john.smith@loantracker.com',
    role: 'Loan Officer'
  });

  // Mock loan data
  const [loanData] = useState<LoanDetails>({
    id: loanId,
    borrowerName: 'Rajesh Kumar',
    borrowerEmail: 'rajesh.kumar@email.com',
    borrowerPhone: '+91 98765 43210',
    borrowerAddress: '123 MG Road, Bangalore, Karnataka 560001',
    loanType: 'Personal',
    amount: 500000,
    term: 36,
    interestRate: 12.5,
    status: 'Started',
    applicationDate: new Date('2024-01-15'),
    approvalDate: new Date('2024-01-20'),
    disbursementDate: new Date('2024-01-25'),
    maturityDate: new Date('2027-01-25'),
    nextDueDate: new Date('2024-02-25'),
    monthlyEMI: 16680,
    totalInterest: 100880,
    totalAmount: 600880,
    remainingAmount: 450000
  });

  const [workflowSteps] = useState<WorkflowStep[]>([
  {
    id: 1,
    title: 'Application',
    description: 'Loan application submitted',
    status: 'completed',
    completedDate: new Date('2024-01-15')
  },
  {
    id: 2,
    title: 'Verification',
    description: 'Document verification',
    status: 'completed',
    completedDate: new Date('2024-01-18')
  },
  {
    id: 3,
    title: 'Approval',
    description: 'Loan approval process',
    status: 'completed',
    completedDate: new Date('2024-01-20')
  },
  {
    id: 4,
    title: 'Disbursement',
    description: 'Loan amount disbursed',
    status: 'current'
  }]
  );

  const [documents, setDocuments] = useState<LoanDocument[]>([
  {
    id: 'doc1',
    name: 'Aadhar Card.pdf',
    type: 'application/pdf',
    size: 2048576,
    uploadDate: new Date('2024-01-15'),
    status: 'verified',
    url: 'https://example.com/aadhar.pdf',
    thumbnailUrl: "https://images.unsplash.com/photo-1707482868275-9258019cd110"
  },
  {
    id: 'doc2',
    name: 'Income Certificate.pdf',
    type: 'application/pdf',
    size: 1536000,
    uploadDate: new Date('2024-01-16'),
    status: 'verified',
    url: 'https://example.com/income.pdf'
  },
  {
    id: 'doc3',
    name: 'Bank Statement.pdf',
    type: 'application/pdf',
    size: 3072000,
    uploadDate: new Date('2024-01-17'),
    status: 'pending',
    url: 'https://example.com/bank-statement.pdf'
  }]
  );

  const [payments, setPayments] = useState<PaymentRecord[]>([
  {
    id: 'pay1',
    amount: 16680,
    paymentDate: new Date('2024-01-25'),
    paymentMethod: 'Bank Transfer',
    transactionId: 'TXN123456789',
    status: 'completed',
    principalAmount: 12500,
    interestAmount: 4180,
    remainingBalance: 487500
  },
  {
    id: 'pay2',
    amount: 16680,
    paymentDate: new Date('2024-02-25'),
    paymentMethod: 'UPI',
    transactionId: 'UPI987654321',
    status: 'pending',
    principalAmount: 12600,
    interestAmount: 4080,
    remainingBalance: 474900
  }]
  );

  const [comments, setComments] = useState<InternalComment[]>([
  {
    id: 'comment1',
    author: 'John Smith',
    authorRole: 'Loan Officer',
    content: `Initial verification completed successfully. All documents are in order and borrower profile looks good.\n\nCredit score: 750\nDebt-to-income ratio: 35%\nEmployment verification: Confirmed`,
    timestamp: new Date('2024-01-18T10:30:00'),
    isPrivate: false
  },
  {
    id: 'comment2',
    author: 'Sarah Wilson',
    authorRole: 'Manager',
    content: 'Approved for disbursement. Please proceed with fund transfer.',
    timestamp: new Date('2024-01-20T14:15:00'),
    isPrivate: true
  }]
  );

  const tabSections: TabSection[] = [
  {
    id: 'documents',
    label: 'Documents',
    icon: 'FileText',
    count: documents.length
  },
  {
    id: 'payments',
    label: 'Payment History',
    icon: 'CreditCard',
    count: payments.filter((p) => p.status === 'completed').length
  },
  {
    id: 'comments',
    label: 'Internal Comments',
    icon: 'MessageSquare',
    count: comments.length
  }];


  const handleUploadDocuments = (files: FileList) => {
    Array.from(files).forEach((file) => {
      const newDocument: LoanDocument = {
        id: `doc${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: file.type,
        size: file.size,
        uploadDate: new Date(),
        status: 'pending',
        url: URL.createObjectURL(file)
      };
      setDocuments((prev) => [...prev, newDocument]);
    });
  };

  const handleReplaceDocument = (documentId: string, file: File) => {
    setDocuments((prev) => prev.map((doc) =>
    doc.id === documentId ?
    { ...doc, name: file.name, size: file.size, uploadDate: new Date(), status: 'pending' } :
    doc
    ));
  };

  const handleDeleteDocument = (documentId: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
  };

  const handleRecordPayment = (payment: Omit<PaymentRecord, 'id'>) => {
    const newPayment: PaymentRecord = {
      ...payment,
      id: `pay${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    setPayments((prev) => [newPayment, ...prev]);
  };

  const handleAddComment = (comment: Omit<InternalComment, 'id' | 'timestamp'>) => {
    const newComment: InternalComment = {
      ...comment,
      id: `comment${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };
    setComments((prev) => [newComment, ...prev]);
  };

  const handleLogout = () => {
    logout(navigate);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'documents':
        return (
          <DocumentsSection
            documents={documents}
            onUpload={handleUploadDocuments}
            onReplace={handleReplaceDocument}
            onDelete={handleDeleteDocument} />);


      case 'payments':
        return (
          <PaymentHistory
            payments={payments}
            onRecordPayment={handleRecordPayment} />);


      case 'comments':
        return (
          <CommentsSection
            comments={comments}
            onAddComment={handleAddComment} />);


      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={handleLogout} />
      
      <main className="pt-16">
        <div className="max-w-screen-2xl mx-auto px-6 py-6">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6" />

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                Loan Details
              </h1>
              <p className="text-muted-foreground">
                Comprehensive loan management and workflow tracking
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                iconName="ArrowLeft"
                iconPosition="left"
                onClick={() => navigate('/loans-list')}>

                Back to Loans
              </Button>
              <Button
                variant="default"
                iconName="Edit"
                iconPosition="left"
                onClick={() => navigate(`/edit-loan?id=${loanId}`)}>

                Edit Loan
              </Button>
            </div>
          </div>

          {/* Loan Header */}
          <LoanHeader loan={loanData} />

          {/* Workflow Timeline */}
          <WorkflowTimeline steps={workflowSteps} />

          {/* Tabbed Content */}
          <div className="bg-card border border-border rounded-lg">
            {/* Tab Navigation */}
            <div className="border-b border-border">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {tabSections.map((tab) =>
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id ?
                  'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}`
                  }>

                    <Icon name={tab.icon} size={16} />
                    <span>{tab.label}</span>
                    {tab.count !== undefined &&
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  activeTab === tab.id ?
                  'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`
                  }>
                        {tab.count}
                      </span>
                  }
                  </button>
                )}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </main>
    </div>);

};

export default LoanDetailsPage;