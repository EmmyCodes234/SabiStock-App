import React from 'react';
import Icon from '../../../components/AppIcon';

const RecentActivity = ({ activities, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="bg-card rounded-lg border border-border p-6 shadow-card">
        <div className="h-6 bg-muted rounded w-32 animate-pulse mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="flex items-start space-x-3 animate-pulse">
              <div className="w-8 h-8 bg-muted rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-muted rounded w-48 mb-2"></div>
                <div className="h-3 bg-muted rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'sale':
        return 'ShoppingCart';
      case 'product_added':
        return 'Plus';
      case 'stock_update':
        return 'Package';
      case 'low_stock':
        return 'AlertTriangle';
      default:
        return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'sale':
        return 'var(--color-success)';
      case 'product_added':
        return 'var(--color-primary)';
      case 'stock_update':
        return 'var(--color-accent)';
      case 'low_stock':
        return 'var(--color-warning)';
      default:
        return 'var(--color-muted-foreground)';
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-card">
      <h2 className="font-heading font-semibold text-lg text-foreground mb-6">
        Recent Activity
      </h2>

      {activities.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Activity" size={24} color="var(--color-muted-foreground)" />
          </div>
          <p className="text-muted-foreground font-body mb-2">No recent activity</p>
          <p className="text-sm text-muted-foreground">
            Your business activities will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${getActivityColor(activity.type)}20` }}
              >
                <Icon 
                  name={getActivityIcon(activity.type)} 
                  size={16} 
                  color={getActivityColor(activity.type)} 
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm text-foreground">
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatTime(activity.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;