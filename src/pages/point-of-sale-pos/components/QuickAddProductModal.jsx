import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import { productService } from '../../../utils/apiService';
import { notificationHelpers } from '../../../utils/notifications';

const QuickAddProductModal = ({ isOpen, onClose, onProductAdded, initialSearchTerm = '' }) => {
  const [formData, setFormData] = useState({
    name: initialSearchTerm,
    selling_price: '',
    quantity: '1',
    sku: `SKU-${Date.now().toString().slice(-6)}`,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required.';
    if (!formData.selling_price || parseFloat(formData.selling_price) <= 0) newErrors.selling_price = 'A valid selling price is required.';
    if (formData.quantity === '' || parseInt(formData.quantity) < 0) newErrors.quantity = 'A valid quantity is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    try {
      const newProduct = await productService.create(formData);
      notificationHelpers.productSaved(newProduct.name);
      onProductAdded(newProduct);
      onClose();
      // Reset form for next time
      setFormData({ name: '', selling_price: '', quantity: '1', sku: `SKU-${Date.now().toString().slice(-6)}` });
    } catch (error) {
      notificationHelpers.error(`Failed to add product: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-300 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-modal max-w-md w-full mx-auto">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="PackagePlus" size={20} color="var(--color-primary)" />
            </div>
            <div>
              <h2 className="font-heading font-semibold text-lg text-foreground">Quick Add Product</h2>
              <p className="text-sm text-muted-foreground">Add a new item to inventory & cart.</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose} disabled={isSaving}>
            <Icon name="X" size={16} />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <Input label="Product Name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} error={errors.name} required />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Selling Price (₦)" type="number" value={formData.selling_price} onChange={(e) => handleInputChange('selling_price', e.target.value)} error={errors.selling_price} required />
              <Input label="Initial Quantity" type="number" value={formData.quantity} onChange={(e) => handleInputChange('quantity', e.target.value)} error={errors.quantity} required />
            </div>
            <Input label="SKU (auto-generated)" value={formData.sku} onChange={(e) => handleInputChange('sku', e.target.value)} disabled />
             <p className="text-xs text-muted-foreground pt-2">More details like cost price and image can be added later from the Product Management page.</p>
          </div>
          
          <div className="p-6 border-t border-border flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
            <Button type="submit" loading={isSaving} disabled={isSaving}>Add Product & Add to Cart</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickAddProductModal;