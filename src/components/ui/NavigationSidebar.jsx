import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const NavigationSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const navigationSections = [
    {
      title: 'Dashboard',
      items: [
        {
          name: 'Overview',
          path: '/dashboard-overview',
          icon: 'BarChart3',
          description: 'Business performance metrics'
        }
      ]
    },
    {
      title: 'Products',
      items: [
        {
          name: 'Product Management',
          path: '/product-management',
          icon: 'Package',
          description: 'View and manage inventory'
        },
        {
          name: 'Add Product',
          path: '/add-edit-product',
          icon: 'Plus',
          description: 'Add new products to inventory'
        }
      ]
    },
    {
      title: 'Sales',
      items: [
        {
          name: 'Point of Sale',
          path: '/point-of-sale-pos',
          icon: 'ShoppingCart',
          description: 'Process customer transactions'
        },
        {
          name: 'Sales History',
          path: '/sales-history',
          icon: 'History',
          description: 'View transaction records'
        }
      ]
    }
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-200 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full bg-card border-r border-border z-100
        transition-transform duration-300 ease-in-out
        ${isCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-16' : 'translate-x-0 w-240 lg:w-240'}
        lg:translate-x-0
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className={`flex items-center space-x-3 ${isCollapsed ? 'lg:justify-center' : ''}`}>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Package" size={20} color="white" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="font-heading font-semibold text-lg text-foreground">
                  SabiStock
                </h1>
                <p className="text-xs text-muted-foreground">
                  Inventory Management
                </p>
              </div>
            )}
          </div>
          
          {/* Toggle Button - Desktop Only */}
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted transition-colors duration-200"
          >
            <Icon 
              name={isCollapsed ? "ChevronRight" : "ChevronLeft"} 
              size={16} 
              color="var(--color-muted-foreground)" 
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            {navigationSections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                {!isCollapsed && (
                  <h3 className="font-heading font-medium text-sm text-muted-foreground uppercase tracking-wide mb-3">
                    {section.title}
                  </h3>
                )}
                
                <div className="space-y-1">
                  {section.items.map((item, itemIndex) => (
                    <Link
                      key={itemIndex}
                      to={item.path}
                      className={`
                        flex items-center space-x-3 px-3 py-2.5 rounded-lg
                        transition-all duration-200 ease-out group
                        ${isActiveRoute(item.path)
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-foreground hover:bg-muted hover:text-foreground'
                        }
                        ${isCollapsed ? 'lg:justify-center lg:px-2' : ''}
                      `}
                      title={isCollapsed ? item.name : ''}
                    >
                      <Icon 
                        name={item.icon} 
                        size={20} 
                        color={isActiveRoute(item.path) ? 'currentColor' : 'var(--color-muted-foreground)'}
                        className={`
                          transition-colors duration-200
                          ${isActiveRoute(item.path) ? 'text-primary-foreground' : 'group-hover:text-foreground'}
                        `}
                      />
                      {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                          <p className="font-body font-medium text-sm truncate">
                            {item.name}
                          </p>
                          {item.description && (
                            <p className="text-xs opacity-75 truncate">
                              {item.description}
                            </p>
                          )}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className={`flex items-center space-x-3 ${isCollapsed ? 'lg:justify-center' : ''}`}>
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <Icon name="User" size={16} color="var(--color-muted-foreground)" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-body font-medium text-sm text-foreground truncate">
                  Business Owner
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  Active Session
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-300 lg:hidden bg-card border border-border rounded-lg p-2 shadow-card"
      >
        <Icon name="Menu" size={20} color="var(--color-foreground)" />
      </button>
    </>
  );
};

export default NavigationSidebar;