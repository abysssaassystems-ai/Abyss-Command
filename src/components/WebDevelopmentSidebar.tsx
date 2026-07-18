"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface UserSession {
  account_name: string;
  email: string;
  access_level: string;
}

export default function WebDevelopmentSidebar(): React.JSX.Element {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);

  useEffect(() => {
    const session = localStorage.getItem("active_user");
    if (session) {
      setUser(JSON.parse(session));
    } else {
      // Direct boot-loop fallback if someone tries to access dashboard without logging in
      setUser({
        account_name: "Nexus Labs Inc.",
        email: "operations@nexuslabs.io",
        access_level: "administrator"
      });
    }
  }, []);

  const handleTerminalLogout = () => {
    localStorage.removeItem("active_user");
    router.push("/web-login");
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
        </div>

        {/* Segment Routing Navigation Tree Layout */}
 {/* Update ONLY the nav buttons inside your Sidebar file to pass tab parameters */}
<nav className="space-y-1.5 pt-2">
  <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider mb-2">// DIRECTORIES</span>
  <SidebarNavButton href="/web-dashboard?tab=progress" label="Project Progress" icon="🚀" />
  <SidebarNavButton href="/web-dashboard?tab=requests" label="My Requests" icon="📂" />
  <SidebarNavButton href="/web-dashboard?tab=integrations" label="Website Integrations" icon="🔌" />
  <SidebarNavButton href="/web-dashboard?tab=hardware" label="Web Hardware" icon="📟" />
  <SidebarNavButton href="/web-dashboard?tab=account" label="My Account" icon="🛡️" />
  <SidebarNavButton href="/web-dashboard?tab=billing" label="Billing" icon="💳" />
  <SidebarNavButton href="/web-dashboard?tab=branding" label="Branding" icon="🎨" />
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

function SidebarNavButton({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <Link 
      href={href}
      className="flex items-center space-x-3 p-3 text-gray-300 hover:bg-[#4B5563]/40 hover:text-white rounded-xl transition border border-transparent hover:border-gray-500/10 font-sans"
    >
      <span className="text-sm">{icon}</span>
      <span className="font-semibold text-xs tracking-wide">{label}</span>
    </Link>
  );
}