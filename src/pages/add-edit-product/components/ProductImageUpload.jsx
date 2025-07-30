import React, { useState, useRef } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ProductImageUpload = ({ image, onImageChange, error }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file.type.startsWith('image/')) {
      return;
    }

    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageChange(e.target.result);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }, 1000);
  };

  const removeImage = () => {
    onImageChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-foreground">
          Product Image
        </label>
        {image && (
          <Button
            variant="ghost"
            size="sm"
            onClick={removeImage}
            iconName="Trash2"
            iconPosition="left"
            className="text-error hover:text-error"
          >
            Remove
          </Button>
        )}
      </div>

      {image ? (
        <div className="relative group">
          <div className="aspect-square w-full max-w-sm mx-auto bg-muted rounded-lg overflow-hidden">
            <Image
              src={image}
              alt="Product preview"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
            <Button
              variant="secondary"
              onClick={openFileDialog}
              iconName="Camera"
              iconPosition="left"
            >
              Change Image
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
            ${isDragging 
              ? 'border-primary bg-primary bg-opacity-5' :'border-border hover:border-primary hover:bg-muted'
            }
            ${error ? 'border-error' : ''}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isUploading ? (
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto animate-pulse">
                <Icon name="Upload" size={24} color="white" />
              </div>
              <p className="text-sm text-muted-foreground">Uploading image...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Icon name="ImagePlus" size={24} color="var(--color-muted-foreground)" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">
                  Drop your image here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports JPG, PNG up to 5MB
                </p>
              </div>
              <Button
                variant="outline"
                onClick={openFileDialog}
                iconName="Upload"
                iconPosition="left"
              >
                Choose File
              </Button>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-error flex items-center space-x-2">
          <Icon name="AlertCircle" size={16} />
          <span>{error}</span>
        </p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default ProductImageUpload;