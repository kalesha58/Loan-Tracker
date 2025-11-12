import React from 'react';

import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const navigate = useNavigate();

  const handleAddLoan = () => {
    // Navigate to add loan form (would be implemented in loans-list page)
    navigate('/loans-list?action=add');
  };

  const handleUploadDocuments = () => {
    // Navigate to document upload (would be implemented in loan-details page)
    navigate('/loans-list?tab=documents');
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-8">
      <Button
        variant="default"
        size="lg"
        onClick={handleAddLoan}
        iconName="Plus"
        iconPosition="left"
        iconSize={20}
        className="flex-1 sm:flex-none shadow-sm hover:shadow-md transition-shadow"
      >
        Add New Loan
      </Button>
      <Button
        variant="outline"
        size="lg"
        onClick={handleUploadDocuments}
        iconName="Upload"
        iconPosition="left"
        iconSize={20}
        className="flex-1 sm:flex-none hover:bg-muted transition-colors"
      >
        Upload Documents
      </Button>
    </div>
  );
};

export default QuickActions;

