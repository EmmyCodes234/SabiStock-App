import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TransactionSummary = ({ 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart,
  disabled 
}) => {
  const subtotal = cartItems.reduce((sum, item) => sum + (item.sellingPrice * item.cartQuantity), 0);
  const tax = subtotal * 0.075; // 7.5% VAT
  const total = subtotal + tax;

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      onRemoveItem(itemId);
    } else {
      onUpdateQuantity(itemId, newQuantity);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-semibold text-lg text-foreground">
          Transaction Summary
        </h3>
        {cartItems.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearCart}
            disabled={disabled}
            iconName="Trash2"
            iconPosition="left"
          >
            Clear All
          </Button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="ShoppingCart" size={24} color="var(--color-muted-foreground)" />
            </div>
            <h4 className="font-medium text-foreground mb-2">Cart is Empty</h4>
            <p className="text-sm text-muted-foreground">
              Search or select products to add them to the cart
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="flex-1 space-y-3 mb-4 max-h-80 overflow-y-auto">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-background border border-border rounded-lg p-3">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-foreground truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          ₦{item.sellingPrice.toLocaleString()} each
                        </p>
                      </div>
                      
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        disabled={disabled}
                        className="text-muted-foreground hover:text-error transition-colors duration-200 p-1"
                        aria-label="Remove item"
                      >
                        <Icon name="X" size={16} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.cartQuantity - 1)}
                          disabled={disabled || item.cartQuantity <= 1}
                          className="w-8 h-8 bg-muted rounded-md flex items-center justify-center hover:bg-border transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Icon name="Minus" size={14} />
                        </button>
                        
                        <span className="font-medium text-sm text-foreground min-w-8 text-center">
                          {item.cartQuantity}
                        </span>
                        
                        <button
                          onClick={() => handleQuantityChange(item.id, item.cartQuantity + 1)}
                          disabled={disabled || item.cartQuantity >= item.quantity}
                          className="w-8 h-8 bg-muted rounded-md flex items-center justify-center hover:bg-border transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Icon name="Plus" size={14} />
                        </button>
                      </div>
                      
                      <span className="font-semibold text-sm text-foreground">
                        ₦{(item.sellingPrice * item.cartQuantity).toLocaleString()}
                      </span>
                    </div>
                    
                    {item.cartQuantity >= item.quantity && (
                      <p className="text-xs text-warning mt-1">
                        Maximum quantity reached
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t border-border pt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="font-medium text-foreground">
                ₦{subtotal.toLocaleString()}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">VAT (7.5%):</span>
              <span className="font-medium text-foreground">
                ₦{tax.toLocaleString()}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-lg font-semibold border-t border-border pt-2">
              <span className="text-foreground">Total:</span>
              <span className="text-primary">
                ₦{total.toLocaleString()}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TransactionSummary;