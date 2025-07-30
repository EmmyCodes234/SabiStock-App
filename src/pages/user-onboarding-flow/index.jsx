import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomeStep from './components/WelcomeStep';
import BusinessProfileStep from './components/BusinessProfileStep';
import ProductSetupStep from './components/ProductSetupStep';
import POSDemoStep from './components/POSDemoStep';
import CompletionStep from './components/CompletionStep';
import ProgressIndicator from './components/ProgressIndicator';

const UserOnboardingFlow = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [businessData, setBusinessData] = useState({
    businessName: '',
    businessType: '',
    businessSize: '',
    location: '',
    currency: 'NGN',
    phone: ''
  });
  const [sampleProducts, setSampleProducts] = useState([
    {
      name: '',
      sku: '',
      costPrice: '',
      sellingPrice: '',
      quantity: '',
      category: 'General'
    }
  ]);

  const steps = [
    {
      title: 'Welcome',
      subtitle: 'Get started with SabiStock',
      component: WelcomeStep
    },
    {
      title: 'Business Profile',
      subtitle: 'Tell us about your business',
      component: BusinessProfileStep
    },
    {
      title: 'Add Products',
      subtitle: 'Set up your inventory',
      component: ProductSetupStep
    },
    {
      title: 'POS Demo',
      subtitle: 'Learn to process sales',
      component: POSDemoStep
    },
    {
      title: 'Complete',
      subtitle: 'You\'re ready to start!',
      component: CompletionStep
    }
  ];

  // Check if user has already completed onboarding
  useEffect(() => {
    const onboardingCompleted = localStorage.getItem('sabistock_onboarding_completed');
    if (onboardingCompleted === 'true') {
      navigate('/dashboard-overview');
    }
  }, [navigate]);

  // Save progress to localStorage
  useEffect(() => {
    const progressData = {
      currentStep,
      businessData,
      sampleProducts,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('sabistock_onboarding_progress', JSON.stringify(progressData));
  }, [currentStep, businessData, sampleProducts]);

  // Load saved progress on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('sabistock_onboarding_progress');
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        const savedTime = new Date(progress.timestamp);
        const now = new Date();
        const hoursDiff = (now - savedTime) / (1000 * 60 * 60);
        
        // Only restore progress if it's less than 24 hours old
        if (hoursDiff < 24) {
          setCurrentStep(progress.currentStep || 0);
          setBusinessData(progress.businessData || businessData);
          setSampleProducts(progress.sampleProducts || sampleProducts);
        }
      } catch (error) {
        console.error('Error loading saved progress:', error);
      }
    }
  }, []);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipToEnd = () => {
    // Mark onboarding as completed and go to dashboard
    localStorage.setItem('sabistock_onboarding_completed', 'true');
    localStorage.removeItem('sabistock_onboarding_progress');
    navigate('/dashboard-overview');
  };

  const completeOnboarding = () => {
    // Save final data and mark as completed
    localStorage.setItem('sabistock_onboarding_completed', 'true');
    localStorage.setItem('sabistock_business_data', JSON.stringify(businessData));
    localStorage.setItem('sabistock_sample_products', JSON.stringify(sampleProducts));
    localStorage.removeItem('sabistock_onboarding_progress');
    navigate('/dashboard-overview');
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-background">
      {/* Progress Indicator - Only show for steps 1-4 */}
      {currentStep > 0 && currentStep < steps.length - 1 && (
        <ProgressIndicator
          currentStep={currentStep - 1}
          totalSteps={steps.length - 2}
          steps={steps.slice(1, -1)}
        />
      )}

      {/* Main Content */}
      <div className={currentStep > 0 && currentStep < steps.length - 1 ? 'pt-24' : ''}>
        <CurrentStepComponent
          onNext={nextStep}
          onPrev={prevStep}
          onSkip={skipToEnd}
          onComplete={completeOnboarding}
          businessData={businessData}
          setBusinessData={setBusinessData}
          sampleProducts={sampleProducts}
          setSampleProducts={setSampleProducts}
          currentStep={currentStep}
        />
      </div>

      {/* Skip Button - Fixed position for easy access */}
      {currentStep > 0 && currentStep < steps.length - 1 && (
        <button
          onClick={skipToEnd}
          className="
            fixed top-4 right-4 z-50
            text-sm text-muted-foreground hover:text-foreground
            bg-card border border-border rounded-lg px-3 py-2
            transition-colors duration-200
            shadow-sm hover:shadow-md
          "
        >
          Skip Setup
        </button>
      )}
    </div>
  );
};

export default UserOnboardingFlow;