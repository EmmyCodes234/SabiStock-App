import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import { authService, profileService } from '../../utils/apiService';
import { notificationHelpers } from '../../utils/notifications';

const NavigationSidebar = ({ isCollapsed, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userProfile = await profileService.getProfile();
        setProfile(userProfile);
      } catch (error) {
        console.error("Failed to fetch profile for sidebar:", error);
      }
    };

    fetchProfile();
  }, []);


  const navigationSections = [
    {
      title: 'Dashboard',
      items: [
        { name: 'Overview', path: '/dashboard-overview', icon: 'BarChart3' },
        { name: 'Reports', path: '/reports', icon: 'PieChart' }
      ]
    },
    {
      title: 'Products',
      items: [
        { name: 'Product Management', path: '/product-management', icon: 'Package' },
        { name: 'Add Product', path: '/add-edit-product', icon: 'Plus' }
      ]
    },
    {
      title: 'Sales',
      items: [
        { name: 'Point of Sale', path: '/point-of-sale-pos', icon: 'ShoppingCart' },
        { name: 'Sales History', path: '/sales-history', icon: 'History' },
        { name: 'Customers', path: '/customers', icon: 'Users' }
      ]
    }
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      navigate('/login');
      notificationHelpers.success("You have been signed out.");
    } catch (error) {
      notificationHelpers.error(`Sign out failed: ${error.message}`);
    }
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
        fixed top-0 left-0 h-full bg-card border-r border-border z-100 flex flex-col
        transition-all duration-300 ease-in-out
        -translate-x-full lg:translate-x-0
        ${isCollapsed ? 'lg:w-16' : 'translate-x-0 w-240 lg:w-240'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border h-[69px]">
          <div className={`flex items-center space-x-3 ${isCollapsed ? 'lg:justify-center' : ''}`}>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="Package" size={20} color="white" />
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <h1 className="font-heading font-semibold text-lg text-foreground truncate">
                  SabiStock
                </h1>
                <p className="text-xs text-muted-foreground truncate">
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
                          transition-colors duration-200 flex-shrink-0
                          ${isActiveRoute(item.path) ? 'text-primary-foreground' : 'group-hover:text-foreground'}
                        `}
                      />
                      {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                          <p className="font-body font-medium text-sm truncate">
                            {item.name}
                          </p>
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
           <div className={`flex items-center space-x-3 mb-4 ${isCollapsed ? 'lg:justify-center' : ''}`}>
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
              <Icon name="User" size={16} color="var(--color-muted-foreground)" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-body font-medium text-sm text-foreground truncate">
                  {profile?.business_name || 'Business Owner'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  Active Session
                </p>
              </div>
            )}
          </div>
          
          {/* Settings Link */}
          <Link to="/settings" className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg w-full transition-all duration-200 ease-out group text-foreground hover:bg-muted ${isCollapsed ? 'lg:justify-center lg:px-2' : ''}`} title={isCollapsed ? 'Settings' : ''}>
              <Icon name="Settings" size={20} color="var(--color-muted-foreground)" className="transition-colors duration-200 group-hover:text-foreground flex-shrink-0"/>
              {!isCollapsed && <p className="font-body font-medium text-sm text-left">Settings</p>}
          </Link>
          
          <button
            onClick={handleSignOut}
            className={`
              flex items-center space-x-3 px-3 py-2.5 rounded-lg w-full
              transition-all duration-200 ease-out group
              text-foreground hover:bg-error/10 hover:text-error
              ${isCollapsed ? 'lg:justify-center lg:px-2' : ''}
            `}
            title={isCollapsed ? 'Sign Out' : ''}
          >
            <Icon
              name="LogOut"
              size={20}
              color="var(--color-muted-foreground)"
              className="transition-colors duration-200 group-hover:text-error flex-shrink-0"
            />
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-body font-medium text-sm text-left">
                  Sign Out
                </p>
              </div>
            )}
          </button>
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