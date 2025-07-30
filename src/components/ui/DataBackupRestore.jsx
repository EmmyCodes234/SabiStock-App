import React, { useState, useRef } from 'react';
import { backupService, analyticsService } from '../../utils/apiService'; // <-- CORRECTED IMPORT
import { notificationHelpers } from '../../utils/notifications';
import Button from './Button';
import Icon from '../AppIcon';
import { cn } from '../../utils/cn';

const DataBackupRestore = ({ className = '' }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showConfirmRestore, setShowConfirmRestore] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Note: These services will need to be updated to be async when fully migrated.
  // For now, getStorageUsage is sync and backupService is not yet migrated.
  const storageInfo = analyticsService.getStorageUsage ? analyticsService.getStorageUsage() : { totalSizeFormatted: 'N/A', usagePercentage: 0 };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // This will need to be refactored once backupService is async
      if (backupService.export) {
        await backupService.export();
        notificationHelpers.backupCreated();
      } else {
        notificationHelpers.error("Export service is not available.");
      }
    } catch (error) {
      notificationHelpers.error(`Export failed: ${error.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        setSelectedFile(file);
        setShowConfirmRestore(true);
      } else {
        notificationHelpers.error('Please select a valid JSON backup file');
      }
    }
  };

  const handleConfirmRestore = async () => {
    if (!selectedFile) return;

    setIsImporting(true);
    try {
      // This will need to be refactored once backupService is async
       if (backupService.import) {
        const result = await backupService.import(selectedFile);
        notificationHelpers.success(result.message);
        setShowConfirmRestore(false);
        setSelectedFile(null);
        
        // Reload page to refresh all components with new data
        setTimeout(() => {
            window.location.reload();
        }, 1000);
      } else {
         notificationHelpers.error("Import service is not available.");
      }
    } catch (error) {
      notificationHelpers.error(error.message);
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCancelRestore = () => {
    setShowConfirmRestore(false);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn('bg-card border border-border rounded-lg p-6', className)}>
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="DatabaseZap" size={20} color="var(--color-primary)" />
        </div>
        <div>
          <h3 className="font-heading font-semibold text-lg text-foreground">
            Data Backup & Restore
          </h3>
          <p className="text-sm text-muted-foreground">
            Manage your business data
          </p>
        </div>
      </div>

       {/* This component will be fully deprecated post-migration */}
      <div className="bg-muted rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Storage</span>
          <span className="text-sm text-muted-foreground">
            {storageInfo.totalSizeFormatted === 'N/A' ? 'Cloud Synced' : `${storageInfo.totalSizeFormatted} used`}
          </span>
        </div>
        <div className="w-full bg-background rounded-full h-2">
          <div 
            className="bg-success h-2 rounded-full"
            style={{ width: `100%` }}
          />
        </div>
         <p className="text-xs text-success mt-2">
            Your data is now securely stored in the cloud.
          </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div>
            <h4 className="font-medium text-foreground">Export Data (Legacy)</h4>
            <p className="text-sm text-muted-foreground">
              Download a local JSON backup file.
            </p>
          </div>
          <Button
            onClick={handleExport}
            disabled={true} // Disabling legacy backup for now
            iconName="Download"
            iconPosition="left"
            variant="outline"
          >
            Export
          </Button>
        </div>

        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div>
            <h4 className="font-medium text-foreground">Import Data (Legacy)</h4>
            <p className="text-sm text-muted-foreground">
              Restore from a local JSON file.
            </p>
          </div>
          <Button
            onClick={handleImportClick}
            disabled={true} // Disabling legacy backup for now
            iconName="Upload"
            iconPosition="left"
            variant="outline"
          >
            Import
          </Button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileSelect}
        className="hidden"
      />

      {showConfirmRestore && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-500 p-4">
          <div className="bg-card border border-border rounded-lg max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                <Icon name="AlertTriangle" size={20} color="var(--color-warning)" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-lg text-foreground">
                  Confirm Data Restore
                </h3>
                <p className="text-sm text-muted-foreground">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-4 mb-6">
              <p className="text-sm text-foreground mb-2">
                <strong>File:</strong> {selectedFile?.name}
              </p>
              <p className="text-sm text-foreground mb-4">
                <strong>Size:</strong> {selectedFile ? (selectedFile.size / 1024).toFixed(1) : 0} KB
              </p>
              
              <div className="bg-warning/10 border border-warning/20 rounded-md p-3">
                <p className="text-xs text-warning font-medium">
                  ⚠️ Warning: This will replace all your current data including products, sales, and settings. 
                  Make sure to export your current data first if you want to keep it.
                </p>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={handleCancelRestore}
                variant="outline"
                disabled={isImporting}
                fullWidth
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmRestore}
                variant="default"
                disabled={isImporting}
                iconName={isImporting ? "Loader" : "Upload"}
                iconPosition="left"
                fullWidth
              >
                {isImporting ? 'Restoring...' : 'Restore Data'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataBackupRestore;