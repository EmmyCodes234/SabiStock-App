import React from 'react';

const TimeFilter = ({ activeFilter, onFilterChange, isLoading = false }) => {
  const filters = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' }
  ];

  if (isLoading) {
    return (
      <div className="flex space-x-1 mb-6">
        {filters.map((filter) => (
          <div 
            key={filter.id}
            className="h-10 bg-muted rounded-lg animate-pulse w-20"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex space-x-1 mb-6 bg-muted rounded-lg p-1">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`
            flex-1 px-4 py-2 text-sm font-body font-medium rounded-md
            transition-all duration-200 ease-out
            ${activeFilter === filter.id
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
            }
          `}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default TimeFilter;