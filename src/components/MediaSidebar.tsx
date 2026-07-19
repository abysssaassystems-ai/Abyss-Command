"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { 
  Film, 
  Tv, 
  Gamepad2, 
  BookOpen, 
  LayoutGrid, 
  UploadCloud, 
  Search,
  ShieldCheck
} from "lucide-react";

export type MediaTab = 'overview' | 'movies' | 'tv' | 'gaming' | 'books' | 'import' | 'explore';

interface MediaSidebarProps {
  activeTab: MediaTab;
  setActiveTab: (tab: MediaTab) => void;
}

interface SidebarNavItem {
  id: MediaTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAVIGATION_ITEMS: SidebarNavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'movies', label: 'Movies', icon: Film },
  { id: 'tv', label: 'TV Shows', icon: Tv },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
  { id: 'books', label: 'Books', icon: BookOpen },
  { id: 'explore', label: 'Explore', icon: Search },
];

export default function MediaSidebar({ activeTab, setActiveTab }: MediaSidebarProps): React.JSX.Element {
  // --- MULTI-TENANT ARCHITECTURE SECURE HANDSHAKE ---
  const [tenantEmail, setTenantEmail] = useState<string>("authenticating...");

  useEffect(() => {
    // Process context mutations safely against state revisions
    function handleUserIdentity(user: any) {
      if (user?.email) {
        setTenantEmail(user.email);
      } else if (user) {
        setTenantEmail("anonymous_isolated");
      } else {
        setTenantEmail("unauthenticated_session");
      }
    }

    // 1. Initial secure token signature validation
    async function loadInitialIdentity() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (!error && user) {
          handleUserIdentity(user);
        } else {
          handleUserIdentity(null);
        }
      } catch (err) {
        console.error("MEDIA_SIDEBAR_AUTH_EXCEPTION:", err);
        setTenantEmail("fault_containment_mode");
      }
    }
    loadInitialIdentity();

    // 2. Real-time auth state channel connection
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleUserIdentity(session?.user || null);
    });

    // Tear down channels cleanly on component unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <aside className="w-64 bg-white border-r border-zinc-200 hidden md:flex flex-col justify-between shrink-0 min-h-screen select-none">
      <div className="p-6">
        
        {/* Core Subsystem Branding Panel */}
        <div className="mb-8 text-left">
          <span className="text-[9px] font-mono font-black tracking-widest text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded uppercase">
            Media Catalog
          </span>
          <h2 className="text-xl font-black tracking-tight text-zinc-900 mt-2.5">
            MEDIA-<span className="text-amber-500 font-mono">ENGINE</span>
          </h2>
        </div>

        {/* Dynamic Nav Link Generation Vector */}
        <nav className="space-y-1">
          {NAVIGATION_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            const IconComponent = item.icon;
            
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full h-11 flex items-center gap-3 px-4 rounded-xl text-xs font-mono font-black uppercase tracking-wider transition-all cursor-pointer border text-left ${
                  isActive
                    ? "bg-amber-50 text-amber-800 border-amber-100/70 shadow-2xs"
                    : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 border-transparent"
                }`}
              >
                <IconComponent className={`w-4 h-4 shrink-0 transition-transform ${isActive ? "scale-110 stroke-[2.5]" : "opacity-70 stroke-[2]"}`} />
                <span className="tracking-wide">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Security Checkpoint and Account Isolation Footer */}
      <div className="p-4 border-t border-zinc-100 space-y-3 bg-zinc-50/50">
        
        {/* Isolated Session Environment Card */}
        <div className="bg-white border border-zinc-200 rounded-xl p-2.5 flex items-center gap-2 shadow-2xs text-left">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
          <div className="min-w-0 flex-1">
            <p className="text-[8px] font-mono font-black text-zinc-400 uppercase tracking-wider leading-none">
              Isolated Workspace
            </p>
            <p className="text-[10px] font-sans font-semibold text-zinc-700 truncate mt-0.5" title={tenantEmail}>
              {tenantEmail}
            </p>
          </div>
        </div>

        {/* Premium Migration Action / TV Time Migration */}
        <button
          type="button"
          onClick={() => setActiveTab('import')}
          className={`w-full h-11 flex items-center justify-center gap-2 px-3 rounded-xl text-[10px] font-mono font-black uppercase tracking-widest border transition-all cursor-pointer shadow-2xs ${
            activeTab === 'import'
              ? 'bg-zinc-900 text-white border-zinc-900'
              : 'bg-white border-amber-200 text-amber-700 hover:bg-amber-50/60 hover:border-amber-300'
          }`}
        >
          <UploadCloud className="w-4 h-4 shrink-0 stroke-[2.5]" />
          <span>Migration Terminal</span>
        </button>
      </div>
    </aside>
  );
}