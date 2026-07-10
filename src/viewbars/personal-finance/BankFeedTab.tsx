"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AccountAsset } from "@/app/dashboard/budget/page";
import PlaidLinkButton from "@/components/PlaidLinkButton";

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

export default function BankFeedTab({ accounts, totalAssets }: BankFeedTabProps) {
  const devUserId = "mock-dev-user-uuid-123";

  // --- STATE ENGINES ---
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [activeSubTab, setActiveSubTab] = useState<"all" | "income" | "expense">("all");
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [refreshesRemaining, setRefreshesRemaining] = useState<number>(10);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);

  // Find the Plaid account ID from the local internal asset configuration block
  const currentSelectedAccount = accounts.find(a => a.id === selectedAccountId);
  // Default fallback assignment to make sure the first node matches cleanly on load
  const targetPlaidId = currentSelectedAccount?.id || accounts[0]?.id || "";

  // --- DYNAMIC DATA FETCH COMPILER ---
  const syncLiveTransactions = useCallback(async (plaidId: string) => {
    if (!plaidId) return;
    setIsSyncing(true);
    try {
      const response = await fetch("/api/plaid/sync-transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: devUserId,
          plaid_account_id: plaidId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions || []);
        setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    } catch (err) {
      console.error("Failed to run real-time background sync:", err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Sync automatically on component mount or whenever the user clicks a different account block
  useEffect(() => {
    if (accounts.length > 0) {
      if (!selectedAccountId) {
        setSelectedAccountId(accounts[0].id);
      }
      syncLiveTransactions(selectedAccountId || accounts[0].id);
    }
  }, [selectedAccountId, accounts, syncLiveTransactions]);

  // --- INTERACTION PIPELINES ---
  const handleManualRefreshRequest = () => {
    if (refreshesRemaining <= 0 || isSyncing) return;
    setRefreshesRemaining((prev) => prev - 1);
    syncLiveTransactions(targetPlaidId);
  };

  // --- SUB-TAB INTERFACE FILTERS ---
  const filteredTransactions = transactions.filter(tx => {
    if (activeSubTab === "income") return tx.type === "income";
    if (activeSubTab === "expense") return tx.type === "expense";
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* 1. CONTROL DECK HEADER STRIP */}
      <div className="border-b border-slate-200/60 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Institution Account Feed</h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Real-time liquid capital ledger arrays synced dynamically via secure Plaid API endpoints.
          </p>
          <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500 font-bold font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Last Synced: <span className="text-blue-500 tabular-nums">{lastUpdated || "Syncing with ledger..."}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            disabled={refreshesRemaining <= 0 || isSyncing || !targetPlaidId}
            onClick={handleManualRefreshRequest}
            className="flex-1 md:flex-none border border-slate-200 hover:border-slate-300 bg-white text-slate-700 font-bold text-xs px-4 h-11 rounded-xl transition-all shadow-sm flex flex-col justify-center items-center select-none active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-1.5">
              <span className={`text-[11px] ${isSyncing ? 'animate-spin block' : ''}`}>🔄</span>
              <span>{isSyncing ? "Syncing..." : "Refresh Balance"}</span>
            </div>
            <span className="text-[9px] text-slate-400 font-mono tracking-tight mt-0.5 font-normal">
              {refreshesRemaining} Plan Queries Left This Month
            </span>
          </button>

          <PlaidLinkButton 
            userId={devUserId} 
            onSuccessSync={() => syncLiveTransactions(targetPlaidId)} 
          />
        </div>
      </div>

      {/* 2. CUMULATIVE VALUE DISK */}
      <div className="bg-white border border-slate-100 shadow-md rounded-[2rem] p-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-sky-400" />
        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Cumulative Net Portfolio Value</span>
        <span className="text-4xl font-black text-slate-900 mt-2 block tracking-tight tabular-nums">
          ${totalAssets.toLocaleString()}
        </span>
      </div>

      {/* 3. INTERACTIVE ACCOUNT SELECTION GRID BLOCK */}
      <div className="space-y-2">
        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block ml-1">Select Financial Node Feed</span>
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
                className={`w-full text-left p-5 rounded-2xl flex justify-between items-center transition-all relative overflow-hidden border ${
                  isSelected 
                    ? "bg-gradient-to-br from-slate-900 to-[#121824] border-blue-500 shadow-md text-white" 
                    : "bg-white border-slate-100 shadow-sm hover:border-slate-200 text-slate-800"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 left-0 h-full w-1 bg-blue-500" />
                )}
                <div className="min-w-0">
                  <span className={`text-[9px] px-2 py-0.5 rounded uppercase font-mono tracking-wider font-extrabold ${
                    isSelected ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-slate-100 text-slate-500"
                  }`}>
                    {acc.institution}
                  </span>
                  <h4 className="text-sm font-bold mt-2 truncate">{acc.name}</h4>
                  <span className="text-[10px] capitalize block mt-0.5 text-slate-400">
                    {acc.type.replace("_", " ")} Stream
                  </span>
                </div>
                <span className={`text-base font-black tabular-nums shrink-0 ml-4 ${
                  !isSelected && acc.balance < 0 ? 'text-rose-500' : isSelected && acc.balance < 0 ? 'text-rose-400' : ''
                }`}>
                  ${acc.balance.toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. GRANULAR LEDGER TRANSACTION MODULE LAYER */}
      <div className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden p-5 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-800">
              {currentSelectedAccount?.institution || accounts[0]?.institution || "Node"} Ledger Stack
            </span>
            <span className="text-[10px] bg-blue-50 text-blue-600 font-mono font-bold px-2 py-0.5 rounded">
              {filteredTransactions.length} Logged rows
            </span>
          </div>

          <div className="bg-slate-100 p-0.5 rounded-lg flex gap-0.5 max-w-fit self-start sm:self-auto select-none">
            {(["all", "income", "expense"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveSubTab(tab)}
                className={`px-3 py-1 text-[10px] uppercase tracking-wider font-black rounded-md transition-all ${
                  activeSubTab === tab 
                    ? "bg-white text-slate-900 shadow-xs" 
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
          {isSyncing ? (
            <div className="text-center py-10 space-y-2 select-none">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mx-auto" />
              <p className="text-xs font-bold text-slate-400 tracking-tight">Pulling real-time ledger records...</p>
            </div>
          ) : filteredTransactions.length > 0 ? (
            filteredTransactions.map((tx) => (
              <div key={tx.id} className="py-3.5 flex justify-between items-center text-xs first:pt-0 last:pb-0 group">
                <div className="min-w-0 pr-4">
                  <h5 className="font-bold text-slate-800 tracking-tight truncate group-hover:text-blue-500 transition-colors">
                    {tx.description}
                  </h5>
                  <span className="text-[10px] font-medium text-slate-400 block mt-0.5 font-mono tabular-nums">
                    📅 {tx.date}
                  </span>
                </div>
                <span className={`font-extrabold text-sm tabular-nums shrink-0 ${
                  tx.type === "income" ? "text-emerald-500" : "text-slate-700"
                }`}>
                  {tx.type === "income" ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-10 space-y-2 select-none">
              <span className="text-2xl block opacity-40">🕳️</span>
              <p className="text-xs font-bold text-slate-400 tracking-tight">
                No transactions found for this account in your database yet. Try running a balance refresh!
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}