import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const POSDemoStep = ({ onNext, onPrev, onSkip, sampleProducts }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentStep, setCurrentStep] = useState(0);

  const demoSteps = [
    {
      title: 'Search & Select Products',
      description: 'Start by searching for products your customer wants to buy',
      action: 'search'
    },
    {
      title: 'Adjust Quantities',
      description: 'Set the quantity for each product in the cart',
      action: 'quantity'
    },
    {
      title: 'Review & Complete',
      description: 'Review the total and complete the transaction',
      action: 'complete'
    }
  ];

  const demoProducts = sampleProducts.length > 0 ? sampleProducts : [
    {
      name: 'Samsung Galaxy Phone',
      sku: 'PHONE-001',
      sellingPrice: '220000',
      quantity: '15',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop'
    },
    {
      name: 'Nike Air Max Sneakers',
      sku: 'SHOE-002',
      sellingPrice: '35000',
      quantity: '8',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop'
    },
    {
      name: 'Organic Face Cream',
      sku: 'BEAUTY-003',
      sellingPrice: '5500',
      quantity: '25',
      image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop'
    }
  ];

  const filteredProducts = demoProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product) => {
    const existingItem = selectedProducts.find(item => item.sku === product.sku);
    if (existingItem) {
      setSelectedProducts(prev =>
        prev.map(item =>
          item.sku === product.sku
            ? { ...item, cartQuantity: item.cartQuantity + 1 }
            : item
        )
      );
    } else {
      setSelectedProducts(prev => [
        ...prev,
        { ...product, cartQuantity: 1 }
      ]);
    }
  };

  const updateCartQuantity = (sku, newQuantity) => {
    if (newQuantity <= 0) {
      setSelectedProducts(prev => prev.filter(item => item.sku !== sku));
    } else {
      setSelectedProducts(prev =>
        prev.map(item =>
          item.sku === sku
            ? { ...item, cartQuantity: newQuantity }
            : item
        )
      );
    }
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((total, item) => {
      return total + (parseFloat(item.sellingPrice) * item.cartQuantity);
    }, 0);
  };

  const nextDemoStep = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onNext();
    }
  };

  const prevDemoStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentDemoStep = demoSteps[currentStep];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Icon name="ShoppingCart" size={32} color="white" />
          </div>
          <h2 className="font-heading font-bold text-3xl text-foreground mb-2">
            Try the Point of Sale System
          </h2>
          <p className="text-muted-foreground text-lg">
            Practice processing a sale with your sample products
          </p>
        </div>

        {/* Demo Progress */}
        <div className="bg-card rounded-2xl shadow-lg border border-border p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-lg text-foreground">
              {currentDemoStep.title}
            </h3>
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {demoSteps.length}
            </span>
          </div>
          
          <p className="text-muted-foreground mb-4">
            {currentDemoStep.description}
          </p>
          
          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${((currentStep + 1) / demoSteps.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Product Selection */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
              <h3 className="font-heading font-semibold text-lg text-foreground mb-4">
                Available Products
              </h3>
              
              {/* Search */}
              <div className="mb-6">
                <Input
                  type="search"
                  placeholder="Search products by name or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`${currentStep === 0 ? 'ring-2 ring-primary' : ''}`}
                />
              </div>

              {/* Product Grid */}
              <div className="grid sm:grid-cols-2 gap-4">
                {filteredProducts.map((product, index) => (
                  <div
                    key={product.sku}
                    className={`border border-border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
                      currentStep === 0 ? 'hover:border-primary' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <Image
                        src={product.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop'}
                        alt={product.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground truncate">
                          {product.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {product.sku}
                        </p>
                        <p className="text-lg font-semibold text-primary">
                          ₦{parseInt(product.sellingPrice).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Stock: {product.quantity}
                        </p>
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addToCart(product)}
                      iconName="Plus"
                      iconPosition="left"
                      className="w-full mt-4"
                      disabled={currentStep !== 0}
                    >
                      Add to Cart
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Shopping Cart */}
          <div>
            <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
              <h3 className="font-heading font-semibold text-lg text-foreground mb-4">
                Shopping Cart
              </h3>
              
              {selectedProducts.length === 0 ? (
                <div className="text-center py-8">
                  <Icon name="ShoppingCart" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Cart is empty
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Add products to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedProducts.map((item) => (
                    <div key={item.sku} className="border border-border rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <Image
                          src={item.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop'}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground text-sm truncate">
                            {item.name}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            ₦{parseInt(item.sellingPrice).toLocaleString()} each
                          </p>
                        </div>
                      </div>
                      
                      <div className={`flex items-center justify-between ${currentStep === 1 ? 'ring-2 ring-primary rounded-lg p-2' : ''}`}>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateCartQuantity(item.sku, item.cartQuantity - 1)}
                            disabled={currentStep !== 1}
                          >
                            <Icon name="Minus" size={16} />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {item.cartQuantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateCartQuantity(item.sku, item.cartQuantity + 1)}
                            disabled={currentStep !== 1}
                          >
                            <Icon name="Plus" size={16} />
                          </Button>
                        </div>
                        <span className="font-semibold text-foreground">
                          ₦{(parseFloat(item.sellingPrice) * item.cartQuantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {/* Total */}
                  <div className={`border-t border-border pt-4 ${currentStep === 2 ? 'ring-2 ring-primary rounded-lg p-4' : ''}`}>
                    <div className="flex items-center justify-between text-lg font-bold">
                      <span className="text-foreground">Total:</span>
                      <span className="text-primary">
                        ₦{calculateTotal().toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Demo Navigation */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button
            variant="outline"
            size="lg"
            onClick={currentStep === 0 ? onPrev : prevDemoStep}
            iconName="ArrowLeft"
            iconPosition="left"
            className="flex-1 sm:flex-none"
          >
            {currentStep === 0 ? 'Back' : 'Previous Step'}
          </Button>
          
          <div className="flex gap-4 flex-1">
            <Button
              variant="ghost"
              size="lg"
              onClick={onSkip}
              className="flex-1 sm:flex-none"
            >
              Skip Demo
            </Button>
            
            <Button
              variant="default"
              size="lg"
              onClick={nextDemoStep}
              iconName={currentStep === demoSteps.length - 1 ? "CheckCircle" : "ArrowRight"}
              iconPosition="right"
              className="flex-1"
              disabled={currentStep === 0 && selectedProducts.length === 0}
            >
              {currentStep === demoSteps.length - 1 ? 'Complete Demo' : 'Next Step'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSDemoStep;