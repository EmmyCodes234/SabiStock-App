import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const TransactionTable = ({ transactions, onSort, sortField, sortDirection, onBulkAction }) => {
  const [selectedTransactions, setSelectedTransactions] = useState([]);

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

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedTransactions(transactions.map(t => t.id));
    } else {
      setSelectedTransactions([]);
    }
  };

  const handleSelectTransaction = (transactionId, checked) => {
    if (checked) {
      setSelectedTransactions([...selectedTransactions, transactionId]);
    } else {
      setSelectedTransactions(selectedTransactions.filter(id => id !== transactionId));
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return 'ArrowUpDown';
    return sortDirection === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const isHighValue = (amount) => amount >= 50000;

  return (
    <div className="hidden lg:block">
      {/* Bulk Actions */}
      {selectedTransactions.length > 0 && (
        <div className="bg-muted border border-border rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-foreground">
              {selectedTransactions.length} transaction{selectedTransactions.length !== 1 ? 's' : ''} selected
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkAction('export', selectedTransactions)}
                iconName="Download"
                iconPosition="left"
              >
                Export Selected
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTransactions([])}
              >
                Clear Selection
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="text-left p-4 w-12">
                  <Checkbox
                    checked={selectedTransactions.length === transactions.length && transactions.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
                <th className="text-left p-4">
                  <button
                    onClick={() => onSort('id')}
                    className="flex items-center space-x-2 font-heading font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    <span>Transaction ID</span>
                    <Icon name={getSortIcon('id')} size={16} />
                  </button>
                </th>
                <th className="text-left p-4">
                  <button
                    onClick={() => onSort('date')}
                    className="flex items-center space-x-2 font-heading font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    <span>Date & Time</span>
                    <Icon name={getSortIcon('date')} size={16} />
                  </button>
                </th>
                <th className="text-left p-4">
                  <button
                    onClick={() => onSort('total')}
                    className="flex items-center space-x-2 font-heading font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    <span>Amount</span>
                    <Icon name={getSortIcon('total')} size={16} />
                  </button>
                </th>
                <th className="text-left p-4">Items</th>
                <th className="text-left p-4">Payment</th>
                <th className="text-left p-4">Customer</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4 w-20">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr 
                  key={transaction.id} 
                  className={`border-b border-border hover:bg-muted/50 transition-colors ${
                    isHighValue(transaction.total) ? 'bg-accent/5' : ''
                  }`}
                >
                  <td className="p-4">
                    <Checkbox
                      checked={selectedTransactions.includes(transaction.id)}
                      onChange={(e) => handleSelectTransaction(transaction.id, e.target.checked)}
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon name="Receipt" size={16} color="var(--color-primary)" />
                      </div>
                      <div>
                        <p className="font-heading font-semibold text-foreground">
                          #{transaction.id}
                        </p>
                        {isHighValue(transaction.total) && (
                          <div className="flex items-center space-x-1 mt-1">
                            <Icon name="TrendingUp" size={12} color="var(--color-accent)" />
                            <span className="text-xs text-accent font-medium">High Value</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-foreground">{formatDate(transaction.date)}</p>
                      <p className="text-sm text-muted-foreground">{formatTime(transaction.date)}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-heading font-bold text-lg text-foreground">
                      ₦{transaction.total.toLocaleString()}
                    </p>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-foreground">
                        {transaction.items.length} item{transaction.items.length !== 1 ? 's' : ''}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.items.slice(0, 2).map(item => item.name).join(', ')}
                        {transaction.items.length > 2 && ` +${transaction.items.length - 2} more`}
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Icon name={getPaymentMethodIcon(transaction.paymentMethod)} size={16} color="var(--color-muted-foreground)" />
                      <span className="text-sm text-foreground capitalize">{transaction.paymentMethod}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-foreground">
                      {transaction.customer || 'Walk-in Customer'}
                    </p>
                  </td>
                  <td className="p-4">
                    <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </div>
                  </td>
                  <td className="p-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {/* Handle view details */}}
                      className="w-8 h-8"
                    >
                      <Icon name="Eye" size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;