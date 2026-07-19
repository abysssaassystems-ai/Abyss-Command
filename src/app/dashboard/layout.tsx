"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import AppsAcctSidebar from "@/components/AppsAcctSidebar";
import AppsHeader from "@/components/AppsHeader";
import { Loader2, ShieldAlert } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const router = useRouter();
  const [globalAuthState, setGlobalAuthState] = useState<"authenticating" | "authorized" | "expired">("authenticating");

  useEffect(() => {
    // 1. Core security clearance pass on initial mount
    async function verifyGlobalClearance() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
          setGlobalAuthState("expired");
        } else {
          setGlobalAuthState("authorized");
        }
      } catch (err) {
        console.error("GLOBAL_LAYOUT_AUTH_EXCEPTION:", err);
        setGlobalAuthState("expired");
      }
    }
    verifyGlobalClearance();

    // 2. Real-time token termination listener (Phase 3 Lockdown Core)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        setGlobalAuthState("expired");
        // Optional: Instantly kick the user out back to the central gateway root
        router.push("/login");
      } else if (session) {
        setGlobalAuthState("authorized");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  // --- PHASE 3 GUARD: RENDER THE APPROPRIATE VIEWPORT PARTITION ---
  
  // State A: Cryptographic token validation underway
  if (globalAuthState === "authenticating") {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-3 text-xs font-mono font-black text-purple-600 uppercase tracking-widest select-none">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span>Initializing Secure Workspace Context...</span>
      </div>
    );
  }

  // State B: Token dropped mid-action (Tester cleared cookies or signed out in Tab A)
  if (globalAuthState === "expired") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 select-none animate-fadeIn">
        <div className="bg-white border border-rose-200 rounded-[2rem] p-8 max-w-md w-full text-center shadow-xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mx-auto">
            <ShieldAlert className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-mono font-black text-gray-900 uppercase tracking-wider">
              Workspace Session Terminated
            </h3>
            <p className="text-xs font-medium text-gray-400 leading-relaxed">
              The cryptographic environment token associated with this layout pipeline context has expired or been explicitly revoked. Access blocked.
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="w-full py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-mono font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm"
          >
            Re-Authenticate Session
          </button>
        </div>
      </div>
    );
  }

  // State C: Authenticated Clearance Confirmed
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans flex antialiased">
      {/* Structural Persistent Sidebar Left Navigation Node */}
      <AppsAcctSidebar />

      {/* Main Structural Runtime Frame Context */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Dynamic Global Operational Header */}
        <AppsHeader />

        {/* Dynamic Main Workspace Canvas Block */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}