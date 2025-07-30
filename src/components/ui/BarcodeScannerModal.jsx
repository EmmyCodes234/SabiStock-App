import React, { useState } from 'react';
import BarcodeScanner from 'react-qr-barcode-scanner'; // <-- CORRECTED IMPORT
import Button from './Button';
import Icon from '../AppIcon';

const BarcodeScannerModal = ({ isOpen, onClose, onScanSuccess }) => {
  const [isScanning, setIsScanning] = useState(true);

  if (!isOpen) return null;

  const handleScan = (error, result) => {
    if (result && isScanning) {
      setIsScanning(false); // Stop further scans
      onScanSuccess(result.text);
      onClose(); // Close the modal automatically on success
    }
    if (error) {
      // You can add error handling here if needed
      // console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 z-300 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-modal max-w-lg w-full mx-auto overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name="Camera" size={20} className="text-primary" />
            <h2 className="font-heading font-semibold text-lg text-foreground">Scan Product Barcode</h2>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <Icon name="X" size={16} />
          </Button>
        </div>
        
        <div className="p-4 relative bg-black">
          <div className="w-full aspect-video rounded-lg overflow-hidden">
            <BarcodeScanner
              onUpdate={handleScan}
              width="100%"
              height="100%"
              facingMode="environment" // Prioritize rear camera
            />
          </div>
           {/* Overlay to guide user */}
          <div className="absolute inset-4 flex items-center justify-center pointer-events-none">
            <div className="w-full max-w-xs h-24 border-4 border-white/50 rounded-lg animate-pulse"></div>
          </div>
        </div>
        
        <div className="p-4 text-center bg-muted">
            <p className="text-sm text-muted-foreground">
                Position a product's barcode or QR code inside the frame.
            </p>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScannerModal;