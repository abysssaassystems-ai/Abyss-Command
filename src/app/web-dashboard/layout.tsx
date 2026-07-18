import React from 'react';
import WebDevelopmentSidebar from '../../components/WebDevelopmentSidebar';

export const metadata = {
  title: 'Abyss Dev Dashboard Engine',
  description: 'Customized web infrastructure management array.',
};

export default function WebDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="flex bg-[#4B5563] min-h-screen text-[#F9FAFB] font-sans antialiased overflow-hidden">
      
      {/* Universal Shared Sidebar Interface Layer */}
      <WebDevelopmentSidebar />

      {/* Primary Dynamic Viewport Window Frame */}
      <main className="flex-1 overflow-y-auto h-screen p-8 md:p-12 relative max-w-7xl mx-auto">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00F2FE]/5 rounded-full blur-3xl pointer-events-none" />
        {children}
      </main>

    </div>
  );
}