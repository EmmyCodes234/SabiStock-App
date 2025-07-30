import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import { productService } from '../../../utils/localStorage';
import { notificationHelpers } from '../../../utils/notifications';

const StockAdjustmentModal = ({ isOpen, onClose, product, onSuccess }) => {
  const [adjustmentType, setAdjustmentType] = useState('set'); // 'set', 'add', 'subtract'
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  if (!isOpen || !product) return null;

  const handleAdjustmentTypeChange = (type) => {
    setAdjustmentType(type);
    setQuantity('');
    setErrors({});
  };

  const calculateNewQuantity = () => {
    const currentQty = product.quantity;
    const adjustQty = parseInt(quantity) || 0;
    
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
    
    if (!quantity || isNaN(parseInt(quantity)) || parseInt(quantity) < 0) {
      newErrors.quantity = 'Valid quantity is required';
    }
    
    if (!reason.trim()) {
      newErrors.reason = 'Adjustment reason is required';
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
    
    if (!validateForm()) {
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const newQuantity = calculateNewQuantity();
      const adjustmentReason = `${adjustmentType.toUpperCase()}: ${reason}`;
      
      await productService.adjustStock(product.id, newQuantity, adjustmentReason, 'manual');
      
      notificationHelpers.stockAdjusted(product.name, newQuantity);
      
      if (onSuccess) {
        onSuccess();
      }
      
      handleClose();
      
    } catch (error) {
      notificationHelpers.error(`Stock adjustment failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setAdjustmentType('set');
    setQuantity('');
    setReason('');
    setErrors({});
    onClose();
  };

  const newQuantity = calculateNewQuantity();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-500 p-4">
      <div className="bg-card border border-border rounded-lg max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Package" size={20} color="var(--color-primary)" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-lg text-foreground">
                Adjust Stock
              </h3>
              <p className="text-sm text-muted-foreground">
                {product.name}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            disabled={isProcessing}
          >
            <Icon name="X" size={20} color="var(--color-muted-foreground)" />
          </button>
        </div>

        {/* Current Stock Info */}
        <div className="bg-muted rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-foreground">Current Stock</span>
            <span className="text-lg font-heading font-semibold text-foreground">
              {product.quantity} units
            </span>
          </div>
          
          {product.quantity <= product.lowStockThreshold && (
            <div className="mt-2 text-xs text-warning">
              ⚠️ Low stock threshold: {product.lowStockThreshold} units
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Adjustment Type */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Adjustment Type
            </label>
            
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleAdjustmentTypeChange('set')}
                className={`p-3 rounded-lg border text-center transition-colors ${
                  adjustmentType === 'set' ?'border-primary bg-primary/10 text-primary' :'border-border hover:border-primary/50'
                }`}
              >
                <div className="text-xs font-medium">Set To</div>
                <div className="text-xs text-muted-foreground">Exact amount</div>
              </button>
              
              <button
                type="button"
                onClick={() => handleAdjustmentTypeChange('add')}
                className={`p-3 rounded-lg border text-center transition-colors ${
                  adjustmentType === 'add' ?'border-success bg-success/10 text-success' :'border-border hover:border-success/50'
                }`}
              >
                <div className="text-xs font-medium">Add</div>
                <div className="text-xs text-muted-foreground">Increase stock</div>
              </button>
              
              <button
                type="button"
                onClick={() => handleAdjustmentTypeChange('subtract')}
                className={`p-3 rounded-lg border text-center transition-colors ${
                  adjustmentType === 'subtract' ?'border-error bg-error/10 text-error' :'border-border hover:border-error/50'
                }`}
              >
                <div className="text-xs font-medium">Remove</div>
                <div className="text-xs text-muted-foreground">Decrease stock</div>
              </button>
            </div>
          </div>

          {/* Quantity Input */}
          <div>
            <Input
              label={`Quantity to ${adjustmentType === 'set' ? 'set' : adjustmentType}`}
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              error={errors.quantity}
              placeholder="Enter quantity"
              min="0"
              disabled={isProcessing}
            />
          </div>

          {/* New Quantity Preview */}
          {quantity && !errors.quantity && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">New Stock Level</span>
                <span className={`text-lg font-heading font-semibold ${
                  newQuantity <= product.lowStockThreshold 
                    ? 'text-warning' :'text-success'
                }`}>
                  {newQuantity} units
                </span>
              </div>
              
              <div className="text-xs text-muted-foreground mt-1">
                Change: {adjustmentType === 'set' 
                  ? `${newQuantity - product.quantity > 0 ? '+' : ''}${newQuantity - product.quantity}`
                  : adjustmentType === 'add' 
                    ? `+${quantity}`
                    : `-${quantity}`
                } units
              </div>
            </div>
          )}

          {/* Reason Input */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Reason for Adjustment *
            </label>
            
            <div className="space-y-2">
              {/* Quick Reason Buttons */}
              <div className="flex flex-wrap gap-2">
                {[
                  'Stock Count Correction',
                  'Damaged Items',
                  'New Stock Received',
                  'Return/Exchange',
                  'Promotion/Gift'
                ].map((quickReason) => (
                  <button
                    key={quickReason}
                    type="button"
                    onClick={() => setReason(quickReason)}
                    className="text-xs px-3 py-1 border border-border rounded-full hover:border-primary hover:text-primary transition-colors"
                    disabled={isProcessing}
                  >
                    {quickReason}
                  </button>
                ))}
              </div>
              
              {/* Custom Reason Input */}
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for stock adjustment..."
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg resize-none transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                  errors.reason 
                    ? 'border-error focus:border-error' :'border-border focus:border-primary'
                }`}
                disabled={isProcessing}
              />
              
              {errors.reason && (
                <p className="text-sm text-error">{errors.reason}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isProcessing}
              fullWidth
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              variant="default"
              disabled={isProcessing || !quantity || !reason.trim()}
              iconName={isProcessing ? "Loader" : "Check"}
              iconPosition="left"
              fullWidth
            >
              {isProcessing ? 'Adjusting...' : 'Adjust Stock'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockAdjustmentModal;