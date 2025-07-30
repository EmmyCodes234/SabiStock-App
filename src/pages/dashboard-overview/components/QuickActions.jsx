import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      id: 'new-sale',
      label: 'New Sale',
      description: 'Process a customer transaction',
      icon: 'ShoppingCart',
      variant: 'default',
      action: () => navigate('/point-of-sale-pos')
    },
    {
      id: 'add-product',
      label: 'Add Product',
      description: 'Add new item to inventory',
      icon: 'Plus',
      variant: 'outline',
      action: () => navigate('/add-edit-product')
    }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-card">
      <h2 className="font-heading font-semibold text-lg text-foreground mb-4">
        Quick Actions
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action) => (
          <div key={action.id} className="space-y-2">
            <Button
              variant={action.variant}
              onClick={action.action}
              iconName={action.icon}
              iconPosition="left"
              fullWidth
              className="justify-start"
            >
              {action.label}
            </Button>
            <p className="text-xs text-muted-foreground px-3">
              {action.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;