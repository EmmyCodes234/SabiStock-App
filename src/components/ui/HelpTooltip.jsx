import React, { useState } from 'react';
import Icon from '../AppIcon';
import { cn } from '../../utils/cn';

const HelpTooltip = ({ content, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className={cn('relative inline-flex items-center', className)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <Icon
        name="HelpCircle"
        size={16}
        className="text-muted-foreground cursor-pointer"
      />
      {isVisible && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-foreground text-background text-sm rounded-lg shadow-lg z-10"
        >
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-foreground"></div>
        </div>
      )}
    </div>
  );
};

export default HelpTooltip;