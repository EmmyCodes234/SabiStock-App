import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';

const DashboardSettingsModal = ({ isOpen, onClose, settings, onSettingsChange }) => {
  if (!isOpen) return null;

  const handleCheckboxChange = (widgetId, isChecked) => {
    onSettingsChange({
      ...settings,
      [widgetId]: { ...settings[widgetId], isVisible: isChecked },
    });
  };
  
  // Convert settings object to array for easier mapping
  const widgets = Object.entries(settings);

  return (
    <div className="fixed inset-0 z-300 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-modal max-w-md w-full mx-auto">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
            <div className="flex items-center space-x-3">
                 <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="LayoutGrid" size={20} color="var(--color-primary)" />
                </div>
                <div>
                    <h2 className="font-heading font-semibold text-lg text-foreground">Customize Dashboard</h2>
                    <p className="text-sm text-muted-foreground">Show or hide widgets</p>
                </div>
            </div>
             <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
                <Icon name="X" size={16} />
            </Button>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-4 max-h-80 overflow-y-auto">
            <p className="text-sm text-muted-foreground">Select the widgets you want to display on your dashboard.</p>
            {widgets.map(([widgetId, widget]) => (
                 <div key={widgetId} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <label htmlFor={widgetId} className="font-medium text-foreground">{widget.label}</label>
                    <Checkbox
                        id={widgetId}
                        checked={widget.isVisible}
                        onCheckedChange={(isChecked) => handleCheckboxChange(widgetId, isChecked)}
                    />
                </div>
            ))}
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-border flex justify-end">
            <Button onClick={onClose}>Done</Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardSettingsModal;