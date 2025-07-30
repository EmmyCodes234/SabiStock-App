import React, { useState, useEffect, useRef } from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ProductSearchBar = ({ products, onProductSelect, onQuickAdd, onScan, disabled }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()))
    ).slice(0, 8);

    setFilteredProducts(filtered);
    setShowSuggestions(true);
    setSelectedIndex(-1);
  }, [searchTerm, products]);

  const handleInputChange = (e) => setSearchTerm(e.target.value);

  const handleProductSelect = (product) => {
    if (product.quantity > 0) {
      onProductSelect(product);
      setSearchTerm('');
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < filteredProducts.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && filteredProducts[selectedIndex]) {
          handleProductSelect(filteredProducts[selectedIndex]);
        } else if (searchTerm.trim()) {
            // This allows USB scanners to work - they type the SKU and hit Enter
            const exactMatch = products.find(p => p.sku === searchTerm.trim());
            if(exactMatch) {
                handleProductSelect(exactMatch);
            }
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
    }
  };
  
  const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
          setShowSuggestions(false);
      }
  };

  useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
          document.removeEventListener("mousedown", handleClickOutside);
      };
  }, []);
  
  const handleQuickAddClick = () => {
    onQuickAdd(searchTerm);
    setSearchTerm('');
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="flex items-center gap-2">
        <div className="relative flex-grow">
          <Input
            type="search"
            placeholder="Search by name or scan a barcode..."
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            disabled={disabled}
            className="pl-10"
          />
          <Icon name="Search" size={20} color="var(--color-muted-foreground)" className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
        </div>
        <Button variant="outline" size="icon" onClick={onScan} disabled={disabled} aria-label="Scan barcode">
            <Icon name="ScanLine" />
        </Button>
      </div>

      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 z-50 bg-card border border-border rounded-lg shadow-modal mt-1 max-h-80 overflow-y-auto">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <button key={product.id} onClick={() => handleProductSelect(product)} disabled={product.quantity === 0}
                className={`w-full p-3 flex items-center space-x-3 text-left transition-colors duration-200 ${index === selectedIndex ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'} ${product.quantity === 0 ? 'opacity-50 cursor-not-allowed' :'cursor-pointer'}`}>
                <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm text-foreground truncate">{product.name}</h4>
                        <span className="text-sm font-medium text-foreground ml-2">₦{product.selling_price.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">SKU: {product.sku}</span>
                        <span className={`text-xs font-medium ${product.quantity === 0 ? 'text-error' : product.quantity <= 5 ? 'text-warning' : 'text-success'}`}>
                            {product.quantity === 0 ? 'Out of Stock' : `${product.quantity} in stock`}
                        </span>
                    </div>
                </div>
              </button>
            ))
          ) : (
             <div className="p-4 text-center text-sm text-muted-foreground">
                <p>No products found for "{searchTerm}"</p>
                <Button variant="link" className="mt-2" onClick={handleQuickAddClick}>Add it now?</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductSearchBar;