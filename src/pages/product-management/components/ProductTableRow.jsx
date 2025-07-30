import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ProductTableRow = ({ product, onEdit, onDelete, isSelected, onSelect }) => {
  const isLowStock = product.quantity <= product.lowStockThreshold;
  const stockStatus = product.quantity === 0 ? 'out-of-stock' : isLowStock ? 'low-stock' : 'in-stock';

  const getStockStatusColor = () => {
    switch (stockStatus) {
      case 'out-of-stock':
        return 'text-error bg-error/10';
      case 'low-stock':
        return 'text-warning bg-warning/10';
      default:
        return 'text-success bg-success/10';
    }
  };

  const getStockStatusText = () => {
    switch (stockStatus) {
      case 'out-of-stock':
        return 'Out of Stock';
      case 'low-stock':
        return 'Low Stock';
      default:
        return 'In Stock';
    }
  };

  return (
    <tr className={`
      border-b border-border hover:bg-muted/50 transition-colors duration-200
      ${isSelected ? 'bg-primary/5' : ''}
    `}>
      {/* Selection Checkbox */}
      <td className="p-4">
        <button
          onClick={() => onSelect(product.id)}
          className={`
            w-5 h-5 rounded border-2 flex items-center justify-center
            transition-colors duration-200
            ${isSelected 
              ? 'bg-primary border-primary text-primary-foreground' 
              : 'border-border hover:border-primary'
            }
          `}
          aria-label={`Select ${product.name}`}
        >
          {isSelected && <Icon name="Check" size={12} />}
        </button>
      </td>

      {/* Product Image & Name */}
      <td className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 overflow-hidden rounded-lg bg-muted flex-shrink-0">
            <Image
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <h3 className="font-heading font-medium text-foreground truncate">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              SKU: {product.sku}
            </p>
          </div>
        </div>
      </td>

      {/* Cost Price */}
      <td className="p-4 text-muted-foreground">
        {product.costPrice ? `₦${product.costPrice.toLocaleString()}` : '-'}
      </td>

      {/* Selling Price */}
      <td className="p-4">
        <span className="font-heading font-semibold text-primary">
          ₦{product.sellingPrice.toLocaleString()}
        </span>
      </td>

      {/* Stock Quantity */}
      <td className="p-4">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-foreground">
            {product.quantity}
          </span>
          {isLowStock && (
            <Icon name="AlertTriangle" size={16} color="var(--color-warning)" />
          )}
        </div>
      </td>

      {/* Stock Status */}
      <td className="p-4">
        <span className={`
          px-2 py-1 rounded-full text-xs font-medium
          ${getStockStatusColor()}
        `}>
          {getStockStatusText()}
        </span>
      </td>

      {/* Date Added */}
      <td className="p-4 text-muted-foreground">
        {new Date(product.dateAdded).toLocaleDateString('en-GB')}
      </td>

      {/* Actions */}
      <td className="p-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(product)}
            iconName="Edit"
            className="h-8 w-8 p-0"
            aria-label={`Edit ${product.name}`}
          />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(product)}
            iconName="Trash2"
            className="h-8 w-8 p-0 text-error hover:text-error hover:bg-error/10"
            aria-label={`Delete ${product.name}`}
          />
        </div>
      </td>
    </tr>
  );
};

export default ProductTableRow;