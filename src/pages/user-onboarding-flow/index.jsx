import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomeStep from './components/WelcomeStep';
import BusinessProfileStep from './components/BusinessProfileStep';
import ProductSetupStep from './components/ProductSetupStep';
import POSDemoStep from './components/POSDemoStep';
import CompletionStep from './components/CompletionStep';
import ProgressIndicator from './components/ProgressIndicator';
import { productService, profileService, authService } from '../../utils/apiService';
import { notificationHelpers } from '../../utils/notifications';
import { useAuth } from '../../contexts/AuthContext';

const UserOnboardingFlow = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [businessData, setBusinessData] = useState({
    business_name: '',
    business_type: '',
    business_size: '',
    location: '',
    currency: 'NGN',
    phone: ''
  });
  const [sampleProducts, setSampleProducts] = useState([
    {
      name: 'Samsung Galaxy Phone',
      sku: 'PHONE-001',
      cost_price: '180000',
      selling_price: '220000',
      quantity: '15',
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop'
    },
    {
      name: 'Nike Air Max Sneakers',
      sku: 'SHOE-002',
      cost_price: '25000',
      selling_price: '35000',
      quantity: '8',
      category: 'Fashion',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop'
    },
    {
      name: 'Organic Face Cream',
      sku: 'BEAUTY-003',
      cost_price: '3500',
      selling_price: '5500',
      quantity: '25',
      category: 'Beauty',
      image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop'
    }
  ]);

  const steps = [
    { title: 'Welcome', component: WelcomeStep },
    { title: 'Business Profile', component: BusinessProfileStep },
    { title: 'Add Products', component: ProductSetupStep },
    { title: 'POS Demo', component: POSDemoStep },
    { title: 'Complete', component: CompletionStep }
  ];

  useEffect(() => {
    // If user is logged in but tries to visit onboarding, send them to the dashboard.
    // We will add a check later to see if they have *completed* onboarding.
    if (session) {
        // A real implementation would check a `has_completed_onboarding` flag on the user's profile
    }
  }, [session, navigate]);


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
    // In a real app, you might want to set a flag that the user skipped.
    // For now, we just navigate them away.
    navigate('/dashboard-overview');
  };

  const completeOnboarding = async (path = '/dashboard-overview') => {
    try {
      notificationHelpers.info("Saving your setup, please wait...");

      // Step 1: Update the user's profile with the business data
      await profileService.updateProfile(businessData);

      // Step 2: Create the sample products and associate them with the user
      for (const product of sampleProducts) {
        if (product.name && product.selling_price && product.quantity) {
          try {
            // Ensure the field names match the database schema
            const productToCreate = {
              name: product.name,
              sku: product.sku,
              cost_price: parseFloat(product.cost_price) || 0,
              selling_price: parseFloat(product.selling_price) || 0,
              quantity: parseInt(product.quantity, 10) || 0,
              category: product.category,
              image: product.image,
              low_stock_threshold: 5, // A sensible default
            };
            await productService.create(productToCreate);
          } catch (error) {
            // It's okay if a sample product fails (e.g., duplicate SKU),
            // we just log it and continue.
            console.warn(`Could not create sample product: ${product.name}. Reason: ${error.message}`);
          }
        }
      }
      
      // We will later update the user's profile to mark onboarding as complete.
      // For now, we can use a localStorage flag as a temporary measure.
      localStorage.setItem('sabistock_just_onboarded', 'true');
      
      notificationHelpers.success("Setup complete! Welcome to SabiStock.");
      navigate(path);

    } catch (error) {
      notificationHelpers.error(`Onboarding failed: ${error.message}`);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-background">
      {currentStep > 0 && currentStep < steps.length - 1 && (
        <ProgressIndicator
          currentStep={currentStep - 1}
          totalSteps={steps.length - 2}
          steps={steps.slice(1, -1)}
        />
      )}
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
        />
      </div>
    </div>
  );
};

export default UserOnboardingFlow;