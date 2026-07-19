"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import BudgetSidebar from "@/components/nodes/BudgetSidebar";
import { ShieldAlert, Cpu } from "lucide-react";

// --- SUB-COMPONENT METRIC SHELLS ---
const HealthTrackerCard = () => (
  <div className="bg-white p-6 flex flex-col justify-between h-full relative z-10 rounded-[23px]">
    <div>
      <span className="text-[10px] text-blue-600 font-mono tracking-wider block mb-1">// SYSTEM SUBSYSTEM ACTIVE</span>
      <h3 className="text-lg font-black text-gray-900 uppercase italic tracking-tight">Bio-Engine Console</h3>
      <p className="text-xs text-gray-500 mt-2 leading-relaxed">Integrated tracking metrics for lifestyle habits, nutrition logs, and workout vectors.</p>
    </div>
    <div className="mt-6 flex justify-end">
      <Link 
        href="/dashboard/health"
        className="text-[10px] uppercase font-bold tracking-wider bg-gray-50 border border-gray-200 text-gray-700 hover:border-blue-600 hover:text-blue-600 px-4 py-2.5 rounded-xl transition-all font-mono"
      >
        Open Module Console →
      </Link>
    </div>
  </div>
);

const HabitStreakCard = () => (
  <div className="bg-white p-6 h-full relative z-10 rounded-[23px] flex flex-col justify-between">
    <div>
      <span className="text-[10px] text-purple-600 font-mono tracking-wider block mb-1">// COGNITIVE PATTERN LOOP</span>
      <h3 className="text-lg font-black text-gray-900 uppercase italic tracking-tight">Habit Streak Engine</h3>
      <p className="text-xs text-gray-500 mt-2 mb-4 leading-relaxed">Automated consecutive checkpoint frequency tracking metrics.</p>
    </div>
    <div className="flex gap-1.5 mt-2">
      {[...Array(7)].map((_, i) => (
        <div key={i} className={`w-7 h-7 rounded-lg border text-[10px] flex items-center justify-center font-bold ${i < 4 ? 'bg-purple-50 border-purple-300 text-purple-700' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>{i + 1}</div>
      ))}
    </div>
  </div>
);

const MicroLedgerCard = () => (
  <div className="bg-white p-6 h-full relative z-10 rounded-[23px] flex flex-col justify-between">
    <div>
      <span className="text-[10px] text-gray-400 font-mono tracking-wider block mb-1">// TRANSACTION INGEST</span>
      <h3 className="text-lg font-black text-gray-900 uppercase italic tracking-tight">Minimalist Ledger</h3>
    </div>
    <div className="text-3xl font-mono font-black text-gray-900 mt-4">$0.00 <span className="text-xs text-gray-400 font-normal font-sans block mt-0.5">Calculated active ledger metrics for this billing cycle</span></div>
  </div>
);

const MediaTrackerCard = () => (
  <div className="bg-white p-6 flex flex-col justify-between h-full relative z-10 rounded-[23px]">
    <div>
      <span className="text-[10px] text-blue-600 font-mono tracking-wider block mb-1">// CONTAINER RUNTIME ACTIVE</span>
      <h3 className="text-lg font-black text-gray-900 uppercase italic tracking-tight">My Media Vault</h3>
      <p className="text-xs text-gray-500 mt-2 leading-relaxed">Integrated unified tracking metrics for shows, movies, books, and gaming libraries.</p>
    </div>
    <div className="mt-6 flex justify-end">
      <Link 
        href="/dashboard/media"
        className="text-[10px] uppercase font-bold tracking-wider bg-gray-50 border border-gray-200 text-gray-700 hover:border-blue-600 hover:text-blue-600 px-4 py-2.5 rounded-xl transition-all font-mono"
      >
        Open Full Console →
      </Link>
    </div>
  </div>
);

const GenericBusinessCard = ({ title }: { title: string }) => (
  <div className="bg-white p-6 h-full relative z-10 rounded-[23px]">
    <span className="text-[10px] text-purple-600 font-mono tracking-wider block mb-1">// AUTOMATED WORKER</span>
    <h3 className="text-lg font-black text-gray-900 uppercase italic tracking-tight">{title}</h3>
    <p className="text-xs text-gray-500 mt-2 leading-relaxed">Background automation models running continuous system diagnostics checking workflows...</p>
  </div>
);

const CATALOGUE_COMPONENTS: Record<string, React.ComponentType<any>> = {
  "health-tracker": HealthTrackerCard,
  "habit-streak": HabitStreakCard,
  "micro-ledger": MicroLedgerCard,
  "my-media": MediaTrackerCard,
  "inquiry-router": () => <GenericBusinessCard title="Inquiry Router Engine" />,
  "scheduling-link": () => <GenericBusinessCard title="Scheduling Engine" />,
  "budget": BudgetSidebar,
  "statement-detector": () => <GenericBusinessCard title="Statement Fluctuation Detector" />,
};

interface ActiveNode {
  id: string;
  title: string;
}

export default function Dashboard(): React.JSX.Element {
  const [deployedNodes, setDeployedNodes] = useState<ActiveNode[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [workspaceName, setWorkspaceName] = useState<string>("Loading Workspace...");
  const [tenantState, setTenantState] = useState<"identifying" | "verified" | "revoked">("identifying");

  // --- REFACTORED ISOLATED DATA STREAM HANDLER ---
  const fetchDashboardMetrics = useCallback(async (userId: string) => {
    try {
      // 1. Pull core account descriptor fields safely
      const { data: profile } = await supabase
        .from("apps_and_software_clients")
        .select("account_name")
        .eq("user_id", userId)
        .maybeSingle();

      if (profile?.account_name) {
        setWorkspaceName(profile.account_name);
      } else {
        setWorkspaceName("System Engine Operator");
      }

      // 2. Load configured node modules bound to this specific token owner
      const { data: nodes, error } = await supabase
        .from("user_deployed_nodes")
        .select("node_id, title")
        .eq("user_id", userId);

      if (!error && nodes) {
        setDeployedNodes(nodes.map(n => ({ id: n.node_id, title: n.title })));
      }
    } catch (err) {
      console.error("DASHBOARD_METRICS_FETCH_EXCEPTION:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // --- REAL-TIME RETENTION & TIMEOUT REACTION OBSERVABLE ---
  useEffect(() => {
    function evaluateSessionState(user: any) {
      if (user) {
        setTenantState("verified");
        fetchDashboardMetrics(user.id);
      } else {
        // Real-Time Memory Purging Sandbox (Phase 3 Safeguard)
        setTenantState("revoked");
        setDeployedNodes([]);
        setWorkspaceName("");
        setIsLoading(false);
      }
    }

    // 1. Initial validation block on component boot
    async function assertBaselineAccess() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (!error && user) {
          evaluateSessionState(user);
        } else {
          evaluateSessionState(null);
        }
      } catch (err) {
        console.error("BASELINE_IDENT_CHECK_FAULT:", err);
        evaluateSessionState(null);
      }
    }
    assertBaselineAccess();

    // 2. Active event listener connection tracking auth shifts
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      evaluateSessionState(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchDashboardMetrics]);

  // --- COMPONENT UNDEPLOY MUTATION BLOCK ---
  const handleRemoveNode = async (id: string) => {
    if (tenantState !== "verified") return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("user_deployed_nodes")
        .delete()
        .eq("user_id", user.id)
        .eq("node_id", id);

      if (!error) {
        setDeployedNodes(prev => prev.filter((node) => node.id !== id));
      }
    } catch (err) {
      console.error("MUTATION_NODE_REMOVAL_EXCEPTION:", err);
    }
  };

  // --- VIEW RENDERING INTERCEPT DECK ---
  if (tenantState === "identifying" || isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center font-mono text-xs text-purple-600 tracking-widest gap-2">
        <Cpu className="w-5 h-5 animate-spin text-purple-500" />
        <span>SYNCING WORKSPACE ENGINES...</span>
      </div>
    );
  }

  if (tenantState === "revoked") {
    return (
      <div className="max-w-xl mx-auto text-center mt-12">
        <div className="border border-dashed border-rose-200 bg-rose-50/10 rounded-3xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mx-auto">
            <ShieldAlert className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-mono font-black text-gray-900 uppercase tracking-wider">
              Dashboard Session Terminated
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm mx-auto">
              Your runtime context token has expired or been purged. Access has been restricted to protect workspace telemetry.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex h-10 px-5 bg-zinc-950 text-white rounded-xl text-xs font-mono font-black uppercase tracking-wider items-center justify-center hover:bg-zinc-800 transition-all shadow-xs"
          >
            Re-Authenticate Session
          </Link>
        </div>
      </div>
    );
  }

  // --- SECURED WORKSPACE CANVAS ---
  return (
    <div className="space-y-6 select-none">
      
      {/* Title Header Block */}
      <div className="border-b border-gray-100 pb-5">
        <h1 className="text-3xl font-black italic uppercase tracking-tight text-gray-900">
          {workspaceName} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Online</span>
        </h1>
        <p className="text-xs text-gray-500 mt-1 font-sans">Workspace for apps and software systems.</p>
      </div>

      {/* Active Node Layout Canvas Grid */}
      <div className="w-full">
        {deployedNodes.length === 0 ? (
          <div className="border border-dashed border-gray-200 bg-gray-50/50 rounded-3xl p-16 text-center text-sm font-medium text-gray-400">
            No software engine cards currently initialized. Visit the marketplace catalogues to choose and configure your modules.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deployedNodes.map((node) => {
              const VisualCard = CATALOGUE_COMPONENTS[node.id];
              return (
                <div key={node.id} className="p-[1px] bg-gradient-to-br from-purple-600 via-blue-500 to-gray-300 rounded-3xl shadow-md group relative transition-all duration-300 hover:shadow-lg">
                  <button 
                    type="button"
                    disabled={tenantState !== "verified"}
                    onClick={() => handleRemoveNode(node.id)}
                    className="absolute top-4 right-4 z-20 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 opacity-0 group-hover:opacity-100 transition-all text-[9px] font-bold font-mono uppercase px-2 py-1 rounded-lg disabled:cursor-not-allowed"
                  >
                    Undeploy Node
                  </button>
                  {VisualCard ? <VisualCard /> : <GenericBusinessCard title={node.title} />}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}