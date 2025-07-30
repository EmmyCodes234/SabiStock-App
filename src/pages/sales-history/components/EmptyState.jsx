import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const EmptyState = ({ hasFilters, onClearFilters }) => {
  const navigate = useNavigate();

  const onCreateSale = () => {
    navigate('/point-of-sale-pos');
  };

  if (hasFilters) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="SearchX" size={32} color="var(--color-muted-foreground)" />
        </div>
        <h3 className="font-heading font-semibold text-xl text-foreground mb-3">
          No Transactions Found
        </h3>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
          Your search or filter criteria did not match any transactions. Try adjusting your search or clearing the filters.
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
    <div className="text-center py-16">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon name="Receipt" size={32} color="var(--color-primary)" />
      </div>
      
      <h3 className="font-heading font-semibold text-xl text-foreground mb-3">
        Your Sales History Will Appear Here
      </h3>
      
      <p className="text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
        Once you make your first sale using the Point of Sale (POS) system, all transaction details will be automatically recorded and displayed on this page.
      </p>

      <Button
        variant="default"
        size="lg"
        onClick={onCreateSale}
        iconName="ShoppingCart"
        iconPosition="left"
      >
        Make Your First Sale
      </Button>

      {/* How it Works Section */}
      <div className="mt-12 bg-muted rounded-lg p-6 max-w-2xl mx-auto">
        <h4 className="font-heading font-medium text-foreground mb-4 flex items-center justify-center space-x-2">
          <Icon name="Wand2" size={18} color="var(--color-primary)" />
          <span>How Sales Tracking Works</span>
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-muted-foreground">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-card rounded-lg flex items-center justify-center mb-3">
              <Icon name="ShoppingCart" size={20} color="var(--color-primary)" />
            </div>
            <p className="font-medium text-foreground mb-1">1. Make a Sale</p>
            <p>Use the POS to sell products to customers.</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-card rounded-lg flex items-center justify-center mb-3">
              <Icon name="FileCheck" size={20} color="var(--color-primary)" />
            </div>
            <p className="font-medium text-foreground mb-1">2. Auto-Record</p>
            <p>SabiStock instantly saves every transaction detail.</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-card rounded-lg flex items-center justify-center mb-3">
              <Icon name="BarChart3" size={20} color="var(--color-primary)" />
            </div>
            <p className="font-medium text-foreground mb-1">3. Analyze History</p>
            <p>View, filter, and export your sales data here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;