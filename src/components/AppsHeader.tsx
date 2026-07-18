"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { LogOut, User, ShieldCheck } from "lucide-react";

export default function AppsHeader(): React.JSX.Element {
  const router = useRouter();
  const [accountName, setAccountName] = useState<string>("Client Engine");
  const [tenantEmail, setTenantEmail] = useState<string>("authenticating...");

  useEffect(() => {
    const session = localStorage.getItem("active_software_user");
    if (!session) {
      setTenantEmail("unauthenticated_session");
      return;
    }

    try {
      const parsedSession = JSON.parse(session);
      const targetEmail = parsedSession?.email || "";
      setTenantEmail(targetEmail || "anonymous_isolated");

      // Live-sync query validating the database tenant context matching the record
      async function syncHeaderProfile() {
        if (!targetEmail) {
          if (parsedSession?.account_name) {
            setAccountName(parsedSession.account_name);
          }
          return;
        }

        try {
          const { data, error } = await supabase
            .from("apps_and_software_clients")
            .select("account_name")
            .eq("email", targetEmail)
            .maybeSingle();

          if (!error && data?.account_name) {
            setAccountName(data.account_name);
          } else if (parsedSession.account_name) {
            setAccountName(parsedSession.account_name);
          }
        } catch (dbError) {
          console.error("HEADER_DB_SYNC_EXCEPTION:", dbError);
          if (parsedSession.account_name) {
            setAccountName(parsedSession.account_name);
          }
        }
      }

      syncHeaderProfile();
    } catch (err) {
      console.error("HEADER_AUTH_PARSE_EXCEPTION:", err);
      setTenantEmail("fault_containment_mode");
    }
  }, []);

  const handleSessionLogout = () => {
    localStorage.removeItem("active_software_user");
    router.push("/login");
  };

  return (
    <header className="h-20 bg-white border-b border-zinc-200 px-6 md:px-8 flex items-center justify-between select-none z-40 text-left">
      
      {/* Session User Profile Greeting */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-600 shrink-0">
          <User className="w-4 h-4 stroke-[2.5]" />
        </div>
        <div className="min-w-0">
          <p className="text-[9px] font-mono font-black text-zinc-400 uppercase tracking-widest leading-none">
            Authorized Account
          </p>
          <h2 className="text-sm font-bold text-zinc-900 tracking-tight truncate mt-1">
            {accountName}
          </h2>
        </div>
      </div>

      {/* Right Control Actions Panel Block */}
      <div className="flex items-center gap-4">
        {/* Real-time Inline Tenant Identity Badge */}
        <div className="hidden lg:flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-xl px-3 h-11 text-left">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
          <div className="min-w-[120px] max-w-[200px]">
            <p className="text-[8px] font-mono font-black text-zinc-400 uppercase tracking-wider leading-none">
              Security Boundary
            </p>
            <p className="text-[10px] font-sans font-semibold text-zinc-600 truncate mt-0.5" title={tenantEmail}>
              {tenantEmail}
            </p>
          </div>
        </div>

        {/* Terminal Exit Action Interface */}
        <button
          type="button"
          onClick={handleSessionLogout}
          className="h-11 px-4 text-xs font-mono font-black uppercase tracking-wider text-red-600 bg-white hover:bg-red-50/50 border border-red-200 rounded-xl transition-all shadow-2xs active:scale-97 cursor-pointer touch-manipulation flex items-center gap-2"
        >
          <LogOut className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Logout</span>
        </button>
      </div>

    </header>
  );
}