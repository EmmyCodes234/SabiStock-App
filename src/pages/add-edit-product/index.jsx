import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import QuickActionButton from '../../components/ui/QuickActionButton';
import Icon from '../../components/AppIcon';
import SkeletonLoader, { SkeletonForm } from '../../components/ui/SkeletonLoader';
import { productService } from '../../utils/localStorage';
import { notificationHelpers } from '../../utils/notifications';

import ProductImageUpload from './components/ProductImageUpload';
import ProductDetailsSection from './components/ProductDetailsSection';
import PricingSection from './components/PricingSection';
import InventorySection from './components/InventorySection';
import FormActions from './components/FormActions';
import SuccessModal from './components/SuccessModal';

const AddEditProduct = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('id');
  const isEditing = Boolean(productId);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    costPrice: '',
    sellingPrice: '',
    quantity: '0',
    lowStockThreshold: '5',
    category: '',
    image: ''
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState(null);

  // Load product data for editing
  useEffect(() => {
    if (isEditing && productId) {
      loadProduct();
    }
  }, [isEditing, productId]);

  const loadProduct = async () => {
    setIsLoading(true);
    try {
      // Simulate loading delay for skeleton effect
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const product = productService.getById(productId);
      if (product) {
        setFormData({
          name: product.name || '',
          sku: product.sku || '',
          description: product.description || '',
          costPrice: product.costPrice?.toString() || '',
          sellingPrice: product.sellingPrice?.toString() || '',
          quantity: product.quantity?.toString() || '0',
          lowStockThreshold: product.lowStockThreshold?.toString() || '5',
          category: product.category || '',
          image: product.image || ''
        });
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
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    // Auto-save functionality (disabled during actual saving)
    if (!isSaving && autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }
    
    if (!isSaving) {
      const timeout = setTimeout(() => {
        console.log('Auto-save data prepared for:', field, value);
        // Could implement draft saving to localStorage here
      }, 2000);
      
      setAutoSaveTimeout(timeout);
    }
  };

  const generateSKU = () => {
    const timestamp = Date.now().toString().slice(-6);
    const namePrefix = formData.name
      .split(' ')
      .map(word => word.substring(0, 3).toUpperCase())
      .join('-')
      .substring(0, 10);
    
    const newSKU = namePrefix ? `${namePrefix}-${timestamp}` : `PROD-${timestamp}`;
    handleInputChange('sku', newSKU);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required';
    }

    if (!formData.costPrice || parseFloat(formData.costPrice) < 0) {
      newErrors.costPrice = 'Valid cost price is required';
    }

    if (!formData.sellingPrice || parseFloat(formData.sellingPrice) < 0) {
      newErrors.sellingPrice = 'Valid selling price is required';
    }

    if (formData.quantity && parseInt(formData.quantity) < 0) {
      newErrors.quantity = 'Quantity cannot be negative';
    }

    if (formData.lowStockThreshold && parseInt(formData.lowStockThreshold) < 0) {
      newErrors.lowStockThreshold = 'Threshold cannot be negative';
    }

    // Validate selling price vs cost price
    if (formData.costPrice && formData.sellingPrice) {
      const costPrice = parseFloat(formData.costPrice);
      const sellingPrice = parseFloat(formData.sellingPrice);
      if (sellingPrice < costPrice) {
        newErrors.sellingPrice = 'Selling price should not be less than cost price';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      notificationHelpers.validationError(Object.values(errors));
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
      
      setHasUnsavedChanges(false);
      setShowSuccessModal(true);
      
      // Clear auto-save timeout
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
      
    } catch (error) {
      notificationHelpers.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAndAddAnother = async () => {
    if (!validateForm()) {
      notificationHelpers.validationError(Object.values(errors));
      return;
    }

    setIsSaving(true);
    
    try {
      let savedProduct = await productService.create(formData);
      notificationHelpers.productSaved(savedProduct.name);
      
      // Reset form for new product
      setFormData({
        name: '',
        sku: '',
        description: '',
        costPrice: '',
        sellingPrice: '',
        quantity: '0',
        lowStockThreshold: '5',
        category: '',
        image: ''
      });
      
      setHasUnsavedChanges(false);
      setErrors({});
      
      // Clear auto-save timeout
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
      
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
    setFormData({
      name: '',
      sku: '',
      description: '',
      costPrice: '',
      sellingPrice: '',
      quantity: '0',
      lowStockThreshold: '5',
      category: '',
      image: ''
    });
    setErrors({});
    setHasUnsavedChanges(false);
  };

  // Cleanup auto-save timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
    };
  }, [autoSaveTimeout]);

  return (
    <div className="min-h-screen bg-background">
      <NavigationSidebar />
      
      <main className="lg:ml-240 min-h-screen">
        <div className="p-4 lg:p-8">
          {/* Header */}
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
                    {isEditing 
                      ? 'Update your product information and inventory details'
                      : 'Create a new product for your inventory with detailed information'
                    }
                  </p>
                </div>
              </div>
              
              <QuickActionButton />
            </div>
          </div>

          {/* Form Content */}
          <div className="max-w-6xl mx-auto">
            {isLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <SkeletonForm fields={8} />
                </div>
                <div className="lg:col-span-1">
                  <SkeletonLoader variant="card" height="16rem" />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Form Sections */}
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-card rounded-lg border border-border p-6">
                    <ProductDetailsSection
                      formData={formData}
                      errors={errors}
                      onInputChange={handleInputChange}
                      onGenerateSKU={generateSKU}
                    />
                  </div>

                  <div className="bg-card rounded-lg border border-border p-6">
                    <PricingSection
                      formData={formData}
                      errors={errors}
                      onInputChange={handleInputChange}
                    />
                  </div>

                  <div className="bg-card rounded-lg border border-border p-6">
                    <InventorySection
                      formData={formData}
                      errors={errors}
                      onInputChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Right Column - Image Upload */}
                <div className="lg:col-span-1">
                  <div className="bg-card rounded-lg border border-border p-6 sticky top-8">
                    <ProductImageUpload
                      image={formData.image}
                      onImageChange={(image) => handleInputChange('image', image)}
                      error={errors.image}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Form Actions */}
            {!isLoading && (
              <div className="bg-card rounded-lg border border-border p-6 mt-8">
                <FormActions
                  isEditing={isEditing}
                  isSaving={isSaving}
                  onSave={handleSave}
                  onSaveAndAddAnother={handleSaveAndAddAnother}
                  hasUnsavedChanges={hasUnsavedChanges}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Success Modal */}
      <SuccessModal
        isVisible={showSuccessModal}
        onClose={handleSuccessModalClose}
        productName={formData.name}
        isEditing={isEditing}
        onAddAnother={handleAddAnotherFromModal}
      />
    </div>
  );
};

export default AddEditProduct;