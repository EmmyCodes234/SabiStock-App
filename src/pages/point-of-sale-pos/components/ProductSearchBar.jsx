import React, { useState, useEffect, useRef } from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ProductSearchBar = ({ products, onProductSelect, disabled }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 8);

    setFilteredProducts(filtered);
    setShowSuggestions(filtered.length > 0);
    setSelectedIndex(-1);
  }, [searchTerm, products]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleProductSelect = (product) => {
    if (product.quantity > 0) {
      onProductSelect(product);
      setSearchTerm('');
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredProducts.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && filteredProducts[selectedIndex]) {
          handleProductSelect(filteredProducts[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleClickOutside = (e) => {
    if (searchRef.current && !searchRef.current.contains(e.target)) {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <Input
          type="search"
          placeholder="Search products by name or SKU..."
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="pl-10"
        />
        <Icon 
          name="Search" 
          size={20} 
          color="var(--color-muted-foreground)"
          className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
        />
      </div>

      {showSuggestions && (
        <div 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 z-50 bg-card border border-border rounded-lg shadow-modal mt-1 max-h-80 overflow-y-auto"
        >
          {filteredProducts.map((product, index) => (
            <button
              key={product.id}
              onClick={() => handleProductSelect(product)}
              disabled={product.quantity === 0}
              className={`
                w-full p-3 flex items-center space-x-3 text-left
                transition-colors duration-200
                ${index === selectedIndex 
                  ? 'bg-accent text-accent-foreground' 
                  : 'hover:bg-muted'
                }
                ${product.quantity === 0 
                  ? 'opacity-50 cursor-not-allowed' :'cursor-pointer'
                }
                ${index === 0 ? 'rounded-t-lg' : ''}
                ${index === filteredProducts.length - 1 ? 'rounded-b-lg' : ''}
              `}
            >
              <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-sm text-foreground truncate">
                    {product.name}
                  </h4>
                  <span className="text-sm font-medium text-foreground ml-2">
                    ₦{product.sellingPrice.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    SKU: {product.sku}
                  </span>
                  <div className="flex items-center space-x-2">
                    {product.quantity <= 5 && product.quantity > 0 && (
                      <span className="text-xs text-warning font-medium">
                        Low Stock
                      </span>
                    )}
                    <span className={`
                      text-xs font-medium
                      ${product.quantity === 0 
                        ? 'text-error' 
                        : product.quantity <= 5 
                          ? 'text-warning' :'text-success'
                      }
                    `}>
                      {product.quantity === 0 ? 'Out of Stock' : `${product.quantity} in stock`}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductSearchBar;