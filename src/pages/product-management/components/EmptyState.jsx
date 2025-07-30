import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const EmptyState = ({ hasSearchTerm, searchTerm, onClearSearch }) => {
  const navigate = useNavigate();

  if (hasSearchTerm) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Search" size={24} color="var(--color-muted-foreground)" />
        </div>
        
        <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
          No products found
        </h3>
        
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          We couldn't find any products matching "{searchTerm}". Try adjusting your search terms or filters.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3">
          <Button
            variant="outline"
            onClick={onClearSearch}
            iconName="X"
            iconPosition="left"
          >
            Clear Search
          </Button>
          
          <Button
            variant="default"
            onClick={() => navigate('/add-edit-product')}
            iconName="Plus"
            iconPosition="left"
          >
            Add New Product
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon name="Package" size={32} color="var(--color-primary)" />
      </div>
      
      <h3 className="font-heading font-semibold text-xl text-foreground mb-3">
        Start Building Your Inventory
      </h3>
      
      <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
        Add your first product to begin managing your inventory. Track stock levels, monitor sales, and grow your business with confidence.
      </p>

      <div className="space-y-4">
        <Button
          variant="default"
          size="lg"
          onClick={() => navigate('/add-edit-product')}
          iconName="Plus"
          iconPosition="left"
        >
          Add Your First Product
        </Button>

        <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={16} color="var(--color-success)" />
            <span>Track inventory</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={16} color="var(--color-success)" />
            <span>Monitor sales</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={16} color="var(--color-success)" />
            <span>Manage stock</span>
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="mt-12 bg-muted rounded-lg p-6 max-w-2xl mx-auto">
        <h4 className="font-heading font-medium text-foreground mb-4 flex items-center justify-center space-x-2">
          <Icon name="Lightbulb" size={18} color="var(--color-primary)" />
          <span>Quick Tips for Getting Started</span>
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div className="flex items-start space-x-3">
            <Icon name="Package" size={16} color="var(--color-primary)" className="mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground">Add Product Details</p>
              <p>Include name, SKU, prices, and stock quantity</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Icon name="Camera" size={16} color="var(--color-primary)" className="mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground">Upload Images</p>
              <p>Clear photos help identify products quickly</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Icon name="AlertTriangle" size={16} color="var(--color-primary)" className="mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground">Set Stock Alerts</p>
              <p>Get notified when inventory runs low</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Icon name="Tag" size={16} color="var(--color-primary)" className="mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground">Organize by Category</p>
              <p>Group similar products for easier management</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;