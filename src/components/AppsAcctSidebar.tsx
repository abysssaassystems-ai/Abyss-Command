"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  AppWindow, 
  LifeBuoy, 
  CreditCard, 
  Cpu, 
  ShoppingBag, 
  Blocks,
  ShieldCheck,
  Fingerprint
} from "lucide-react";

export default function AppsAcctSidebar(): React.JSX.Element {
  const pathname = usePathname();
  const [accountName, setAccountName] = useState<string>("Client Engine");
  const [tenantEmail, setTenantEmail] = useState<string>("authenticating...");

  // Ingest the local software user session to parse out the identity signatures safely
  useEffect(() => {
    const session = localStorage.getItem("active_software_user");
    if (!session) {
      setTenantEmail("unauthenticated_session");
      return;
    }
    try {
      const parsedSession = JSON.parse(session);
      if (parsedSession?.account_name) {
        setAccountName(parsedSession.account_name);
      }
      if (parsedSession?.email) {
        setTenantEmail(parsedSession.email);
      } else {
        setTenantEmail("isolated_anonymous");
      }
    } catch (err) {
      console.error("SESSION_PARSE_ERROR:", err);
      setTenantEmail("fault_containment_mode");
    }
  }, []);

  const menuRoutes = [
    { name: "My Apps & Software", href: "/dashboard/my-apps", icon: AppWindow },
    { name: "Service Desk", href: "/dashboard/service-desk", icon: LifeBuoy },
    { name: "Billing Lifecycle", href: "/dashboard/billing", icon: CreditCard },
    { name: "Custom App Progress", href: "/dashboard/custom-made-app", icon: Cpu },
    { name: "App Catalogue", href: "/dashboard/app-catalogue", icon: ShoppingBag },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r border-zinc-200 flex flex-col justify-between p-5 select-none sticky top-0 z-50 text-left">
      <div className="space-y-6">
        
        {/* Workspace Branding Header Identifier */}
        <div className="border-b border-zinc-100 pb-5">
          <Link href="/dashboard" className="flex items-center gap-3 group focus:outline-none">
            <div className="p-2 bg-zinc-950 rounded-xl text-white transition-colors group-hover:bg-zinc-800">
              <Blocks className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-black tracking-wider text-zinc-900 uppercase block transition-colors group-hover:text-zinc-600">
                Abyss Software
              </span>
              <span className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-widest block mt-0.5">
                Operational Hub
              </span>
            </div>
          </Link>
        </div>

        {/* Dynamic Tenant Context Partition Pin */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 flex items-center gap-2.5">
          <Fingerprint className="w-4 h-4 text-zinc-500 shrink-0 stroke-[2.5]" />
          <div className="min-w-0">
            <p className="text-[8px] font-mono font-black text-zinc-400 uppercase tracking-wider leading-none">
              Active Context
            </p>
            <p className="text-[11px] font-sans font-bold text-zinc-700 truncate mt-1 leading-tight">
              {accountName}
            </p>
          </div>
        </div>

        {/* Directory Matrix Navigation List */}
        <nav className="flex flex-col space-y-1">
          <span className="text-[10px] font-mono font-black uppercase text-zinc-400 tracking-widest mb-2 px-1 block">
            Navigation Panel
          </span>
          
          {menuRoutes.map((route) => {
            const isActive = pathname === route.href || pathname.startsWith(route.href + '/');
            const IconComponent = route.icon;
            
            return (
              <Link
                key={route.href}
                href={route.href}
                className={`h-11 px-4 rounded-xl text-xs font-mono font-black uppercase tracking-wider transition-all flex items-center gap-3 border select-none touch-manipulation cursor-pointer ${
                  isActive
                    ? "bg-zinc-950 border-zinc-950 text-white shadow-xs"
                    : "border-transparent text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                }`}
              >
                <IconComponent className={`w-4 h-4 shrink-0 stroke-[2.5] ${isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-600"}`} />
                <span className="font-sans font-semibold text-[11px] normal-case tracking-normal">
                  {route.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Infrastructure Validation Block */}
      <div className="border-t border-zinc-100 pt-4 space-y-3">
        <div className="flex items-center gap-2 px-1 text-zinc-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
          <span className="text-[10px] font-sans font-medium truncate" title={tenantEmail}>
            {tenantEmail}
          </span>
        </div>
        
        <div className="text-[9px] font-mono text-zinc-400 flex justify-between items-center px-1">
          <span>FRAMEWORK v4.26</span>
          <span className="tracking-widest font-bold">SECURE</span>
        </div>
      </div>

    </aside>
  );
}