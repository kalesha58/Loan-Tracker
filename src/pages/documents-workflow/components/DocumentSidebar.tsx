import React from 'react';

import Icon from '../../../components/ui/AppIcon';
import { LoanStageDocuments, DocumentStatus } from '../types';

interface DocumentSidebarProps {
  stageDocuments: LoanStageDocuments[];
  selectedDocumentId: string | null;
  onDocumentSelect: (documentId: string) => void;
  filterStatus: DocumentStatus | 'all';
  onFilterChange: (status: DocumentStatus | 'all') => void;
}

const DocumentSidebar = ({
  stageDocuments,
  selectedDocumentId,
  onDocumentSelect,
  filterStatus,
  onFilterChange
}: DocumentSidebarProps) => {
  const getStatusColor = (status: DocumentStatus): string => {
    const colors = {
      pending: '#F59E0B',
      approved: '#10B981',
      rejected: '#EF4444',
      revision_required: '#8B5CF6'
    };
    return colors[status];
  };

  const getStatusIcon = (status: DocumentStatus): string => {
    const icons = {
      pending: 'Clock',
      approved: 'CheckCircle',
      rejected: 'XCircle',
      revision_required: 'AlertCircle'
    };
    return icons[status];
  };

  const filteredStages = stageDocuments.map(stage => ({
    ...stage,
    documents: stage.documents.filter(doc => 
      filterStatus === 'all' || doc.status === filterStatus
    )
  })).filter(stage => stage.documents.length > 0);

  return (
    <div className="w-80 bg-card border-r border-border h-full overflow-y-auto">
      {/* Filter Section */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">Document Checklist</h2>
        <div className="space-y-2">
          <button
            onClick={() => onFilterChange('all')}
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
              filterStatus === 'all' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:bg-accent'
            }`}
          >
            All Documents
          </button>
          <button
            onClick={() => onFilterChange('pending')}
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
              filterStatus === 'pending' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:bg-accent'
            }`}
          >
            Pending Review
          </button>
          <button
            onClick={() => onFilterChange('revision_required')}
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
              filterStatus === 'revision_required' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:bg-accent'
            }`}
          >
            Needs Revision
          </button>
        </div>
      </div>

      {/* Document Stages */}
      <div className="flex-1">
        {filteredStages.map((stage) => (
          <div key={stage.stage} className="border-b border-border">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-foreground">{stage.stageTitle}</h3>
                <div className="flex items-center space-x-2">
                  <div className="text-xs text-muted-foreground">
                    {Math.round(stage.completionPercentage)}%
                  </div>
                  {stage.isCompleted && (
                    <Icon name="CheckCircle" size={16} color="#10B981" />
                  )}
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-accent rounded-full h-2 mb-4">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${stage.completionPercentage}%` }}
                />
              </div>

              {/* Documents List */}
              <div className="space-y-2">
                {stage.documents.map((document) => (
                  <button
                    key={document.id}
                    onClick={() => onDocumentSelect(document.id)}
                    className={`w-full text-left p-3 rounded-md border transition-all ${
                      selectedDocumentId === document.id
                        ? 'bg-accent border-primary' :'border-border hover:bg-accent/50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <Icon
                        name={getStatusIcon(document.status)}
                        size={16}
                        color={getStatusColor(document.status)}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground truncate">
                          {document.name}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                            style={{
                              backgroundColor: `${getStatusColor(document.status)}15`,
                              color: getStatusColor(document.status)
                            }}
                          >
                            {document.status.replace('_', ' ')}
                          </span>
                          {document.type === 'required' && (
                            <span className="text-xs text-red-500">Required</span>
                          )}
                        </div>
                        {document.comments.length > 0 && (
                          <div className="flex items-center mt-1">
                            <Icon name="MessageCircle" size={12} className="text-muted-foreground mr-1" />
                            <span className="text-xs text-muted-foreground">
                              {document.comments.length} comment{document.comments.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentSidebar;

