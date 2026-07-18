import React from 'react';
import AppsAcctSidebar from '@/components/AppsAcctSidebar';
import AppsHeader from '@/components/AppsHeader';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans flex antialiased">
      {/* Structural Persistent Sidebar Left Navigation Node */}
      <AppsAcctSidebar />

      {/* Main Structural Runtime Frame Context */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Dynamic Global Operational Header */}
        <AppsHeader />

        {/* Dynamic Main Workspace Canvas Block */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}