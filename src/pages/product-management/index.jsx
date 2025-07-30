import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import QuickActionButton from '../../components/ui/QuickActionButton';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { SkeletonProductGrid, SkeletonMetricCards } from '../../components/ui/SkeletonLoader';
import { productService } from '../../utils/localStorage';
import { notificationHelpers } from '../../utils/notifications';

// Component imports
import ProductCard from './components/ProductCard';
import ProductTableRow from './components/ProductTableRow';
import SearchAndFilters from './components/SearchAndFilters';
import ViewToggle from './components/ViewToggle';
import BulkActions from './components/BulkActions';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import EmptyState from './components/EmptyState';

const ProductManagement = () => {
  const navigate = useNavigate();
  
  // State management
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [currentView, setCurrentView] = useState('grid');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  
  const [filters, setFilters] = useState({
    stockStatus: 'all',
    category: 'all',
    priceRange: {
      min: null,
      max: null
    }
  });

  // Load products on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      // Simulate loading delay for skeleton effect
      await new Promise(resolve => setTimeout(resolve, 800));
      const productsData = productService.getAll();
      setProducts(productsData);
    } catch (error) {
      notificationHelpers.error(`Failed to load products: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtered and sorted products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // Search filter
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Stock status filter
      let matchesStock = true;
      if (filters.stockStatus !== 'all') {
        const isLowStock = product.quantity <= product.lowStockThreshold;
        const isOutOfStock = product.quantity === 0;
        
        switch (filters.stockStatus) {
          case 'in-stock':
            matchesStock = product.quantity > product.lowStockThreshold;
            break;
          case 'low-stock':
            matchesStock = isLowStock && !isOutOfStock;
            break;
          case 'out-of-stock':
            matchesStock = isOutOfStock;
            break;
        }
      }
      
      // Category filter
      const matchesCategory = filters.category === 'all' || product.category === filters.category;
      
      // Price range filter
      const matchesPrice = (!filters.priceRange.min || product.sellingPrice >= filters.priceRange.min) &&
                          (!filters.priceRange.max || product.sellingPrice <= filters.priceRange.max);
      
      return matchesSearch && matchesStock && matchesCategory && matchesPrice;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return a.sellingPrice - b.sellingPrice;
        case 'price-desc':
          return b.sellingPrice - a.sellingPrice;
        case 'stock-asc':
          return a.quantity - b.quantity;
        case 'stock-desc':
          return b.quantity - a.quantity;
        case 'date-newest':
          return new Date(b.dateAdded) - new Date(a.dateAdded);
        case 'date-oldest':
          return new Date(a.dateAdded) - new Date(b.dateAdded);
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, searchTerm, sortBy, filters]);

  // Event handlers
  const handleEditProduct = (product) => {
    navigate(`/add-edit-product?id=${product.id}`);
  };

  const handleDeleteProduct = (product) => {
    setProductToDelete(product);
    setIsBulkDelete(false);
    setShowDeleteModal(true);
  };

  const handleBulkDelete = () => {
    setIsBulkDelete(true);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      if (isBulkDelete) {
        // Delete multiple products
        for (const productId of selectedProducts) {
          await productService.delete(productId);
        }
        notificationHelpers.success(`${selectedProducts.length} products deleted successfully`);
        setSelectedProducts([]);
      } else if (productToDelete) {
        // Delete single product
        await productService.delete(productToDelete.id);
        notificationHelpers.productDeleted(productToDelete.name);
      }
      
      // Reload products
      await loadProducts();
    } catch (error) {
      notificationHelpers.error(`Delete failed: ${error.message}`);
    } finally {
      setShowDeleteModal(false);
      setProductToDelete(null);
      setIsBulkDelete(false);
    }
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredAndSortedProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredAndSortedProducts.map(p => p.id));
    }
  };

  const handleClearSelection = () => {
    setSelectedProducts([]);
  };

  const handleClearFilters = () => {
    setFilters({
      stockStatus: 'all',
      category: 'all',
      priceRange: { min: null, max: null }
    });
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    handleClearFilters();
  };

  // Get statistics
  const getStats = () => {
    const lowStockCount = products.filter(p => p.quantity <= p.lowStockThreshold && p.quantity > 0).length;
    const outOfStockCount = products.filter(p => p.quantity === 0).length;
    const inStockCount = products.filter(p => p.quantity > p.lowStockThreshold).length;
    
    return {
      total: products.length,
      inStock: inStockCount,
      lowStock: lowStockCount,
      outOfStock: outOfStockCount
    };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-background">
      <NavigationSidebar />
      
      <main className="lg:ml-240 min-h-screen">
        <div className="p-4 lg:p-6">
          {/* Header Section */}
          <div className="mb-6">
            <BreadcrumbTrail />
            
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="font-heading font-semibold text-2xl lg:text-3xl text-foreground mb-2">
                  Product Management
                </h1>
                <p className="text-muted-foreground">
                  Manage your inventory, track stock levels, and organize your products
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <ViewToggle currentView={currentView} onViewChange={setCurrentView} />
                <QuickActionButton />
              </div>
            </div>

            {/* Summary Cards */}
            {isLoading ? (
              <SkeletonMetricCards className="mt-6" />
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name="Package" size={20} color="var(--color-primary)" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Products</p>
                      <p className="font-heading font-semibold text-xl text-foreground">
                        {stats.total}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                      <Icon name="CheckCircle" size={20} color="var(--color-success)" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">In Stock</p>
                      <p className="font-heading font-semibold text-xl text-foreground">
                        {stats.inStock}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                      <Icon name="AlertTriangle" size={20} color="var(--color-warning)" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Low Stock</p>
                      <p className="font-heading font-semibold text-xl text-foreground">
                        {stats.lowStock}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
                      <Icon name="XCircle" size={20} color="var(--color-error)" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Out of Stock</p>
                      <p className="font-heading font-semibold text-xl text-foreground">
                        {stats.outOfStock}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search and Filters */}
          {!isLoading && (
            <SearchAndFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              sortBy={sortBy}
              onSortChange={setSortBy}
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={handleClearFilters}
            />
          )}

          {/* Bulk Actions */}
          {!isLoading && (
            <BulkActions
              selectedCount={selectedProducts.length}
              onBulkDelete={handleBulkDelete}
              onSelectAll={handleSelectAll}
              onClearSelection={handleClearSelection}
            />
          )}

          {/* Products Display */}
          {isLoading ? (
            <SkeletonProductGrid />
          ) : filteredAndSortedProducts.length === 0 ? (
            <EmptyState
              hasSearchTerm={searchTerm.length > 0}
              searchTerm={searchTerm}
              onClearSearch={handleClearSearch}
            />
          ) : (
            <>
              {/* Grid View */}
              {currentView === 'grid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredAndSortedProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onEdit={handleEditProduct}
                      onDelete={handleDeleteProduct}
                      isSelected={selectedProducts.includes(product.id)}
                      onSelect={handleSelectProduct}
                    />
                  ))}
                </div>
              )}

              {/* Table View */}
              {currentView === 'table' && (
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted border-b border-border">
                        <tr>
                          <th className="p-4 text-left">
                            <button
                              onClick={handleSelectAll}
                              className={`
                                w-5 h-5 rounded border-2 flex items-center justify-center
                                transition-colors duration-200
                                ${selectedProducts.length === filteredAndSortedProducts.length && filteredAndSortedProducts.length > 0
                                  ? 'bg-primary border-primary text-primary-foreground' 
                                  : 'border-border hover:border-primary'
                                }
                              `}
                            >
                              {selectedProducts.length === filteredAndSortedProducts.length && filteredAndSortedProducts.length > 0 && (
                                <Icon name="Check" size={12} />
                              )}
                            </button>
                          </th>
                          <th className="p-4 text-left font-heading font-medium text-foreground">Product</th>
                          <th className="p-4 text-left font-heading font-medium text-foreground">Cost Price</th>
                          <th className="p-4 text-left font-heading font-medium text-foreground">Selling Price</th>
                          <th className="p-4 text-left font-heading font-medium text-foreground">Stock</th>
                          <th className="p-4 text-left font-heading font-medium text-foreground">Status</th>
                          <th className="p-4 text-left font-heading font-medium text-foreground">Date Added</th>
                          <th className="p-4 text-left font-heading font-medium text-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAndSortedProducts.map(product => (
                          <ProductTableRow
                            key={product.id}
                            product={product}
                            onEdit={handleEditProduct}
                            onDelete={handleDeleteProduct}
                            isSelected={selectedProducts.includes(product.id)}
                            onSelect={handleSelectProduct}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setProductToDelete(null);
          setIsBulkDelete(false);
        }}
        onConfirm={confirmDelete}
        productName={productToDelete?.name}
        isBulkDelete={isBulkDelete}
        bulkCount={selectedProducts.length}
      />

      {/* Mobile Floating Action Button */}
      <button
        onClick={() => navigate('/add-edit-product')}
        className="
          fixed bottom-6 right-6 z-200 lg:hidden
          w-14 h-14 bg-primary text-primary-foreground
          rounded-full shadow-modal
          flex items-center justify-center
          transition-all duration-200 ease-out
          hover:scale-105 active:scale-95
          focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
        "
        aria-label="Add new product"
      >
        <Icon name="Plus" size={24} color="currentColor" />
      </button>
    </div>
  );
};

export default ProductManagement;