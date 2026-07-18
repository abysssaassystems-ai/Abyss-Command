"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminSidebar(): React.JSX.Element {
  const pathname = usePathname();
  const router = useRouter();

  // Ingested unique, tactical terminal icons to keep design system parity
  const adminRoutes = [
    { name: "Forum Backend", href: "/abyssadmincentralcmmd/dashboardcmmd/backend-forum", icon: "💬" },
    { name: "Blog Builder", href: "/abyssadmincentralcmmd/dashboardcmmd/blog-builder", icon: "✍️" },
    { name: "Custom Inquiries", href: "/abyssadmincentralcmmd/dashboardcmmd/custom-web-inquiries", icon: "📊" },
    { name: "Service Desk", href: "/abyssadmincentralcmmd/dashboardcmmd/service-desk", icon: "🛠️" },
    { name: "Web Inquiries", href: "/abyssadmincentralcmmd/dashboardcmmd/standard-website-inquiries", icon: "📁" },
    { name: "Web Clients", href: "/abyssadmincentralcmmd/dashboardcmmd/web-client", icon: "👥" },
  ];

  return (
    <aside className="w-64 h-screen bg-[#374151] border-r border-gray-500/30 flex flex-col justify-between sticky top-0 p-6 shadow-xl z-50 select-none">
      
      {/* Top Section: Brand Header & Route Directory */}
      <div className="space-y-8">
        
        {/* Brand System Info */}
        <Link href="/abyssadmincentralcmmd/dashboardcmmd" className="flex flex-col text-left border-b border-gray-500/20 pb-4 group">
          <span className="text-sm font-black tracking-widest text-white uppercase italic group-hover:text-[#00F2FE] transition-colors">
            ABYSS // CORE
          </span>
          <span className="text-[10px] font-mono font-bold text-[#00F2FE] tracking-wider uppercase mt-0.5">
            Admin Terminal
          </span>
        </Link>

        {/* Vertical Link Navigation List */}
        <div className="flex flex-col space-y-2">
          <span className="text-[9px] font-mono font-bold uppercase text-gray-400 tracking-wider mb-2">
            // ENVIRONMENT NODES
          </span>
          
          {adminRoutes.map((route) => {
            // Uses a robust match check to keep parent routes lit during active sub-view sweeps
            const isActive = pathname === route.href || pathname.startsWith(route.href + '/');
            
            return (
              <Link
                key={route.href}
                href={route.href}
                className={`text-xs font-bold uppercase tracking-wider px-4 py-3 rounded-xl transition-all flex items-center gap-3 border ${
                  isActive
                    ? "bg-[#4B5563] border-[#00F2FE]/50 text-[#00F2FE] text-glow shadow-[0_2px_12px_rgba(0,242,254,0.1)]"
                    : "border-transparent text-gray-300 hover:text-white hover:bg-[#4B5563]/50"
                }`}
              >
                <span className="text-sm opacity-90">{route.icon}</span>
                <span className="font-sans tracking-wide font-semibold normal-case text-[12px]">
                  {route.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom Section: Session Action */}
      <div className="border-t border-gray-500/20 pt-4">
        <button
          type="button"
          onClick={() => router.push('/abyssadmincentralcmmd/login')}
          className="w-full text-[10px] uppercase font-bold tracking-widest border border-rose-500/40 text-rose-400 hover:bg-rose-500 hover:text-white py-3 rounded-xl transition-all focus:outline-none"
        >
          ✖ Exit Shell
        </button>
      </div>

    </aside>
  );
}