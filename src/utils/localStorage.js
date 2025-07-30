/**
 * Comprehensive Local Storage Management Service
 * Handles all data operations with atomic transactions, validation, and error handling
 * Designed for easy migration to Supabase
 */

// Storage keys
export const STORAGE_KEYS = {
  PRODUCTS: 'sabi_products',
  SALES: 'sabi_sales',
  AUDIT_LOG: 'sabi_audit_log',
  USER_SETTINGS: 'sabi_user_settings',
  BUSINESS_PROFILE: 'sabi_business_profile',
  DATA_VERSION: 'sabi_data_version'
};

// Current data version for migration compatibility
const CURRENT_DATA_VERSION = '1.0.0';

// In-memory cache for performance optimization
let cache = {
  products: null,
  sales: null,
  auditLog: null,
  lastUpdated: null
};

/**
 * Generic Local Storage operations with error handling
 */
const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      throw new Error(`Failed to read data: ${error.message}`);
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage (${key}):`, error);
      if (error.name === 'QuotaExceededError') {
        throw new Error('Storage quota exceeded. Please backup and clear old data.');
      }
      throw new Error(`Failed to save data: ${error.message}`);
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage (${key}):`, error);
      throw new Error(`Failed to remove data: ${error.message}`);
    }
  },

  clear: () => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      cache = { products: null, sales: null, auditLog: null, lastUpdated: null };
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      throw new Error(`Failed to clear data: ${error.message}`);
    }
  }
};

/**
 * Data validation functions
 */
const validators = {
  product: (product) => {
    const errors = {};
    
    if (!product.name?.toString().trim()) {
      errors.name = 'Product name is required';
    }
    
    if (!product.sku?.toString().trim()) {
      errors.sku = 'SKU is required';
    } else if (product.sku.length > 50) {
      errors.sku = 'SKU must be less than 50 characters';
    }
    
    if (!product.costPrice || isNaN(parseFloat(product.costPrice)) || parseFloat(product.costPrice) < 0) {
      errors.costPrice = 'Valid cost price is required';
    }
    
    if (!product.sellingPrice || isNaN(parseFloat(product.sellingPrice)) || parseFloat(product.sellingPrice) < 0) {
      errors.sellingPrice = 'Valid selling price is required';
    }
    
    if (product.quantity !== undefined && (isNaN(parseInt(product.quantity)) || parseInt(product.quantity) < 0)) {
      errors.quantity = 'Quantity must be a non-negative number';
    }
    
    if (product.lowStockThreshold !== undefined && (isNaN(parseInt(product.lowStockThreshold)) || parseInt(product.lowStockThreshold) < 0)) {
      errors.lowStockThreshold = 'Low stock threshold must be a non-negative number';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  sale: (sale) => {
    const errors = {};
    
    if (!sale.items || !Array.isArray(sale.items) || sale.items.length === 0) {
      errors.items = 'Sale must contain at least one item';
    }
    
    if (!sale.total || isNaN(parseFloat(sale.total)) || parseFloat(sale.total) <= 0) {
      errors.total = 'Valid total amount is required';
    }
    
    if (!sale.paymentMethod) {
      errors.paymentMethod = 'Payment method is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  stockAdjustment: (adjustment) => {
    const errors = {};
    
    if (!adjustment.productId) {
      errors.productId = 'Product ID is required';
    }
    
    if (adjustment.quantity === undefined || isNaN(parseInt(adjustment.quantity))) {
      errors.quantity = 'Valid quantity is required';
    }
    
    if (!adjustment.reason?.toString().trim()) {
      errors.reason = 'Adjustment reason is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};

/**
 * Cache management functions
 */
const cacheManager = {
  invalidate: () => {
    cache = { products: null, sales: null, auditLog: null, lastUpdated: null };
  },

  updateProducts: (products) => {
    cache.products = products;
    cache.lastUpdated = Date.now();
  },

  updateSales: (sales) => {
    cache.sales = sales;
    cache.lastUpdated = Date.now();
  },

  updateAuditLog: (auditLog) => {
    cache.auditLog = auditLog;
    cache.lastUpdated = Date.now();
  },

  isValid: () => {
    return cache.lastUpdated && (Date.now() - cache.lastUpdated) < 30000; // 30 seconds cache
  }
};

/**
 * Audit logging system
 */
const auditLogger = {
  log: (action, entityType, entityId, details = {}) => {
    try {
      const auditLog = storage.get(STORAGE_KEYS.AUDIT_LOG) || [];
      const entry = {
        id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        action,
        entityType,
        entityId,
        details,
        userAgent: navigator.userAgent
      };
      
      auditLog.push(entry);
      
      // Keep only last 1000 audit entries to prevent storage bloat
      if (auditLog.length > 1000) {
        auditLog.splice(0, auditLog.length - 1000);
      }
      
      storage.set(STORAGE_KEYS.AUDIT_LOG, auditLog);
      cacheManager.updateAuditLog(auditLog);
      
      return entry;
    } catch (error) {
      console.error('Failed to log audit entry:', error);
    }
  },

  getLog: () => {
    if (cache.auditLog && cacheManager.isValid()) {
      return cache.auditLog;
    }
    
    const auditLog = storage.get(STORAGE_KEYS.AUDIT_LOG) || [];
    cacheManager.updateAuditLog(auditLog);
    return auditLog;
  }
};

/**
 * Product management functions
 */
export const productService = {
  getAll: () => {
    if (cache.products && cacheManager.isValid()) {
      return cache.products;
    }
    
    const products = storage.get(STORAGE_KEYS.PRODUCTS) || [];
    cacheManager.updateProducts(products);
    return products;
  },

  getById: (id) => {
    const products = productService.getAll();
    return products.find(p => p.id.toString() === id.toString());
  },

  create: (productData) => {
    const validation = validators.product(productData);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${Object.values(validation.errors).join(', ')}`);
    }

    const products = productService.getAll();
    
    // Check SKU uniqueness
    if (products.some(p => p.sku === productData.sku)) {
      throw new Error('A product with this SKU already exists');
    }

    const newProduct = {
      id: Date.now().toString(),
      ...productData,
      costPrice: parseFloat(productData.costPrice),
      sellingPrice: parseFloat(productData.sellingPrice),
      quantity: parseInt(productData.quantity) || 0,
      lowStockThreshold: parseInt(productData.lowStockThreshold) || 5,
      dateAdded: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    products.push(newProduct);
    storage.set(STORAGE_KEYS.PRODUCTS, products);
    cacheManager.updateProducts(products);
    
    auditLogger.log('CREATE', 'PRODUCT', newProduct.id, { name: newProduct.name, sku: newProduct.sku });
    
    return newProduct;
  },

  update: (id, updateData) => {
    const validation = validators.product(updateData);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${Object.values(validation.errors).join(', ')}`);
    }

    const products = productService.getAll();
    const index = products.findIndex(p => p.id.toString() === id.toString());
    
    if (index === -1) {
      throw new Error('Product not found');
    }

    // Check SKU uniqueness (excluding current product)
    if (updateData.sku && products.some(p => p.sku === updateData.sku && p.id.toString() !== id.toString())) {
      throw new Error('A product with this SKU already exists');
    }

    const originalProduct = { ...products[index] };
    const updatedProduct = {
      ...originalProduct,
      ...updateData,
      costPrice: parseFloat(updateData.costPrice),
      sellingPrice: parseFloat(updateData.sellingPrice),
      quantity: parseInt(updateData.quantity) || 0,
      lowStockThreshold: parseInt(updateData.lowStockThreshold) || 5,
      lastModified: new Date().toISOString()
    };

    products[index] = updatedProduct;
    storage.set(STORAGE_KEYS.PRODUCTS, products);
    cacheManager.updateProducts(products);
    
    auditLogger.log('UPDATE', 'PRODUCT', id, {
      changes: Object.keys(updateData),
      name: updatedProduct.name
    });
    
    return updatedProduct;
  },

  delete: (id) => {
    const products = productService.getAll();
    const index = products.findIndex(p => p.id.toString() === id.toString());
    
    if (index === -1) {
      throw new Error('Product not found');
    }

    const deletedProduct = products[index];
    products.splice(index, 1);
    
    storage.set(STORAGE_KEYS.PRODUCTS, products);
    cacheManager.updateProducts(products);
    
    auditLogger.log('DELETE', 'PRODUCT', id, {
      name: deletedProduct.name,
      sku: deletedProduct.sku
    });
    
    return deletedProduct;
  },

  adjustStock: (productId, newQuantity, reason, type = 'manual') => {
    const adjustment = { productId, quantity: newQuantity, reason, type };
    const validation = validators.stockAdjustment(adjustment);
    
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${Object.values(validation.errors).join(', ')}`);
    }

    const products = productService.getAll();
    const index = products.findIndex(p => p.id.toString() === productId.toString());
    
    if (index === -1) {
      throw new Error('Product not found');
    }

    const originalQuantity = products[index].quantity;
    products[index].quantity = parseInt(newQuantity);
    products[index].lastModified = new Date().toISOString();
    
    storage.set(STORAGE_KEYS.PRODUCTS, products);
    cacheManager.updateProducts(products);
    
    auditLogger.log('STOCK_ADJUSTMENT', 'PRODUCT', productId, {
      originalQuantity,
      newQuantity: parseInt(newQuantity),
      difference: parseInt(newQuantity) - originalQuantity,
      reason,
      type,
      productName: products[index].name
    });
    
    return products[index];
  }
};

/**
 * Sales management functions with atomic operations
 */
export const salesService = {
  getAll: () => {
    if (cache.sales && cacheManager.isValid()) {
      return cache.sales;
    }
    
    const sales = storage.get(STORAGE_KEYS.SALES) || [];
    cacheManager.updateSales(sales);
    return sales;
  },

  getById: (id) => {
    const sales = salesService.getAll();
    return sales.find(s => s.id === id);
  },

  // Atomic sale creation with automatic stock deduction
  createSale: (saleData) => {
    const validation = validators.sale(saleData);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${Object.values(validation.errors).join(', ')}`);
    }

    // Begin atomic operation
    const rollbackData = {
      products: [...productService.getAll()],
      sales: [...salesService.getAll()]
    };

    try {
      // Validate stock availability for all items
      const products = productService.getAll();
      const stockValidation = saleData.items.map(item => {
        const product = products.find(p => p.id.toString() === item.productId.toString());
        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }
        if (product.quantity < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}. Available: ${product.quantity}, Required: ${item.quantity}`);
        }
        return { product, item };
      });

      // Create sale record
      const newSale = {
        id: `sale_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...saleData,
        total: parseFloat(saleData.total),
        date: new Date().toISOString(),
        status: 'completed'
      };

      // Update product quantities
      stockValidation.forEach(({ product, item }) => {
        productService.adjustStock(
          product.id,
          product.quantity - item.quantity,
          `Sale: ${newSale.id}`,
          'sale'
        );
      });

      // Add sale to storage
      const sales = salesService.getAll();
      sales.push(newSale);
      storage.set(STORAGE_KEYS.SALES, sales);
      cacheManager.updateSales(sales);

      auditLogger.log('CREATE', 'SALE', newSale.id, {
        total: newSale.total,
        itemCount: newSale.items.length,
        paymentMethod: newSale.paymentMethod
      });

      return newSale;

    } catch (error) {
      // Rollback on failure
      storage.set(STORAGE_KEYS.PRODUCTS, rollbackData.products);
      storage.set(STORAGE_KEYS.SALES, rollbackData.sales);
      cacheManager.updateProducts(rollbackData.products);
      cacheManager.updateSales(rollbackData.sales);
      
      auditLogger.log('ROLLBACK', 'SALE', 'failed_creation', { error: error.message });
      
      throw new Error(`Sale creation failed: ${error.message}`);
    }
  },

  // Update sale status (for refunds, cancellations)
  updateStatus: (saleId, newStatus, reason = '') => {
    const sales = salesService.getAll();
    const index = sales.findIndex(s => s.id === saleId);
    
    if (index === -1) {
      throw new Error('Sale not found');
    }

    const originalStatus = sales[index].status;
    sales[index].status = newStatus;
    sales[index].lastModified = new Date().toISOString();
    
    if (reason) {
      sales[index].statusReason = reason;
    }

    // Handle refunds - restore stock
    if (newStatus === 'refunded' && originalStatus === 'completed') {
      sales[index].items.forEach(item => {
        const product = productService.getById(item.productId);
        if (product) {
          productService.adjustStock(
            product.id,
            product.quantity + item.quantity,
            `Refund: ${saleId}`,
            'refund'
          );
        }
      });
    }

    storage.set(STORAGE_KEYS.SALES, sales);
    cacheManager.updateSales(sales);
    
    auditLogger.log('UPDATE', 'SALE', saleId, {
      originalStatus,
      newStatus,
      reason
    });

    return sales[index];
  }
};

/**
 * Data backup and restore functions
 */
export const backupService = {
  export: () => {
    try {
      const data = {
        version: CURRENT_DATA_VERSION,
        timestamp: new Date().toISOString(),
        products: productService.getAll(),
        sales: salesService.getAll(),
        auditLog: auditLogger.getLog(),
        userSettings: storage.get(STORAGE_KEYS.USER_SETTINGS) || {},
        businessProfile: storage.get(STORAGE_KEYS.BUSINESS_PROFILE) || {}
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `sabistock-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      auditLogger.log('EXPORT', 'BACKUP', 'data_export', {
        productCount: data.products.length,
        salesCount: data.sales.length
      });
      
      return { success: true, message: 'Data exported successfully' };
    } catch (error) {
      throw new Error(`Export failed: ${error.message}`);
    }
  },

  import: async (file) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      // Validate backup format
      if (!data.version || !data.products || !data.sales) {
        throw new Error('Invalid backup file format');
      }

      // Create backup of current data before import
      const currentBackup = {
        products: productService.getAll(),
        sales: salesService.getAll(),
        auditLog: auditLogger.getLog()
      };

      try {
        // Import data
        storage.set(STORAGE_KEYS.PRODUCTS, data.products);
        storage.set(STORAGE_KEYS.SALES, data.sales);
        
        if (data.auditLog) {
          storage.set(STORAGE_KEYS.AUDIT_LOG, data.auditLog);
        }
        
        if (data.userSettings) {
          storage.set(STORAGE_KEYS.USER_SETTINGS, data.userSettings);
        }
        
        if (data.businessProfile) {
          storage.set(STORAGE_KEYS.BUSINESS_PROFILE, data.businessProfile);
        }

        // Update version
        storage.set(STORAGE_KEYS.DATA_VERSION, data.version);
        
        // Invalidate cache
        cacheManager.invalidate();
        
        auditLogger.log('IMPORT', 'BACKUP', 'data_import', {
          productCount: data.products.length,
          salesCount: data.sales.length,
          importedVersion: data.version
        });
        
        return { 
          success: true, 
          message: `Import successful. Loaded ${data.products.length} products and ${data.sales.length} sales.` 
        };
        
      } catch (importError) {
        // Rollback on failure
        storage.set(STORAGE_KEYS.PRODUCTS, currentBackup.products);
        storage.set(STORAGE_KEYS.SALES, currentBackup.sales);
        storage.set(STORAGE_KEYS.AUDIT_LOG, currentBackup.auditLog);
        cacheManager.invalidate();
        
        throw new Error(`Import failed, data restored: ${importError.message}`);
      }
      
    } catch (error) {
      throw new Error(`Import failed: ${error.message}`);
    }
  }
};

/**
 * Analytics and reporting functions
 */
export const analyticsService = {
  getStorageUsage: () => {
    const usage = {};
    let totalSize = 0;
    
    Object.entries(STORAGE_KEYS).forEach(([key, storageKey]) => {
      const data = localStorage.getItem(storageKey);
      const size = data ? new Blob([data]).size : 0;
      usage[key] = {
        size,
        sizeFormatted: formatBytes(size)
      };
      totalSize += size;
    });
    
    // Estimate quota (most browsers: 5-10MB)
    const estimatedQuota = 5 * 1024 * 1024; // 5MB conservative estimate
    
    return {
      usage,
      totalSize,
      totalSizeFormatted: formatBytes(totalSize),
      estimatedQuota,
      usagePercentage: Math.round((totalSize / estimatedQuota) * 100)
    };
  },

  getLowStockProducts: () => {
    const products = productService.getAll();
    return products.filter(p => p.quantity <= p.lowStockThreshold);
  },

  getTopSellingProducts: (limit = 10) => {
    const sales = salesService.getAll().filter(s => s.status === 'completed');
    const productSales = {};
    
    sales.forEach(sale => {
      sale.items.forEach(item => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = {
            productId: item.productId,
            totalQuantity: 0,
            totalRevenue: 0
          };
        }
        productSales[item.productId].totalQuantity += item.quantity;
        productSales[item.productId].totalRevenue += item.price * item.quantity;
      });
    });
    
    return Object.values(productSales)
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, limit);
  }
};

// Utility function for formatting file sizes
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Initialize data version on first load
if (!storage.get(STORAGE_KEYS.DATA_VERSION)) {
  storage.set(STORAGE_KEYS.DATA_VERSION, CURRENT_DATA_VERSION);
}

export default {
  productService,
  salesService,
  backupService,
  analyticsService,
  auditLogger,
  storage,
  STORAGE_KEYS
};