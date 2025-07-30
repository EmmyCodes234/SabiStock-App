import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SuccessModal = ({ 
  isVisible, 
  onClose, 
  productName, 
  isEditing,
  onAddAnother,
  onStartSale,
  onViewProductList,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-300 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-modal max-w-md w-full mx-auto">
        {/* Header */}
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="CheckCircle" size={32} color="white" />
          </div>
          
          <h2 className="font-heading font-semibold text-xl text-foreground mb-2">
            {isEditing ? 'Product Updated!' : 'Product Added Successfully!'}
          </h2>
          
          <p className="text-muted-foreground">
            {isEditing 
              ? `"${productName}" has been updated in your inventory.`
              : `"${productName}" has been added and is ready for sale.`
            }
          </p>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-border space-y-3">
            <Button
              variant="default"
              onClick={onStartSale}
              iconName="ShoppingCart"
              iconPosition="left"
              className="w-full"
            >
              Start Sale With This Product
            </Button>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={onViewProductList}
              iconName="Package"
              iconPosition="left"
              className="w-full"
            >
              View All Products
            </Button>
            
            {!isEditing && (
              <Button
                variant="outline"
                onClick={onAddAnother}
                iconName="Plus"
                iconPosition="left"
                className="w-full"
              >
                Add Another
              </Button>
            )}
          </div>
          
          <Button
            variant="ghost"
            onClick={onClose}
            className="w-full mt-2"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;