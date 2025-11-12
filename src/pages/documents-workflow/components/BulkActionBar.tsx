import React from 'react';

import Icon from '../../../components/ui/AppIcon';
import Button from '../../../components/ui/Button';
import { BulkAction } from '../types';

interface BulkActionsBarProps {
  selectedCount: number;
  onBulkAction: (action: BulkAction) => void;
  onClearSelection: () => void;
}

const BulkActionsBar = ({ selectedCount, onBulkAction, onClearSelection }: BulkActionsBarProps) => {
  if (selectedCount === 0) return null;

  const handleBulkApprove = () => {
    onBulkAction({ action: 'approve', documentIds: [] });
  };

  const handleBulkReject = () => {
    onBulkAction({ action: 'reject', documentIds: [] });
  };

  const handleBulkDownload = () => {
    onBulkAction({ action: 'download', documentIds: [] });
  };

  const handleBulkArchive = () => {
    onBulkAction({ action: 'archive', documentIds: [] });
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
      <div className="bg-card border border-border rounded-lg shadow-lg p-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="CheckSquare" size={20} className="text-primary" />
            <span className="text-sm font-medium text-foreground">
              {selectedCount} document{selectedCount !== 1 ? 's' : ''} selected
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkApprove}
              className="text-green-600 border-green-200 hover:bg-green-50"
            >
              <Icon name="CheckCircle" size={16} className="mr-1" />
              Approve All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkReject}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <Icon name="XCircle" size={16} className="mr-1" />
              Reject All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkDownload}
            >
              <Icon name="Download" size={16} className="mr-1" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkArchive}
            >
              <Icon name="Archive" size={16} className="mr-1" />
              Archive
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClearSelection}
              className="border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              <Icon name="X" size={16} className="mr-1" />
              Clear
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkActionsBar;

