import React, { useState, useEffect } from 'react';
import { customerService } from '../../../utils/apiService';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { notificationHelpers } from '../../../utils/notifications';

const CustomerSelect = ({ onCustomerSelected }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [newCustomerName, setNewCustomerName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (searchTerm.length < 2) {
            setResults([]);
            return;
        }
        const search = async () => {
            setIsLoading(true);
            try {
                const customers = await customerService.search(searchTerm);
                setResults(customers);
            } catch (error) {
                notificationHelpers.error("Failed to search customers.");
            } finally {
                setIsLoading(false);
            }
        };
        const debounce = setTimeout(search, 300);
        return () => clearTimeout(debounce);
    }, [searchTerm]);
    
    const handleSelect = (customer) => {
        setSelectedCustomer(customer);
        onCustomerSelected(customer);
        setSearchTerm('');
        setResults([]);
    };

    const handleAddNew = async () => {
        if (!newCustomerName.trim()) {
            notificationHelpers.error("Please enter a name for the new customer.");
            return;
        }
        try {
            const newCustomer = await customerService.add({ name: newCustomerName });
            notificationHelpers.success(`Customer "${newCustomer.name}" added.`);
            handleSelect(newCustomer);
            setIsAdding(false);
            setNewCustomerName('');
        } catch (error) {
            notificationHelpers.error(`Failed to add customer: ${error.message}`);
        }
    };

    if (selectedCustomer) {
        return (
             <div className="bg-muted rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon name="UserCheck" size={16} className="text-success" />
                    <span className="font-medium text-foreground">{selectedCustomer.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => { setSelectedCustomer(null); onCustomerSelected(null);}}>Change</Button>
            </div>
        );
    }
    
    if (isAdding) {
        return (
            <div className="space-y-2">
                 <Input value={newCustomerName} onChange={(e) => setNewCustomerName(e.target.value)} placeholder="Enter new customer's name" />
                 <div className="flex gap-2">
                    <Button onClick={handleAddNew} size="sm">Save Customer</Button>
                    <Button variant="outline" size="sm" onClick={() => setIsAdding(false)}>Cancel</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            <Input 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or add new..."
                icon={isLoading ? <Icon name="Loader" className="animate-spin" /> : <Icon name="Search" />}
            />
            {results.length > 0 && (
                 <div className="absolute top-full left-0 right-0 z-10 bg-card border border-border rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
                    {results.map(customer => (
                         <div key={customer.id} onClick={() => handleSelect(customer)} className="p-3 hover:bg-muted cursor-pointer text-sm">
                            <p className="font-medium">{customer.name}</p>
                            {customer.phone && <p className="text-xs text-muted-foreground">{customer.phone}</p>}
                        </div>
                    ))}
                </div>
            )}
             <Button variant="link" size="sm" className="mt-2" onClick={() => setIsAdding(true)}>
                + Add New Customer
            </Button>
        </div>
    );
};

export default CustomerSelect;