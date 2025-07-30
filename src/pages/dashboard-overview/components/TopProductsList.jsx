import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const TopProductsList = ({ products, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="bg-card rounded-lg border border-border p-6 shadow-card">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-muted rounded w-32 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-16 animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex items-center space-x-4 animate-pulse">
              <div className="w-12 h-12 bg-muted rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-muted rounded w-24 mb-2"></div>
                <div className="h-3 bg-muted rounded w-16"></div>
              </div>
              <div className="h-4 bg-muted rounded w-12"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-semibold text-lg text-foreground">
          Top Selling Products
        </h2>
        <span className="text-sm text-muted-foreground font-body">
          Last 30 days
        </span>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Package" size={24} color="var(--color-muted-foreground)" />
          </div>
          <p className="text-muted-foreground font-body mb-2">No sales data yet</p>
          <p className="text-sm text-muted-foreground">
            Start selling products to see your top performers here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product, index) => (
            <div 
              key={product.id} 
              className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200"
            >
              <div className="flex-shrink-0 relative">
                <Image
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-body font-semibold">
                  {index + 1}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-body font-medium text-foreground truncate">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {product.soldQuantity} units sold
                </p>
              </div>
              
              <div className="text-right">
                <p className="font-body font-semibold text-foreground">
                  {formatCurrency(product.revenue)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Revenue
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopProductsList;