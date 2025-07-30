import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const WelcomeStep = ({ onNext, onSkip }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid lg:grid-cols-2 gap-8 items-center">
        {/* Content Section */}
        <div className="text-center lg:text-left space-y-6">
          <div className="flex items-center justify-center lg:justify-start space-x-3 mb-6">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Icon name="Package" size={24} color="white" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-2xl text-foreground">
                SabiStock
              </h1>
              <p className="text-sm text-muted-foreground">
                Inventory Management
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-foreground leading-tight">
              Welcome to Your Business Success Journey
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Join thousands of Nigerian entrepreneurs who trust SabiStock to manage their inventory, track sales, and grow their businesses with confidence.
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                <Icon name="Check" size={16} color="white" />
              </div>
              <span className="text-foreground font-medium">
                Easy inventory tracking with real-time updates
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                <Icon name="Check" size={16} color="white" />
              </div>
              <span className="text-foreground font-medium">
                Simple point-of-sale system for quick transactions
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                <Icon name="Check" size={16} color="white" />
              </div>
              <span className="text-foreground font-medium">
                Detailed sales reports and business insights
              </span>
            </div>
          </div>

          {/* Testimonial */}
          <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
            <div className="flex items-start space-x-4">
              <Image
                src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face"
                alt="Testimonial"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="text-sm text-foreground italic mb-2">
                  "SabiStock transformed how I manage my shop. Sales tracking is now effortless, and I never run out of stock unexpectedly."
                </p>
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Adunni Okafor</span> - Lagos Fashion Store Owner
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              variant="default"
              size="lg"
              onClick={onNext}
              iconName="ArrowRight"
              iconPosition="right"
              className="flex-1 sm:flex-none"
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={onSkip}
              className="flex-1 sm:flex-none"
            >
              Skip Setup
            </Button>
          </div>
        </div>

        {/* Image Section */}
        <div className="hidden lg:block">
          <div className="relative">
            <Image
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop"
              alt="Nigerian business owner managing inventory"
              className="w-full h-96 object-cover rounded-2xl shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
            
            {/* Floating Stats Cards */}
            <div className="absolute -bottom-4 -left-4 bg-card rounded-lg p-4 shadow-lg border border-border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-success rounded-lg flex items-center justify-center">
                  <Icon name="TrendingUp" size={20} color="white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">₦2.4M</p>
                  <p className="text-xs text-muted-foreground">Monthly Revenue</p>
                </div>
              </div>
            </div>
            
            <div className="absolute -top-4 -right-4 bg-card rounded-lg p-4 shadow-lg border border-border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                  <Icon name="Package" size={20} color="white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">1,247</p>
                  <p className="text-xs text-muted-foreground">Products Tracked</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeStep;