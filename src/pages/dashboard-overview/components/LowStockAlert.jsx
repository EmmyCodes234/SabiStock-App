import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const LowStockAlert = ({ lowStockProducts, isLoading = false }) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="bg-card rounded-lg border border-border p-6 shadow-card">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-5 h-5 bg-muted rounded animate-pulse"></div>
          <div className="h-5 bg-muted rounded w-32 animate-pulse"></div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center space-x-3 animate-pulse">
              <div className="w-10 h-10 bg-muted rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-muted rounded w-24 mb-1"></div>
                <div className="h-3 bg-muted rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!lowStockProducts || lowStockProducts.length === 0) {
    return null;
  }

  return (
    <div className="bg-card rounded-lg border border-warning/20 p-6 shadow-card">
      <div className="flex items-center space-x-2 mb-4">
        <Icon 
          name="AlertTriangle" 
          size={20} 
          color="var(--color-warning)" 
        />
        <h2 className="font-heading font-semibold text-lg text-foreground">
          Low Stock Alert
        </h2>
        <span className="bg-warning/10 text-warning px-2 py-1 rounded-full text-xs font-body font-medium">
          {lowStockProducts.length} items
        </span>
      </div>

      <div className="space-y-3 mb-4">
        {lowStockProducts.slice(0, 3).map((product) => (
          <div key={product.id} className="flex items-center space-x-3 p-2 rounded-lg bg-warning/5">
            <Image
              src={product.image}
              alt={product.name}
              className="w-10 h-10 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="font-body font-medium text-sm text-foreground truncate">
                {product.name}
              </p>
              <p className="text-xs text-warning">
                Only {product.quantity} left in stock
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-muted-foreground">
                Min: {product.minStock}
              </span>
            </div>
          </div>
        ))}
      </div>

      {lowStockProducts.length > 3 && (
        <p className="text-sm text-muted-foreground mb-4">
          And {lowStockProducts.length - 3} more items need restocking
        </p>
      )}

      <Button
        variant="outline"
        onClick={() => navigate('/product-management')}
        iconName="Package"
        iconPosition="left"
        fullWidth
        className="border-warning/20 text-warning hover:bg-warning/10"
      >
        Manage Inventory
      </Button>
    </div>
  );
};

export default LowStockAlert;