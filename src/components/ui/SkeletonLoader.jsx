import React from 'react';
import { cn } from '../../utils/cn';

const SkeletonLoader = ({ 
  className = '', 
  variant = 'default',
  width = '100%',
  height = '1rem',
  rounded = 'rounded',
  animate = true,
  children,
  ...props 
}) => {
  const variants = {
    default: 'bg-muted',
    card: 'bg-card border border-border rounded-lg p-4',
    text: 'bg-muted rounded',
    circle: 'bg-muted rounded-full',
    avatar: 'bg-muted rounded-full w-10 h-10',
    button: 'bg-muted rounded-md h-10',
    input: 'bg-muted rounded-md h-10'
  };

  const baseClasses = cn(
    variants[variant] || variants.default,
    animate && 'animate-pulse',
    rounded,
    className
  );

  if (children) {
    return (
      <div className={baseClasses} {...props}>
        {children}
      </div>
    );
  }

  return (
    <div 
      className={baseClasses}
      style={{ width, height }}
      {...props}
    />
  );
};

// Predefined skeleton components
export const SkeletonCard = ({ className = '' }) => (
  <SkeletonLoader variant="card" className={cn('space-y-3', className)}>
    <SkeletonLoader height="1.5rem" width="60%" />
    <SkeletonLoader height="1rem" width="100%" />
    <SkeletonLoader height="1rem" width="80%" />
    <div className="flex justify-between items-center mt-4">
      <SkeletonLoader height="2rem" width="5rem" />
      <SkeletonLoader height="2rem" width="5rem" />
    </div>
  </SkeletonLoader>
);

export const SkeletonTable = ({ rows = 5, columns = 4, className = '' }) => (
  <div className={cn('space-y-4', className)}>
    {/* Header */}
    <div className="flex space-x-4">
      {Array.from({ length: columns }).map((_, index) => (
        <SkeletonLoader key={index} height="1.5rem" width="100%" />
      ))}
    </div>
    
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex space-x-4">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <SkeletonLoader key={colIndex} height="1rem" width="100%" />
        ))}
      </div>
    ))}
  </div>
);

export const SkeletonMetricCards = ({ count = 4, className = '' }) => (
  <div className={cn('grid grid-cols-2 lg:grid-cols-4 gap-4', className)}>
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonLoader key={index} variant="card" className="h-20">
        <div className="flex items-center space-x-3">
          <SkeletonLoader variant="circle" width="2.5rem" height="2.5rem" />
          <div className="space-y-2 flex-1">
            <SkeletonLoader height="0.75rem" width="60%" />
            <SkeletonLoader height="1.25rem" width="40%" />
          </div>
        </div>
      </SkeletonLoader>
    ))}
  </div>
);

export const SkeletonProductGrid = ({ count = 8, className = '' }) => (
  <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6', className)}>
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonLoader key={index} variant="card" className="h-64">
        <SkeletonLoader height="8rem" width="100%" className="mb-4" />
        <SkeletonLoader height="1.25rem" width="80%" className="mb-2" />
        <SkeletonLoader height="1rem" width="60%" className="mb-4" />
        <div className="flex justify-between items-center">
          <SkeletonLoader height="1.25rem" width="30%" />
          <SkeletonLoader height="2rem" width="4rem" />
        </div>
      </SkeletonLoader>
    ))}
  </div>
);

export const SkeletonForm = ({ fields = 6, className = '' }) => (
  <div className={cn('space-y-6', className)}>
    {Array.from({ length: fields }).map((_, index) => (
      <div key={index} className="space-y-2">
        <SkeletonLoader height="1rem" width="25%" />
        <SkeletonLoader variant="input" />
      </div>
    ))}
    
    <div className="flex space-x-4 pt-4">
      <SkeletonLoader variant="button" width="6rem" />
      <SkeletonLoader variant="button" width="8rem" />
    </div>
  </div>
);

export default SkeletonLoader;