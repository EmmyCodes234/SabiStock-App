import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const BreadcrumbTrail = () => {
  const location = useLocation();
  
  const routeMap = {
    '/dashboard-overview': { name: 'Dashboard', parent: null },
    '/product-management': { name: 'Product Management', parent: null },
    '/add-edit-product': { name: 'Add Product', parent: '/product-management' },
    '/point-of-sale-pos': { name: 'Point of Sale', parent: null },
    '/sales-history': { name: 'Sales History', parent: null },
    '/user-onboarding-flow': { name: 'Getting Started', parent: null }
  };

  const currentRoute = routeMap[location.pathname];
  
  if (!currentRoute) return null;

  const breadcrumbs = [];
  let current = currentRoute;
  let currentPath = location.pathname;

  // Build breadcrumb trail
  while (current) {
    breadcrumbs.unshift({ name: current.name, path: currentPath });
    if (current.parent) {
      currentPath = current.parent;
      current = routeMap[current.parent];
    } else {
      break;
    }
  }

  // Always add Home as the first breadcrumb if not already there
  if (breadcrumbs.length > 0 && breadcrumbs[0].path !== '/dashboard-overview') {
    breadcrumbs.unshift({ name: 'Dashboard', path: '/dashboard-overview' });
  }

  return (
    <nav className="flex items-center space-x-2 text-sm font-body mb-6" aria-label="Breadcrumb">
      <Icon name="Home" size={16} color="var(--color-muted-foreground)" />
      
      {breadcrumbs.map((breadcrumb, index) => (
        <React.Fragment key={breadcrumb.path}>
          {index > 0 && (
            <Icon 
              name="ChevronRight" 
              size={14} 
              color="var(--color-muted-foreground)" 
              className="opacity-60"
            />
          )}
          
          {index === breadcrumbs.length - 1 ? (
            <span className="text-foreground font-medium truncate">
              {breadcrumb.name}
            </span>
          ) : (
            <Link
              to={breadcrumb.path}
              className="text-muted-foreground hover:text-foreground transition-colors duration-200 truncate"
            >
              {breadcrumb.name}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default BreadcrumbTrail;