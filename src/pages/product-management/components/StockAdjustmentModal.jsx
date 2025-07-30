import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import { productService } from '../../../utils/apiService';
import { notificationHelpers } from '../../../utils/notifications';

const StockAdjustmentModal = ({ isOpen, onClose, product, onSuccess }) => {
  const [adjustmentType, setAdjustmentType] = useState('set'); // 'set', 'add', 'subtract'
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Reset state when a new product is passed in or when modal is opened
    if (product) {
      setAdjustmentType('set');
      setQuantity(product.quantity.toString());
      setReason('');
      setErrors({});
    }
  }, [product]);


  if (!isOpen || !product) return null;

  const handleAdjustmentTypeChange = (type) => {
    setAdjustmentType(type);
    setQuantity(''); // Clear quantity when changing type
    setErrors({});
  };

  const calculateNewQuantity = () => {
    const currentQty = parseInt(product.quantity, 10) || 0;
    const adjustQty = parseInt(quantity, 10) || 0;
    
    switch (adjustmentType) {
      case 'set':
        return adjustQty;
      case 'add':
        return currentQty + adjustQty;
      case 'subtract':
        return Math.max(0, currentQty - adjustQty);
      default:
        return currentQty;
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (quantity === '' || isNaN(parseInt(quantity)) || parseInt(quantity) < 0) {
      newErrors.quantity = 'Valid, non-negative quantity is required';
    }
    if (!reason.trim()) {
      newErrors.reason = 'An adjustment reason is required';
    }
    const newQuantity = calculateNewQuantity();
    if (newQuantity < 0) {
      newErrors.quantity = 'Resulting quantity cannot be negative';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsProcessing(true);
    try {
      const newQuantity = calculateNewQuantity();
      await productService.adjustStock(product.id, newQuantity);
      notificationHelpers.stockAdjusted(product.name, newQuantity);
      onSuccess(); // This will trigger a refresh of the product list
      onClose();
    } catch (error) {
      notificationHelpers.error(`Stock adjustment failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const newQuantity = calculateNewQuantity();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-500 p-4">
      <div className="bg-card border border-border rounded-lg max-w-md w-full">
        <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="font-heading font-semibold text-lg text-foreground">Adjust Stock for {product.name}</h3>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}><Icon name="X" size={16} /></Button>
        </div>
        <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6">
                <div className="bg-muted rounded-lg p-4 flex justify-between items-center">
                    <span className="text-sm font-medium text-foreground">Current Stock</span>
                    <span className="text-lg font-heading font-semibold text-foreground">{product.quantity} units</span>
                </div>
                <div>
                    <label className="block text-sm font-medium text-foreground mb-3">Adjustment Type</label>
                    <div className="grid grid-cols-3 gap-2">
                        <Button type="button" variant={adjustmentType === 'set' ? 'default' : 'outline'} onClick={() => handleAdjustmentTypeChange('set')}>Set To</Button>
                        <Button type="button" variant={adjustmentType === 'add' ? 'default' : 'outline'} onClick={() => handleAdjustmentTypeChange('add')}>Add</Button>
                        <Button type="button" variant={adjustmentType === 'subtract' ? 'default' : 'outline'} onClick={() => handleAdjustmentTypeChange('subtract')}>Remove</Button>
                    </div>
                </div>
                <Input label={`Quantity to ${adjustmentType}`} type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} error={errors.quantity} min="0" required />
                {quantity && !errors.quantity && (
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-foreground">New Stock Level</span>
                            <span className="text-lg font-heading font-semibold text-primary">{newQuantity} units</span>
                        </div>
                    </div>
                )}
                <Input label="Reason for Adjustment" value={reason} onChange={(e) => setReason(e.target.value)} error={errors.reason} required placeholder="e.g., Stock count correction, Damaged goods"/>
            </div>
            <div className="p-6 border-t border-border flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit" loading={isProcessing} disabled={isProcessing}>Adjust Stock</Button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default StockAdjustmentModal;