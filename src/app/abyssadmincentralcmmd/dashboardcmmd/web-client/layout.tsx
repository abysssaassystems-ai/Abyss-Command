import React from 'react';

export const metadata = {
  title: 'Abyss Master HQ :: Client Administration Matrix',
  description: 'Internal operations panel for infrastructure modifications.',
};

export default function AdminClientLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="w-full min-h-screen bg-[#4B5563] text-[#F9FAFB] font-sans antialiased p-6 md:p-10 relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-7xl mx-auto space-y-6">
        {children}
      </div>
    </div>
  );
}