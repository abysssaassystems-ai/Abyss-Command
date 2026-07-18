import React from 'react';
import AdminSidebar from '@/components/AdminSidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-[#4B5563] text-[#F9FAFB] font-sans antialiased overflow-hidden">
      
      {/* Side Navigation Control Frame */}
      <AdminSidebar />
      
      {/* Primary Ingestion Viewport */}
      <main className="flex-1 h-screen overflow-y-auto p-8 md:p-12 relative z-10">
        {children}
      </main>

    </div>
  );
}