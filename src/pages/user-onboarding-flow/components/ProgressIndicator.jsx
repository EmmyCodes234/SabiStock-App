import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressIndicator = ({ currentStep, totalSteps, steps }) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Mobile Progress */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-heading font-semibold text-foreground">
              {steps[currentStep]?.title || 'Setup Progress'}
            </h3>
            <span className="text-sm text-muted-foreground">
              {currentStep + 1} of {totalSteps}
            </span>
          </div>
          
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Desktop Progress */}
        <div className="hidden lg:block">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                {/* Step Circle */}
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200
                  ${index < currentStep 
                    ? 'bg-success border-success text-success-foreground' 
                    : index === currentStep
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'bg-muted border-muted-foreground text-muted-foreground'
                  }
                `}>
                  {index < currentStep ? (
                    <Icon name="Check" size={16} color="currentColor" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>

                {/* Step Label */}
                <div className="ml-3 min-w-0">
                  <p className={`text-sm font-medium truncate ${
                    index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </p>
                  {step.subtitle && (
                    <p className="text-xs text-muted-foreground truncate">
                      {step.subtitle}
                    </p>
                  )}
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className={`
                    flex-1 h-0.5 mx-4 transition-colors duration-200
                    ${index < currentStep ? 'bg-success' : 'bg-muted'}
                  `} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;