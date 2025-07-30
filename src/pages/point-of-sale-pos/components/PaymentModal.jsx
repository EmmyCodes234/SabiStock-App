import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  total, 
  onPaymentComplete,
  cartItems 
}) => {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountReceived, setAmountReceived] = useState('');
  const [change, setChange] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  const paymentMethods = [
    { value: 'cash', label: 'Cash Payment' },
    { value: 'card', label: 'Card Payment' },
    { value: 'transfer', label: 'Bank Transfer' },
    { value: 'pos', label: 'POS Terminal' }
  ];

  useEffect(() => {
    if (paymentMethod === 'cash' && amountReceived) {
      const received = parseFloat(amountReceived) || 0;
      setChange(Math.max(0, received - total));
    } else {
      setChange(0);
    }
  }, [amountReceived, total, paymentMethod]);

  useEffect(() => {
    if (isOpen) {
      setAmountReceived('');
      setChange(0);
      setErrors({});
      setIsProcessing(false);
    }
  }, [isOpen]);

  const validatePayment = () => {
    const newErrors = {};

    if (paymentMethod === 'cash') {
      const received = parseFloat(amountReceived) || 0;
      if (!amountReceived || received <= 0) {
        newErrors.amountReceived = 'Please enter amount received';
      } else if (received < total) {
        newErrors.amountReceived = 'Amount received is less than total';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validatePayment()) return;

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const paymentData = {
        method: paymentMethod,
        total,
        amountReceived: paymentMethod === 'cash' ? parseFloat(amountReceived) : total,
        change: paymentMethod === 'cash' ? change : 0,
        timestamp: new Date(),
        items: cartItems
      };

      onPaymentComplete(paymentData);
    } catch (error) {
      console.error('Payment processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuickAmount = (amount) => {
    setAmountReceived(amount.toString());
  };

  if (!isOpen) return null;

  const quickAmounts = [
    total,
    Math.ceil(total / 1000) * 1000,
    Math.ceil(total / 5000) * 5000,
    Math.ceil(total / 10000) * 10000
  ].filter((amount, index, arr) => arr.indexOf(amount) === index && amount >= total);

  return (
    <div className="fixed inset-0 z-300 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-modal max-w-md w-full mx-auto">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="CreditCard" size={20} color="white" />
              </div>
              <div>
                <h2 className="font-heading font-semibold text-lg text-foreground">
                  Process Payment
                </h2>
                <p className="text-sm text-muted-foreground">
                  Complete the transaction
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="text-muted-foreground hover:text-foreground transition-colors duration-200 disabled:opacity-50"
            >
              <Icon name="X" size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Total Amount */}
          <div className="bg-muted rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
            <p className="text-2xl font-bold text-primary">
              ₦{total.toLocaleString()}
            </p>
          </div>

          {/* Payment Method */}
          <Select
            label="Payment Method"
            options={paymentMethods}
            value={paymentMethod}
            onChange={setPaymentMethod}
            disabled={isProcessing}
          />

          {/* Cash Payment Fields */}
          {paymentMethod === 'cash' && (
            <div className="space-y-4">
              <Input
                label="Amount Received"
                type="number"
                placeholder="Enter amount received"
                value={amountReceived}
                onChange={(e) => setAmountReceived(e.target.value)}
                error={errors.amountReceived}
                disabled={isProcessing}
                min="0"
                step="0.01"
              />

              {/* Quick Amount Buttons */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Quick Amounts:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickAmounts.slice(0, 4).map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAmount(amount)}
                      disabled={isProcessing}
                    >
                      ₦{amount.toLocaleString()}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Change Display */}
              {change > 0 && (
                <div className="bg-success bg-opacity-10 border border-success border-opacity-20 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-success">Change to Give:</span>
                    <span className="text-lg font-bold text-success">
                      ₦{change.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Non-cash payment info */}
          {paymentMethod !== 'cash' && (
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Info" size={16} color="var(--color-primary)" />
                <span className="text-sm font-medium text-foreground">
                  {paymentMethod === 'card' && 'Insert or tap card to complete payment'}
                  {paymentMethod === 'transfer' && 'Customer will transfer the exact amount'}
                  {paymentMethod === 'pos' && 'Process payment through POS terminal'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Ensure payment is confirmed before completing the transaction
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border flex items-center justify-between">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancel
          </Button>

          <Button
            variant="default"
            onClick={handlePayment}
            loading={isProcessing}
            iconName="CheckCircle"
            iconPosition="left"
          >
            {isProcessing ? 'Processing...' : 'Complete Payment'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;