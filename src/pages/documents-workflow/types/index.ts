export type DocumentStatus = 'pending' | 'approved' | 'rejected' | 'revision_required';

export type DocumentType = 'required' | 'optional';

export type BulkAction = {
  action: 'approve' | 'reject' | 'download' | 'archive';
  documentIds: string[];
};

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  status: DocumentStatus;
  fileSize?: number;
  fileUrl?: string;
  version: number;
  uploadedAt?: Date;
  approvedAt?: Date;
  comments: DocumentComment[];
}

export interface DocumentComment {
  id: string;
  authorName: string;
  authorRole: string;
  message: string;
  timestamp: Date;
  type: 'comment' | 'approval' | 'rejection' | 'revision_request';
}

export interface LoanStageDocuments {
  stage: string;
  stageTitle: string;
  documents: Document[];
  completionPercentage: number;
  isCompleted: boolean;
}

export interface DocumentWorkflowState {
  currentLoan: {
    id: string;
    borrowerName: string;
    loanType: string;
    amount: number;
  };
  selectedDocuments: string[];
  currentDocument: Document | null;
  viewMode: 'list' | 'viewer';
  filterStatus: DocumentStatus | 'all';
}
