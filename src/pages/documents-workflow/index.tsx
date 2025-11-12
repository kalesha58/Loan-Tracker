import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import DocumentSidebar from './components/DocumentSidebar';
import DocumentViewer from './components/DocumentView';
import DocumentMetaPanel from './components/DocumentMeta';
import BulkActionsBar from './components/BulkActionBar';
import UploadZone from './components/UploadZone';
import { handleLogout as logout } from '../../utils/auth';
import {
  Document,
  DocumentComment,
  LoanStageDocuments,
  DocumentStatus,
  DocumentWorkflowState,
  BulkAction
} from './types';

const DocumentsWorkflow = () => {
  const navigate = useNavigate();
  const [workflowState, setWorkflowState] = useState<DocumentWorkflowState>({
    currentLoan: {
      id: "LN001",
      borrowerName: "Priya Sharma",
      loanType: "Personal Loan",
      amount: 250000
    },
    selectedDocuments: [],
    currentDocument: null,
    viewMode: 'viewer',
    filterStatus: 'all'
  });

  const [stageDocuments, setStageDocuments] = useState<LoanStageDocuments[]>([]);

  // Mock user data
  const user = {
    name: "Rajesh Kumar",
    email: "rajesh.kumar@loantracker.com",
    role: "Senior Loan Officer"
  };

  // Initialize mock document data
  useEffect(() => {
    const mockStageDocuments: LoanStageDocuments[] = [
      {
        stage: 'application',
        stageTitle: 'Application Documents',
        completionPercentage: 85,
        isCompleted: false,
        documents: [
          {
            id: 'doc-1',
            name: 'Loan Application Form',
            type: 'required',
            status: 'approved',
            version: 1,
            fileSize: 156789,
            uploadedAt: new Date('2024-01-10T10:30:00Z'),
            approvedAt: new Date('2024-01-10T14:20:00Z'),
            comments: [
              {
                id: 'comment-1',
                authorName: 'Rajesh Kumar',
                authorRole: 'Senior Loan Officer',
                message: 'Application form is complete and all required fields are filled correctly.',
                timestamp: new Date('2024-01-10T14:20:00Z'),
                type: 'approval'
              }
            ]
          },
          {
            id: 'doc-2',
            name: 'Identity Proof (Aadhaar)',
            type: 'required',
            status: 'approved',
            version: 1,
            fileSize: 245678,
            uploadedAt: new Date('2024-01-09T16:45:00Z'),
            approvedAt: new Date('2024-01-09T17:10:00Z'),
            comments: []
          },
          {
            id: 'doc-3',
            name: 'Address Proof',
            type: 'required',
            status: 'pending',
            version: 1,
            fileSize: 189456,
            uploadedAt: new Date('2024-01-11T09:15:00Z'),
            comments: []
          }
        ]
      },
      {
        stage: 'verification',
        stageTitle: 'Verification Documents',
        completionPercentage: 60,
        isCompleted: false,
        documents: [
          {
            id: 'doc-4',
            name: 'Income Certificate',
            type: 'required',
            status: 'revision_required',
            version: 2,
            fileSize: 367890,
            uploadedAt: new Date('2024-01-08T11:20:00Z'),
            comments: [
              {
                id: 'comment-2',
                authorName: 'Rajesh Kumar',
                authorRole: 'Senior Loan Officer',
                message: 'Please provide updated income certificate for the current financial year.',
                timestamp: new Date('2024-01-08T15:30:00Z'),
                type: 'revision_request'
              }
            ]
          },
          {
            id: 'doc-5',
            name: 'Employment Letter',
            type: 'required',
            status: 'approved',
            version: 1,
            fileSize: 123456,
            uploadedAt: new Date('2024-01-07T14:00:00Z'),
            approvedAt: new Date('2024-01-07T16:45:00Z'),
            comments: []
          },
          {
            id: 'doc-6',
            name: 'Bank Statements (6 months)',
            type: 'required',
            status: 'pending',
            version: 1,
            fileSize: 892345,
            uploadedAt: new Date('2024-01-11T13:30:00Z'),
            comments: []
          }
        ]
      },
      {
        stage: 'approval',
        stageTitle: 'Approval Documents',
        completionPercentage: 0,
        isCompleted: false,
        documents: [
          {
            id: 'doc-7',
            name: 'Credit Report',
            type: 'required',
            status: 'pending',
            version: 1,
            comments: []
          },
          {
            id: 'doc-8',
            name: 'Property Valuation',
            type: 'optional',
            status: 'pending',
            version: 1,
            comments: []
          }
        ]
      },
      {
        stage: 'disbursement',
        stageTitle: 'Disbursement Documents',
        completionPercentage: 0,
        isCompleted: false,
        documents: [
          {
            id: 'doc-9',
            name: 'Loan Agreement',
            type: 'required',
            status: 'pending',
            version: 1,
            comments: []
          },
          {
            id: 'doc-10',
            name: 'Disbursement Authorization',
            type: 'required',
            status: 'pending',
            version: 1,
            comments: []
          }
        ]
      }
    ];

    setStageDocuments(mockStageDocuments);
    
    // Set first document as selected initially
    if (mockStageDocuments[0]?.documents?.[0]) {
      setWorkflowState((prev: DocumentWorkflowState) => ({
        ...prev,
        currentDocument: mockStageDocuments[0].documents[0]
      }));
    }
  }, []);

  const handleDocumentSelect = (documentId: string) => {
    const allDocuments = stageDocuments.flatMap(stage => stage.documents);
    const selectedDoc = allDocuments.find(doc => doc.id === documentId);
    
    setWorkflowState((prev: DocumentWorkflowState) => ({
      ...prev,
      currentDocument: selectedDoc || null
    }));
  };

  const handleFilterChange = (status: DocumentStatus | 'all') => {
    setWorkflowState((prev: DocumentWorkflowState) => ({
      ...prev,
      filterStatus: status
    }));
  };

  const handleDocumentApproval = (documentId: string, comment?: string) => {
    setStageDocuments((prev: LoanStageDocuments[]) =>
      prev.map(stage => ({
        ...stage,
        documents: stage.documents.map(doc => {
          if (doc.id === documentId) {
            const updatedDoc = {
              ...doc,
              status: 'approved' as DocumentStatus,
              approvedAt: new Date()
            };
            
            if (comment) {
              const newComment: DocumentComment = {
                id: `comment-${Date.now()}`,
                authorName: user.name,
                authorRole: user.role,
                message: comment,
                timestamp: new Date(),
                type: 'approval'
              };
              updatedDoc.comments = [...doc.comments, newComment];
            }
            
            // Update current document if it's the selected one
            if (workflowState.currentDocument?.id === documentId) {
              setWorkflowState((prev: DocumentWorkflowState) => ({ ...prev, currentDocument: updatedDoc }));
            }
            
            return updatedDoc;
          }
          return doc;
        })
      }))
    );
  };

  const handleDocumentRejection = (documentId: string, comment: string) => {
    setStageDocuments((prev: LoanStageDocuments[]) =>
      prev.map(stage => ({
        ...stage,
        documents: stage.documents.map(doc => {
          if (doc.id === documentId) {
            const newComment: DocumentComment = {
              id: `comment-${Date.now()}`,
              authorName: user.name,
              authorRole: user.role,
              message: comment,
              timestamp: new Date(),
              type: 'rejection'
            };
            
            const updatedDoc = {
              ...doc,
              status: 'rejected' as DocumentStatus,
              rejectedAt: new Date(),
              comments: [...doc.comments, newComment]
            };
            
            // Update current document if it's the selected one
            if (workflowState.currentDocument?.id === documentId) {
              setWorkflowState((prev: DocumentWorkflowState) => ({ ...prev, currentDocument: updatedDoc }));
            }
            
            return updatedDoc;
          }
          return doc;
        })
      }))
    );
  };

  const handleRevisionRequest = (documentId: string, comment: string) => {
    setStageDocuments((prev: LoanStageDocuments[]) =>
      prev.map(stage => ({
        ...stage,
        documents: stage.documents.map(doc => {
          if (doc.id === documentId) {
            const newComment: DocumentComment = {
              id: `comment-${Date.now()}`,
              authorName: user.name,
              authorRole: user.role,
              message: comment,
              timestamp: new Date(),
              type: 'revision_request'
            };
            
            const updatedDoc = {
              ...doc,
              status: 'revision_required' as DocumentStatus,
              comments: [...doc.comments, newComment]
            };
            
            // Update current document if it's the selected one
            if (workflowState.currentDocument?.id === documentId) {
              setWorkflowState((prev: DocumentWorkflowState) => ({ ...prev, currentDocument: updatedDoc }));
            }
            
            return updatedDoc;
          }
          return doc;
        })
      }))
    );
  };

  const handleAddComment = (documentId: string, comment: string) => {
    setStageDocuments((prev: LoanStageDocuments[]) =>
      prev.map(stage => ({
        ...stage,
        documents: stage.documents.map(doc => {
          if (doc.id === documentId) {
            const newComment: DocumentComment = {
              id: `comment-${Date.now()}`,
              authorName: user.name,
              authorRole: user.role,
              message: comment,
              timestamp: new Date(),
              type: 'comment'
            };
            
            const updatedDoc = {
              ...doc,
              comments: [...doc.comments, newComment]
            };
            
            // Update current document if it's the selected one
            if (workflowState.currentDocument?.id === documentId) {
              setWorkflowState((prev: DocumentWorkflowState) => ({ ...prev, currentDocument: updatedDoc }));
            }
            
            return updatedDoc;
          }
          return doc;
        })
      }))
    );
  };

  const handleBulkAction = (action: BulkAction) => {
    // Handle bulk actions here
    console.log('Bulk action:', action);
    setWorkflowState((prev: DocumentWorkflowState) => ({ ...prev, selectedDocuments: [] }));
  };

  const handleFileUpload = (file: File) => {
    console.log('File uploaded:', file.name);
    // Handle file upload logic here
  };

  const handleLogout = () => {
    logout(navigate);
  };

  const calculateProgress = (docs: Document[]): number => {
    if (docs.length === 0) return 0;
    const approvedDocs = docs.filter(doc => doc.status === 'approved').length;
    return (approvedDocs / docs.length) * 100;
  };

  // Recalculate completion percentages
  const updatedStageDocuments = stageDocuments.map(stage => ({
    ...stage,
    completionPercentage: calculateProgress(stage.documents),
    isCompleted: stage.documents.length > 0 && stage.documents.every(doc => doc.status === 'approved')
  }));

  return (
    <>
      <Helmet>
        <title>Documents Workflow - LoanTracker</title>
        <meta name="description" content="Comprehensive document management and review workflow for loan applications with collaborative features" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header user={user} onLogout={handleLogout} />
        
        <main className="pt-16 h-screen flex flex-col">
          <div className="px-6 py-4 border-b border-border">
            <Breadcrumb />
            <div className="flex items-center justify-between mt-4">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">
                  Documents Workflow
                </h1>
                <p className="text-muted-foreground mt-1">
                  {workflowState.currentLoan.borrowerName} • {workflowState.currentLoan.loanType} • 
                  ₹{workflowState.currentLoan.amount.toLocaleString('en-IN')}
                </p>
              </div>
              
              {workflowState.viewMode === 'list' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setWorkflowState((prev: DocumentWorkflowState) => ({ ...prev, viewMode: 'viewer' }))}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Switch to Viewer
                  </button>
                </div>
              )}
            </div>
          </div>

          {workflowState.viewMode === 'viewer' ? (
            <div className="flex-1 flex overflow-hidden">
              {/* Left Sidebar - Document List */}
              <DocumentSidebar
                stageDocuments={updatedStageDocuments}
                selectedDocumentId={workflowState.currentDocument?.id || null}
                onDocumentSelect={handleDocumentSelect}
                filterStatus={workflowState.filterStatus}
                onFilterChange={handleFilterChange}
              />

              {/* Main Content - Document Viewer */}
              <DocumentViewer
                document={workflowState.currentDocument}
                onApprove={handleDocumentApproval}
                onReject={handleDocumentRejection}
                onRequestRevision={handleRevisionRequest}
              />

              {/* Right Panel - Document Metadata & Comments */}
              <DocumentMetaPanel
                document={workflowState.currentDocument}
                onAddComment={handleAddComment}
              />
            </div>
          ) : (
            <div className="flex-1 p-6 overflow-auto">
              <UploadZone onFileUpload={handleFileUpload} />
            </div>
          )}

          {/* Bulk Actions Bar */}
          <BulkActionsBar
            selectedCount={workflowState.selectedDocuments.length}
            onBulkAction={handleBulkAction}
            onClearSelection={() => setWorkflowState((prev: DocumentWorkflowState) => ({ ...prev, selectedDocuments: [] }))}
          />
        </main>
      </div>
    </>
  );
};

export default DocumentsWorkflow;