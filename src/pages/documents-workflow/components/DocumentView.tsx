import React, { useState } from 'react';

import Icon from '../../../components/ui/AppIcon';
import Button from '../../../components/ui/Button';
import { Document } from '../types';

interface DocumentViewerProps {
  document: Document | null;
  onApprove: (documentId: string, comment?: string) => void;
  onReject: (documentId: string, comment: string) => void;
  onRequestRevision: (documentId: string, comment: string) => void;
}

const DocumentViewer = ({ document, onApprove, onReject, onRequestRevision }: DocumentViewerProps) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'revision'>('approve');
  const [comment, setComment] = useState('');

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };

  const handleZoomReset = () => {
    setZoomLevel(100);
  };

  const openCommentModal = (type: 'approve' | 'reject' | 'revision') => {
    setActionType(type);
    setShowCommentModal(true);
    setComment('');
  };

  const handleSubmitAction = () => {
    if (!document) return;

    switch (actionType) {
      case 'approve':
        onApprove(document.id, comment || undefined);
        break;
      case 'reject':
        onReject(document.id, comment);
        break;
      case 'revision':
        onRequestRevision(document.id, comment);
        break;
    }

    setShowCommentModal(false);
    setComment('');
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  if (!document) {
    return (
      <div className="flex-1 bg-card flex items-center justify-center">
        <div className="text-center">
          <Icon name="FileText" size={64} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Document Selected</h3>
          <p className="text-muted-foreground">
            Select a document from the sidebar to view and review
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-card flex flex-col">
      {/* Viewer Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-foreground">{document.name}</h2>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            {document.fileSize && (
              <>
                <span>{formatFileSize(document.fileSize)}</span>
                <span>•</span>
              </>
            )}
            <span>Version {document.version}</span>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 border border-border rounded-md">
            <button
              onClick={handleZoomOut}
              className="p-2 hover:bg-accent transition-colors"
              disabled={zoomLevel <= 50}
            >
              <Icon name="ZoomOut" size={16} />
            </button>
            <span className="px-3 text-sm text-muted-foreground border-x border-border">
              {zoomLevel}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-2 hover:bg-accent transition-colors"
              disabled={zoomLevel >= 200}
            >
              <Icon name="ZoomIn" size={16} />
            </button>
          </div>
          <button
            onClick={handleZoomReset}
            className="px-3 py-2 text-sm border border-border rounded-md hover:bg-accent transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Document Viewer Area */}
      <div className="flex-1 bg-accent/20 overflow-auto p-4">
        <div className="bg-white rounded-lg shadow-md mx-auto max-w-4xl min-h-[800px] flex items-center justify-center">
          {document.fileUrl ? (
            <div style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}>
              <div className="bg-gray-100 p-8 rounded-lg">
                <Icon name="FileText" size={64} className="text-gray-400 mx-auto mb-4" />
                <p className="text-center text-gray-600">PDF Document Preview</p>
                <p className="text-center text-sm text-gray-500 mt-2">{document.name}</p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <Icon name="Upload" size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Document not yet uploaded</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between p-4 border-t border-border bg-background">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.fileUrl && window.open(document.fileUrl, '_blank')}
            disabled={!document.fileUrl}
          >
            <Icon name="Download" size={16} className="mr-2" />
            Download
          </Button>
          <Button variant="outline" size="sm">
            <Icon name="Printer" size={16} className="mr-2" />
            Print
          </Button>
        </div>

        {document.status === 'pending' && (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => openCommentModal('revision')}
              className="text-purple-600 border-purple-200 hover:bg-purple-50"
            >
              <Icon name="MessageSquare" size={16} className="mr-2" />
              Request Revision
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => openCommentModal('reject')}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <Icon name="XCircle" size={16} className="mr-2" />
              Reject
            </Button>
            <Button
              size="sm"
              onClick={() => openCommentModal('approve')}
              className="bg-green-600 hover:bg-green-700"
            >
              <Icon name="CheckCircle" size={16} className="mr-2" />
              Approve
            </Button>
          </div>
        )}
      </div>

      {/* Comment Modal */}
      {showCommentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {actionType === 'approve' ? 'Approve Document' :
               actionType === 'reject' ? 'Reject Document' : 'Request Revision'}
            </h3>
            
            {actionType !== 'approve' && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Comment {actionType === 'reject' ? '(Required)' : '(Optional)'}
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-3 border border-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={4}
                  placeholder={`Add your ${actionType === 'reject' ? 'rejection reason' : 'revision request'}...`}
                />
              </div>
            )}

            {actionType === 'approve' && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Comment (Optional)</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-3 border border-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                  placeholder="Add an approval comment..."
                />
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowCommentModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitAction}
                disabled={actionType === 'reject' && !comment.trim()}
                className={
                  actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' :
                  actionType === 'reject'? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'
                }
              >
                {actionType === 'approve' ? 'Approve' :
                 actionType === 'reject' ? 'Reject' : 'Request Revision'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentViewer;

