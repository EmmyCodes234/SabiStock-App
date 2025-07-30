import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import QuickActionButton from '../../components/ui/QuickActionButton';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import SkeletonLoader, { SkeletonProductGrid } from '../../components/ui/SkeletonLoader';
import { productService, salesService } from '../../utils/apiService';
import { notificationHelpers } from '../../utils/notifications';

import ProductSearchBar from './components/ProductSearchBar';
import ProductGrid from './components/ProductGrid';
import TransactionSummary from './components/TransactionSummary';
import PaymentModal from './components/PaymentModal';
import TransactionComplete from './components/TransactionComplete';
import QuickAddProductModal from './components/QuickAddProductModal';
import BarcodeScannerModal from '../../components/ui/BarcodeScannerModal';

const PointOfSalePOS = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showTransactionComplete, setShowTransactionComplete] = useState(false);
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [quickAddSearchTerm, setQuickAddSearchTerm] = useState('');
  const [transactionData, setTransactionData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (location.state?.productToAdd && products.length > 0) {
      const product = products.find(p => p.id === location.state.productToAdd.id);
      if (product) {
        handleProductSelect(product);
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  }, [location.state, products]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const productsData = await productService.getAll();
      setProducts(productsData);
    } catch (error) {
      notificationHelpers.error(`Failed to load products: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductSelect = (product) => {
    if (!product) return;
    if (product.quantity <= 0) {
      notificationHelpers.warning(`${product.name} is out of stock`);
      return;
    }
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      if (existingItem.cartQuantity < product.quantity) {
        setCartItems(cartItems.map(item =>
          item.id === product.id ? { ...item, cartQuantity: item.cartQuantity + 1 } : item
        ));
      } else {
        notificationHelpers.warning(`Cannot add more ${product.name}. Only ${product.quantity} available.`);
      }
    } else {
      setCartItems([...cartItems, { ...product, cartQuantity: 1 }]);
    }
  };
  
  const handleScanSuccess = (scannedSku) => {
    const foundProduct = products.find(p => p.sku === scannedSku);
    if (foundProduct) {
        notificationHelpers.success(`Found: ${foundProduct.name}`);
        handleProductSelect(foundProduct);
    } else {
        notificationHelpers.error(`Product with SKU "${scannedSku}" not found.`);
    }
  };

  const handleOpenQuickAdd = (searchTerm) => {
    setQuickAddSearchTerm(searchTerm);
    setShowQuickAddModal(true);
  };
  
  const handleProductAdded = (newProduct) => {
    setProducts(prevProducts => [newProduct, ...prevProducts]);
    handleProductSelect(newProduct);
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    const product = products.find(p => p.id === itemId);
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    if (newQuantity <= product.quantity) {
      setCartItems(cartItems.map(item =>
        item.id === itemId ? { ...item, cartQuantity: newQuantity } : item
      ));
    } else {
      notificationHelpers.warning(`Only ${product.quantity} units available for ${product.name}`);
    }
  };

  const handleRemoveItem = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
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
      const saleData = {
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          sku: item.sku,
          price: item.selling_price,
          quantity: item.cartQuantity,
          costPrice: item.cost_price || 0
        })),
        total: paymentData.total,
        paymentMethod: paymentData.method,
        customer: paymentData.customer,
        notes: paymentData.notes || ''
      };
      const completedSale = await salesService.createSale(saleData);
      setTransactionData({ ...completedSale, ...paymentData, items: cartItems, timestamp: new Date() });
      notificationHelpers.saleCompleted(completedSale.total);
      setShowPaymentModal(false);
      setShowTransactionComplete(true);
      setCartItems([]);
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
    const subtotal = cartItems.reduce((sum, item) => sum + (item.selling_price * item.cartQuantity), 0);
    const tax = subtotal * 0.075;
    return subtotal + tax;
  };

  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-background">
      <NavigationSidebar isCollapsed={isSidebarCollapsed} toggleSidebar={() => setSidebarCollapsed(!isSidebarCollapsed)} />
      <main className={`min-h-screen transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-240'}`}>
        <div className="p-4 lg:p-6">
          <div className="mb-6">
            <BreadcrumbTrail />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="font-heading font-bold text-2xl lg:text-3xl text-foreground mb-2">Point of Sale</h1>
                <p className="text-muted-foreground">Process customer transactions quickly and efficiently</p>
              </div>
              <div className="flex items-center space-x-3">
                <QuickActionButton />
                {cartItems.length > 0 && !isLoading && (
                  <Button variant="default" onClick={handleCheckout} disabled={isProcessing} iconName="CreditCard" iconPosition="left" className="hidden sm:flex">
                    Checkout (₦{total.toLocaleString()})
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              {!isLoading && (
                <div className="bg-card rounded-lg border border-border p-4">
                  <ProductSearchBar 
                    products={products} 
                    onProductSelect={handleProductSelect} 
                    onQuickAdd={handleOpenQuickAdd}
                    onScan={() => setShowScannerModal(true)}
                    disabled={isProcessing} 
                  />
                </div>
              )}
              {isLoading ? <SkeletonProductGrid count={10} /> : <ProductGrid products={products} onProductSelect={handleProductSelect} disabled={isProcessing} />}
            </div>
            <div className="xl:col-span-1">
              <div className="sticky top-6">
                <TransactionSummary cartItems={cartItems} onUpdateQuantity={handleUpdateQuantity} onRemoveItem={handleRemoveItem} onClearCart={handleClearCart} disabled={isProcessing} />
                {cartItems.length > 0 && !isLoading && (
                  <div className="mt-4 sm:hidden">
                    <Button variant="default" onClick={handleCheckout} disabled={isProcessing} iconName="CreditCard" iconPosition="left" fullWidth>
                      Checkout - ₦{total.toLocaleString()}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <PaymentModal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} total={total} onPaymentComplete={handlePaymentComplete} cartItems={cartItems} />
      <TransactionComplete isVisible={showTransactionComplete} transactionData={transactionData} onStartNewSale={handleStartNewSale} onViewReceipt={handleViewReceipt} />
      <QuickAddProductModal 
        isOpen={showQuickAddModal}
        onClose={() => setShowQuickAddModal(false)}
        onProductAdded={handleProductAdded}
        initialSearchTerm={quickAddSearchTerm}
      />
      <BarcodeScannerModal
        isOpen={showScannerModal}
        onClose={() => setShowScannerModal(false)}
        onScanSuccess={handleScanSuccess}
      />
    </div>
  );
};

export default PointOfSalePOS;