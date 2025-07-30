import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import QuickActionButton from '../../components/ui/QuickActionButton';
import OnboardingOverlay from '../../components/ui/OnboardingOverlay';
import SkeletonLoader, { SkeletonTable, SkeletonMetricCards } from '../../components/ui/SkeletonLoader';
import { salesService } from '../../utils/localStorage';
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

  // Load sales on component mount
  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    setIsLoading(true);
    try {
      // Simulate loading delay for skeleton effect
      await new Promise(resolve => setTimeout(resolve, 800));
      const salesData = salesService.getAll();
      setSales(salesData);
    } catch (error) {
      notificationHelpers.error(`Failed to load sales: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter transactions based on selected period
  const getFilteredTransactions = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let filtered = sales;

    // Apply date filter
    switch (selectedFilter) {
      case 'today':
        filtered = sales.filter(t => {
          const transactionDate = new Date(t.date);
          return transactionDate >= today;
        });
        break;
      case 'yesterday':
        filtered = sales.filter(t => {
          const transactionDate = new Date(t.date);
          return transactionDate >= yesterday && transactionDate < today;
        });
        break;
      case 'thisWeek':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        filtered = sales.filter(t => new Date(t.date) >= weekStart);
        break;
      case 'thisMonth':
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        filtered = sales.filter(t => new Date(t.date) >= monthStart);
        break;
      case 'custom':
        if (customStartDate && customEndDate) {
          const startDate = new Date(customStartDate);
          const endDate = new Date(customEndDate);
          endDate.setHours(23, 59, 59, 999);
          filtered = sales.filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate >= startDate && transactionDate <= endDate;
          });
        }
        break;
      default:
        break;
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        t.id.toLowerCase().includes(searchLower) ||
        t.total.toString().includes(searchLower) ||
        (t.customer && t.customer.toLowerCase().includes(searchLower)) ||
        t.items.some(item => item.name.toLowerCase().includes(searchLower))
      );
    }

    return filtered;
  };

  // Sort transactions
  const sortedTransactions = useMemo(() => {
    let filtered = getFilteredTransactions();
    
    return [...filtered].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case 'id':
          aValue = a.id;
          bValue = b.id;
          break;
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case 'total':
          aValue = a.total;
          bValue = b.total;
          break;
        default:
          aValue = new Date(a.date);
          bValue = new Date(b.date);
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [sales, selectedFilter, searchTerm, customStartDate, customEndDate, sortField, sortDirection]);

  // Pagination
  const totalTransactions = sortedTransactions.length;
  const totalPages = Math.ceil(totalTransactions / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = sortedTransactions.slice(startIndex, startIndex + itemsPerPage);

  // Calculate metrics
  const metrics = useMemo(() => {
    const completedTransactions = sortedTransactions.filter(t => t.status === 'completed');
    const totalSales = completedTransactions.reduce((sum, t) => sum + t.total, 0);
    const totalItems = completedTransactions.reduce((sum, t) => sum + t.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
    const averageTransaction = completedTransactions.length > 0 ? totalSales / completedTransactions.length : 0;

    return {
      totalSales,
      averageTransaction,
      totalItems,
      numberOfSales: completedTransactions.length
    };
  }, [sortedTransactions]);

  const getPeriodLabel = () => {
    switch (selectedFilter) {
      case 'today':
        return 'Today';
      case 'yesterday':
        return 'Yesterday';
      case 'thisWeek':
        return 'This Week';
      case 'thisMonth':
        return 'This Month';
      case 'custom':
        if (customStartDate && customEndDate) {
          return `${new Date(customStartDate).toLocaleDateString('en-GB')} - ${new Date(customEndDate).toLocaleDateString('en-GB')}`;
        }
        return 'Custom Range';
      default:
        return 'All Time';
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleCustomDateRange = (startDate, endDate) => {
    setCustomStartDate(startDate);
    setCustomEndDate(endDate);
    setSelectedFilter('custom');
    setCurrentPage(1);
  };

  const handleExport = () => {
    try {
      const csvContent = [
        ['Transaction ID', 'Date', 'Time', 'Amount (₦)', 'Items', 'Payment Method', 'Customer', 'Status'].join(','),
        ...sortedTransactions.map(t => [
          t.id,
          new Date(t.date).toLocaleDateString('en-GB'),
          new Date(t.date).toLocaleTimeString('en-GB'),
          t.total,
          t.items.length,
          t.paymentMethod,
          t.customer || 'Walk-in Customer',
          t.status
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sales-history-${getPeriodLabel().toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      notificationHelpers.success('Sales data exported successfully');
    } catch (error) {
      notificationHelpers.error(`Export failed: ${error.message}`);
    }
  };

  const handleBulkAction = (action, selectedIds) => {
    if (action === 'export') {
      try {
        const selectedTransactions = sortedTransactions.filter(t => selectedIds.includes(t.id));
        const csvContent = [
          ['Transaction ID', 'Date', 'Time', 'Amount (₦)', 'Items', 'Payment Method', 'Customer', 'Status'].join(','),
          ...selectedTransactions.map(t => [
            t.id,
            new Date(t.date).toLocaleDateString('en-GB'),
            new Date(t.date).toLocaleTimeString('en-GB'),
            t.total,
            t.items.length,
            t.paymentMethod,
            t.customer || 'Walk-in Customer',
            t.status
          ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `selected-transactions-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        notificationHelpers.success(`${selectedTransactions.length} transactions exported successfully`);
      } catch (error) {
        notificationHelpers.error(`Export failed: ${error.message}`);
      }
    }
  };

  const clearFilters = () => {
    setSelectedFilter('today');
    setSearchTerm('');
    setCustomStartDate('');
    setCustomEndDate('');
    setCurrentPage(1);
  };

  const hasFilters = searchTerm || selectedFilter !== 'today';

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilter, searchTerm, itemsPerPage]);

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('sabistock_onboarding_completed');
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <NavigationSidebar />
      
      <main className="lg:ml-240 min-h-screen">
        <div className="p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <BreadcrumbTrail />
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
                  Sales History
                </h1>
                <p className="text-muted-foreground">
                  Track and analyze your business transactions
                </p>
              </div>
              <QuickActionButton />
            </div>

            {/* Date Filter Chips */}
            {!isLoading && (
              <DateFilterChips
                selectedFilter={selectedFilter}
                onFilterChange={setSelectedFilter}
                onCustomRangeClick={() => setShowCustomDatePicker(true)}
              />
            )}

            {/* Sales Metrics */}
            {isLoading ? (
              <SkeletonMetricCards className="mb-8" />
            ) : (
              <SalesMetrics
                metrics={metrics}
                selectedPeriod={getPeriodLabel()}
              />
            )}

            {/* Search and Export */}
            {!isLoading && (
              <SearchAndExport
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onExport={handleExport}
                totalTransactions={totalTransactions}
              />
            )}

            {/* Content */}
            {isLoading ? (
              <SkeletonTable rows={8} columns={7} />
            ) : totalTransactions === 0 ? (
              <EmptyState
                hasFilters={hasFilters}
                onClearFilters={clearFilters}
                onCreateSale={() => navigate('/point-of-sale-pos')}
              />
            ) : (
              <>
                {/* Mobile Cards */}
                <div className="lg:hidden">
                  {paginatedTransactions.map((transaction) => (
                    <TransactionCard
                      key={transaction.id}
                      transaction={transaction}
                    />
                  ))}
                </div>

                {/* Desktop Table */}
                <TransactionTable
                  transactions={paginatedTransactions}
                  onSort={handleSort}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onBulkAction={handleBulkAction}
                />

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalTransactions}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={setItemsPerPage}
                />
              </>
            )}
          </div>
        </div>
      </main>

      {/* Custom Date Picker Modal */}
      <CustomDatePicker
        isOpen={showCustomDatePicker}
        onClose={() => setShowCustomDatePicker(false)}
        onApply={handleCustomDateRange}
        initialStartDate={customStartDate}
        initialEndDate={customEndDate}
      />

      {/* Onboarding Overlay */}
      <OnboardingOverlay
        isVisible={showOnboarding}
        onComplete={() => setShowOnboarding(false)}
      />
    </div>
  );
};

export default SalesHistory;