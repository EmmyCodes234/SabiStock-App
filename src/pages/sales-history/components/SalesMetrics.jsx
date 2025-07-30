import React from 'react';
import Icon from '../../../components/AppIcon';

const SalesMetrics = ({ metrics, selectedPeriod }) => {
  const metricCards = [
    {
      title: 'Total Sales',
      value: `₦${metrics.totalSales.toLocaleString()}`,
      icon: 'TrendingUp',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'Average Transaction',
      value: `₦${metrics.averageTransaction.toLocaleString()}`,
      icon: 'Calculator',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      title: 'Total Items Sold',
      value: metrics.totalItems.toLocaleString(),
      icon: 'Package',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      title: 'Number of Sales',
      value: metrics.numberOfSales.toLocaleString(),
      icon: 'ShoppingCart',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    }
  ];

  return (
    <div className="mb-6">
      <h2 className="font-heading font-semibold text-lg text-foreground mb-4">
        Sales Summary - {selectedPeriod}
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((metric, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-10 h-10 ${metric.bgColor} rounded-lg flex items-center justify-center`}>
                <Icon 
                  name={metric.icon} 
                  size={20} 
                  color={`var(--color-${metric.color.split('-')[1]})`}
                />
              </div>
            </div>
            <p className="text-2xl font-heading font-bold text-foreground mb-1">
              {metric.value}
            </p>
            <p className="text-sm text-muted-foreground">
              {metric.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesMetrics;