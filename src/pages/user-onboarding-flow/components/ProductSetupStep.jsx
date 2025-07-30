import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ProductSetupStep = ({ onNext, onPrev, onSkip, sampleProducts, setSampleProducts }) => {
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [errors, setErrors] = useState({});

  const productTemplates = [
    {
      name: 'Samsung Galaxy Phone',
      sku: 'PHONE-001',
      costPrice: '180000',
      sellingPrice: '220000',
      quantity: '15',
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop'
    },
    {
      name: 'Nike Air Max Sneakers',
      sku: 'SHOE-002',
      costPrice: '25000',
      sellingPrice: '35000',
      quantity: '8',
      category: 'Fashion',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop'
    },
    {
      name: 'Organic Face Cream',
      sku: 'BEAUTY-003',
      costPrice: '3500',
      sellingPrice: '5500',
      quantity: '25',
      category: 'Beauty',
      image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop'
    }
  ];

  const currentProduct = sampleProducts[currentProductIndex] || {
    name: '',
    sku: '',
    costPrice: '',
    sellingPrice: '',
    quantity: '',
    category: 'General'
  };

  const validateCurrentProduct = () => {
    const newErrors = {};
    
    if (!currentProduct.name?.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!currentProduct.sellingPrice || parseFloat(currentProduct.sellingPrice) <= 0) {
      newErrors.sellingPrice = 'Valid selling price is required';
    }
    
    if (!currentProduct.quantity || parseInt(currentProduct.quantity) < 0) {
      newErrors.quantity = 'Valid quantity is required';
    }

    if (currentProduct.costPrice && currentProduct.sellingPrice) {
      const cost = parseFloat(currentProduct.costPrice);
      const selling = parseFloat(currentProduct.sellingPrice);
      if (cost >= selling) {
        newErrors.sellingPrice = 'Selling price should be higher than cost price';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    const updatedProducts = [...sampleProducts];
    updatedProducts[currentProductIndex] = {
      ...currentProduct,
      [field]: value
    };
    setSampleProducts(updatedProducts);
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const useTemplate = (template) => {
    const updatedProducts = [...sampleProducts];
    updatedProducts[currentProductIndex] = { ...template };
    setSampleProducts(updatedProducts);
    setErrors({});
  };

  const addAnotherProduct = () => {
    if (validateCurrentProduct()) {
      setSampleProducts(prev => [...prev, {
        name: '',
        sku: '',
        costPrice: '',
        sellingPrice: '',
        quantity: '',
        category: 'General'
      }]);
      setCurrentProductIndex(sampleProducts.length);
      setErrors({});
    }
  };

  const removeProduct = (index) => {
    if (sampleProducts.length > 1) {
      const updatedProducts = sampleProducts.filter((_, i) => i !== index);
      setSampleProducts(updatedProducts);
      if (currentProductIndex >= updatedProducts.length) {
        setCurrentProductIndex(updatedProducts.length - 1);
      }
    }
  };

  const handleNext = () => {
    if (validateCurrentProduct()) {
      onNext();
    }
  };

  const calculateProfit = () => {
    const cost = parseFloat(currentProduct.costPrice) || 0;
    const selling = parseFloat(currentProduct.sellingPrice) || 0;
    const profit = selling - cost;
    const margin = cost > 0 ? ((profit / selling) * 100).toFixed(1) : 0;
    return { profit, margin };
  };

  const { profit, margin } = calculateProfit();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Icon name="Package" size={32} color="white" />
          </div>
          <h2 className="font-heading font-bold text-3xl text-foreground mb-2">
            Add Your First Products
          </h2>
          <p className="text-muted-foreground text-lg">
            Start with a few products to get familiar with the system
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Product Form */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl shadow-lg border border-border p-8">
              {/* Product Navigation */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading font-semibold text-xl text-foreground">
                  Product {currentProductIndex + 1} of {sampleProducts.length}
                </h3>
                <div className="flex items-center space-x-2">
                  {sampleProducts.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentProductIndex(index)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-200 ${
                        index === currentProductIndex
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted-foreground hover:text-muted'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                <Input
                  label="Product Name"
                  type="text"
                  placeholder="e.g., Samsung Galaxy S23"
                  value={currentProduct.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  error={errors.name}
                  required
                />

                <Input
                  label="SKU (Stock Keeping Unit)"
                  type="text"
                  placeholder="e.g., PHONE-001"
                  value={currentProduct.sku}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                  description="Unique identifier for this product (optional)"
                />

                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Cost Price (₦)"
                    type="number"
                    placeholder="0.00"
                    value={currentProduct.costPrice}
                    onChange={(e) => handleInputChange('costPrice', e.target.value)}
                    description="What you paid for this product"
                  />

                  <Input
                    label="Selling Price (₦)"
                    type="number"
                    placeholder="0.00"
                    value={currentProduct.sellingPrice}
                    onChange={(e) => handleInputChange('sellingPrice', e.target.value)}
                    error={errors.sellingPrice}
                    required
                    description="Price you sell to customers"
                  />
                </div>

                <Input
                  label="Initial Stock Quantity"
                  type="number"
                  placeholder="0"
                  value={currentProduct.quantity}
                  onChange={(e) => handleInputChange('quantity', e.target.value)}
                  error={errors.quantity}
                  required
                  description="How many units do you have in stock?"
                />

                {/* Profit Calculation */}
                {currentProduct.costPrice && currentProduct.sellingPrice && (
                  <div className="bg-muted rounded-lg p-4">
                    <h4 className="font-heading font-medium text-foreground mb-2">
                      Profit Analysis
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Profit per unit:</span>
                        <span className={`ml-2 font-medium ${profit > 0 ? 'text-success' : 'text-error'}`}>
                          ₦{profit.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Profit margin:</span>
                        <span className={`ml-2 font-medium ${profit > 0 ? 'text-success' : 'text-error'}`}>
                          {margin}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Product Actions */}
                <div className="flex flex-wrap gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={addAnotherProduct}
                    iconName="Plus"
                    iconPosition="left"
                    size="sm"
                  >
                    Add Another
                  </Button>
                  
                  {sampleProducts.length > 1 && (
                    <Button
                      variant="destructive"
                      onClick={() => removeProduct(currentProductIndex)}
                      iconName="Trash2"
                      iconPosition="left"
                      size="sm"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Templates & Tips */}
          <div className="space-y-6">
            {/* Quick Templates */}
            <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
              <h4 className="font-heading font-semibold text-foreground mb-4">
                Quick Templates
              </h4>
              <div className="space-y-3">
                {productTemplates.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => useTemplate(template)}
                    className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <Image
                        src={template.image}
                        alt={template.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">
                          {template.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ₦{parseInt(template.sellingPrice).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                  <Icon name="Lightbulb" size={16} color="white" />
                </div>
                <h4 className="font-heading font-semibold text-foreground">
                  Pricing Tips
                </h4>
              </div>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Aim for 20-50% profit margin for healthy business</li>
                <li>• Research competitor prices before setting yours</li>
                <li>• Consider your target customers' budget</li>
                <li>• You can always adjust prices later</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button
            variant="outline"
            size="lg"
            onClick={onPrev}
            iconName="ArrowLeft"
            iconPosition="left"
            className="flex-1 sm:flex-none"
          >
            Back
          </Button>
          
          <div className="flex gap-4 flex-1">
            <Button
              variant="ghost"
              size="lg"
              onClick={onSkip}
              className="flex-1 sm:flex-none"
            >
              Skip for Now
            </Button>
            
            <Button
              variant="default"
              size="lg"
              onClick={handleNext}
              iconName="ArrowRight"
              iconPosition="right"
              className="flex-1"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSetupStep;