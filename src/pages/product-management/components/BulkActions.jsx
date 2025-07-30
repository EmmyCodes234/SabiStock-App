import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const BulkActions = ({ selectedCount, onBulkDelete, onSelectAll, onClearSelection }) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-200 lg:relative lg:bottom-auto lg:left-auto lg:transform-none lg:z-auto">
      <div className="bg-card border border-border rounded-lg shadow-modal p-4 lg:shadow-none lg:border-0 lg:bg-muted lg:rounded-lg">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="CheckSquare" size={20} color="var(--color-primary)" />
            <span className="font-medium text-foreground">
              {selectedCount} product{selectedCount !== 1 ? 's' : ''} selected
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onSelectAll}
              iconName="CheckSquare"
              iconPosition="left"
            >
              Select All
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={onBulkDelete}
              iconName="Trash2"
              iconPosition="left"
            >
              Delete Selected
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              iconName="X"
              className="h-8 w-8 p-0"
              aria-label="Clear selection"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkActions;