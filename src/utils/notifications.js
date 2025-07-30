/**
 * Unified Notification System
 * Provides consistent, non-intrusive notifications throughout the app
 */

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  LOADING: 'loading'
};

// Global notification state
let notifications = [];
let listeners = [];
let notificationId = 0;

/**
 * Create a new notification
 */
export const showNotification = (message, type = NOTIFICATION_TYPES.INFO, options = {}) => {
  const notification = {
    id: ++notificationId,
    message,
    type,
    timestamp: Date.now(),
    duration: options.duration || (type === NOTIFICATION_TYPES.ERROR ? 8000 : 4000),
    persistent: options.persistent || false,
    action: options.action || null,
    icon: options.icon || getDefaultIcon(type),
    className: options.className || ''
  };

  notifications.push(notification);
  notifyListeners();

  // Auto-remove non-persistent notifications
  if (!notification.persistent) {
    setTimeout(() => {
      removeNotification(notification.id);
    }, notification.duration);
  }

  return notification.id;
};

/**
 * Remove a notification by ID
 */
export const removeNotification = (id) => {
  notifications = notifications.filter(n => n.id !== id);
  notifyListeners();
};

/**
 * Clear all notifications
 */
export const clearNotifications = () => {
  notifications = [];
  notifyListeners();
};

/**
 * Get all current notifications
 */
export const getNotifications = () => notifications;

/**
 * Subscribe to notification changes
 */
export const subscribeToNotifications = (callback) => {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter(l => l !== callback);
  };
};

/**
 * Notify all listeners of changes
 */
const notifyListeners = () => {
  listeners.forEach(listener => listener(notifications));
};

/**
 * Get default icon for notification type
 */
const getDefaultIcon = (type) => {
  switch (type) {
    case NOTIFICATION_TYPES.SUCCESS:
      return 'CheckCircle';
    case NOTIFICATION_TYPES.ERROR:
      return 'XCircle';
    case NOTIFICATION_TYPES.WARNING:
      return 'AlertTriangle';
    case NOTIFICATION_TYPES.INFO:
      return 'Info';
    case NOTIFICATION_TYPES.LOADING:
      return 'Loader';
    default:
      return 'Bell';
  }
};

/**
 * Predefined notification helpers
 */
export const notificationHelpers = {
  success: (message, options = {}) => showNotification(message, NOTIFICATION_TYPES.SUCCESS, options),
  error: (message, options = {}) => showNotification(message, NOTIFICATION_TYPES.ERROR, options),
  warning: (message, options = {}) => showNotification(message, NOTIFICATION_TYPES.WARNING, options),
  info: (message, options = {}) => showNotification(message, NOTIFICATION_TYPES.INFO, options),
  loading: (message, options = {}) => showNotification(message, NOTIFICATION_TYPES.LOADING, { ...options, persistent: true }),

  // Business-specific helpers
  productSaved: (productName) => showNotification(
    `Product "${productName}" saved successfully`,
    NOTIFICATION_TYPES.SUCCESS
  ),

  productDeleted: (productName) => showNotification(
    `Product "${productName}" deleted successfully`,
    NOTIFICATION_TYPES.SUCCESS
  ),

  saleCompleted: (total) => showNotification(
    `Sale completed successfully - ₦${total.toLocaleString()}`,
    NOTIFICATION_TYPES.SUCCESS
  ),

  stockAdjusted: (productName, newQuantity) => showNotification(
    `Stock updated for "${productName}" - New quantity: ${newQuantity}`,
    NOTIFICATION_TYPES.SUCCESS
  ),

  lowStockWarning: (productName, quantity) => showNotification(
    `Low stock alert: "${productName}" has only ${quantity} units remaining`,
    NOTIFICATION_TYPES.WARNING,
    { duration: 8000 }
  ),

  backupCreated: () => showNotification(
    'Data backup created successfully',
    NOTIFICATION_TYPES.SUCCESS
  ),

  backupRestored: (itemCount) => showNotification(
    `Data restored successfully - ${itemCount} items imported`,
    NOTIFICATION_TYPES.SUCCESS
  ),

  validationError: (errors) => {
    const errorMessage = Array.isArray(errors) 
      ? errors.join(', ') 
      : typeof errors === 'object' ? Object.values(errors).join(', ')
        : errors;
    
    return showNotification(
      `Validation Error: ${errorMessage}`,
      NOTIFICATION_TYPES.ERROR,
      { duration: 6000 }
    );
  },

  operationFailed: (operation, error) => showNotification(
    `${operation} failed: ${error}`,
    NOTIFICATION_TYPES.ERROR,
    { duration: 8000 }
  )
};

export default {
  show: showNotification,
  remove: removeNotification,
  clear: clearNotifications,
  subscribe: subscribeToNotifications,
  get: getNotifications,
  helpers: notificationHelpers,
  types: NOTIFICATION_TYPES
};