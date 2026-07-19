"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface UserProfile {
  id: string;
  account_name: string;
  email: string;
  access_level: string;
  created_at?: string;
}

export default function MyAccountTab(): React.JSX.Element {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [resetStatus, setResetStatus] = useState<string | null>(null);

  useEffect(() => {
    const secureHydrateAccount = async () => {
      try {
        setIsLoading(true);
        setErrorMsg(null);

        // 1. EXTRACT JWT IDENTITY: Request current session parameters from crypto layer
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          setErrorMsg("SECURITY_TOKEN_INVALID: Active workspace session context unverified.");
          return;
        }

        // 2. QUERY MASTER DATA PLATFORM: Read row profile matched securely by RLS rules
        const { data, error: dbError } = await supabase
          .from('web_login_users')
          .select('id, account_name, email, access_level, created_at')
          .eq('id', user.id)
          .maybeSingle();

        if (dbError) {
          throw new Error(`PROFILE_RESOLUTION_FAIL: ${dbError.message}`);
        }

        if (data) {
          setProfile(data);
        } else {
          setProfile({
            id: user.id,
            account_name: "Unprovisioned Workspace Node",
            email: user.email || "unknown@node.io",
            access_level: "restricted"
          });
        }
      } catch (err: any) {
        setErrorMsg(err.message || "UNCAUGHT_IDENTITY_AGGREGATION_FAULT");
      } finally {
        setIsLoading(false);
      }
    };

    secureHydrateAccount();
  }, []);

  // 3. SECURE SECURITY LOOP INVOCATION: Dispatch server mail-recovery instructions
  const triggerPasswordResetLoop = async () => {
    if (!profile?.email) return;
    setIsResetting(true);
    setResetStatus(null);
    setErrorMsg(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(profile.email, {
        redirectTo: `${window.location.origin}/web-login/reset-password`,
      });
      if (error) throw error;
      
      setResetStatus("MAIL_LOOP_DISPATCHED: Security credentials recovery matrix sent to your channel.");
    } catch (err: any) {
      setErrorMsg(`RECOVERY_FAULT: ${err.message || err}`);
    } finally {
      setIsResetting(false);
    }
  };

  const formatDateString = (isoString?: string) => {
    if (!isoString) return "N/A";
    return new Date(isoString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="w-full h-48 flex items-center justify-center font-mono text-[11px] text-gray-400">
        <div className="text-center space-y-2">
          <div className="animate-pulse tracking-widest text-[#00F2FE] font-bold">// RESOLVING ACCREDITATION MATRIX //</div>
          <div>DOWNLOADING PERIMETER LOGS...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn select-none max-w-4xl mx-auto">
      
      {/* Tab Branding Header Section */}
      <div className="bg-[#374151] border border-gray-500/40 p-6 rounded-3xl shadow-lg">
        <span className="text-[10px] font-mono font-bold tracking-widest text-[#00F2FE] uppercase block">// SECURITY DESK</span>
        <h2 className="text-xl font-black text-white uppercase italic mt-1">Client Profile Parameters</h2>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl font-mono text-[11px] text-rose-400">
          ⚠ EXCEPTION_LOGGED: {errorMsg}
        </div>
      )}

      {resetStatus && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl font-mono text-[11px] text-emerald-400">
          ✓ TRANSMISSION_SUCCESS: {resetStatus}
        </div>
      )}

      {/* Main Metadata Configuration Card Layout */}
      <div className="bg-[#374151] border border-gray-500/40 p-6 rounded-3xl font-mono text-xs space-y-6">
        
        <div className="space-y-1">
          <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">// IDENTITY SPECIFICATION VECTORS</span>
          <h3 className="text-sm font-bold text-white uppercase tracking-wide">Infrastructure Access Ledger</h3>
        </div>

        <div className="p-4 bg-gray-950/20 rounded-xl border border-gray-500/10 space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-500/10 pb-2 gap-1">
            <span className="text-gray-400 uppercase text-[10px]">Profile Identifier:</span>
            <span className="text-white font-bold tracking-wide text-sm">{profile?.account_name}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-500/10 pb-2 gap-1">
            <span className="text-gray-400 uppercase text-[10px]">Primary Ingestion Channel:</span>
            <span className="text-white font-sans font-semibold text-[13px] truncate">{profile?.email}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-500/10 pb-2 gap-1">
            <span className="text-gray-400 uppercase text-[10px]">Authorization Rank:</span>
            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border tracking-wider self-start sm:self-auto ${
              profile?.access_level === 'administrator' 
                ? 'bg-cyan-500/10 text-[#00F2FE] border-[#00F2FE]/20 shadow-[0_0_8px_rgba(0,242,254,0.1)]' 
                : 'bg-zinc-500/10 text-zinc-300 border-zinc-500/20'
            }`}>
              ★ LEVEL :: {profile?.access_level}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-0.5 gap-1">
            <span className="text-gray-400 uppercase text-[10px]">Node Initialization Date:</span>
            <span className="text-gray-300 font-sans text-xs">{formatDateString(profile?.created_at)}</span>
          </div>
        </div>

        <hr className="border-gray-500/20" />

        {/* Security Controls Action Layer */}
        <div className="space-y-3">
          <div className="space-y-1">
            <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">// KEY MANAGEMENT CONTROLS</span>
            <h4 className="text-xs font-bold text-white uppercase">Credential Modifications</h4>
          </div>
          
          <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
            To enforce high-entropy perimeter protection, user authorization credentials must be updated using localized outbound cryptographically-signed loops rather than immediate database record field typing updates.
          </p>

          <div className="pt-2">
            <button
              type="button"
              disabled={isResetting || !profile?.email}
              onClick={triggerPasswordResetLoop}
              className="px-5 py-3 border border-[#00F2FE]/30 bg-[#00B8C4]/5 text-[#00F2FE] hover:bg-[#00F2FE] hover:text-gray-900 font-bold uppercase tracking-widest rounded-xl transition-all focus:outline-none disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[#00F2FE] text-[10px]"
            >
              {isResetting ? "DISPATCHING MAIL TOKEN..." : "⚡ REQUEST SECURITY CREDENTIAL UPDATE"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}