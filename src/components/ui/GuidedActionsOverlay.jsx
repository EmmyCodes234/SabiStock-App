import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import Icon from '../AppIcon';

const GuidedActionsOverlay = ({ isVisible, onComplete }) => {
  const navigate = useNavigate();

  if (!isVisible) return null;

  const handleAction = (path) => {
    onComplete();
    navigate(path);
  };

  const actions = [
    {
      title: 'Add Your First Product',
      description: 'Start building your real inventory.',
      icon: 'PackagePlus',
      path: '/add-edit-product',
      variant: 'default'
    },
    {
      title: 'Explore the Dashboard',
      description: 'See your sample data in action.',
      icon: 'BarChart3',
      path: '/dashboard-overview',
      variant: 'outline'
    },
     {
      title: 'Make a Test Sale',
      description: 'Use the POS with your sample items.',
      icon: 'ShoppingCart',
      path: '/point-of-sale-pos',
      variant: 'outline'
    }
  ];

  return (
    <div className="fixed inset-0 z-300 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-modal max-w-2xl w-full mx-auto p-8 text-center">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="Rocket" size={32} color="white" />
        </div>
        <h2 className="font-heading font-bold text-3xl text-foreground mb-4">
          You're All Set! What's Next?
        </h2>
        <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
          Your setup is complete and we've added some sample data to help you get started. Choose your next step:
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleAction(action.path)}
              className={`p-6 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-md hover:-translate-y-1 ${
                action.variant === 'default'
                  ? 'border-primary bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'border-border bg-card text-foreground hover:border-primary hover:bg-muted'
              }`}
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                action.variant === 'default' ? 'bg-primary-foreground/20' : 'bg-primary'
              }`}>
                <Icon
                  name={action.icon}
                  size={24}
                  color={action.variant === 'default' ? 'currentColor' : 'white'}
                />
              </div>
              <h4 className="font-heading font-semibold text-lg mb-2">
                {action.title}
              </h4>
              <p className={`text-sm ${
                action.variant === 'default' ? 'text-primary-foreground/80' : 'text-muted-foreground'
              }`}>
                {action.description}
              </p>
            </button>
          ))}
        </div>
        
        <Button variant="ghost" onClick={onComplete}>
          Or, I'll explore on my own
        </Button>
      </div>
    </div>
  );
};

export default GuidedActionsOverlay;