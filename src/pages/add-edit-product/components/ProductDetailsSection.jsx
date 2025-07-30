import React from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const ProductDetailsSection = ({ 
  formData, 
  errors, 
  onInputChange, 
  onGenerateSKU 
}) => {
  const handleInputChange = (field) => (e) => {
    onInputChange(field, e.target.value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Icon name="Package" size={16} color="white" />
        </div>
        <div>
          <h3 className="font-heading font-semibold text-lg text-foreground">
            Product Details
          </h3>
          <p className="text-sm text-muted-foreground">
            Basic information about your product
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <Input
          label="Product Name"
          type="text"
          placeholder="e.g., Samsung Galaxy A54"
          value={formData.name}
          onChange={handleInputChange('name')}
          error={errors.name}
          required
          description="Enter a clear, descriptive name for your product"
        />

        <div className="space-y-2">
          <Input
            label="SKU (Stock Keeping Unit)"
            type="text"
            placeholder="e.g., SAM-A54-128GB"
            value={formData.sku}
            onChange={handleInputChange('sku')}
            error={errors.sku}
            description="Unique identifier for inventory tracking"
          />
          <button
            type="button"
            onClick={onGenerateSKU}
            className="text-sm text-primary hover:text-primary-foreground hover:bg-primary px-3 py-1 rounded-md transition-colors duration-200 flex items-center space-x-2"
          >
            <Icon name="RefreshCw" size={14} />
            <span>Generate SKU</span>
          </button>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Description
            <span className="text-muted-foreground font-normal ml-1">(Optional)</span>
          </label>
          <textarea
            placeholder="Describe your product features, specifications, or any important details..."
            value={formData.description}
            onChange={handleInputChange('description')}
            rows={4}
            className={`
              w-full px-3 py-2 border rounded-md resize-none
              bg-input text-foreground placeholder:text-muted-foreground
              border-border focus:border-ring focus:ring-2 focus:ring-ring focus:ring-offset-2
              transition-colors duration-200
              ${errors.description ? 'border-error focus:border-error focus:ring-error' : ''}
            `}
          />
          {errors.description && (
            <p className="text-sm text-error flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} />
              <span>{errors.description}</span>
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Help customers understand what makes your product special
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsSection;