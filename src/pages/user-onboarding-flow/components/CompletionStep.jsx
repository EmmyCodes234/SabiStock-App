import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';


const CompletionStep = ({ businessData, sampleProducts }) => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'View Dashboard',
      description: 'See your business overview and key metrics',
      icon: 'BarChart3',
      path: '/dashboard-overview',
      variant: 'default'
    },
    {
      title: 'Manage Products',
      description: 'Add more products or edit existing ones',
      icon: 'Package',
      path: '/product-management',
      variant: 'outline'
    },
    {
      title: 'Start Selling',
      description: 'Process your first customer transaction',
      icon: 'ShoppingCart',
      path: '/point-of-sale-pos',
      variant: 'outline'
    }
  ];

  const features = [
    {
      icon: 'TrendingUp',
      title: 'Real-time Analytics',
      description: 'Track sales, profits, and inventory levels instantly'
    },
    {
      icon: 'Bell',
      title: 'Smart Alerts',
      description: 'Get notified when stock runs low or sales spike'
    },
    {
      icon: 'Shield',
      title: 'Data Security',
      description: 'Your business data is encrypted and secure'
    },
    {
      icon: 'Smartphone',
      title: 'Mobile Ready',
      description: 'Access your business from any device, anywhere'
    }
  ];

  const handleGetStarted = (path) => {
    // Mark onboarding as completed
    localStorage.setItem('sabistock_onboarding_completed', 'true');
    localStorage.setItem('sabistock_business_data', JSON.stringify(businessData));
    localStorage.setItem('sabistock_sample_products', JSON.stringify(sampleProducts));
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Icon name="CheckCircle" size={40} color="white" />
          </div>
          <h1 className="font-heading font-bold text-4xl text-foreground mb-4">
            🎉 Congratulations!
          </h1>
          <h2 className="font-heading font-semibold text-2xl text-foreground mb-2">
            Your SabiStock Setup is Complete
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            You're now ready to manage your inventory, process sales, and grow your business with confidence.
          </p>
        </div>

        {/* Setup Summary */}
        <div className="bg-card rounded-2xl shadow-lg border border-border p-8 mb-8">
          <h3 className="font-heading font-semibold text-xl text-foreground mb-6">
            Setup Summary
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Business Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="Store" size={20} color="white" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Business Profile</h4>
                  <p className="text-sm text-muted-foreground">
                    {businessData?.businessName || 'Your Business'}
                  </p>
                </div>
              </div>
              
              <div className="ml-13 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="text-foreground capitalize">
                    {businessData?.businessType || 'General'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Size:</span>
                  <span className="text-foreground capitalize">
                    {businessData?.businessSize || 'Small'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Currency:</span>
                  <span className="text-foreground">
                    {businessData?.currency === 'NGN' ? '₦ Nigerian Naira' : businessData?.currency || '₦ Nigerian Naira'}
                  </span>
                </div>
              </div>
            </div>

            {/* Products Summary */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                  <Icon name="Package" size={20} color="white" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Products Added</h4>
                  <p className="text-sm text-muted-foreground">
                    {sampleProducts?.length || 0} products in inventory
                  </p>
                </div>
              </div>
              
              {sampleProducts && sampleProducts.length > 0 && (
                <div className="ml-13 space-y-2">
                  {sampleProducts.slice(0, 3).map((product, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-muted-foreground truncate">
                        {product.name}
                      </span>
                      <span className="text-foreground">
                        ₦{parseInt(product.sellingPrice || 0).toLocaleString()}
                      </span>
                    </div>
                  ))}
                  {sampleProducts.length > 3 && (
                    <p className="text-xs text-muted-foreground">
                      +{sampleProducts.length - 3} more products
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-2xl shadow-lg border border-border p-8 mb-8">
          <h3 className="font-heading font-semibold text-xl text-foreground mb-6">
            What would you like to do first?
          </h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleGetStarted(action.path)}
                className={`p-6 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-md ${
                  action.variant === 'default' ?'border-primary bg-primary text-primary-foreground hover:bg-primary/90' :'border-border bg-card text-foreground hover:border-primary hover:bg-muted'
                }`}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                  action.variant === 'default' ?'bg-primary-foreground/20' :'bg-primary'
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
                  action.variant === 'default' ?'text-primary-foreground/80' :'text-muted-foreground'
                }`}>
                  {action.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Features Overview */}
        <div className="bg-card rounded-2xl shadow-lg border border-border p-8 mb-8">
          <h3 className="font-heading font-semibold text-xl text-foreground mb-6">
            What's Available for You
          </h3>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Icon name={feature.icon} size={20} color="var(--color-primary)" />
                </div>
                <h4 className="font-heading font-medium text-foreground mb-2">
                  {feature.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-card rounded-2xl shadow-lg border border-border p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon name="HeadphonesIcon" size={32} color="white" />
            </div>
            <h3 className="font-heading font-semibold text-xl text-foreground mb-2">
              Need Help Getting Started?
            </h3>
            <p className="text-muted-foreground mb-6">
              Our support team is here to help you succeed with SabiStock
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                iconName="MessageCircle"
                iconPosition="left"
                onClick={() => window.open('mailto:support@sabistock.com', '_blank')}
              >
                Contact Support
              </Button>
              <Button
                variant="outline"
                iconName="BookOpen"
                iconPosition="left"
                onClick={() => window.open('#', '_blank')}
              >
                View Help Guide
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Message */}
        <div className="text-center mt-8">
          <p className="text-muted-foreground">
            Welcome to the SabiStock family! 🚀 Let's grow your business together.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompletionStep;