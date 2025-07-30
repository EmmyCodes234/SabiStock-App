import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import { salesService, analyticsService } from '../../utils/apiService';
import { notificationHelpers } from '../../utils/notifications';
import { subDays, format } from 'date-fns';
import ChartCard from './components/ChartCard';
import DateRangeFilter from './components/DateRangeFilter';

const Reports = () => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [salesChartData, setSalesChartData] = useState([]);
  const [topProductsData, setTopProductsData] = useState([]);
  const [profitChartData, setProfitChartData] = useState([]); // <-- New State
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');

  useEffect(() => {
    loadAllReportsData();
  }, [dateRange]);

  const loadAllReportsData = async () => {
    setIsLoading(true);
    try {
      const sales = await salesService.getAll();
      const topProducts = await analyticsService.getTopSellingProducts(5);
      
      const processedSales = processSalesForChart(sales, dateRange);
      const processedProfit = await analyticsService.getProfitData(sales.filter(s => new Date(s.created_at) >= getDateRangeFromString(dateRange)));
      
      setSalesChartData(processedSales);
      setTopProductsData(processTopProductsForChart(topProducts));
      setProfitChartData(processedProfit);

    } catch (error) {
      notificationHelpers.error(`Failed to load reports data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getDateRangeFromString = (rangeString) => {
    const now = new Date();
    switch (rangeString) {
        case '7d': return subDays(now, 7);
        case '90d': return subDays(now, 90);
        case '12m': return subDays(now, 365);
        case '30d':
        default:
            return subDays(now, 30);
    }
  };

  const processSalesForChart = (sales, range) => {
    const startDate = getDateRangeFromString(range);
    const relevantSales = sales.filter(s => new Date(s.created_at) >= startDate);
    
    const aggregatedData = relevantSales.reduce((acc, sale) => {
        const date = format(new Date(sale.created_at), 'MMM dd');
        acc[date] = (acc[date] || 0) + sale.total;
        return acc;
    }, {});

    const dateArray = [];
    let currentDate = getDateRangeFromString(range); // Get a fresh start date
    const endDate = new Date();
    while(currentDate <= endDate){
        dateArray.push(format(currentDate, 'MMM dd'));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dateArray.map(date => ({ date, revenue: aggregatedData[date] || 0 }));
  };

  const processTopProductsForChart = (topProducts) => {
    return topProducts.map(p => ({ name: p.name, revenue: p.totalRevenue }));
  };
  
  const formatCurrency = (value) => `₦${value.toLocaleString()}`;
  const formatYAxis = (tickItem) => `₦${(tickItem / 1000)}k`;

  const COLORS = ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'];
  
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
    if (percent < 0.05) return null;
    return (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-xs font-medium">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationSidebar isCollapsed={isSidebarCollapsed} toggleSidebar={() => setSidebarCollapsed(!isSidebarCollapsed)} />
      <main className={`min-h-screen transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-240'}`}>
        <div className="p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <BreadcrumbTrail />
            <div className="mb-8">
              <h1 className="font-heading font-bold text-3xl text-foreground mb-2">Reports & Analytics</h1>
              <p className="text-muted-foreground">Visualize your business performance and sales trends.</p>
            </div>

            <DateRangeFilter selectedRange={dateRange} onRangeChange={setDateRange} />

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <ChartCard title="Daily Revenue" isLoading={isLoading}>
                <LineChart data={salesChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="date" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickFormatter={formatYAxis} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }} formatter={(value) => [formatCurrency(value), 'Revenue']} />
                  <Legend wrapperStyle={{ fontSize: '14px' }}/>
                  <Line type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={2} dot={false} activeDot={{ r: 8 }} />
                </LineChart>
              </ChartCard>

              <ChartCard title="Profitability" isLoading={isLoading}>
                 <BarChart data={profitChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="date" stroke="var(--color-muted-foreground)" fontSize={12} />
                    <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickFormatter={formatYAxis} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }} formatter={(value) => formatCurrency(value)} />
                    <Legend wrapperStyle={{ fontSize: '14px' }}/>
                    <Bar dataKey="revenue" fill="#60A5FA" name="Total Revenue" />
                    <Bar dataKey="cost" fill="#F87171" name="Cost of Goods" />
                    <Bar dataKey="profit" fill="#4ADE80" name="Net Profit" />
                </BarChart>
              </ChartCard>
              
              <div className="xl:col-span-2">
                <ChartCard title="Top 5 Products by Revenue" isLoading={isLoading}>
                    <PieChart>
                    <Pie data={topProductsData} cx="50%" cy="50%" labelLine={false} label={renderCustomizedLabel} outerRadius={150} fill="#8884d8" dataKey="revenue" nameKey="name">
                        {topProductsData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                    </Pie>
                    <Tooltip formatter={(value) => [formatCurrency(value), 'Revenue']} />
                    <Legend wrapperStyle={{ fontSize: '14px' }}/>
                    </PieChart>
                </ChartCard>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reports;