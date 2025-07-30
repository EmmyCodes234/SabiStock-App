import React from 'react';
import Button from '../../../components/ui/Button';

const DateRangeFilter = ({ selectedRange, onRangeChange }) => {
  const ranges = [
    { id: '7d', label: 'Last 7 Days' },
    { id: '30d', label: 'Last 30 Days' },
    { id: '90d', label: 'Last 90 Days' },
    { id: '12m', label: 'Last 12 Months' },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {ranges.map((range) => (
        <Button
          key={range.id}
          variant={selectedRange === range.id ? 'default' : 'outline'}
          size="sm"
          onClick={() => onRangeChange(range.id)}
        >
          {range.label}
        </Button>
      ))}
       {/* A custom date picker could be added here in the future */}
    </div>
  );
};

export default DateRangeFilter;