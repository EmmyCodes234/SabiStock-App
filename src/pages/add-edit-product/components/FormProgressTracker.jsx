import React from 'react';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';

const FormProgressTracker = ({ progress }) => {
  const steps = [
    { id: 'details', label: 'Product Details' },
    { id: 'pricing', label: 'Pricing Info' },
    { id: 'inventory', label: 'Inventory Setup' },
    { id: 'image', label: 'Upload Image' },
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6 sticky top-8">
      <h3 className="font-heading font-semibold text-lg text-foreground mb-6">Your Progress</h3>
      <ul className="space-y-4">
        {steps.map((step, index) => {
          const isCompleted = progress[step.id];
          return (
            <li key={step.id} className="flex items-start space-x-3">
              <div
                className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-300',
                  isCompleted ? 'bg-success text-success-foreground' : 'bg-muted border-2 border-border'
                )}
              >
                {isCompleted ? (
                  <Icon name="Check" size={14} />
                ) : (
                  <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                )}
              </div>
              <div>
                <p className={cn('font-medium text-sm', isCompleted ? 'text-foreground' : 'text-muted-foreground')}>
                  {step.label}
                </p>
                <p className="text-xs text-muted-foreground">{index + 1} of {steps.length}</p>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-6">
        <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-success h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Object.values(progress).filter(Boolean).length / steps.length * 100}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            {Object.values(progress).filter(Boolean).length} of {steps.length} steps completed
          </p>
      </div>
    </div>
  );
};

export default FormProgressTracker;