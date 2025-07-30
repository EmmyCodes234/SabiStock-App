import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // <-- New Import
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { customerService } from '../../utils/apiService';
import { notificationHelpers } from '../../utils/notifications';
import AddCustomerModal from './components/AddCustomerModal';

const CustomersPage = () => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const data = await customerService.getAll();
      setCustomers(data);
    } catch (error) {
      notificationHelpers.error(`Failed to load customers: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCustomerAdded = () => {
    fetchCustomers();
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationSidebar isCollapsed={isSidebarCollapsed} toggleSidebar={() => setSidebarCollapsed(!isSidebarCollapsed)} />
      <main className={`min-h-screen transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-240'}`}>
        <div className="p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <BreadcrumbTrail />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <h1 className="font-heading font-bold text-3xl text-foreground mb-2">Customers</h1>
                <p className="text-muted-foreground">Manage your customer database and view their history.</p>
              </div>
              <Button iconName="UserPlus" onClick={() => setShowAddModal(true)}>
                Add New Customer
              </Button>
            </div>

            <div className="bg-card border border-border rounded-lg">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted border-b border-border">
                    <tr>
                      <th className="p-4 text-left font-heading font-medium text-foreground">Name</th>
                      <th className="p-4 text-left font-heading font-medium text-foreground">Email</th>
                      <th className="p-4 text-left font-heading font-medium text-foreground">Phone</th>
                      <th className="p-4 text-left font-heading font-medium text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} className="border-b border-border">
                          <td className="p-4"><div className="h-4 bg-muted rounded animate-pulse w-3/4"></div></td>
                          <td className="p-4"><div className="h-4 bg-muted rounded animate-pulse w-3/4"></div></td>
                          <td className="p-4"><div className="h-4 bg-muted rounded animate-pulse w-1/2"></div></td>
                          <td className="p-4"><div className="h-8 bg-muted rounded animate-pulse w-20"></div></td>
                        </tr>
                      ))
                    ) : customers.map(customer => (
                      <tr key={customer.id} className="border-b border-border hover:bg-muted/50">
                        <td className="p-4 font-medium text-foreground">{customer.name}</td>
                        <td className="p-4 text-muted-foreground">{customer.email || 'N/A'}</td>
                        <td className="p-4 text-muted-foreground">{customer.phone || 'N/A'}</td>
                        <td className="p-4">
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/customers/${customer.id}`}>View History</Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                 { !isLoading && customers.length === 0 && (
                    <div className="text-center p-12">
                        <Icon name="Users" size={40} className="text-muted-foreground mx-auto mb-4"/>
                        <h3 className="font-medium text-foreground">No Customers Yet</h3>
                        <p className="text-sm text-muted-foreground mt-2">Click "Add New Customer" to add your first customer.</p>
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <AddCustomerModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onCustomerAdded={handleCustomerAdded}
      />
    </div>
  );
};

export default CustomersPage;