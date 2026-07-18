"use client";
import React, { use } from 'react';
import { useSearchParams } from 'next/navigation';

// Ingesting all of your modular viewbar layout tabs
import ProjectProgressTab from '../../viewbars/website-client/ProjectProgressTab';
import WebMyRequestsTab from '../../viewbars/website-client/WebMyRequestsTab';
import WebsiteIntegrationsTab from '../../viewbars/website-client/WebsiteIntegrationsTab';
import WebHardwareTab from '../../viewbars/website-client/WebHardwareTab';
import MyAccountTab from '../../viewbars/website-client/MyAccountTab';
import BillingTab from '../../viewbars/website-client/BillingTab';
import BrandingTab from '../../viewbars/website-client/BrandingTab';

export default function WebDashboardOverview(): React.JSX.Element {
  const searchParams = useSearchParams();
  
  // Read the '?tab=' variable from the URL path, fallback to 'progress' if empty
  const activeTab = searchParams.get('tab') || 'progress';

  // Structural dictionary mapping string keys straight to your component viewbars
  const renderTabContent = () => {
    switch (activeTab) {
      case 'progress':
        return <ProjectProgressTab />;
      case 'requests':
        return <WebMyRequestsTab />;
      case 'integrations':
        return <WebsiteIntegrationsTab />;
      case 'hardware':
        return <WebHardwareTab />;
      case 'account':
        return <MyAccountTab />;
      case 'billing':
        return <BillingTab />;
      case 'branding':
        return <BrandingTab />;
      default:
        return <ProjectProgressTab />;
    }
  };

  return (
    <div className="w-full h-full transition-all duration-300">
      {renderTabContent()}
    </div>
  );
}