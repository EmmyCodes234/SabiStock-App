import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const ProductGrid = ({ products, onProductSelect, disabled }) => {
  const availableProducts = products.filter(product => product.quantity > 0);

  const handleProductClick = (product) => {
    if (product.quantity > 0 && !disabled) {
      onProductSelect(product);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-semibold text-lg text-foreground">
          Available Products
        </h3>
        <span className="text-sm text-muted-foreground">
          {availableProducts.length} items available
        </span>
      </div>

      {availableProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Package" size={24} color="var(--color-muted-foreground)" />
          </div>
          <h4 className="font-medium text-foreground mb-2">No Products Available</h4>
          <p className="text-sm text-muted-foreground">
            Add products to your inventory to start making sales
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {availableProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => handleProductClick(product)}
              disabled={disabled || product.quantity === 0}
              className={`
                bg-background border border-border rounded-lg p-3
                transition-all duration-200 ease-out
                ${disabled 
                  ? 'opacity-50 cursor-not-allowed' :'hover:border-primary hover:shadow-card cursor-pointer'
                }
                focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                text-left
              `}
            >
              <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-3">
                <Image
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-1">
                <h4 className="font-medium text-sm text-foreground truncate">
                  {product.name}
                </h4>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-primary">
                    ₦{product.sellingPrice.toLocaleString()}
                  </span>
                  <span className={`
                    text-xs font-medium
                    ${product.quantity <= 5 ? 'text-warning' : 'text-success'}
                  `}>
                    {product.quantity} left
                  </span>
                </div>
                
                {product.quantity <= 5 && (
                  <div className="flex items-center space-x-1">
                    <Icon name="AlertTriangle" size={12} color="var(--color-warning)" />
                    <span className="text-xs text-warning">Low Stock</span>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;