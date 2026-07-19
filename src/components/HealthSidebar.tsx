"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { 
  LayoutDashboard, 
  Apple, 
  Database, 
  Target, 
  Dumbbell, 
  TrendingUp, 
  Pill,
  ShieldCheck
} from "lucide-react";
import { TabID } from "@/app/dashboard/my-apps/health/types";

interface HealthSidebarProps {
  activeTab: TabID;
  setActiveTab: (tab: TabID) => void;
}

interface SidebarNavItem {
  id: TabID;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAVIGATION_ITEMS: SidebarNavItem[] = [
  { id: "overview", label: "Hub Overview", icon: LayoutDashboard },
  { id: "nutrition", label: "Nutrition & Logs", icon: Apple },
  { id: "meals", label: "Meals Database", icon: Database },
  { id: "goals", label: "Biometric Goals", icon: Target },
  { id: "workouts", label: "Workout Core", icon: Dumbbell },
  { id: "trends", label: "Analytics & Trends", icon: TrendingUp },
  { id: "supplements", label: "Supplements Stack", icon: Pill },
];

export default function HealthSidebar({ activeTab, setActiveTab }: HealthSidebarProps): React.JSX.Element {
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
        console.error("SIDEBAR_AUTH_EXCEPTION:", err);
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
    <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col justify-between shrink-0 min-h-screen select-none">
      <div className="p-6">
        
        {/* Core Subsystem Branding Panel */}
        <div className="mb-8 text-left">
          <span className="text-[9px] font-mono font-black tracking-widest text-purple-600 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded uppercase">
            Subsystem Core
          </span>
          <h2 className="text-xl font-black tracking-tight text-gray-900 mt-2.5">
            BIO-<span className="text-purple-600 font-mono">ENGINE</span>
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
                    ? "bg-purple-50 text-purple-700 border-purple-100/70 shadow-2xs"
                    : "text-gray-400 hover:text-gray-900 hover:bg-gray-50 border-transparent"
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
      <div className="p-4 border-t border-gray-100 space-y-3 bg-gray-50/50">
        
        {/* Isolated Session Environment Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-2.5 flex items-center gap-2 shadow-2xs text-left">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
          <div className="min-w-0 flex-1">
            <p className="text-[8px] font-mono font-black text-gray-400 uppercase tracking-wider leading-none">
              Isolated Workspace
            </p>
            <p className="text-[10px] font-sans font-semibold text-gray-700 truncate mt-0.5" title={tenantEmail}>
              {tenantEmail}
            </p>
          </div>
        </div>

        {/* Global Network Escape Hatch */}
        <a 
          href="/dashboard" 
          className="w-full h-10 flex items-center justify-center text-[10px] font-mono font-black uppercase tracking-widest border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 text-gray-500 hover:text-gray-900 rounded-xl transition-all shadow-2xs"
        >
          ← Return to Network
        </a>
      </div>
    </aside>
  );
}