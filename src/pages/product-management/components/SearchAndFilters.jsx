import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';


const SearchAndFilters = ({ 
  searchTerm, 
  onSearchChange, 
  sortBy, 
  onSortChange, 
  filters, 
  onFiltersChange,
  onClearFilters 
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const sortOptions = [
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'price-asc', label: 'Price (Low to High)' },
    { value: 'price-desc', label: 'Price (High to Low)' },
    { value: 'stock-asc', label: 'Stock (Low to High)' },
    { value: 'stock-desc', label: 'Stock (High to Low)' },
    { value: 'date-newest', label: 'Newest First' },
    { value: 'date-oldest', label: 'Oldest First' }
  ];

  const stockStatusOptions = [
    { value: 'all', label: 'All Products' },
    { value: 'in-stock', label: 'In Stock' },
    { value: 'low-stock', label: 'Low Stock' },
    { value: 'out-of-stock', label: 'Out of Stock' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'food', label: 'Food & Beverages' },
    { value: 'beauty', label: 'Beauty & Personal Care' },
    { value: 'home', label: 'Home & Garden' },
    { value: 'books', label: 'Books & Stationery' },
    { value: 'sports', label: 'Sports & Fitness' },
    { value: 'other', label: 'Other' }
  ];

  const handlePriceRangeChange = (field, value) => {
    onFiltersChange({
      ...filters,
      priceRange: {
        ...filters.priceRange,
        [field]: value ? parseFloat(value) : null
      }
    });
  };

  const hasActiveFilters = () => {
    return filters.stockStatus !== 'all' || 
           filters.category !== 'all' || 
           filters.priceRange.min !== null || 
           filters.priceRange.max !== null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      {/* Main Search and Sort Row */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        {/* Search Input */}
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search products by name or SKU..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="sm:w-48">
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={onSortChange}
            placeholder="Sort by..."
          />
        </div>

        {/* Advanced Filters Toggle */}
        <Button
          variant="outline"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          iconName={showAdvancedFilters ? "ChevronUp" : "ChevronDown"}
          iconPosition="right"
          className="sm:w-auto"
        >
          Filters
          {hasActiveFilters() && (
            <span className="ml-2 w-2 h-2 bg-primary rounded-full"></span>
          )}
        </Button>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <div className="border-t border-border pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Stock Status Filter */}
            <div>
              <Select
                label="Stock Status"
                options={stockStatusOptions}
                value={filters.stockStatus}
                onChange={(value) => onFiltersChange({ ...filters, stockStatus: value })}
              />
            </div>

            {/* Category Filter */}
            <div>
              <Select
                label="Category"
                options={categoryOptions}
                value={filters.category}
                onChange={(value) => onFiltersChange({ ...filters, category: value })}
              />
            </div>

            {/* Price Range - Min */}
            <div>
              <Input
                label="Min Price (₦)"
                type="number"
                placeholder="0"
                value={filters.priceRange.min || ''}
                onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                min="0"
                step="0.01"
              />
            </div>

            {/* Price Range - Max */}
            <div>
              <Input
                label="Max Price (₦)"
                type="number"
                placeholder="No limit"
                value={filters.priceRange.max || ''}
                onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters() && (
            <div className="flex justify-end mt-4">
              <Button
                variant="ghost"
                onClick={onClearFilters}
                iconName="X"
                iconPosition="left"
                size="sm"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAndFilters;