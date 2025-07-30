import React from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import HelpTooltip from '../../../components/ui/HelpTooltip'; // <-- New Import

const InventorySection = ({ 
  formData, 
  errors, 
  onInputChange 
}) => {
  const handleInputChange = (field) => (e) => {
    onInputChange(field, e.target.value);
  };

  const adjustQuantity = (adjustment) => {
    const currentQuantity = parseInt(formData.quantity) || 0;
    const newQuantity = Math.max(0, currentQuantity + adjustment);
    onInputChange('quantity', newQuantity.toString());
  };

  const getStockStatus = () => {
    const quantity = parseInt(formData.quantity) || 0;
    const threshold = parseInt(formData.lowStockThreshold) || 0;
    
    if (quantity === 0) {
      return { status: 'Out of Stock', color: 'text-error', icon: 'XCircle' };
    } else if (quantity <= threshold && threshold > 0) {
      return { status: 'Low Stock', color: 'text-warning', icon: 'AlertTriangle' };
    } else {
      return { status: 'In Stock', color: 'text-success', icon: 'CheckCircle' };
    }
  };

  const stockStatus = getStockStatus();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-success rounded-lg flex items-center justify-center">
          <Icon name="Package2" size={16} color="white" />
        </div>
        <div>
          <h3 className="font-heading font-semibold text-lg text-foreground">
            Inventory Management
          </h3>
          <p className="text-sm text-muted-foreground">
            Track stock levels and set alerts
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Current Stock Status */}
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Package" size={16} color="var(--color-muted-foreground)" />
              <span className="text-sm font-medium text-foreground">Current Status</span>
            </div>
            <div className={`flex items-center space-x-2 ${stockStatus.color}`}>
              <Icon name={stockStatus.icon} size={16} />
              <span className="text-sm font-semibold">{stockStatus.status}</span>
            </div>
          </div>
        </div>

        {/* Quantity Input with Controls */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Current Quantity
            <span className="text-error ml-1">*</span>
          </label>
          
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => adjustQuantity(-1)}
              disabled={parseInt(formData.quantity) <= 0}
              className="w-10 h-10 bg-muted hover:bg-border disabled:opacity-50 disabled:cursor-not-allowed rounded-md flex items-center justify-center transition-colors duration-200"
            >
              <Icon name="Minus" size={16} color="var(--color-foreground)" />
            </button>
            
            <Input
              type="number"
              placeholder="0"
              value={formData.quantity}
              onChange={handleInputChange('quantity')}
              error={errors.quantity}
              min="0"
              className="text-center font-semibold"
            />
            
            <button
              type="button"
              onClick={() => adjustQuantity(1)}
              className="w-10 h-10 bg-muted hover:bg-border rounded-md flex items-center justify-center transition-colors duration-200"
            >
              <Icon name="Plus" size={16} color="var(--color-foreground)" />
            </button>
          </div>
          
          {errors.quantity && (
            <p className="text-sm text-error flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} />
              <span>{errors.quantity}</span>
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Number of units currently in stock
          </p>
        </div>

        <Input
          label={
            <div className="flex items-center gap-2">
              Low Stock Alert Threshold
              <HelpTooltip content="Set a number here to get a 'Low Stock' warning when the quantity falls to or below this level. This helps you reorder before you run out." />
            </div>
          }
          type="number"
          placeholder="5"
          value={formData.lowStockThreshold}
          onChange={handleInputChange('lowStockThreshold')}
          error={errors.lowStockThreshold}
          min="0"
          description="Get notified when stock falls below this number"
        />

        {/* Stock Management Tips */}
        <div className="bg-accent bg-opacity-10 rounded-lg p-4 space-y-2">
          <div className="flex items-center space-x-2">
            <Icon name="Lightbulb" size={16} color="var(--color-accent)" />
            <h4 className="font-medium text-sm text-foreground">Stock Management Tips</h4>
          </div>
          <ul className="text-xs text-muted-foreground space-y-1 ml-6">
            <li>• Set threshold to 20-30% of your average monthly sales</li>
            <li>• Update quantities after receiving new stock</li>
            <li>• Regular stock counts help maintain accuracy</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InventorySection;