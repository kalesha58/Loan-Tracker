import React from 'react';

import Icon from '../../../components/ui/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { LoanFilter } from '../types';

interface SearchBarProps {
  filter: LoanFilter;
  onFilterChange: (filter: Partial<LoanFilter>) => void;
  onExport: () => void;
}

const SearchBar = ({ filter, onFilterChange, onExport }: SearchBarProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1 relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <Icon name="Search" size={16} className="text-muted-foreground" />
        </div>
        <Input
          type="search"
          placeholder="Search by borrower name or loan type..."
          value={filter.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          className="pl-10"
        />
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          iconName="Download"
          iconPosition="left"
          onClick={onExport}
        >
          Export
        </Button>
        
        <Button
          variant="default"
          iconName="Plus"
          iconPosition="left"
          onClick={() => {/* Navigate to add loan */}}
        >
          Add Loan
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;

