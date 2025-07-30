import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import QuickActionButton from '../../components/ui/QuickActionButton';
import Icon from '../../components/AppIcon';
import SkeletonLoader, { SkeletonForm } from '../../components/ui/SkeletonLoader';
import { productService } from '../../utils/apiService';
import { notificationHelpers } from '../../utils/notifications';

import ProductImageUpload from './components/ProductImageUpload';
import ProductDetailsSection from './components/ProductDetailsSection';
import PricingSection from './components/PricingSection';
import InventorySection from './components/InventorySection';
import FormActions from './components/FormActions';
import SuccessModal from './components/SuccessModal';
import FormProgressTracker from './components/FormProgressTracker';

const AddEditProduct = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('id');
  const isEditing = Boolean(productId);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false); // <-- New State

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    cost_price: '',
    selling_price: '',
    quantity: '0',
    low_stock_threshold: '5',
    category: '',
    image: ''
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [savedProductInfo, setSavedProductInfo] = useState(null);
  const [formProgress, setFormProgress] = useState({
    details: false,
    pricing: false,
    inventory: false,
    image: false,
  });

  useEffect(() => {
    const checkProgress = () => {
      setFormProgress({
        details: !!formData.name && !!formData.sku,
        pricing: !!formData.cost_price && !!formData.selling_price && parseFloat(formData.selling_price) > parseFloat(formData.cost_price),
        inventory: formData.quantity !== '' && formData.low_stock_threshold !== '',
        image: !!formData.image,
      });
    };
    checkProgress();
  }, [formData]);

  useEffect(() => {
    if (isEditing && productId) {
      loadProduct();
    }
  }, [isEditing, productId]);

  const loadProduct = async () => {
    setIsLoading(true);
    try {
      const product = await productService.getById(productId);
      if (product) {
        setFormData(product);
      } else {
        notificationHelpers.error('Product not found');
        navigate('/product-management');
      }
    } catch (error) {
      notificationHelpers.error(`Failed to load product: ${error.message}`);
      navigate('/product-management');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const generateSKU = () => {
    const timestamp = Date.now().toString().slice(-6);
    const namePrefix = formData.name.split(' ').map(word => word.substring(0, 3).toUpperCase()).join('-').substring(0, 10);
    const newSKU = namePrefix ? `${namePrefix}-${timestamp}` : `PROD-${timestamp}`;
    handleInputChange('sku', newSKU);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (formData.cost_price === '' || parseFloat(formData.cost_price) < 0) newErrors.cost_price = 'Valid cost price is required';
    if (formData.selling_price === '' || parseFloat(formData.selling_price) < 0) newErrors.selling_price = 'Valid selling price is required';
    if (parseFloat(formData.selling_price) < parseFloat(formData.cost_price)) newErrors.selling_price = 'Selling price should not be less than cost price';
    if (formData.quantity === '' || parseInt(formData.quantity) < 0) newErrors.quantity = 'Quantity cannot be negative';
    if (formData.low_stock_threshold === '' || parseInt(formData.low_stock_threshold) < 0) newErrors.low_stock_threshold = 'Threshold cannot be negative';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      notificationHelpers.error('Please fix the errors before saving.');
      return;
    }
    setIsSaving(true);
    try {
      let savedProduct;
      if (isEditing) {
        savedProduct = await productService.update(productId, formData);
        notificationHelpers.success(`Product "${savedProduct.name}" updated successfully`);
      } else {
        savedProduct = await productService.create(formData);
        notificationHelpers.productSaved(savedProduct.name);
      }
      setSavedProductInfo(savedProduct);
      setHasUnsavedChanges(false);
      setShowSuccessModal(true);
    } catch (error) {
      notificationHelpers.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate('/product-management');
  };
  
  const handleAddAnotherFromModal = () => {
    setShowSuccessModal(false);
    setSavedProductInfo(null);
    setFormData({ name: '', sku: '', description: '', cost_price: '', selling_price: '', quantity: '0', low_stock_threshold: '5', category: '', image: '' });
    setErrors({});
    setHasUnsavedChanges(false);
  };
  
  const handleStartSale = () => {
    setShowSuccessModal(false);
    navigate('/point-of-sale-pos', { state: { productToAdd: savedProductInfo } });
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationSidebar isCollapsed={isSidebarCollapsed} toggleSidebar={() => setSidebarCollapsed(!isSidebarCollapsed)} />
      <main className={`min-h-screen transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-240'}`}>
        <div className="p-4 lg:p-8">
          <div className="mb-6">
            <BreadcrumbTrail />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name={isEditing ? "Edit" : "Plus"} size={20} color="white" />
                </div>
                <div>
                  <h1 className="font-heading font-bold text-2xl lg:text-3xl text-foreground">
                    {isEditing ? 'Edit Product' : 'Add New Product'}
                  </h1>
                  <p className="text-muted-foreground">
                    {isEditing ? 'Update your product information and inventory details' : 'Create a new product for your inventory'}
                  </p>
                </div>
              </div>
              <QuickActionButton />
            </div>
          </div>
          <div className="max-w-6xl mx-auto">
            {isLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2"><SkeletonForm fields={8} /></div>
                <div className="lg:col-span-1"><SkeletonLoader variant="card" height="16rem" /></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-card rounded-lg border border-border p-6">
                    <ProductDetailsSection formData={formData} errors={errors} onInputChange={handleInputChange} onGenerateSKU={generateSKU} />
                  </div>
                  <div className="bg-card rounded-lg border border-border p-6">
                    <PricingSection formData={formData} errors={errors} onInputChange={handleInputChange} />
                  </div>
                  <div className="bg-card rounded-lg border border-border p-6">
                    <InventorySection formData={formData} errors={errors} onInputChange={handleInputChange} />
                  </div>
                </div>
                <div className="lg:col-span-1 space-y-8">
                  <div className="bg-card rounded-lg border border-border p-6 sticky top-8">
                    <ProductImageUpload image={formData.image} onImageChange={(image) => handleInputChange('image', image)} error={errors.image} />
                  </div>
                   <FormProgressTracker progress={formProgress} />
                </div>
              </div>
            )}
            {!isLoading && (
              <div className="bg-card rounded-lg border border-border p-6 mt-8">
                <FormActions isEditing={isEditing} isSaving={isSaving} onSave={handleSave} onSaveAndAddAnother={() => {}} hasUnsavedChanges={hasUnsavedChanges} />
              </div>
            )}
          </div>
        </div>
      </main>
      {showSuccessModal && (
        <SuccessModal
          isVisible={showSuccessModal}
          onClose={handleSuccessModalClose}
          productName={savedProductInfo?.name}
          isEditing={isEditing}
          onAddAnother={handleAddAnotherFromModal}
          onStartSale={handleStartSale}
          onViewProductList={() => navigate('/product-management')}
        />
      )}
    </div>
  );
};

export default AddEditProduct;