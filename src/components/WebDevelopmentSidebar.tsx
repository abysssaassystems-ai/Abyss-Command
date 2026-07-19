"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from "@/lib/supabaseClient";

interface UserSession {
  account_name: string;
  email: string;
  access_level: string;
}

export default function WebDevelopmentSidebar(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Read the active tab directly from URL parameter layout matrix
  const activeTab = searchParams.get('tab') || 'progress';

  useEffect(() => {
    const fetchUserProfileContext = async () => {
      try {
        // 1. EXTRACT AUTHENTICATED USER: Read current token properties from the crypto-layer
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

        if (authError || !authUser) {
          router.replace("/web-login");
          return;
        }

        // 2. QUERY PROFILE METADATA: Match database profile fields secured via RLS
        const { data: profile, error: profileError } = await supabase
          .from("web_login_users")
          .select("account_name, email, access_level")
          .eq("id", authUser.id)
          .maybeSingle();

        if (profileError || !profile) {
          setUser({
            account_name: "Unknown Node",
            email: authUser.email || "No email provided",
            access_level: "restricted"
          });
          return;
        }

        setUser(profile);
      } catch (err) {
        console.error("SIDEBAR_IDENTITY_RESOLUTION_FAULT:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfileContext();
  }, [router]);

  const handleTerminalLogout = async () => {
    try {
      // 3. ATOMIC SIGN-OUT: Invalidate active tokens safely on both client and server engines
      await supabase.auth.signOut();
      router.push("/web-login");
    } catch (err) {
      // Force programmatic fallback reroute if connection loops fail
      router.push("/web-login");
    }
  };

  return (
    <aside className="w-80 bg-[#374151] border-r border-gray-500/30 flex flex-col justify-between h-screen p-6 sticky top-0 flex-shrink-0 font-mono text-xs select-none">
      <div className="space-y-8">
        
        {/* Module Brand Layout Accent */}
        <div className="border-b border-gray-500/20 pb-4">
          <span className="text-[10px] text-[#00F2FE] tracking-widest block font-bold uppercase">// SYS_WORKSPACE_NODE</span>
          <h2 className="text-xl font-black text-white tracking-wider mt-1 uppercase italic">ABYSS CORE</h2>
        </div>

        {/* Dynamic User Identity Profile Widget */}
        <div className="bg-[#4B5563]/40 border border-gray-500/20 p-4 rounded-2xl space-y-2">
          <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">// IDENTITY SPEC</span>
          {loading ? (
            <div className="space-y-2 animate-pulse py-1">
              <div className="h-4 bg-gray-500/40 rounded w-3/4" />
              <div className="h-3 bg-gray-500/20 rounded w-1/2" />
            </div>
          ) : (
            <>
              <div>
                <div className="text-white font-black uppercase text-sm tracking-wide truncate">
                  {user?.account_name}
                </div>
                <div className="text-gray-400 font-sans text-[11px] mt-0.5 truncate">{user?.email}</div>
              </div>
              <div className="pt-2">
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border tracking-wider ${
                  user?.access_level === 'administrator' 
                    ? 'bg-cyan-500/10 text-[#00F2FE] border-[#00F2FE]/20 shadow-[0_0_8px_rgba(0,242,254,0.1)]' 
                    : 'bg-zinc-500/10 text-zinc-300 border-zinc-500/20'
                }`}>
                  ★ LEVEL :: {user?.access_level}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Segment Routing Navigation Tree Layout */}
        <nav className="space-y-1.5 pt-2">
          <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider mb-2">// DIRECTORIES</span>
          <SidebarNavButton href="/web-dashboard?tab=progress" label="Project Progress" icon="🚀" isActive={activeTab === 'progress'} />
          <SidebarNavButton href="/web-dashboard?tab=requests" label="My Requests" icon="📂" isActive={activeTab === 'requests'} />
          <SidebarNavButton href="/web-dashboard?tab=integrations" label="Website Integrations" icon="🔌" isActive={activeTab === 'integrations'} />
          <SidebarNavButton href="/web-dashboard?tab=hardware" label="Web Hardware" icon="📟" isActive={activeTab === 'hardware'} />
          <SidebarNavButton href="/web-dashboard?tab=account" label="My Account" icon="🛡️" isActive={activeTab === 'account'} />
          <SidebarNavButton href="/web-dashboard?tab=billing" label="Billing" icon="💳" isActive={activeTab === 'billing'} />
          <SidebarNavButton href="/web-dashboard?tab=branding" label="Branding" icon="🎨" isActive={activeTab === 'branding'} />
        </nav>
      </div>

      {/* Disconnection Control Area */}
      <div className="border-t border-gray-500/20 pt-4">
        <button
          type="button"
          onClick={handleTerminalLogout}
          className="w-full py-3 border border-rose-500/30 bg-transparent text-rose-400 hover:bg-rose-500 hover:text-white transition-all font-bold uppercase tracking-widest rounded-xl text-center focus:outline-none text-[10px]"
        >
          ✖ TERMINATE TERMINAL ACCESS
        </button>
      </div>
    </aside>
  );
}

interface NavButtonProps {
  href: string;
  label: string;
  icon: string;
  isActive: boolean;
}

function SidebarNavButton({ href, label, icon, isActive }: NavButtonProps) {
  return (
    <Link 
      href={href}
      className={`flex items-center space-x-3 p-3 rounded-xl transition border font-sans ${
        isActive 
          ? 'bg-[#4B5563]/70 text-white border-gray-500/30 shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)] font-bold' 
          : 'text-gray-300 border-transparent hover:bg-[#4B5563]/40 hover:text-white hover:border-gray-500/10'
      }`}
    >
      <span className={`text-sm transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>{icon}</span>
      <span className="text-xs tracking-wide">{label}</span>
    </Link>
  );
}