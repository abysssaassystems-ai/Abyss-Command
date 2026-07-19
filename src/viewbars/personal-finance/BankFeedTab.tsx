"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AccountAsset } from "@/app/dashboard/my-apps/budget/page";
import PlaidLinkButton from "@/components/PlaidLinkButton";
import { supabase } from "@/lib/supabaseClient";
import { 
  RefreshCw, 
  Calendar, 
  Layers, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Database, 
  CreditCard,
  TrendingUp,
  CircleAlert,
  Loader2
} from "lucide-react";

interface TransactionRow {
  id: string;
  plaid_account_id: string;
  description: string;
  date: string;
  amount: number;
  type: "income" | "expense";
}

interface BankFeedTabProps {
  accounts: AccountAsset[];
  totalAssets: number;
}

export default function BankFeedTab({ accounts, totalAssets }: BankFeedTabProps): React.JSX.Element {
  // --- MULTI-TENANT SESSION HANDSHAKE STATE ---
  const [userEmail, setUserEmail] = useState<string>("authenticating...");
  //  Correct: Clean initialization of the string state
const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [activeSubTab, setActiveSubTab] = useState<"all" | "income" | "expense">("all");
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [refreshesRemaining, setRefreshesRemaining] = useState<number>(10);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);

  // --- MULTI-TENANT ARCHITECTURE SECURE HANDSHAKE ---
  useEffect(() => {
    function handleUserIdentity(user: any) {
      if (user?.email) {
        setUserEmail(user.email);
      } else if (user) {
        setUserEmail("anonymous_isolated");
      } else {
        setUserEmail("unauthenticated_session");
      }
    }

    // 1. Initial signature validation pass
    async function syncTenantSession() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (!error && user) {
          handleUserIdentity(user);
        } else {
          handleUserIdentity(null);
        }
      } catch (err) {
        console.error("LEDGER_AUTH_HANDSHAKE_EXCEPTION:", err);
        setUserEmail("fault_containment_mode");
      }
    }
    syncTenantSession();

    // 2. Real-time auth subscriber channel observer line
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleUserIdentity(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const isSecuredTenant = userEmail && !["authenticating...", "unauthenticated_session", "fault_containment_mode"].includes(userEmail);

  // Isolate active institutional registry nodes
  const currentSelectedAccount = accounts.find(a => a.id === selectedAccountId);
  const targetPlaidId = currentSelectedAccount?.id || accounts[0]?.id || "";

  // --- DYNAMIC CLOUD SYNC ENGINE ---
  const syncLiveTransactions = useCallback(async (plaidId: string) => {
    if (!plaidId || !isSecuredTenant) return;
    setIsSyncing(true);
    try {
      const response = await fetch("/api/plaid/sync-transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userEmail, // Cryptographically sourced and verified identity string
          plaid_account_id: plaidId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions || []);
        setLastUpdated(
          new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        );
      }
    } catch (err) {
      console.error("REALTIME_LEDGER_SYNC_FAULT:", err);
    } finally {
      setIsSyncing(false);
    }
  }, [userEmail, isSecuredTenant]);

  // Handle downstream structural synchronization updates across lifecycle transitions
  useEffect(() => {
    if (accounts.length > 0 && isSecuredTenant) {
      if (!selectedAccountId) {
        setSelectedAccountId(accounts[0].id);
      }
      syncLiveTransactions(selectedAccountId || accounts[0].id);
    }
  }, [selectedAccountId, accounts, isSecuredTenant, syncLiveTransactions]);

  // --- MUTATION PIPE HANDLERS ---
  const handleManualRefreshRequest = () => {
    if (refreshesRemaining <= 0 || isSyncing || !targetPlaidId || !isSecuredTenant) return;
    setRefreshesRemaining((prev) => prev - 1);
    syncLiveTransactions(targetPlaidId);
  };

  // --- SUB-ARRAY REGISTRY FILTERS ---
  const filteredTransactions = transactions.filter(tx => {
    if (activeSubTab === "income") return tx.type === "income";
    if (activeSubTab === "expense") return tx.type === "expense";
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn text-gray-800 select-none">
      
      {/* 1. CONTROL DECK RUNTIME STRIP HEADER */}
      <div className="border-b border-gray-200 pb-5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Database className="w-5 h-5 text-purple-600" /> Institution Network Pipeline
          </h3>
          <p className="text-xs text-gray-400 font-medium mt-0.5 text-left">
            Liquid capital streams mapped dynamically via automated Open Banking cryptographic parameters.
          </p>
          <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-500 font-bold font-mono uppercase bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100 max-w-fit">
            <span className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-purple-500 animate-ping' : isSecuredTenant ? 'bg-emerald-500' : 'bg-rose-400'}`} />
            {userEmail === "authenticating..." ? (
              <span>Sync Status: Verifying Handshake Token...</span>
            ) : userEmail === "unauthenticated_session" ? (
              <span className="text-rose-600">Sync Status: Pipeline Offline</span>
            ) : (
              <span>Sync Pulse state: <span className="text-purple-600 font-black">{lastUpdated || "AWAITING_HANDSHAKE"}</span></span>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <button
            type="button"
            disabled={refreshesRemaining <= 0 || isSyncing || !targetPlaidId || !isSecuredTenant}
            onClick={handleManualRefreshRequest}
            className="flex-1 lg:flex-none bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-bold text-xs px-4 h-11 rounded-xl transition-all shadow-sm flex flex-col justify-center items-center active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <RefreshCw className={`w-3.5 h-3.5 text-purple-600 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? "Re-aligning Array..." : "Refresh Channel Balance"}</span>
            </div>
            <span className="text-[9px] text-gray-400 font-mono tracking-tight mt-0.5 font-normal">
              {refreshesRemaining} Priority Handshakes Left
            </span>
          </button>

          {isSecuredTenant && (
            <PlaidLinkButton 
              userId={userEmail} 
              onSuccessSync={() => syncLiveTransactions(targetPlaidId)} 
            />
          )}
        </div>
      </div>

      {/* 2. CUMULATIVE VALUE VALUE MATRIX METER */}
      <div className="p-[1px] bg-gradient-to-r from-purple-600 via-blue-500 to-gray-200 rounded-2xl shadow-sm">
        <div className="bg-white rounded-[15px] p-6 text-center relative overflow-hidden">
          <span className="text-[10px] text-gray-400 font-mono font-black uppercase tracking-widest flex items-center justify-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-purple-600" /> AGGREGATED PORTFOLIO VALUE MATRIX
          </span>
          <span className="text-3xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-slate-700 mt-2 block tracking-tight tabular-nums">
            {userEmail === "unauthenticated_session" ? (
              "$ --.--"
            ) : (
              `$${totalAssets.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            )}
          </span>
        </div>
      </div>

      {/* 3. INTERACTIVE FINANCIAL ASSETS NODE SELECTION FEED GRID */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono font-black text-gray-400 uppercase tracking-wider block text-left ml-1">
          Active Institutional Array Nodes
        </span>
        
        {userEmail === "authenticating..." ? (
          <div className="py-10 border border-gray-100 rounded-2xl bg-white flex flex-col items-center justify-center gap-2 font-mono text-xs text-gray-400 font-bold uppercase">
            <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
            <span>Validating Security Clearance Context...</span>
          </div>
        ) : userEmail === "unauthenticated_session" ? (
          <div className="p-8 border border-dashed border-rose-200 bg-rose-50/30 rounded-2xl flex flex-col items-center text-center gap-2">
            <CircleAlert className="w-6 h-6 text-rose-500" />
            <p className="text-xs font-mono font-black text-gray-900 uppercase tracking-wider">Access Restrained</p>
            <p className="text-[11px] font-sans font-medium text-gray-400 max-w-sm leading-relaxed">
              An active authenticated software user signature is required to interface with third-party open banking endpoints.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {accounts.map((acc) => {
              const isSelected = acc.id === selectedAccountId;
              return (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => {
                    setSelectedAccountId(acc.id);
                    setActiveSubTab("all");
                  }}
                  className={`w-full text-left p-5 rounded-2xl flex justify-between items-center transition-all relative overflow-hidden border cursor-pointer ${
                    isSelected 
                      ? "bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 border-purple-600 shadow-md text-white scale-[1.01]" 
                      : "bg-white border-gray-200 shadow-sm hover:border-gray-300 text-gray-800"
                  }`}
                >
                  <div className="min-w-0">
                    <span className={`text-[9px] px-2 py-0.5 rounded uppercase font-mono tracking-wider font-black ${
                      isSelected ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "bg-gray-100 text-gray-500 border border-gray-200"
                    }`}>
                      {acc.institution}
                    </span>
                    <h4 className="text-sm font-black mt-2.5 tracking-tight truncate flex items-center gap-1.5">
                      <CreditCard className={`w-4 h-4 shrink-0 ${isSelected ? 'text-blue-400' : 'text-gray-400'}`} />
                      {acc.name}
                    </h4>
                    <span className="text-[10px] capitalize block mt-0.5 font-medium text-gray-400">
                      {acc.type.replace("_", " ")} Node Partition
                    </span>
                  </div>
                  <span className={`text-base font-mono font-black tabular-nums shrink-0 ml-4 ${
                    !isSelected && acc.balance < 0 ? 'text-rose-600' : isSelected && acc.balance < 0 ? 'text-rose-400' : ''
                  }`}>
                    ${acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. GRANULAR LEDGER STATEMENT TRANSMISSION VIEWER */}
      {isSecuredTenant && (
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden p-5 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-purple-600" /> 
                {currentSelectedAccount?.institution || accounts[0]?.institution || "System"} Ledger Array Stack
              </span>
              <span className="text-[10px] bg-purple-50 text-purple-600 font-mono font-bold px-2.5 py-0.5 rounded-full border border-purple-100">
                {filteredTransactions.length} Row logs found
              </span>
            </div>

            <div className="bg-gray-100 p-1 rounded-xl flex gap-1 self-start sm:self-auto shadow-inner">
              {(["all", "income", "expense"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveSubTab(tab)}
                  className={`px-3 py-1.5 text-[10px] uppercase tracking-wider font-black rounded-lg transition-all cursor-pointer ${
                    activeSubTab === tab 
                      ? "bg-white text-gray-900 shadow-sm" 
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* DATA CONTAINER MESH VIEWER */}
          <div className="divide-y divide-gray-100 max-h-[380px] overflow-y-auto pr-1">
            {isSyncing ? (
              <div className="text-center py-12 space-y-3">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-600 border-b-transparent mx-auto" />
                <p className="text-xs font-mono font-bold text-purple-600 tracking-wider uppercase animate-pulse">
                  De-serializing database transaction nodes...
                </p>
              </div>
            ) : filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx) => (
                <div key={tx.id} className="py-3.5 flex justify-between items-center text-xs first:pt-0 last:pb-0 group hover:bg-gray-50/50 px-2 rounded-xl transition-colors">
                  <div className="min-w-0 pr-4 flex items-center gap-3 text-left">
                    <div className={`p-2 rounded-xl shrink-0 border ${
                      tx.type === "income" 
                        ? "bg-emerald-50 border-emerald-100 text-emerald-600" 
                        : "bg-gray-50 border-gray-100 text-gray-400 group-hover:text-purple-600 group-hover:bg-purple-50 group-hover:border-purple-100"
                    } transition-colors`}>
                      {tx.type === "income" ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <h5 className="font-black text-gray-900 tracking-tight truncate">
                        {tx.description}
                      </h5>
                      <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1 mt-0.5 font-mono tabular-nums">
                        <Calendar className="w-3 h-3" /> {tx.date}
                      </span>
                    </div>
                  </div>
                  <span className={`font-mono font-black text-sm tabular-nums shrink-0 ${
                    tx.type === "income" ? "text-emerald-600" : "text-gray-900"
                  }`}>
                    {tx.type === "income" ? "+" : "-"}${Math.abs(tx.amount).toFixed(2)}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-12 space-y-2 max-w-sm mx-auto">
                <CircleAlert className="w-6 h-6 text-gray-300 mx-auto" />
                <p className="text-xs font-black text-gray-400 uppercase tracking-wide font-mono">
                  [ INDEX_PARTITION_VACANT ]
                </p>
                <p className="text-xs text-gray-400 leading-relaxed font-medium">
                  No verified execution rows registered inside this dynamic query bounds. Run an account balance state refresh to poll underlying API pipelines.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}