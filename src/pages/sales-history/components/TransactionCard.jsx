import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TransactionCard = ({ transaction }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPaymentMethodIcon = (method) => {
    switch (method.toLowerCase()) {
      case 'cash':
        return 'Banknote';
      case 'card':
        return 'CreditCard';
      case 'transfer':
        return 'Smartphone';
      default:
        return 'Wallet';
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'text-success bg-success/10';
      case 'refunded':
        return 'text-error bg-error/10';
      case 'pending':
        return 'text-warning bg-warning/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-4 lg:hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Receipt" size={20} color="var(--color-primary)" />
          </div>
          <div>
            <p className="font-heading font-semibold text-foreground">
              #{transaction.id}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatDate(transaction.date)} • {formatTime(transaction.date)}
            </p>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
          {transaction.status}
        </div>
      </div>

      {/* Amount and Items */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-2xl font-heading font-bold text-foreground">
            ₦{transaction.total.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">
            {transaction.items.length} item{transaction.items.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Icon name={getPaymentMethodIcon(transaction.paymentMethod)} size={16} />
          <span className="text-sm capitalize">{transaction.paymentMethod}</span>
        </div>
      </div>

      {/* Customer Info */}
      {transaction.customer && (
        <div className="mb-3">
          <p className="text-sm text-muted-foreground">
            Customer: <span className="text-foreground font-medium">{transaction.customer}</span>
          </p>
        </div>
      )}

      {/* Expand Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
        iconPosition="right"
        className="w-full justify-center"
      >
        {isExpanded ? 'Hide Details' : 'View Details'}
      </Button>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-border">
          <h4 className="font-heading font-semibold text-foreground mb-3">Items Purchased</h4>
          <div className="space-y-3">
            {transaction.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-foreground">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    ₦{item.price.toLocaleString()} × {item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-foreground">
                  ₦{(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
          
          {transaction.notes && (
            <div className="mt-4 pt-3 border-t border-border">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Notes:</span> {transaction.notes}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionCard;