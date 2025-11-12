import React, { useState } from 'react';

import Icon from '../../../components/ui/AppIcon';
import Button from '../../../components/ui/Button';
import { Document, DocumentComment } from '../types';

interface DocumentMetaPanelProps {
  document: Document | null;
  onAddComment: (documentId: string, comment: string) => void;
}

const DocumentMetaPanel = ({ document, onAddComment }: DocumentMetaPanelProps) => {
  const [newComment, setNewComment] = useState('');
  const [showCommentForm, setShowCommentForm] = useState(false);

  const handleSubmitComment = () => {
    if (!document || !newComment.trim()) return;
    
    onAddComment(document.id, newComment.trim());
    setNewComment('');
    setShowCommentForm(false);
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const getCommentTypeIcon = (type: DocumentComment['type']): string => {
    const icons = {
      comment: 'MessageCircle',
      approval: 'CheckCircle',
      rejection: 'XCircle',
      revision_request: 'AlertCircle'
    };
    return icons[type];
  };

  const getCommentTypeColor = (type: DocumentComment['type']): string => {
    const colors = {
      comment: '#6B7280',
      approval: '#10B981',
      rejection: '#EF4444',
      revision_request: '#8B5CF6'
    };
    return colors[type];
  };

  if (!document) {
    return (
      <div className="w-80 bg-card border-l border-border h-full flex items-center justify-center">
        <div className="text-center p-6">
          <Icon name="FileX" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Select a document to view details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-card border-l border-border h-full flex flex-col">
      {/* Document Metadata */}
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Document Details</h3>
        
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              File Name
            </label>
            <p className="text-sm text-foreground mt-1">{document.name}</p>
          </div>
          
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Status
            </label>
            <div className="flex items-center mt-1">
              <span
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize"
                style={{
                  backgroundColor: `${document.status === 'approved' ? '#10B981' :
                                   document.status === 'rejected' ? '#EF4444' :
                                   document.status === 'revision_required'? '#8B5CF6' : '#F59E0B'}15`,
                  color: document.status === 'approved' ? '#10B981' :
                         document.status === 'rejected' ? '#EF4444' :
                         document.status === 'revision_required'? '#8B5CF6' : '#F59E0B'
                }}
              >
                {document.status.replace('_', ' ')}
              </span>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Type
            </label>
            <p className="text-sm text-foreground mt-1 capitalize">
              {document.type} Document
            </p>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              File Size
            </label>
            <p className="text-sm text-foreground mt-1">{formatFileSize(document.fileSize)}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Version
            </label>
            <p className="text-sm text-foreground mt-1">v{document.version}</p>
          </div>
          {document.uploadedAt && (
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Uploaded
              </label>
              <p className="text-sm text-foreground mt-1">{formatDate(document.uploadedAt)}</p>
            </div>
          )}
          {document.approvedAt && (
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Approved
              </label>
              <p className="text-sm text-foreground mt-1">{formatDate(document.approvedAt)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Version History */}
      <div className="p-4 border-b border-border">
        <h4 className="text-sm font-semibold text-foreground mb-3">Version History</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-accent rounded-md">
            <div>
              <div className="text-sm font-medium text-foreground">Version {document.version}</div>
              <div className="text-xs text-muted-foreground">Current</div>
            </div>
            <Icon name="Download" size={16} className="text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-foreground">Comments</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCommentForm(!showCommentForm)}
            >
              <Icon name="Plus" size={14} className="mr-1" />
              Add
            </Button>
          </div>
          {showCommentForm && (
            <div className="mb-4 p-3 bg-accent/50 rounded-md">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full p-2 text-sm border border-border rounded resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
              />
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={() => setShowCommentForm(false)}
                  className="px-3 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <Button
                  size="sm"
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim()}
                >
                  Post
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto">
          {document.comments.length === 0 ? (
            <div className="p-4 text-center">
              <Icon name="MessageSquare" size={32} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No comments yet</p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {document.comments
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                .map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: `${getCommentTypeColor(comment.type)}15`
                    }}
                  >
                    <Icon
                      name={getCommentTypeIcon(comment.type)}
                      size={14}
                      color={getCommentTypeColor(comment.type)}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-foreground">
                        {comment.authorName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {comment.authorRole}
                      </span>
                    </div>
                    <p className="text-sm text-foreground mb-1">{comment.message}</p>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(comment.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentMetaPanel;

