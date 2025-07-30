import React, { useState, useEffect } from 'react';
import Button from './Button';
import Icon from '../AppIcon';

const OnboardingOverlay = ({ isVisible, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const onboardingSteps = [
    {
      title: 'Welcome to SabiStock',
      description: 'Your complete inventory management solution designed for Nigerian micro-businesses.',
      icon: 'Package',
      highlight: null,
      content: 'SabiStock helps you track products, manage sales, and grow your business with confidence.'
    },
    {
      title: 'Navigate Your Business',
      description: 'Use the sidebar to access all your business tools quickly and efficiently.',
      icon: 'Navigation',
      highlight: 'sidebar',
      content: 'Dashboard shows your performance, Products manages inventory, and Sales handles transactions.'
    },
    {
      title: 'Track Your Inventory',
      description: 'Add products, monitor stock levels, and never run out of your best-selling items.',
      icon: 'Package',
      highlight: 'products',
      content: 'Click "Product Management" to view your inventory or "Add Product" to expand your catalog.'
    },
    {
      title: 'Process Sales Easily',
      description: 'Use the Point of Sale to serve customers and track every transaction automatically.',
      icon: 'ShoppingCart',
      highlight: 'sales',
      content: 'Quick actions help you start new sales or review your sales history with one click.'
    },
    {
      title: 'You\'re Ready to Start',
      description: 'Begin by adding your first product or exploring your dashboard.',
      icon: 'CheckCircle',
      highlight: null,
      content: 'Remember: You can always access help and guidance through the interface tooltips.'
    }
  ];

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
      }, 200);
    } else {
      completeOnboarding();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsAnimating(false);
      }, 200);
    }
  };

  const completeOnboarding = () => {
    localStorage.setItem('sabistock_onboarding_completed', 'true');
    onComplete();
  };

  const skipOnboarding = () => {
    completeOnboarding();
  };

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const currentStepData = onboardingSteps[currentStep];
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;

  return (
    <div className="fixed inset-0 z-300 bg-black bg-opacity-75 flex items-center justify-center p-4">
      {/* Highlight Elements */}
      {currentStepData.highlight === 'sidebar' && (
        <div className="absolute left-0 top-0 w-240 h-full bg-white bg-opacity-10 border-2 border-accent rounded-r-lg pointer-events-none" />
      )}

      {/* Main Modal */}
      <div className={`
        bg-card rounded-lg shadow-modal max-w-md w-full mx-auto
        transition-all duration-200 ease-out
        ${isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}
      `}>
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon 
                  name={currentStepData.icon} 
                  size={20} 
                  color="white" 
                />
              </div>
              <div>
                <h2 className="font-heading font-semibold text-lg text-foreground">
                  {currentStepData.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Step {currentStep + 1} of {onboardingSteps.length}
                </p>
              </div>
            </div>
            
            <button
              onClick={skipOnboarding}
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              aria-label="Skip onboarding"
            >
              <Icon name="X" size={20} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-muted-foreground mb-4 leading-relaxed">
            {currentStepData.description}
          </p>
          
          <div className="bg-muted rounded-lg p-4 mb-6">
            <p className="text-sm text-foreground font-body">
              {currentStepData.content}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border flex items-center justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            iconName="ChevronLeft"
            iconPosition="left"
          >
            Previous
          </Button>

          <div className="flex items-center space-x-2">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`
                  w-2 h-2 rounded-full transition-colors duration-200
                  ${index === currentStep ? 'bg-primary' : 'bg-muted'}
                `}
              />
            ))}
          </div>

          <Button
            variant="default"
            onClick={nextStep}
            iconName={currentStep === onboardingSteps.length - 1 ? "CheckCircle" : "ChevronRight"}
            iconPosition="right"
          >
            {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingOverlay;