import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Icon from '../../../components/AppIcon';

const DashboardWidget = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 'auto',
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="relative">
        {/* Drag Handle */}
        <div
          {...listeners}
          className="absolute top-3 right-3 z-10 p-2 cursor-grab bg-card/50 backdrop-blur-sm rounded-full text-muted-foreground hover:bg-muted transition-colors"
          aria-label="Drag to reorder"
        >
          <Icon name="GripVertical" size={16} />
        </div>
        {children}
      </div>
    </div>
  );
};

export default DashboardWidget;