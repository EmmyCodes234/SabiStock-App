import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import { customerService } from '../../../utils/apiService';
import { notificationHelpers } from '../../../utils/notifications';

const AddCustomerModal = ({ isOpen, onClose, onCustomerAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Customer name is required.';
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    try {
      const newCustomer = await customerService.add(formData);
      notificationHelpers.success(`Customer "${newCustomer.name}" has been added.`);
      onCustomerAdded(); // Trigger a refresh on the main page
      onClose();
      // Reset form for next time
      setFormData({ name: '', email: '', phone: '' });
    } catch (error) {
      notificationHelpers.error(`Failed to add customer: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-300 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-modal max-w-md w-full mx-auto">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="UserPlus" size={20} color="var(--color-primary)" />
            </div>
            <div>
              <h2 className="font-heading font-semibold text-lg text-foreground">Add New Customer</h2>
              <p className="text-sm text-muted-foreground">Save a new customer to your database.</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose} disabled={isSaving}>
            <Icon name="X" size={16} />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <Input label="Full Name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} error={errors.name} required />
            <Input label="Email Address (Optional)" type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} error={errors.email} />
            <Input label="Phone Number (Optional)" type="tel" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} error={errors.phone} />
          </div>
          
          <div className="p-6 border-t border-border flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
            <Button type="submit" loading={isSaving} disabled={isSaving}>Save Customer</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomerModal;