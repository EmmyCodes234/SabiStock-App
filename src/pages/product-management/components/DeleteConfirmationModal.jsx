import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  productName, 
  isBulkDelete = false, 
  bulkCount = 0 
}) => {
  if (!isOpen) return null;

  const title = isBulkDelete 
    ? `Delete ${bulkCount} Products` 
    : `Delete "${productName}"`;

  const message = isBulkDelete
    ? `Are you sure you want to delete ${bulkCount} selected products? This action cannot be undone and will permanently remove all selected products from your inventory.`
    : `Are you sure you want to delete "${productName}"? This action cannot be undone and will permanently remove this product from your inventory.`;

  return (
    <div className="fixed inset-0 z-300 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-modal max-w-md w-full mx-auto">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
              <Icon name="AlertTriangle" size={20} color="var(--color-error)" />
            </div>
            <div>
              <h2 className="font-heading font-semibold text-lg text-foreground">
                {title}
              </h2>
              <p className="text-sm text-muted-foreground">
                This action is permanent
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-muted-foreground leading-relaxed mb-4">
            {message}
          </p>

          <div className="bg-error/5 border border-error/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="AlertCircle" size={16} color="var(--color-error)" className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-error mb-1">
                  Warning: This cannot be undone
                </p>
                <p className="text-xs text-error/80">
                  {isBulkDelete 
                    ? 'All selected products will be permanently removed from your inventory and sales history.' :'This product will be permanently removed from your inventory and sales history.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border flex items-center justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={onConfirm}
            iconName="Trash2"
            iconPosition="left"
          >
            {isBulkDelete ? `Delete ${bulkCount} Products` : 'Delete Product'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;