import { supabase } from './supabaseClient';
import { notificationHelpers } from './notifications';

/**
 * ======================================================
 * Authentication Service
 * ======================================================
 */
export const authService = {
  getSession: () => {
    return supabase.auth.getSession();
  },
  getUser: async () => {
    const { data } = await supabase.auth.getUser();
    return data.user;
  },
  onAuthStateChange: (callback) => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
    return authListener;
  },
  signUp: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw new Error(error.message);
    return data;
  },
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    return data;
  },
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  },
};

/**
 * ======================================================
 * Product Service
 * ======================================================
 */
export const productService = {
  getAll: async () => {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  },
  getById: async (id) => {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
    if (error) throw new Error(error.message);
    return data;
  },
  create: async (productData) => {
    const user = await authService.getUser();
    const insertData = { ...productData, user_id: user.id };
    delete insertData.id; delete insertData.dateAdded; delete insertData.lastModified;
    const { data, error } = await supabase.from('products').insert([insertData]).select().single();
    if (error) throw new Error(error.message);
    await auditLogger.log('CREATE', 'PRODUCT', data.id, { name: data.name });
    return data;
  },
  update: async (id, updateData) => {
    const { created_at, user_id, ...productUpdates } = updateData;
    productUpdates.last_modified = new Date().toISOString();
    const { data, error } = await supabase.from('products').update(productUpdates).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    await auditLogger.log('UPDATE', 'PRODUCT', id, { name: data.name });
    return data;
  },
  delete: async (id) => {
    const productToDelete = await productService.getById(id);
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw new Error(error.message);
    await auditLogger.log('DELETE', 'PRODUCT', id, { name: productToDelete.name });
    return true;
  },
  adjustStock: async (productId, newQuantity) => {
    const { data, error } = await supabase.from('products').update({ quantity: newQuantity, last_modified: new Date().toISOString() }).eq('id', productId).select().single();
    if (error) { throw new Error(`Stock adjustment failed: ${error.message}`); }
    return data;
  }
};

/**
 * ======================================================
 * Sales Service
 * ======================================================
 */
export const salesService = {
  getAll: async () => {
    const { data, error } = await supabase.from('sales').select('*, sale_items(*)').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data.map(sale => ({ ...sale, items: sale.sale_items, date: sale.created_at, customerName: sale.customer })) || [];
  },
  getByCustomerId: async (customerId) => {
    const { data, error } = await supabase.from('sales').select('*, sale_items(*)').eq('customer_id', customerId).order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data.map(sale => ({ ...sale, items: sale.sale_items, date: sale.created_at })) || [];
  },
  createSale: async (saleData) => {
    const { data, error } = await supabase.rpc('create_sale_with_customer', {
      sale_items: saleData.items,
      sale_total: saleData.total,
      sale_payment_method: saleData.paymentMethod,
      sale_notes: saleData.notes,
      customer_id_to_link: saleData.customer?.id || null,
      customer_name_to_use: saleData.customer?.name || 'Walk-in Customer'
    });
    if (error) throw new Error(error.message);
    if (data.status !== 'success') throw new Error('Sale creation failed in database.');
    
    await auditLogger.log('CREATE', 'SALE', data.id, { total: saleData.total });
    return { ...saleData, id: data.id };
  },
};

/**
 * ======================================================
 * Customer Service
 * ======================================================
 */
export const customerService = {
    getAll: async () => {
        const { data, error } = await supabase.from('customers').select('*').order('name');
        if (error) throw new Error(error.message);
        return data || [];
    },
    getById: async (id) => {
        const { data, error } = await supabase.from('customers').select('*').eq('id', id).single();
        if (error) throw new Error(error.message);
        return data;
    },
    add: async (customerData) => {
        const user = await authService.getUser();
        const { data, error } = await supabase.from('customers').insert([{ ...customerData, user_id: user.id }]).select().single();
        if (error) throw new Error(error.message);
        return data;
    },
    search: async (searchTerm) => {
        const { data, error } = await supabase.from('customers').select('*').ilike('name', `%${searchTerm}%`).limit(10);
        if (error) throw new Error(error.message);
        return data || [];
    }
};

/**
 * ======================================================
 * Analytics Service
 * ======================================================
 */
export const analyticsService = {
  getStorageUsage: () => ({ totalSizeFormatted: 'Cloud', usagePercentage: 100 }),
  getLowStockProducts: async () => {
    const products = await productService.getAll();
    return products.filter(p => p.quantity > 0 && p.quantity <= p.low_stock_threshold);
  },
  getTopSellingProducts: async (limit = 5) => {
    const sales = await salesService.getAll();
    const productSales = {};
    sales.forEach(sale => {
      sale.items.forEach(item => {
        const productDetails = { name: item.name, productId: item.product_id };
        if (!productSales[productDetails.productId]) {
          productSales[productDetails.productId] = { ...productDetails, totalQuantity: 0, totalRevenue: 0 };
        }
        productSales[productDetails.productId].totalQuantity += item.quantity;
        productSales[productDetails.productId].totalRevenue += item.price * item.quantity;
      });
    });
    return Object.values(productSales).sort((a, b) => b.totalQuantity - a.totalQuantity).slice(0, limit);
  },
  getProfitData: async (sales) => { // <-- New Function
    const profitData = {};
    sales.forEach(sale => {
        const date = format(new Date(sale.date), 'MMM dd');
        if (!profitData[date]) {
            profitData[date] = { date, revenue: 0, cost: 0, profit: 0 };
        }
        const saleRevenue = sale.total;
        const saleCost = sale.items.reduce((sum, item) => sum + (item.cost_price * item.quantity), 0);
        profitData[date].revenue += saleRevenue;
        profitData[date].cost += saleCost;
        profitData[date].profit += (saleRevenue - saleCost);
    });
    return Object.values(profitData);
  },
  getTrendingProducts: async (days = 7, threshold = 5) => {
    const sales = await salesService.getAll();
    const products = await productService.getAll();
    const trendCutoff = new Date();
    trendCutoff.setDate(trendCutoff.getDate() - days);
    const recentSales = sales.filter(s => new Date(s.date) >= trendCutoff);
    const productCounts = {};
    recentSales.forEach(sale => {
      sale.items.forEach(item => {
        productCounts[item.product_id] = (productCounts[item.product_id] || 0) + item.quantity;
      });
    });
    return Object.entries(productCounts)
      .filter(([, count]) => count >= threshold)
      .map(([productId, count]) => {
        const productDetails = products.find(p => p.id.toString() === productId);
        return { ...productDetails, count };
      }).filter(p => p.id);
  },
};

/**
 * ======================================================
 * Audit Logger
 * ======================================================
 */
export const auditLogger = {
  log: async (action, entityType, entityId, details = {}) => {
    try {
      const entry = { action, entity_type: entityType, entity_id: String(entityId), details };
      await supabase.from('audit_log').insert([entry]);
    } catch (error) {
      console.error('Failed to log audit entry:', error);
    }
  },
};

/**
 * ======================================================
 * Profile & Settings Service
 * ======================================================
 */
export const profileService = {
  getProfile: async () => {
    const user = await authService.getUser();
    if (!user) return null;
    const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (error) throw new Error(error.message);
    return data;
  },
  updateProfile: async (profileData) => {
    const user = await authService.getUser();
    if (!user) return null;
    const { data, error } = await supabase.from('profiles').update(profileData).eq('id', user.id).select().single();
    if (error) throw new Error(error.message);
    return data;
  }
};

/**
 * ======================================================
 * Backup Service (Legacy Placeholder)
 * ======================================================
 */
export const backupService = {
  export: () => {
    notificationHelpers.info("This feature is disabled. Your data is automatically backed up in the cloud.");
    return Promise.resolve();
  },
  import: () => {
    notificationHelpers.error("This feature is disabled. Cannot import local files to the cloud database.");
    return Promise.resolve();
  }
};