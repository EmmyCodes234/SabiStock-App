import React from 'react';
import Button from '../../../components/ui/Button';

const DateFilterChips = ({ selectedFilter, onFilterChange, onCustomRangeClick }) => {
  const filterOptions = [
    { id: 'today', label: 'Today' },
    { id: 'yesterday', label: 'Yesterday' },
    { id: 'thisWeek', label: 'This Week' },
    { id: 'thisMonth', label: 'This Month' },
    { id: 'custom', label: 'Custom Range' }
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filterOptions.map((filter) => (
        <Button
          key={filter.id}
          variant={selectedFilter === filter.id ? 'default' : 'outline'}
          size="sm"
          onClick={() => {
            if (filter.id === 'custom') {
              onCustomRangeClick();
            } else {
              onFilterChange(filter.id);
            }
          }}
          className="text-sm"
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
};

export default DateFilterChips;