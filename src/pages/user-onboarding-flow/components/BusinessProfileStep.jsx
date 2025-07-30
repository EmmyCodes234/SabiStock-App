import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const BusinessProfileStep = ({ onNext, onPrev, onSkip, businessData, setBusinessData }) => {
  const [errors, setErrors] = useState({});

  const businessTypes = [
    { value: 'retail', label: 'Retail Store' },
    { value: 'fashion', label: 'Fashion & Clothing' },
    { value: 'electronics', label: 'Electronics & Gadgets' },
    { value: 'food', label: 'Food & Beverages' },
    { value: 'beauty', label: 'Beauty & Cosmetics' },
    { value: 'pharmacy', label: 'Pharmacy & Health' },
    { value: 'automotive', label: 'Automotive Parts' },
    { value: 'books', label: 'Books & Stationery' },
    { value: 'other', label: 'Other' }
  ];

  const businessSizes = [
    { value: 'micro', label: 'Micro (1-10 products)' },
    { value: 'small', label: 'Small (11-100 products)' },
    { value: 'medium', label: 'Medium (101-500 products)' },
    { value: 'large', label: 'Large (500+ products)' }
  ];

  const currencies = [
    { value: 'NGN', label: '₦ Nigerian Naira (NGN)' },
    { value: 'USD', label: '$ US Dollar (USD)' },
    { value: 'GHS', label: '₵ Ghanaian Cedi (GHS)' },
    { value: 'KES', label: 'KSh Kenyan Shilling (KES)' }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!businessData.businessName?.trim()) {
      newErrors.businessName = 'Business name is required';
    }
    
    if (!businessData.businessType) {
      newErrors.businessType = 'Please select your business type';
    }
    
    if (!businessData.businessSize) {
      newErrors.businessSize = 'Please select your business size';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const handleInputChange = (field, value) => {
    setBusinessData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Icon name="Store" size={32} color="white" />
          </div>
          <h2 className="font-heading font-bold text-3xl text-foreground mb-2">
            Tell Us About Your Business
          </h2>
          <p className="text-muted-foreground text-lg">
            Help us customize SabiStock to fit your specific business needs
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-card rounded-2xl shadow-lg border border-border p-8">
          <div className="space-y-6">
            {/* Business Name */}
            <Input
              label="Business Name"
              type="text"
              placeholder="Enter your business name"
              value={businessData.businessName || ''}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
              error={errors.businessName}
              required
              description="This will appear on your reports and receipts"
            />

            {/* Business Type */}
            <Select
              label="Business Type"
              placeholder="Select your business category"
              options={businessTypes}
              value={businessData.businessType || ''}
              onChange={(value) => handleInputChange('businessType', value)}
              error={errors.businessType}
              required
              searchable
              description="Choose the category that best describes your business"
            />

            {/* Business Size */}
            <Select
              label="Business Size"
              placeholder="Select your inventory size"
              options={businessSizes}
              value={businessData.businessSize || ''}
              onChange={(value) => handleInputChange('businessSize', value)}
              error={errors.businessSize}
              required
              description="This helps us optimize the interface for your needs"
            />

            {/* Location */}
            <Input
              label="Business Location (Optional)"
              type="text"
              placeholder="e.g., Lagos, Abuja, Port Harcourt"
              value={businessData.location || ''}
              onChange={(e) => handleInputChange('location', e.target.value)}
              description="City or state where your business operates"
            />

            {/* Currency */}
            <Select
              label="Preferred Currency"
              placeholder="Select your currency"
              options={currencies}
              value={businessData.currency || 'NGN'}
              onChange={(value) => handleInputChange('currency', value)}
              description="Currency for pricing and reports"
            />

            {/* Phone Number */}
            <Input
              label="Contact Number (Optional)"
              type="tel"
              placeholder="e.g., +234 801 234 5678"
              value={businessData.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              description="For customer support and notifications"
            />
          </div>

          {/* Tips Section */}
          <div className="mt-8 bg-muted rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon name="Lightbulb" size={16} color="white" />
              </div>
              <div>
                <h4 className="font-heading font-semibold text-foreground mb-2">
                  Pro Tips for Success
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Accurate business information helps generate better reports</li>
                  <li>• Your business type determines which features we highlight</li>
                  <li>• You can update these details anytime in settings</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button
              variant="outline"
              size="lg"
              onClick={onPrev}
              iconName="ArrowLeft"
              iconPosition="left"
              className="flex-1 sm:flex-none"
            >
              Back
            </Button>
            
            <div className="flex gap-4 flex-1">
              <Button
                variant="ghost"
                size="lg"
                onClick={onSkip}
                className="flex-1 sm:flex-none"
              >
                Skip for Now
              </Button>
              
              <Button
                variant="default"
                size="lg"
                onClick={handleNext}
                iconName="ArrowRight"
                iconPosition="right"
                className="flex-1"
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfileStep;