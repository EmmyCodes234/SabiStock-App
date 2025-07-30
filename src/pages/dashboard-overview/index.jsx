import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import QuickActionButton from '../../components/ui/QuickActionButton';
import DataBackupRestore from '../../components/ui/DataBackupRestore';
import SkeletonLoader, { SkeletonMetricCards } from '../../components/ui/SkeletonLoader';
import { productService, salesService, analyticsService } from '../../utils/localStorage';
import { notificationHelpers } from '../../utils/notifications';

// Component imports
import MetricCard from './components/MetricCard';
import QuickActions from './components/QuickActions';
import TimeFilter from './components/TimeFilter';
import LowStockAlert from './components/LowStockAlert';
import RecentActivity from './components/RecentActivity';
import TopProductsList from './components/TopProductsList';

const DashboardOverview = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('today');
  const [dashboardData, setDashboardData] = useState({
    products: [],
    sales: [],
    lowStockProducts: [],
    topProducts: [],
    metrics: {
      totalProducts: 0,
      totalSales: 0,
      lowStockCount: 0,
      outOfStockCount: 0,
      todayRevenue: 0,
      todaySales: 0
    }
  });

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
    
    // Check for low stock alerts
    checkLowStockAlerts();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Simulate loading delay for skeleton effect
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const products = productService.getAll();
      const sales = salesService.getAll();
      const lowStockProducts = analyticsService.getLowStockProducts();
      const topProducts = analyticsService.getTopSellingProducts(5);
      
      const metrics = calculateMetrics(products, sales, timeFilter);
      
      setDashboardData({
        products,
        sales,
        lowStockProducts,
        topProducts,
        metrics
      });
    } catch (error) {
      notificationHelpers.error(`Failed to load dashboard: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateMetrics = (products, sales, period) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today);
    thisWeek.setDate(today.getDate() - today.getDay());
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    let filteredSales = sales.filter(sale => sale.status === 'completed');
    
    // Filter sales by period
    switch (period) {
      case 'today':
        filteredSales = filteredSales.filter(sale => new Date(sale.date) >= today);
        break;
      case 'week':
        filteredSales = filteredSales.filter(sale => new Date(sale.date) >= thisWeek);
        break;
      case 'month':
        filteredSales = filteredSales.filter(sale => new Date(sale.date) >= thisMonth);
        break;
      default:
        break;
    }
    
    const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
    const totalItemsSold = filteredSales.reduce((sum, sale) => 
      sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );
    
    const lowStockProducts = products.filter(p => p.quantity <= p.lowStockThreshold && p.quantity > 0);
    const outOfStockProducts = products.filter(p => p.quantity === 0);
    
    return {
      totalProducts: products.length,
      totalSales: filteredSales.length,
      lowStockCount: lowStockProducts.length,
      outOfStockCount: outOfStockProducts.length,
      totalRevenue,
      totalItemsSold,
      averageOrderValue: filteredSales.length > 0 ? totalRevenue / filteredSales.length : 0
    };
  };

  const checkLowStockAlerts = () => {
    const lowStockProducts = analyticsService.getLowStockProducts();
    
    // Show notifications for critically low stock (less than 3 units)
    const criticalStock = lowStockProducts.filter(p => p.quantity <= 3 && p.quantity > 0);
    
    criticalStock.forEach(product => {
      notificationHelpers.lowStockWarning(product.name, product.quantity);
    });
  };

  const handleTimeFilterChange = async (newFilter) => {
    setTimeFilter(newFilter);
    
    // Recalculate metrics with new filter
    const updatedMetrics = calculateMetrics(dashboardData.products, dashboardData.sales, newFilter);
    setDashboardData(prev => ({
      ...prev,
      metrics: updatedMetrics
    }));
  };

  const getPeriodLabel = () => {
    switch (timeFilter) {
      case 'today':
        return 'Today';
      case 'week':
        return 'This Week';
      case 'month':
        return 'This Month';
      default:
        return 'All Time';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationSidebar />
      
      <main className="lg:ml-240 min-h-screen">
        <div className="p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <BreadcrumbTrail />
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
                    Dashboard Overview
                  </h1>
                  <p className="text-muted-foreground">
                    Monitor your business performance and key metrics
                  </p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <TimeFilter
                    value={timeFilter}
                    onChange={handleTimeFilterChange}
                    disabled={isLoading}
                  />
                  <QuickActionButton />
                </div>
              </div>
            </div>

            {/* Metrics Overview */}
            {isLoading ? (
              <SkeletonMetricCards className="mb-8" />
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricCard
                  title="Total Products"
                  value={dashboardData.metrics.totalProducts}
                  icon="Package"
                  trend={null}
                  color="primary"
                />
                
                <MetricCard
                  title={`Sales (${getPeriodLabel()})`}
                  value={dashboardData.metrics.totalSales}
                  icon="ShoppingCart"
                  trend={null}
                  color="success"
                />
                
                <MetricCard
                  title={`Revenue (${getPeriodLabel()})`}
                  value={`₦${dashboardData.metrics.totalRevenue.toLocaleString()}`}
                  icon="DollarSign"
                  trend={null}
                  color="info"
                />
                
                <MetricCard
                  title="Low Stock Items"
                  value={dashboardData.metrics.lowStockCount}
                  icon="AlertTriangle"
                  trend={null}
                  color="warning"
                />
              </div>
            )}

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-8">
                {/* Quick Actions */}
                <QuickActions onNavigate={navigate} />
                
                {/* Low Stock Alert */}
                {!isLoading && dashboardData.lowStockProducts.length > 0 && (
                  <LowStockAlert
                    products={dashboardData.lowStockProducts}
                    onViewProduct={(product) => navigate(`/add-edit-product?id=${product.id}`)}
                    onViewAll={() => navigate('/product-management')}
                  />
                )}

                {/* Recent Activity */}
                <RecentActivity
                  sales={dashboardData.sales.slice(0, 10)}
                  isLoading={isLoading}
                  onViewAll={() => navigate('/sales-history')}
                />
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Top Products */}
                <TopProductsList
                  products={dashboardData.topProducts}
                  isLoading={isLoading}
                  onViewProduct={(productId) => navigate(`/add-edit-product?id=${productId}`)}
                  onViewAll={() => navigate('/product-management')}
                />

                {/* Data Backup & Restore */}
                <DataBackupRestore />

                {/* Storage Usage Info */}
                {!isLoading && (
                  <div className="bg-card border border-border rounded-lg p-6">
                    <h3 className="font-heading font-semibold text-lg text-foreground mb-4">
                      Quick Stats
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total Items Sold ({getPeriodLabel()})</span>
                        <span className="font-medium text-foreground">
                          {dashboardData.metrics.totalItemsSold}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Average Order Value</span>
                        <span className="font-medium text-foreground">
                          ₦{Math.round(dashboardData.metrics.averageOrderValue).toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Out of Stock Items</span>
                        <span className="font-medium text-error">
                          {dashboardData.metrics.outOfStockCount}
                        </span>
                      </div>
                      
                      <div className="pt-2 border-t border-border">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Data Storage</span>
                          <span className="font-medium text-foreground">
                            {analyticsService.getStorageUsage().totalSizeFormatted}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardOverview;