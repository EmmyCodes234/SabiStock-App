import React, { useState } from 'react';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import ProfileForm from './components/ProfileForm';

const SettingsPage = () => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <NavigationSidebar isCollapsed={isSidebarCollapsed} toggleSidebar={() => setSidebarCollapsed(!isSidebarCollapsed)} />
      <main className={`min-h-screen transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-240'}`}>
        <div className="p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <BreadcrumbTrail />
            <div className="mb-8">
              <h1 className="font-heading font-bold text-3xl text-foreground mb-2">Settings</h1>
              <p className="text-muted-foreground">Manage your business profile and application preferences.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <ProfileForm />
                </div>
                <div className="lg:col-span-1">
                    {/* Future settings components can go here, like password change or notification preferences */}
                </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;