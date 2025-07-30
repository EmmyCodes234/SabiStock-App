import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricCard = ({ title, value, icon, trend, trendValue, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="bg-card rounded-lg border border-border p-6 shadow-card">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-muted rounded w-24"></div>
            <div className="h-8 w-8 bg-muted rounded-lg"></div>
          </div>
          <div className="h-8 bg-muted rounded w-32 mb-2"></div>
          <div className="h-3 bg-muted rounded w-20"></div>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-NG').format(num);
  };

  const displayValue = title.includes('Revenue') || title.includes('Profit') 
    ? formatCurrency(value) 
    : formatNumber(value);

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-card hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-body font-medium text-sm text-muted-foreground uppercase tracking-wide">
          {title}
        </h3>
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon 
            name={icon} 
            size={20} 
            color="var(--color-primary)" 
          />
        </div>
      </div>
      
      <div className="mb-2">
        <p className="font-heading font-semibold text-2xl lg:text-3xl text-foreground">
          {displayValue}
        </p>
      </div>
      
      {trend && trendValue && (
        <div className="flex items-center space-x-1">
          <Icon 
            name={trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
            size={14} 
            color={trend === 'up' ? 'var(--color-success)' : 'var(--color-error)'} 
          />
          <span className={`text-xs font-body font-medium ${
            trend === 'up' ? 'text-success' : 'text-error'
          }`}>
            {trendValue}% from last period
          </span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;