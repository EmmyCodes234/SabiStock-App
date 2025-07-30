import React, { useRef, useState, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Receipt from './Receipt';
import { profileService } from '../../../utils/apiService';

const TransactionComplete = ({
  isVisible,
  transactionData,
  onStartNewSale,
  onViewReceipt,
}) => {
  const receiptRef = useRef();
  const [businessProfile, setBusinessProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (isVisible) {
        const profile = await profileService.getProfile();
        setBusinessProfile(profile);
      }
    };
    fetchProfile();
  }, [isVisible]);

  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
    documentTitle: `receipt-${transactionData?.id}`,
  });

  if (!isVisible || !transactionData) return null;

  const { method, total, amountReceived, change, timestamp, items } = transactionData;

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="fixed inset-0 z-300 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-modal max-w-md w-full mx-auto">
        <div className="p-6 border-b border-border text-center">
          <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="CheckCircle" size={32} color="white" />
          </div>
          <h2 className="font-heading font-semibold text-xl text-foreground mb-2">Transaction Successful!</h2>
          <p className="text-sm text-muted-foreground">Payment has been processed successfully.</p>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-muted rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Transaction ID:</span>
              <span className="text-sm font-mono text-foreground">TXN-{timestamp.getTime().toString().slice(-8)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Date & Time:</span>
              <span className="text-sm text-foreground">{formatDate(timestamp)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Payment Method:</span>
              <span className="text-sm text-foreground capitalize">{method}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Items Sold:</span>
              <span className="text-sm text-foreground">{items.reduce((sum, item) => sum + item.cartQuantity, 0)} items</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Amount:</span>
              <span className="text-sm font-medium text-foreground">₦{total.toLocaleString()}</span>
            </div>
            {method === 'cash' && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Amount Received:</span>
                  <span className="text-sm font-medium text-foreground">₦{amountReceived.toLocaleString()}</span>
                </div>
                {change > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Change Given:</span>
                    <span className="text-sm font-medium text-success">₦{change.toLocaleString()}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-border space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={onViewReceipt} iconName="FileText" iconPosition="left" size="sm">View History</Button>
            <Button variant="outline" onClick={handlePrint} iconName="Printer" iconPosition="left" size="sm">Print Receipt</Button>
          </div>
          <Button variant="default" onClick={onStartNewSale} iconName="Plus" iconPosition="left" fullWidth>Start New Sale</Button>
        </div>
      </div>

      {/* Hidden receipt component for printing */}
      <div className="hidden">
        <Receipt ref={receiptRef} transactionData={transactionData} businessProfile={businessProfile} />
      </div>
    </div>
  );
};

export default TransactionComplete;