import React from 'react';

import Icon from '../../../components/ui/AppIcon';
import Button from '../../../components/ui/Button';

interface BulkActionsProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkExport: () => void;
  onBulkDelete: () => void;
  onBulkStatusUpdate: (status: string) => void;
}

const BulkActions = ({ 
  selectedCount, 
  onClearSelection, 
  onBulkExport, 
  onBulkDelete, 
  onBulkStatusUpdate 
}: BulkActionsProps) => {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center justify-between p-4 mb-4 bg-primary/10 border border-primary/20 rounded-lg">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Icon name="CheckCircle" size={16} className="text-primary" />
          <span className="text-sm font-medium text-foreground">
            {selectedCount} loan{selectedCount > 1 ? 's' : ''} selected
          </span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          iconName="X"
          onClick={onClearSelection}
          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          iconName="Download"
          iconPosition="left"
          onClick={onBulkExport}
        >
          Export
        </Button>
        
        <div className="relative group">
          <Button
            variant="outline"
            size="sm"
            iconName="Edit"
            iconPosition="left"
          >
            Update Status
          </Button>
          
          <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-md shadow-modal opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            <div className="py-1">
              <button
                onClick={() => onBulkStatusUpdate('Initiated')}
                className="flex items-center w-full px-3 py-2 text-sm text-popover-foreground hover:bg-muted transition-hover"
              >
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                Mark as Initiated
              </button>
              <button
                onClick={() => onBulkStatusUpdate('Accepted')}
                className="flex items-center w-full px-3 py-2 text-sm text-popover-foreground hover:bg-muted transition-hover"
              >
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                Mark as Accepted
              </button>
              <button
                onClick={() => onBulkStatusUpdate('Started')}
                className="flex items-center w-full px-3 py-2 text-sm text-popover-foreground hover:bg-muted transition-hover"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Mark as Started
              </button>
              <button
                onClick={() => onBulkStatusUpdate('Ended')}
                className="flex items-center w-full px-3 py-2 text-sm text-popover-foreground hover:bg-muted transition-hover"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Mark as Ended
              </button>
            </div>
          </div>
        </div>
        
        <Button
          variant="destructive"
          size="sm"
          iconName="Trash2"
          iconPosition="left"
          onClick={onBulkDelete}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default BulkActions;

