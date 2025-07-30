import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const EmptyState = ({ hasFilters, onClearFilters, onCreateSale }) => {
  if (hasFilters) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Search" size={24} color="var(--color-muted-foreground)" />
        </div>
        <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
          No transactions found
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          No sales match your current search criteria. Try adjusting your filters or search terms.
        </p>
        <Button
          variant="outline"
          onClick={onClearFilters}
          iconName="RotateCcw"
          iconPosition="left"
        >
          Clear Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon name="Receipt" size={24} color="var(--color-primary)" />
      </div>
      <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
        No sales recorded yet
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Start making sales to see your transaction history here. Every sale will be automatically tracked and displayed.
      </p>
      
      <div className="space-y-4">
        <Button
          variant="default"
          onClick={onCreateSale}
          iconName="Plus"
          iconPosition="left"
        >
          Make Your First Sale
        </Button>
        
        <div className="bg-muted rounded-lg p-4 max-w-md mx-auto">
          <h4 className="font-heading font-medium text-foreground mb-2">
            Sample Transaction Data
          </h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Transaction ID: #TXN001</p>
            <p>• Date: 30/07/2025 • Time: 14:30</p>
            <p>• Amount: ₦15,500 • Items: 3</p>
            <p>• Payment: Cash • Status: Completed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;