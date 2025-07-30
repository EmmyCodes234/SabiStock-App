import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import QuickActionButton from '../../components/ui/QuickActionButton';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import SkeletonLoader, { SkeletonProductGrid } from '../../components/ui/SkeletonLoader';
import { productService, salesService } from '../../utils/localStorage';
import { notificationHelpers } from '../../utils/notifications';

import ProductSearchBar from './components/ProductSearchBar';
import ProductGrid from './components/ProductGrid';
import TransactionSummary from './components/TransactionSummary';
import PaymentModal from './components/PaymentModal';
import TransactionComplete from './components/TransactionComplete';

const PointOfSalePOS = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showTransactionComplete, setShowTransactionComplete] = useState(false);
  const [transactionData, setTransactionData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load products on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      // Simulate loading delay for skeleton effect
      await new Promise(resolve => setTimeout(resolve, 600));
      const productsData = productService.getAll();
      setProducts(productsData);
    } catch (error) {
      notificationHelpers.error(`Failed to load products: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductSelect = (product) => {
    // Check if product has stock
    if (product.quantity <= 0) {
      notificationHelpers.warning(`${product.name} is out of stock`);
      return;
    }

    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      if (existingItem.cartQuantity < product.quantity) {
        setCartItems(cartItems.map(item =>
          item.id === product.id
            ? { ...item, cartQuantity: item.cartQuantity + 1 }
            : item
        ));
      } else {
        notificationHelpers.warning(`Cannot add more ${product.name}. Only ${product.quantity} available.`);
      }
    } else {
      setCartItems([...cartItems, { ...product, cartQuantity: 1 }]);
    }
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    const product = products.find(p => p.id.toString() === itemId.toString());
    const maxQuantity = product ? product.quantity : 0;
    
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    
    if (newQuantity <= maxQuantity) {
      setCartItems(cartItems.map(item =>
        item.id.toString() === itemId.toString()
          ? { ...item, cartQuantity: newQuantity }
          : item
      ));
    } else {
      notificationHelpers.warning(`Only ${maxQuantity} units available for ${product?.name}`);
    }
  };

  const handleRemoveItem = (itemId) => {
    setCartItems(cartItems.filter(item => item.id.toString() !== itemId.toString()));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      notificationHelpers.warning('Cart is empty. Add products to proceed.');
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = async (paymentData) => {
    setIsProcessing(true);
    
    try {
      // Create sale with atomic operation
      const saleData = {
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          sku: item.sku,
          price: item.sellingPrice,
          quantity: item.cartQuantity
        })),
        total: paymentData.total,
        paymentMethod: paymentData.method,
        customer: paymentData.customer || null,
        notes: paymentData.notes || ''
      };

      const completedSale = await salesService.createSale(saleData);
      
      setTransactionData({
        ...completedSale,
        ...paymentData
      });
      
      notificationHelpers.saleCompleted(completedSale.total);
      
      setShowPaymentModal(false);
      setShowTransactionComplete(true);
      setCartItems([]);
      
      // Reload products to update stock quantities
      await loadProducts();
      
    } catch (error) {
      notificationHelpers.error(`Sale failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartNewSale = () => {
    setShowTransactionComplete(false);
    setTransactionData(null);
    setCartItems([]);
  };

  const handleViewReceipt = () => {
    setShowTransactionComplete(false);
    navigate('/sales-history');
  };

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.sellingPrice * item.cartQuantity), 0);
    const tax = subtotal * 0.075; // 7.5% VAT
    return subtotal + tax;
  };

  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-background">
      <NavigationSidebar />
      
      <main className="lg:ml-240 min-h-screen">
        <div className="p-4 lg:p-6">
          {/* Header */}
          <div className="mb-6">
            <BreadcrumbTrail />
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="font-heading font-bold text-2xl lg:text-3xl text-foreground mb-2">
                  Point of Sale
                </h1>
                <p className="text-muted-foreground">
                  Process customer transactions quickly and efficiently
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <QuickActionButton />
                
                {cartItems.length > 0 && !isLoading && (
                  <Button
                    variant="default"
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    iconName="CreditCard"
                    iconPosition="left"
                    className="hidden sm:flex"
                  >
                    Checkout (₦{total.toLocaleString()})
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Product Selection Area */}
            <div className="xl:col-span-2 space-y-6">
              {/* Search Bar */}
              {!isLoading && (
                <div className="bg-card rounded-lg border border-border p-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <Icon name="Search" size={20} color="var(--color-primary)" />
                    <h3 className="font-heading font-semibold text-lg text-foreground">
                      Find Products
                    </h3>
                  </div>
                  
                  <ProductSearchBar
                    products={products}
                    onProductSelect={handleProductSelect}
                    disabled={isProcessing}
                  />
                </div>
              )}

              {/* Product Grid */}
              {isLoading ? (
                <SkeletonProductGrid count={6} />
              ) : (
                <ProductGrid
                  products={products}
                  onProductSelect={handleProductSelect}
                  disabled={isProcessing}
                />
              )}
            </div>

            {/* Transaction Summary */}
            <div className="xl:col-span-1">
              <div className="sticky top-6">
                <TransactionSummary
                  cartItems={cartItems}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                  onClearCart={handleClearCart}
                  disabled={isProcessing}
                />
                
                {/* Mobile Checkout Button */}
                {cartItems.length > 0 && !isLoading && (
                  <div className="mt-4 sm:hidden">
                    <Button
                      variant="default"
                      onClick={handleCheckout}
                      disabled={isProcessing}
                      iconName="CreditCard"
                      iconPosition="left"
                      fullWidth
                    >
                      Checkout - ₦{total.toLocaleString()}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Help Section */}
          {!isLoading && (
            <div className="mt-8 bg-muted rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <Icon name="HelpCircle" size={20} color="var(--color-primary)" />
                <div>
                  <h4 className="font-medium text-foreground mb-2">Quick Tips</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Search for products by name or SKU code</li>
                    <li>• Click on products to add them to the cart</li>
                    <li>• Use quantity controls to adjust item amounts</li>
                    <li>• Review your cart before proceeding to checkout</li>
                    <li>• Stock levels are automatically updated after each sale</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        total={total}
        onPaymentComplete={handlePaymentComplete}
        cartItems={cartItems}
        isProcessing={isProcessing}
      />

      {/* Transaction Complete Modal */}
      <TransactionComplete
        isVisible={showTransactionComplete}
        transactionData={transactionData}
        onStartNewSale={handleStartNewSale}
        onViewReceipt={handleViewReceipt}
        onClose={() => setShowTransactionComplete(false)}
      />
    </div>
  );
};

export default PointOfSalePOS;