import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from './Button';
import Icon from '../AppIcon';

const QuickActionButton = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getActionConfig = () => {
    switch (location.pathname) {
      case '/dashboard-overview':
        return {
          label: 'New Sale',
          icon: 'Plus',
          action: () => navigate('/point-of-sale-pos'),
          variant: 'default'
        };
      case '/product-management':
        return {
          label: 'Add Product',
          icon: 'Package',
          action: () => navigate('/add-edit-product'),
          variant: 'default'
        };
      case '/point-of-sale-pos':
        return {
          label: 'View Sales',
          icon: 'History',
          action: () => navigate('/sales-history'),
          variant: 'outline'
        };
      case '/sales-history':
        return {
          label: 'New Sale',
          icon: 'ShoppingCart',
          action: () => navigate('/point-of-sale-pos'),
          variant: 'default'
        };
      default:
        return null;
    }
  };

  const actionConfig = getActionConfig();

  if (!actionConfig) return null;

  return (
    <>
      {/* Desktop Quick Action */}
      <div className="hidden lg:block">
        <Button
          variant={actionConfig.variant}
          onClick={actionConfig.action}
          iconName={actionConfig.icon}
          iconPosition="left"
          className="shadow-card"
        >
          {actionConfig.label}
        </Button>
      </div>

      {/* Mobile Floating Action Button */}
      <button
        onClick={actionConfig.action}
        className="
          fixed bottom-6 right-6 z-200 lg:hidden
          w-14 h-14 bg-primary text-primary-foreground
          rounded-full shadow-modal
          flex items-center justify-center
          transition-all duration-200 ease-out
          hover:scale-105 active:scale-95
          focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
        "
        aria-label={actionConfig.label}
      >
        <Icon 
          name={actionConfig.icon} 
          size={24} 
          color="currentColor"
        />
      </button>
    </>
  );
};

export default QuickActionButton;