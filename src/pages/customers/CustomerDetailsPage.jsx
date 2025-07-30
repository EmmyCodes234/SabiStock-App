import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import Icon from '../../components/AppIcon';
import { customerService, salesService } from '../../utils/apiService';
import { notificationHelpers } from '../../utils/notifications';

const CustomerDetailsPage = () => {
  const { id } = useParams();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [sales, setSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const customerData = await customerService.getById(id);
        const salesData = await salesService.getByCustomerId(id);
        setCustomer(customerData);
        setSales(salesData);
      } catch (error) {
        notificationHelpers.error(`Failed to load customer data: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [id]);
  
  const totalSpent = sales.reduce((sum, sale) => sum + sale.total, 0);

  return (
    <div className="min-h-screen bg-background">
      <NavigationSidebar isCollapsed={isSidebarCollapsed} toggleSidebar={() => setSidebarCollapsed(!isSidebarCollapsed)} />
      <main className={`min-h-screen transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-240'}`}>
        <div className="p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <BreadcrumbTrail />
             {isLoading ? (
                <div className="h-10 bg-muted rounded animate-pulse w-1/2 mb-8"></div>
             ) : (
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="font-heading font-bold text-3xl text-foreground mb-2">{customer?.name}</h1>
                        <p className="text-muted-foreground">Customer since {new Date(customer?.created_at).toLocaleDateString()}</p>
                    </div>
                </div>
             )}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    {/* Customer Details Card */}
                    <div className="bg-card border border-border rounded-lg p-6">
                        <h3 className="font-semibold text-lg mb-4">Contact Information</h3>
                        {isLoading ? <p>Loading...</p> : (
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-3"><Icon name="Mail" size={16} className="text-muted-foreground"/><span>{customer?.email || 'No email'}</span></div>
                                <div className="flex items-center gap-3"><Icon name="Phone" size={16} className="text-muted-foreground"/><span>{customer?.phone || 'No phone'}</span></div>
                            </div>
                        )}
                    </div>
                    {/* Lifetime Value Card */}
                    <div className="bg-card border border-border rounded-lg p-6">
                        <h3 className="font-semibold text-lg mb-4">Lifetime Value</h3>
                         {isLoading ? <p>Loading...</p> : (
                            <div className="space-y-2">
                                <p className="text-3xl font-bold text-primary">₦{totalSpent.toLocaleString()}</p>
                                <p className="text-sm text-muted-foreground">from {sales.length} transactions</p>
                            </div>
                         )}
                    </div>
                </div>
                <div className="lg:col-span-2">
                    {/* Sales History Table */}
                    <div className="bg-card border border-border rounded-lg">
                        <h3 className="font-semibold text-lg p-6">Purchase History</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted">
                                    <tr>
                                        <th className="p-4 text-left text-xs font-medium text-muted-foreground uppercase">Date</th>
                                        <th className="p-4 text-left text-xs font-medium text-muted-foreground uppercase">Total</th>
                                        <th className="p-4 text-left text-xs font-medium text-muted-foreground uppercase">Items</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? Array.from({length: 3}).map((_, i) => <tr key={i}><td className="p-4" colSpan="3"><div className="h-4 bg-muted rounded animate-pulse"></div></td></tr>) 
                                    : sales.map(sale => (
                                        <tr key={sale.id} className="border-t border-border">
                                            <td className="p-4">{new Date(sale.date).toLocaleDateString()}</td>
                                            <td className="p-4 font-medium">₦{sale.total.toLocaleString()}</td>
                                            <td className="p-4 text-sm text-muted-foreground">{sale.items.length}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {!isLoading && sales.length === 0 && <p className="p-8 text-center text-muted-foreground">No purchase history found for this customer.</p>}
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerDetailsPage;