import React from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const SearchAndExport = ({ searchTerm, onSearchChange, onExport, totalTransactions }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <Input
          type="search"
          placeholder="Search by product, amount, or transaction ID..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onExport}
          iconName="Download"
          iconPosition="left"
          disabled={totalTransactions === 0}
        >
          Export CSV
        </Button>
      </div>
    </div>
  );
};

export default SearchAndExport;