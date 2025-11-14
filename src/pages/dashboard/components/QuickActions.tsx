import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import AddLoanModal from './AddLoanModal';

const QuickActions = () => {
  const navigate = useNavigate();
  const [isAddLoanModalOpen, setIsAddLoanModalOpen] = useState(false);

  const handleAddLoan = () => {
    setIsAddLoanModalOpen(true);
  };

  return (
    <>
      <Button
        variant="default"
        size="lg"
        onClick={handleAddLoan}
        iconName="Plus"
        iconPosition="left"
        iconSize={20}
        className="shadow-sm hover:shadow-md transition-shadow"
      >
        Add New Loan
      </Button>

      <AddLoanModal
        isOpen={isAddLoanModalOpen}
        onClose={() => setIsAddLoanModalOpen(false)}
      />
    </>
  );
};

export default QuickActions;

