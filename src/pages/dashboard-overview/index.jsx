import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndContext, PointerSensor, KeyboardSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { subDays, format } from 'date-fns';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import QuickActionButton from '../../components/ui/QuickActionButton';
import DataBackupRestore from '../../components/ui/DataBackupRestore';
import SkeletonLoader, { SkeletonMetricCards } from '../../components/ui/SkeletonLoader';
import { productService, salesService, analyticsService } from '../../utils/apiService';
import { notificationHelpers } from '../../utils/notifications';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

// Component imports
import MetricCard from './components/MetricCard';
import SalesTrendChart from './components/SalesTrendChart'; // <-- New Import
import TimeFilter from './components/TimeFilter';
import LowStockAlert from './components/LowStockAlert';
import RecentActivity from './components/RecentActivity';
import TopProductsList from './components/TopProductsList';
import GuidedActionsOverlay from '../../components/ui/GuidedActionsOverlay';
import DashboardSettingsModal from './components/DashboardSettingsModal';
import DashboardWidget from './components/DashboardWidget';

const defaultDashboardSettings = {
  widgetOrder: ['metricCards', 'salesChart', 'recentActivity', 'lowStockAlert', 'topProducts', 'quickStats', 'backup'],
  widgets: {
    metricCards: { label: 'Metric Cards', isVisible: true },
    salesChart: { label: 'Sales Chart', isVisible: true }, // <-- New Widget
    lowStockAlert: { label: 'Low Stock Alert', isVisible: true },
    recentActivity: { label: 'Recent Activity', isVisible: true },
    topProducts: { label: 'Top Products', isVisible: true },
    backup: { label: 'Data Backup', isVisible: true },
    quickStats: { label: 'Quick Stats', isVisible: true },
  }
};

const DashboardOverview = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('today');
  const [showGuidedActions, setShowGuidedActions] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [dashboardSettings, setDashboardSettings] = useState(defaultDashboardSettings);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [salesChartData, setSalesChartData] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    products: [],
    sales: [],
    lowStockProducts: [],
    topProducts: [],
    metrics: { totalProducts: 0, totalSales: 0, lowStockCount: 0, outOfStockCount: 0, todayRevenue: 0, todaySales: 0 }
  });

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem('sabi_dashboard_settings'));
    if (savedSettings) {
      const mergedSettings = { ...defaultDashboardSettings, ...savedSettings, widgets: { ...defaultDashboardSettings.widgets, ...savedSettings.widgets }, widgetOrder: savedSettings.widgetOrder || defaultDashboardSettings.widgetOrder };
      setDashboardSettings(mergedSettings);
    }
    const justOnboarded = localStorage.getItem('sabistock_just_onboarded');
    if (justOnboarded) setShowGuidedActions(true);
    
    loadDashboardData();
  }, []);
  
  const handleSettingsChange = (newWidgets) => {
    const newSettings = { ...dashboardSettings, widgets: newWidgets };
    setDashboardSettings(newSettings);
    localStorage.setItem('sabi_dashboard_settings', JSON.stringify(newSettings));
  };
  
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setDashboardSettings((settings) => {
        const oldIndex = settings.widgetOrder.indexOf(active.id);
        const newIndex = settings.widgetOrder.indexOf(over.id);
        const newOrder = arrayMove(settings.widgetOrder, oldIndex, newIndex);
        const newSettings = { ...settings, widgetOrder: newOrder };
        localStorage.setItem('sabi_dashboard_settings', JSON.stringify(newSettings));
        return newSettings;
      });
    }
  };

  const processSalesForChart = (sales) => {
    const last7Days = {};
    for (let i = 0; i < 7; i++) {
        const date = subDays(new Date(), i);
        last7Days[format(date, 'yyyy-MM-dd')] = 0;
    }
    sales.forEach(sale => {
        const saleDate = format(new Date(sale.created_at), 'yyyy-MM-dd');
        if (last7Days[saleDate] !== undefined) {
            last7Days[saleDate] += sale.total;
        }
    });
    return Object.keys(last7Days).map(date => ({ date, revenue: last7Days[date] })).reverse();
  };

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const productsData = await productService.getAll();
      const salesData = await salesService.getAll();
      const lowStockProductsData = await analyticsService.getLowStockProducts();
      const topProductsData = await analyticsService.getTopSellingProducts(5);
      
      const metrics = calculateMetrics(productsData, salesData, timeFilter);
      setSalesChartData(processSalesForChart(salesData));
      
      setDashboardData({ products: productsData, sales: salesData, lowStockProducts: lowStockProductsData, topProducts: topProductsData, metrics });
      await checkForActionableInsights();
    } catch (error) {
      notificationHelpers.error(`Failed to load dashboard: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const completeGuidedActions = () => {
    localStorage.removeItem('sabistock_just_onboarded');
    setShowGuidedActions(false);
  };

  const calculateMetrics = (products, sales, period) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today); thisWeek.setDate(today.getDate() - today.getDay());
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    let filteredSales = sales.filter(sale => sale.status === 'completed');
    switch (period) {
      case 'today': filteredSales = filteredSales.filter(sale => new Date(sale.date) >= today); break;
      case 'week': filteredSales = filteredSales.filter(sale => new Date(sale.date) >= thisWeek); break;
      case 'month': filteredSales = filteredSales.filter(sale => new Date(sale.date) >= thisMonth); break;
      default: break;
    }
    const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
    const totalItemsSold = filteredSales.reduce((sum, sale) => sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
    const lowStockProducts = products.filter(p => p.quantity > 0 && p.quantity <= p.low_stock_threshold);
    const outOfStockProducts = products.filter(p => p.quantity === 0);
    return {
      totalProducts: products.length,
      totalSales: filteredSales.length,
      lowStockCount: lowStockProducts.length,
      outOfStockCount: outOfStockProducts.length,
      totalRevenue, totalItemsSold,
      averageOrderValue: filteredSales.length > 0 ? totalRevenue / filteredSales.length : 0
    };
  };
  
  const checkForActionableInsights = async () => {
    const lowStockProducts = await analyticsService.getLowStockProducts();
    const criticalStock = lowStockProducts.filter(p => p.quantity <= 3);
    criticalStock.forEach(product => notificationHelpers.warning(`Stock for "${product.name}" is critically low (${product.quantity} left).`));
    const trendingProducts = await analyticsService.getTrendingProducts();
    trendingProducts.forEach(product => notificationHelpers.insight(`"${product.name}" is selling fast! You've sold ${product.count} units this week.`));
  };

  const handleTimeFilterChange = (newFilter) => {
    setTimeFilter(newFilter);
    const updatedMetrics = calculateMetrics(dashboardData.products, dashboardData.sales, newFilter);
    setDashboardData(prev => ({ ...prev, metrics: updatedMetrics }));
  };

  const getPeriodLabel = () => {
    switch (timeFilter) {
      case 'today': return 'Today';
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      default: return 'All Time';
    }
  };
  
  const getRecentActivities = () => {
    return dashboardData.sales.slice(0, 5).map(sale => ({ id: sale.id, type: 'sale', description: `New sale of ₦${sale.total.toLocaleString()} for ${sale.items.length} item(s).`, timestamp: sale.date }));
  };
  
  const widgetComponents = {
    metricCards: <>{isLoading ? <SkeletonMetricCards /> : <div className="grid grid-cols-2 lg:grid-cols-4 gap-6"><MetricCard title="Total Products" value={dashboardData.metrics.totalProducts} icon="Package" /><MetricCard title={`Sales (${getPeriodLabel()})`} value={dashboardData.metrics.totalSales} icon="ShoppingCart" /><MetricCard title={`Revenue (${getPeriodLabel()})`} value={`₦${dashboardData.metrics.totalRevenue.toLocaleString()}`} icon="DollarSign" /><MetricCard title="Low Stock Items" value={dashboardData.metrics.lowStockCount} icon="AlertTriangle" /></div>}</>,
    salesChart: <SalesTrendChart data={salesChartData} isLoading={isLoading} />,
    lowStockAlert: !isLoading && dashboardData.lowStockProducts.length > 0 && <LowStockAlert lowStockProducts={dashboardData.lowStockProducts} />,
    recentActivity: <RecentActivity activities={getRecentActivities()} isLoading={isLoading} />,
    topProducts: <TopProductsList products={dashboardData.topProducts} isLoading={isLoading} />,
    backup: <DataBackupRestore />,
    quickStats: !isLoading && <div className="bg-card border border-border rounded-lg p-6"><h3 className="font-heading font-semibold text-lg text-foreground mb-4">Quick Stats</h3><div className="space-y-4"><div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">Total Items Sold ({getPeriodLabel()})</span><span className="font-medium text-foreground">{dashboardData.metrics.totalItemsSold}</span></div><div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">Average Order Value</span><span className="font-medium text-foreground">₦{Math.round(dashboardData.metrics.averageOrderValue).toLocaleString()}</span></div><div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">Out of Stock Items</span><span className="font-medium text-error">{dashboardData.metrics.outOfStockCount}</span></div><div className="pt-2 border-t border-border"><div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">Data Storage</span><span className="font-medium text-foreground">Cloud</span></div></div></div></div>,
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationSidebar isCollapsed={isSidebarCollapsed} toggleSidebar={() => setSidebarCollapsed(!isSidebarCollapsed)} />
      <GuidedActionsOverlay isVisible={showGuidedActions} onComplete={completeGuidedActions} />
      <DashboardSettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} settings={dashboardSettings.widgets} onSettingsChange={handleSettingsChange} />
      <main className={`min-h-screen transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-240'}`}>
        <div className="p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <BreadcrumbTrail />
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div><h1 className="font-heading font-bold text-3xl text-foreground mb-2">Dashboard Overview</h1><p className="text-muted-foreground">Monitor your business performance</p></div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" iconName="Plus" onClick={() => navigate('/add-edit-product')}>Add Product</Button>
                    <Button iconName="ShoppingCart" onClick={() => navigate('/point-of-sale-pos')}>New Sale</Button>
                    <Button variant="outline" iconName="LayoutGrid" onClick={() => setShowSettingsModal(true)}>Customize</Button>
                </div>
              </div>
            </div>
            <div className="mb-8"><TimeFilter activeFilter={timeFilter} onFilterChange={handleTimeFilterChange} isLoading={isLoading} /></div>
            
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={dashboardSettings.widgetOrder} strategy={verticalListSortingStrategy}>
                {dashboardSettings.widgetOrder.map(widgetId => 
                  widgetId === 'metricCards' && dashboardSettings.widgets[widgetId]?.isVisible ? (
                    <DashboardWidget key={widgetId} id={widgetId}>
                      {widgetComponents[widgetId]}
                    </DashboardWidget>
                  ) : null
                )}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    {dashboardSettings.widgetOrder.map(widgetId => 
                      ['salesChart', 'recentActivity', 'lowStockAlert'].includes(widgetId) && dashboardSettings.widgets[widgetId]?.isVisible && widgetComponents[widgetId] ? (
                        <DashboardWidget key={widgetId} id={widgetId}>
                          {widgetComponents[widgetId]}
                        </DashboardWidget>
                      ) : null
                    )}
                  </div>
                   <div className="space-y-8">
                     {dashboardSettings.widgetOrder.map(widgetId => 
                      ['topProducts', 'quickStats', 'backup'].includes(widgetId) && dashboardSettings.widgets[widgetId]?.isVisible && widgetComponents[widgetId] ? (
                        <DashboardWidget key={widgetId} id={widgetId}>
                          {widgetComponents[widgetId]}
                        </DashboardWidget>
                      ) : null
                    )}
                  </div>
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardOverview;