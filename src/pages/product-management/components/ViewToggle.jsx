import React from 'react';
import Button from '../../../components/ui/Button';


const ViewToggle = ({ currentView, onViewChange }) => {
  return (
    <div className="hidden lg:flex items-center space-x-1 bg-muted rounded-lg p-1">
      <Button
        variant={currentView === 'grid' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('grid')}
        iconName="Grid3X3"
        className="h-8 px-3"
        aria-label="Grid view"
      >
        Grid
      </Button>
      
      <Button
        variant={currentView === 'table' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('table')}
        iconName="List"
        className="h-8 px-3"
        aria-label="Table view"
      >
        Table
      </Button>
    </div>
  );
};

export default ViewToggle;