import React, { useState } from 'react';
import Papa from 'papaparse';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input'; // <-- ADDED MISSING IMPORT
import { productService } from '../../../utils/apiService';
import { notificationHelpers } from '../../../utils/notifications';

const ImportProductsModal = ({ isOpen, onClose, onImportSuccess }) => {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedData, setProcessedData] = useState([]);
  const [step, setStep] = useState(1); // 1: Upload, 2: Preview, 3: Importing

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
    } else {
      notificationHelpers.error("Please select a valid CSV file.");
    }
  };

  const handleParseFile = () => {
    if (!file) return;
    setIsProcessing(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setProcessedData(results.data);
        setIsProcessing(false);
        setStep(2);
      },
      error: (error) => {
        notificationHelpers.error(`CSV Parse Error: ${error.message}`);
        setIsProcessing(false);
      }
    });
  };

  const handleImport = async () => {
    setStep(3);
    setIsProcessing(true);
    let successCount = 0;
    let errorCount = 0;

    for (const product of processedData) {
      try {
        const productData = {
          sku: product.SKU,
          name: product.Name,
          category: product.Category,
          cost_price: parseFloat(product['Cost Price']) || 0,
          selling_price: parseFloat(product['Selling Price']) || 0,
          quantity: parseInt(product.Quantity, 10) || 0,
          low_stock_threshold: parseInt(product['Low Stock Threshold'], 10) || 5,
          description: product.Description,
          image: product['Image URL'],
        };

        // For simplicity, this import function will only create new products.
        // A more advanced version would check for existing SKUs and update them.
        if (productData.sku && productData.name) {
             await productService.create(productData);
             successCount++;
        } else {
            errorCount++;
        }

      } catch (error) {
        // This can happen if the SKU already exists, which is expected behavior.
        console.warn(`Skipping duplicate or invalid product with SKU ${product.SKU}:`, error);
        errorCount++;
      }
    }
    
    setIsProcessing(false);
    notificationHelpers.success(`${successCount} products imported. ${errorCount > 0 ? `${errorCount} skipped (duplicates or invalid data).` : ''}`);
    onImportSuccess();
    handleClose();
  };

  const handleClose = () => {
    setFile(null);
    setProcessedData([]);
    setStep(1);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-300 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-modal max-w-2xl w-full mx-auto">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="font-heading font-semibold text-xl text-foreground">Import Products from CSV</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleClose}><Icon name="X" size={16} /></Button>
        </div>
        
        {step === 1 && (
            <div className="p-6 space-y-4">
                <p className="text-sm text-muted-foreground">Download the template, fill it with your product data, and upload it here. The system will create new products based on the data in the file.</p>
                <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                    <Icon name="FileText" size={24} className="text-primary flex-shrink-0" />
                    <div>
                        <h4 className="font-medium text-foreground">Download CSV Template</h4>
                        <p className="text-xs text-muted-foreground">Start with our pre-formatted template to ensure a smooth import.</p>
                    </div>
                     <Button variant="outline" size="sm" className="ml-auto" onClick={() => {
                        const csv = Papa.unparse([{SKU: '', Name: '', Category: '', 'Cost Price': '', 'Selling Price': '', Quantity: '', 'Low Stock Threshold': '', Description: '', 'Image URL': ''}]);
                        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(blob);
                        link.download = 'sabistock_product_template.csv';
                        link.click();
                    }}>Download</Button>
                </div>
                <div>
                    <label htmlFor="csv-upload" className="block text-sm font-medium text-foreground mb-2">Upload Your CSV File</label>
                    <Input id="csv-upload" type="file" accept=".csv" onChange={handleFileChange} />
                </div>
                 <div className="pt-4 flex justify-end">
                    <Button onClick={handleParseFile} disabled={!file || isProcessing} loading={isProcessing}>Preview Data</Button>
                </div>
            </div>
        )}

        {step === 2 && (
            <div className="p-6">
                <h3 className="font-semibold mb-2">Data Preview</h3>
                <p className="text-sm text-muted-foreground mb-4">{processedData.length} products found. Review the data before importing.</p>
                <div className="max-h-64 overflow-y-auto border border-border rounded-lg">
                    <table className="w-full text-sm">
                       <thead className="bg-muted"><tr className="text-left">
                           <th className="p-2 font-medium">SKU</th><th className="p-2 font-medium">Name</th><th className="p-2 font-medium">Selling Price</th><th className="p-2 font-medium">Quantity</th>
                       </tr></thead>
                       <tbody>
                           {processedData.slice(0, 10).map((row, i) => (
                               <tr key={i} className="border-t border-border">
                                   <td className="p-2">{row.SKU}</td><td className="p-2">{row.Name}</td><td className="p-2">₦{row['Selling Price']}</td><td className="p-2">{row.Quantity}</td>
                               </tr>
                           ))}
                       </tbody>
                    </table>
                </div>
                {processedData.length > 10 && <p className="text-xs text-muted-foreground text-center mt-2">Showing first 10 rows...</p>}
                <div className="pt-6 flex justify-between items-center">
                    <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                    <Button onClick={handleImport}>Confirm and Import</Button>
                </div>
            </div>
        )}
        
        {step === 3 && (
            <div className="p-8 text-center">
                <Icon name="Loader" size={40} className="text-primary animate-spin mx-auto mb-4" />
                <h3 className="font-semibold text-lg">Importing Products...</h3>
                <p className="text-muted-foreground">Please wait while we process your file. This may take a moment.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ImportProductsModal;