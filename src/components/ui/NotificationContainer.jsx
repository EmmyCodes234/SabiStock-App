import React, { useState, useEffect } from 'react';
import { subscribeToNotifications, removeNotification, NOTIFICATION_TYPES } from '../../utils/notifications';
import Icon from '../AppIcon';
import { cn } from '../../utils/cn';

const NotificationContainer = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToNotifications(setNotifications);
    return unsubscribe;
  }, []);

  const handleClose = (id) => {
    removeNotification(id);
  };

  const getNotificationStyles = (type) => {
    const baseClasses = 'border rounded-lg shadow-lg p-4 flex items-start space-x-3 min-w-80 max-w-md transition-all duration-300 ease-out';
    
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return cn(baseClasses, 'bg-green-50 border-green-200 text-green-800');
      case NOTIFICATION_TYPES.ERROR:
        return cn(baseClasses, 'bg-red-50 border-red-200 text-red-800');
      case NOTIFICATION_TYPES.WARNING:
        return cn(baseClasses, 'bg-yellow-50 border-yellow-200 text-yellow-800');
      case NOTIFICATION_TYPES.INFO:
        return cn(baseClasses, 'bg-blue-50 border-blue-200 text-blue-800');
      case NOTIFICATION_TYPES.LOADING:
        return cn(baseClasses, 'bg-gray-50 border-gray-200 text-gray-800');
      default:
        return cn(baseClasses, 'bg-card border-border text-foreground');
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return '#16a34a';
      case NOTIFICATION_TYPES.ERROR:
        return '#dc2626';
      case NOTIFICATION_TYPES.WARNING:
        return '#d97706';
      case NOTIFICATION_TYPES.INFO:
        return '#2563eb';
      case NOTIFICATION_TYPES.LOADING:
        return '#6b7280';
      default:
        return 'var(--color-foreground)';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-500 space-y-2">
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          className={getNotificationStyles(notification.type)}
          style={{
            transform: `translateY(${index * 8}px)`,
            zIndex: 500 - index
          }}
        >
          {/* Icon */}
          <div className="flex-shrink-0 mt-0.5">
            {notification.type === NOTIFICATION_TYPES.LOADING ? (
              <div className="animate-spin">
                <Icon 
                  name={notification.icon} 
                  size={20} 
                  color={getIconColor(notification.type)} 
                />
              </div>
            ) : (
              <Icon 
                name={notification.icon} 
                size={20} 
                color={getIconColor(notification.type)} 
              />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-5">
              {notification.message}
            </p>
            
            {/* Action button if provided */}
            {notification.action && (
              <button
                onClick={notification.action.onClick}
                className="mt-2 text-xs font-medium underline hover:no-underline"
              >
                {notification.action.label}
              </button>
            )}
          </div>

          {/* Close button */}
          {!notification.persistent && (
            <button
              onClick={() => handleClose(notification.id)}
              className="flex-shrink-0 ml-2 p-1 rounded-md hover:bg-black/5 transition-colors"
              aria-label="Close notification"
            >
              <Icon name="X" size={16} color={getIconColor(notification.type)} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer;