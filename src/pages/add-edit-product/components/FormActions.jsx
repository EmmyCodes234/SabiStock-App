import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const FormActions = ({ 
  isEditing, 
  isSaving, 
  onSave, 
  onSaveAndAddAnother,
  hasUnsavedChanges 
}) => {
  const navigate = useNavigate();

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(
        'You have unsaved changes. Are you sure you want to leave? Your changes will be lost.'
      );
      if (!confirmLeave) return;
    }
    navigate('/product-management');
  };

  return (
    <>
      {/* Desktop Actions */}
      <div className="hidden lg:flex items-center justify-between pt-6 border-t border-border">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Save" size={16} />
          <span>Changes are saved automatically as you type</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
          
          {!isEditing && (
            <Button
              variant="secondary"
              onClick={onSaveAndAddAnother}
              loading={isSaving}
              iconName="Plus"
              iconPosition="left"
              disabled={isSaving}
            >
              Save & Add Another
            </Button>
          )}
          
          <Button
            variant="default"
            onClick={onSave}
            loading={isSaving}
            iconName="Check"
            iconPosition="left"
          >
            {isEditing ? 'Update Product' : 'Save Product'}
          </Button>
        </div>
      </div>

      {/* Mobile Sticky Actions */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-50">
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
            className="flex-1"
          >
            Cancel
          </Button>
          
          <Button
            variant="default"
            onClick={onSave}
            loading={isSaving}
            iconName="Check"
            iconPosition="left"
            className="flex-1"
          >
            {isEditing ? 'Update' : 'Save'}
          </Button>
        </div>
        
        {!isEditing && (
          <Button
            variant="ghost"
            onClick={onSaveAndAddAnother}
            loading={isSaving}
            iconName="Plus"
            iconPosition="left"
            className="w-full mt-2"
            disabled={isSaving}
          >
            Save & Add Another Product
          </Button>
        )}
      </div>

      {/* Mobile Spacer */}
      <div className="lg:hidden h-32" />
    </>
  );
};

export default FormActions;