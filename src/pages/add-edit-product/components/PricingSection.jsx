import React, { useEffect, useState } from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const PricingSection = ({ 
  formData, 
  errors, 
  onInputChange 
}) => {
  const [profit, setProfit] = useState(0);
  const [profitMargin, setProfitMargin] = useState(0);

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    onInputChange(field, value);
  };

  useEffect(() => {
    const costPrice = parseFloat(formData.costPrice) || 0;
    const sellingPrice = parseFloat(formData.sellingPrice) || 0;
    
    const calculatedProfit = sellingPrice - costPrice;
    const calculatedMargin = costPrice > 0 ? ((calculatedProfit / costPrice) * 100) : 0;
    
    setProfit(calculatedProfit);
    setProfitMargin(calculatedMargin);
  }, [formData.costPrice, formData.sellingPrice]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getProfitColor = () => {
    if (profit > 0) return 'text-success';
    if (profit < 0) return 'text-error';
    return 'text-muted-foreground';
  };

  const getProfitIcon = () => {
    if (profit > 0) return 'TrendingUp';
    if (profit < 0) return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
          <Icon name="DollarSign" size={16} color="white" />
        </div>
        <div>
          <h3 className="font-heading font-semibold text-lg text-foreground">
            Pricing Information
          </h3>
          <p className="text-sm text-muted-foreground">
            Set your cost and selling prices
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <Input
          label="Cost Price"
          type="number"
          placeholder="0.00"
          value={formData.costPrice}
          onChange={handleInputChange('costPrice')}
          error={errors.costPrice}
          required
          min="0"
          step="0.01"
          description="How much you paid for this product"
        />

        <Input
          label="Selling Price"
          type="number"
          placeholder="0.00"
          value={formData.sellingPrice}
          onChange={handleInputChange('sellingPrice')}
          error={errors.sellingPrice}
          required
          min="0"
          step="0.01"
          description="Price you'll charge customers"
        />

        {/* Profit Calculator */}
        <div className="bg-muted rounded-lg p-4 space-y-3">
          <div className="flex items-center space-x-2">
            <Icon name="Calculator" size={16} color="var(--color-muted-foreground)" />
            <h4 className="font-medium text-sm text-foreground">Profit Calculator</h4>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Profit per Unit</p>
              <div className={`flex items-center space-x-2 ${getProfitColor()}`}>
                <Icon name={getProfitIcon()} size={16} />
                <span className="font-semibold">
                  {formatCurrency(profit)}
                </span>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Profit Margin</p>
              <div className={`flex items-center space-x-2 ${getProfitColor()}`}>
                <Icon name="Percent" size={16} />
                <span className="font-semibold">
                  {profitMargin.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {profit < 0 && (
            <div className="flex items-start space-x-2 p-3 bg-error bg-opacity-10 rounded-md">
              <Icon name="AlertTriangle" size={16} color="var(--color-error)" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-error">Loss Warning</p>
                <p className="text-xs text-error opacity-80">
                  Your selling price is lower than cost price. You'll lose money on each sale.
                </p>
              </div>
            </div>
          )}

          {profit === 0 && formData.costPrice && formData.sellingPrice && (
            <div className="flex items-start space-x-2 p-3 bg-warning bg-opacity-10 rounded-md">
              <Icon name="AlertCircle" size={16} color="var(--color-warning)" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-warning">Break-even Point</p>
                <p className="text-xs text-warning opacity-80">
                  You're not making profit or loss. Consider increasing selling price.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PricingSection;