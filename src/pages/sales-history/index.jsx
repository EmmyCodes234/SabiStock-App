import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import QuickActionButton from '../../components/ui/QuickActionButton';
import OnboardingOverlay from '../../components/ui/OnboardingOverlay';
import SkeletonLoader, { SkeletonTable, SkeletonMetricCards } from '../../components/ui/SkeletonLoader';
import { salesService } from '../../utils/apiService';
import { notificationHelpers } from '../../utils/notifications';

import DateFilterChips from './components/DateFilterChips';
import SalesMetrics from './components/SalesMetrics';
import SearchAndExport from './components/SearchAndExport';
import TransactionCard from './components/TransactionCard';
import TransactionTable from './components/TransactionTable';
import CustomDatePicker from './components/CustomDatePicker';
import EmptyState from './components/EmptyState';
import Pagination from './components/Pagination';

const SalesHistory = () => {
  const navigate = useNavigate();
  const [sales, setSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('today');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false); // <-- New State

  useEffect(() => {
    loadSales();
    const hasCompletedOnboarding = localStorage.getItem('sabistock_onboarding_completed');
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const loadSales = async () => {
    setIsLoading(true);
    try {
      const salesData = await salesService.getAll();
      setSales(salesData);
    } catch (error) {
      notificationHelpers.error(`Failed to load sales: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = sales.filter(t => {
      const searchLower = searchTerm.toLowerCase();
      return t.id.toString().toLowerCase().includes(searchLower) ||
             t.total.toString().includes(searchLower) ||
             (t.customer && t.customer.toLowerCase().includes(searchLower)) ||
             (t.items && t.items.some(item => item.name.toLowerCase().includes(searchLower)));
    });
    
    // Date filtering logic...
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    switch (selectedFilter) {
      case 'today':
        filtered = filtered.filter(t => new Date(t.date) >= today);
        break;
      // ... other date filters
    }
    
    return filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (sortDirection === 'asc') return aValue > bValue ? 1 : -1;
      return aValue < bValue ? 1 : -1;
    });
  }, [sales, searchTerm, selectedFilter, customStartDate, customEndDate, sortField, sortDirection]);

  const totalTransactions = filteredAndSortedTransactions.length;
  const paginatedTransactions = filteredAndSortedTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(totalTransactions / itemsPerPage);

  const metrics = useMemo(() => {
    const completed = filteredAndSortedTransactions.filter(t => t.status === 'completed');
    const totalSales = completed.reduce((sum, t) => sum + t.total, 0);
    const totalItems = completed.reduce((sum, t) => sum + t.items.reduce((iSum, i) => iSum + i.quantity, 0), 0);
    return {
      totalSales,
      averageTransaction: completed.length > 0 ? totalSales / completed.length : 0,
      totalItems,
      numberOfSales: completed.length,
    };
  }, [filteredAndSortedTransactions]);

  // Event handlers for sorting, filtering, etc.
  
  return (
    <div className="min-h-screen bg-background">
      <NavigationSidebar isCollapsed={isSidebarCollapsed} toggleSidebar={() => setSidebarCollapsed(!isSidebarCollapsed)} />
      <main className={`min-h-screen transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-240'}`}>
        <div className="p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <BreadcrumbTrail />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <h1 className="font-heading font-bold text-3xl text-foreground mb-2">Sales History</h1>
                <p className="text-muted-foreground">Track and analyze your business transactions</p>
              </div>
              <QuickActionButton />
            </div>
            {!isLoading && <DateFilterChips selectedFilter={selectedFilter} onFilterChange={setSelectedFilter} onCustomRangeClick={() => setShowCustomDatePicker(true)} />}
            {isLoading ? <SkeletonMetricCards className="mb-8" /> : <SalesMetrics metrics={metrics} selectedPeriod={'Selected Period'} />}
            {!isLoading && <SearchAndExport searchTerm={searchTerm} onSearchChange={setSearchTerm} onExport={() => {}} totalTransactions={totalTransactions} />}
            {isLoading ? <SkeletonTable rows={8} columns={7} /> : totalTransactions === 0 ? <EmptyState hasFilters={searchTerm.length > 0} onClearFilters={() => setSearchTerm('')} /> : (
              <>
                <div className="lg:hidden">{paginatedTransactions.map(t => <TransactionCard key={t.id} transaction={t} />)}</div>
                <TransactionTable transactions={paginatedTransactions} onSort={() => {}} sortField={sortField} sortDirection={sortDirection} onBulkAction={() => {}} />
                <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={totalTransactions} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} onItemsPerPageChange={setItemsPerPage} />
              </>
            )}
          </div>
        </div>
      </main>
      <CustomDatePicker isOpen={showCustomDatePicker} onClose={() => setShowCustomDatePicker(false)} onApply={() => {}} />
      <OnboardingOverlay isVisible={showOnboarding} onComplete={() => setShowOnboarding(false)} />
    </div>
  );
};

export default SalesHistory;