"use client";
import React, { useEffect, useState } from 'react';

interface UserSession {
  account_name: string;
  email: string;
  access_level: string;
}

export default function MyAccountTab(): React.JSX.Element {
  const [user, setUser] = useState<UserSession | null>(null);

  useEffect(() => {
    const session = localStorage.getItem("active_user");
    if (session) setUser(JSON.parse(session));
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn select-none">
      <div className="bg-[#374151] border border-gray-500/40 p-6 rounded-3xl shadow-lg">
        <span className="text-[10px] font-mono font-bold tracking-widest text-[#00F2FE] uppercase block">// PROFILE PROFILE</span>
        <h2 className="text-xl font-black text-white uppercase italic mt-1">Client Profile parameters</h2>
      </div>

      <div className="bg-[#374151] border border-gray-500/40 p-5 rounded-3xl font-mono text-xs space-y-3">
        <div className="p-4 bg-gray-950/20 rounded-xl border border-gray-500/10 space-y-2">
          <div className="flex justify-between border-b border-gray-500/10 pb-1.5">
            <span className="text-gray-400 uppercase">Profile Identifier:</span>
            <span className="text-white font-bold">{user?.account_name || "Nexus Partner"}</span>
          </div>
          <div className="flex justify-between border-b border-gray-500/10 pb-1.5">
            <span className="text-gray-400 uppercase">Primary Ingestion Channel:</span>
            <span className="text-white font-bold truncate max-w-[180px]">{user?.email || "operations@nexus.io"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 uppercase">Authorization Rank:</span>
            <span className="text-[#00F2FE] font-bold uppercase">{user?.access_level || "Client Node"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}