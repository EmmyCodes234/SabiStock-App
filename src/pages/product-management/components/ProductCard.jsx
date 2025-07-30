import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ProductCard = ({ product, onEdit, onDelete, onAdjustStock, isSelected, onSelect }) => {
  const isLowStock = product.quantity > 0 && product.quantity <= product.low_stock_threshold;
  const stockStatus = product.quantity === 0 ? 'out-of-stock' : isLowStock ? 'low-stock' : 'in-stock';

  const getStockStatusColor = () => {
    switch (stockStatus) {
      case 'out-of-stock': return 'text-error bg-error/10 border-error/20';
      case 'low-stock': return 'text-warning bg-warning/10 border-warning/20';
      default: return 'text-success bg-success/10 border-success/20';
    }
  };

  const getStockStatusText = () => {
    switch (stockStatus) {
      case 'out-of-stock': return 'Out of Stock';
      case 'low-stock': return 'Low Stock';
      default: return 'In Stock';
    }
  };

  return (
    <div className={`
      bg-card border border-border rounded-lg p-4 
      transition-all duration-200 ease-out flex flex-col
      hover:shadow-card hover:border-primary/20
      ${isSelected ? 'ring-2 ring-primary border-primary' : ''}
    `}>
      <div className="flex items-start justify-between mb-3">
        <button onClick={() => onSelect(product.id)} className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200 ${isSelected ? 'bg-primary border-primary text-primary-foreground' : 'border-border hover:border-primary'}`} aria-label={`Select ${product.name}`}>
          {isSelected && <Icon name="Check" size={12} />}
        </button>
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStockStatusColor()}`}>
          {getStockStatusText()}
        </span>
      </div>
      <div className="w-full h-32 mb-3 overflow-hidden rounded-lg bg-muted">
        <Image src={product.image} alt={product.name} className="w-full h-full object-cover" />
      </div>
      <div className="space-y-2 mb-4 flex-grow">
        <h3 className="font-heading font-semibold text-foreground truncate">{product.name}</h3>
        <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
        <div className="flex items-center justify-between">
          <span className="font-heading font-semibold text-lg text-primary">₦{product.selling_price.toLocaleString()}</span>
          <span className="text-sm text-muted-foreground">Qty: {product.quantity}</span>
        </div>
        {product.cost_price && <p className="text-xs text-muted-foreground">Cost: ₦{product.cost_price.toLocaleString()}</p>}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(product)} iconName="Edit" iconPosition="left">Edit</Button>
        <Button variant="outline" size="sm" onClick={() => onAdjustStock(product)} iconName="Replace" iconPosition="left">Adjust</Button>
      </div>
      <Button variant="destructive" size="sm" onClick={() => onDelete(product)} iconName="Trash2" iconPosition="left" className="w-full mt-2">Delete</Button>
      {isLowStock && (
        <div className="mt-3 p-2 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={14} color="var(--color-warning)" />
            <span className="text-xs text-warning font-medium">Low stock - Only {product.quantity} left</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;