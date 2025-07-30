import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import QuickActionButton from '../../components/ui/QuickActionButton';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { SkeletonProductGrid, SkeletonMetricCards } from '../../components/ui/SkeletonLoader';
import { productService } from '../../utils/apiService';
import { notificationHelpers } from '../../utils/notifications';

// Component imports
import ProductCard from './components/ProductCard';
import ProductTableRow from './components/ProductTableRow';
import SearchAndFilters from './components/SearchAndFilters';
import ViewToggle from './components/ViewToggle';
import BulkActions from './components/BulkActions';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import EmptyState from './components/EmptyState';
import StockAdjustmentModal from './components/StockAdjustmentModal';
import ImportProductsModal from './components/ImportProductsModal'; // <-- New Import

const ProductManagement = () => {
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [currentView, setCurrentView] = useState('grid');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [productToAdjust, setProductToAdjust] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false); // <-- New State
  
  const [filters, setFilters] = useState({
    stockStatus: 'all',
    category: 'all',
    priceRange: { min: null, max: null }
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const productsData = await productService.getAll();
      setProducts(productsData);
    } catch (error) {
      notificationHelpers.error(`Failed to load products: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportToCSV = () => {
    notificationHelpers.info("Generating your product export...");
    try {
        const productsToExport = filteredAndSortedProducts.map(p => ({
            SKU: p.sku,
            Name: p.name,
            Category: p.category,
            "Cost Price": p.cost_price,
            "Selling Price": p.selling_price,
            Quantity: p.quantity,
            "Low Stock Threshold": p.low_stock_threshold,
            Description: p.description,
            "Image URL": p.image,
            "Date Added": new Date(p.created_at).toISOString(),
        }));

        const csv = Papa.unparse(productsToExport);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `sabistock_products_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        notificationHelpers.success("Product list exported successfully!");
    } catch (error) {
        notificationHelpers.error(`Export failed: ${error.message}`);
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()));
      
      let matchesStock = true;
      if (filters.stockStatus !== 'all') {
        const isLowStock = product.quantity <= product.low_stock_threshold;
        const isOutOfStock = product.quantity === 0;
        
        switch (filters.stockStatus) {
          case 'in-stock': matchesStock = product.quantity > product.low_stock_threshold; break;
          case 'low-stock': matchesStock = isLowStock && !isOutOfStock; break;
          case 'out-of-stock': matchesStock = isOutOfStock; break;
        }
      }
      
      const matchesCategory = filters.category === 'all' || product.category === filters.category;
      const matchesPrice = (!filters.priceRange.min || product.selling_price >= filters.priceRange.min) && (!filters.priceRange.max || product.selling_price <= filters.priceRange.max);
      
      return matchesSearch && matchesStock && matchesCategory && matchesPrice;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        case 'price-asc': return a.selling_price - b.selling_price;
        case 'price-desc': return b.selling_price - a.selling_price;
        case 'stock-asc': return a.quantity - b.quantity;
        case 'stock-desc': return b.quantity - a.quantity;
        case 'date-newest': return new Date(b.created_at) - new Date(a.created_at);
        case 'date-oldest': return new Date(a.created_at) - new Date(b.created_at);
        default: return 0;
      }
    });
  }, [products, searchTerm, sortBy, filters]);

  const handleEditProduct = (product) => navigate(`/add-edit-product?id=${product.id}`);
  const handleOpenStockModal = (product) => { setProductToAdjust(product); setShowStockModal(true); };
  const handleDeleteProduct = (product) => { setProductToDelete(product); setIsBulkDelete(false); setShowDeleteModal(true); };
  const handleBulkDelete = () => { setIsBulkDelete(true); setShowDeleteModal(true); };

  const confirmDelete = async () => {
    try {
      if (isBulkDelete) {
        await Promise.all(selectedProducts.map(id => productService.delete(id)));
        notificationHelpers.success(`${selectedProducts.length} products deleted successfully`);
        setSelectedProducts([]);
      } else if (productToDelete) {
        await productService.delete(productToDelete.id);
        notificationHelpers.productDeleted(productToDelete.name);
      }
      await loadProducts();
    } catch (error) {
      notificationHelpers.error(`Delete failed: ${error.message}`);
    } finally {
      setShowDeleteModal(false);
      setProductToDelete(null);
      setIsBulkDelete(false);
    }
  };

  const handleSelectProduct = (productId) => setSelectedProducts(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  const handleSelectAll = () => setSelectedProducts(selectedProducts.length === filteredAndSortedProducts.length ? [] : filteredAndSortedProducts.map(p => p.id));
  const handleClearSelection = () => setSelectedProducts([]);
  const handleClearFilters = () => setFilters({ stockStatus: 'all', category: 'all', priceRange: { min: null, max: null } });
  const handleClearSearch = () => { setSearchTerm(''); handleClearFilters(); };

  const getStats = () => {
    const lowStockCount = products.filter(p => p.quantity > 0 && p.quantity <= p.low_stock_threshold).length;
    const outOfStockCount = products.filter(p => p.quantity === 0).length;
    const inStockCount = products.length - lowStockCount - outOfStockCount;
    return { total: products.length, inStock: inStockCount, lowStock: lowStockCount, outOfStock: outOfStockCount };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-background">
      <NavigationSidebar isCollapsed={isSidebarCollapsed} toggleSidebar={() => setSidebarCollapsed(!isSidebarCollapsed)} />
      <main className={`min-h-screen transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-240'}`}>
        <div className="p-4 lg:p-6">
          <div className="mb-6">
            <BreadcrumbTrail />
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="font-heading font-semibold text-2xl lg:text-3xl text-foreground mb-2">Product Management</h1>
                <p className="text-muted-foreground">Manage your inventory, track stock levels, and organize your products</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" iconName="Upload" onClick={() => setShowImportModal(true)}>Import</Button>
                <Button variant="outline" iconName="Download" onClick={handleExportToCSV} disabled={products.length === 0}>Export</Button>
                <ViewToggle currentView={currentView} onViewChange={setCurrentView} />
                <QuickActionButton />
              </div>
            </div>
            {isLoading ? <SkeletonMetricCards className="mt-6" /> : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <div className="bg-card border border-border rounded-lg p-4"><div className="flex items-center space-x-3"><div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center"><Icon name="Package" size={20} color="var(--color-primary)" /></div><div><p className="text-sm text-muted-foreground">Total Products</p><p className="font-heading font-semibold text-xl text-foreground">{stats.total}</p></div></div></div>
                <div className="bg-card border border-border rounded-lg p-4"><div className="flex items-center space-x-3"><div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center"><Icon name="CheckCircle" size={20} color="var(--color-success)" /></div><div><p className="text-sm text-muted-foreground">In Stock</p><p className="font-heading font-semibold text-xl text-foreground">{stats.inStock}</p></div></div></div>
                <div className="bg-card border border-border rounded-lg p-4"><div className="flex items-center space-x-3"><div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center"><Icon name="AlertTriangle" size={20} color="var(--color-warning)" /></div><div><p className="text-sm text-muted-foreground">Low Stock</p><p className="font-heading font-semibold text-xl text-foreground">{stats.lowStock}</p></div></div></div>
                <div className="bg-card border border-border rounded-lg p-4"><div className="flex items-center space-x-3"><div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center"><Icon name="XCircle" size={20} color="var(--color-error)" /></div><div><p className="text-sm text-muted-foreground">Out of Stock</p><p className="font-heading font-semibold text-xl text-foreground">{stats.outOfStock}</p></div></div></div>
              </div>
            )}
          </div>
          {!isLoading && <SearchAndFilters searchTerm={searchTerm} onSearchChange={setSearchTerm} sortBy={sortBy} onSortChange={setSortBy} filters={filters} onFiltersChange={setFilters} onClearFilters={handleClearFilters} />}
          {!isLoading && selectedProducts.length > 0 && <BulkActions selectedCount={selectedProducts.length} onBulkDelete={handleBulkDelete} onSelectAll={handleSelectAll} onClearSelection={handleClearSelection} />}
          {isLoading ? <SkeletonProductGrid /> : filteredAndSortedProducts.length === 0 ? <EmptyState hasSearchTerm={searchTerm.length > 0} searchTerm={searchTerm} onClearSearch={handleClearSearch} /> : (
            <>
              {currentView === 'grid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredAndSortedProducts.map(product => <ProductCard key={product.id} product={product} onEdit={handleEditProduct} onDelete={handleDeleteProduct} onAdjustStock={handleOpenStockModal} isSelected={selectedProducts.includes(product.id)} onSelect={handleSelectProduct} />)}
                </div>
              )}
              {currentView === 'table' && (
                <div className="bg-card border border-border rounded-lg overflow-hidden"><div className="overflow-x-auto"><table className="w-full">
                  <thead className="bg-muted border-b border-border">
                    <tr>
                      <th className="p-4 text-left"><button onClick={handleSelectAll} className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200 ${selectedProducts.length === filteredAndSortedProducts.length && filteredAndSortedProducts.length > 0 ? 'bg-primary border-primary text-primary-foreground' : 'border-border hover:border-primary'}`}>{selectedProducts.length === filteredAndSortedProducts.length && filteredAndSortedProducts.length > 0 && <Icon name="Check" size={12} />}</button></th>
                      <th className="p-4 text-left font-heading font-medium text-foreground">Product</th>
                      <th className="p-4 text-left font-heading font-medium text-foreground">Cost Price</th>
                      <th className="p-4 text-left font-heading font-medium text-foreground">Selling Price</th>
                      <th className="p-4 text-left font-heading font-medium text-foreground">Stock</th>
                      <th className="p-4 text-left font-heading font-medium text-foreground">Status</th>
                      <th className="p-4 text-left font-heading font-medium text-foreground">Date Added</th>
                      <th className="p-4 text-left font-heading font-medium text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>{filteredAndSortedProducts.map(product => <ProductTableRow key={product.id} product={product} onEdit={handleEditProduct} onDelete={handleDeleteProduct} onAdjustStock={handleOpenStockModal} isSelected={selectedProducts.includes(product.id)} onSelect={handleSelectProduct} />)}</tbody>
                </table></div></div>
              )}
            </>
          )}
        </div>
      </main>
      <DeleteConfirmationModal isOpen={showDeleteModal} onClose={() => { setShowDeleteModal(false); setProductToDelete(null); setIsBulkDelete(false); }} onConfirm={confirmDelete} productName={productToDelete?.name} isBulkDelete={isBulkDelete} bulkCount={selectedProducts.length} />
      <StockAdjustmentModal isOpen={showStockModal} onClose={() => setShowStockModal(false)} product={productToAdjust} onSuccess={loadProducts} />
      <ImportProductsModal isOpen={showImportModal} onClose={() => setShowImportModal(false)} onImportSuccess={loadProducts} />
    </div>
  );
};

export default ProductManagement;