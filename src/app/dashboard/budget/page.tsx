"use client";

import React, { useState } from "react";
import Link from "next/link";

// Import your decoupled modular layout sub-views
import BankFeedTab from "@/viewbars/personal-finance/BankFeedTab";
import MonthlyBudgetTab from "@/viewbars/personal-finance/MonthlyBudgetTab";
import MySubscriptionsTab from "@/viewbars/personal-finance/MySubscriptionsTab";
import CanIAffordThisTab from "@/viewbars/personal-finance/CanIAffordThisTab";
import InvestmentsAndGoalsTab from "@/viewbars/personal-finance/InvestmentsAndGoalsTab";
import SpendingTab from "@/viewbars/personal-finance/SpendingTab";

// Expanded type definition matrix to support your new analytics endpoint view
type FinanceTabID = "overview" | "budget" | "subscriptions" | "spending" | "simulator" | "investments";

export interface AccountAsset {
  id: string;
  name: string;
  type: "checking" | "savings" | "investment" | "credit_card";
  balance: number;
  institution: string;
}

export interface BudgetCategory {
  name: string;
  spent: number;
  limit: number;
  color: string;
}

export interface SubscriptionBill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
}

export interface VacationTrip {
  id: string;
  name: string;
  destination: string;
  target: number;
  saved: number;
  date: string;
}

export default function BudgetDashboard() {
  // --- SUB-VIEW CONTROLLER ENGINE ---
  const [activeTab, setActiveTab] = useState<FinanceTabID>("overview");

  // --- COMPONENT MASTER DATABASES ---
  const [purchaseCost, setPurchaseCost] = useState<string>("");
  const [purchaseVerdict, setPurchaseVerdict] = useState<{decision: string; message: string} | null>(null);
  const [investmentInput, setInvestmentInput] = useState<string>("");
  const [projectedGrowth, setProjectedGrowth] = useState<number | null>(null);

  const [accounts, setAccounts] = useState<AccountAsset[]>([
    { id: "acc_1", name: "Main Checking", type: "checking", balance: 3450, institution: "Chase" },
    { id: "acc_2", name: "High-Yield Savings", type: "savings", balance: 12800, institution: "Ally" },
    { id: "acc_3", name: "Investment Portfolio", type: "investment", balance: 24150, institution: "Charles Schwab" },
    { id: "acc_4", name: "Sapphire Credit Card", type: "credit_card", balance: -840, institution: "Chase" }
  ]);

  const [categories, setCategories] = useState<BudgetCategory[]>([
    { name: "Groceries & Food", spent: 420, limit: 600, color: "bg-blue-500" },
    { name: "Entertainment & Play", spent: 180, limit: 250, color: "bg-sky-400" },
    { name: "Rent & Utilities", spent: 1200, limit: 1400, color: "bg-blue-600" }
  ]);

  const [subscriptions, setSubscriptions] = useState<SubscriptionBill[]>([
    { id: "sub_1", name: "Netflix Premium", amount: 15.49, dueDate: "In 3 Days" },
    { id: "sub_2", name: "Spotify Family", amount: 16.99, dueDate: "In 8 Days" },
    { id: "sub_3", name: "Gym Membership", amount: 50.00, dueDate: "July 1st" }
  ]);

  const [vacations, setVacations] = useState<VacationTrip[]>([
    { id: "vac_1", name: "Tokyo Summer 2026", destination: "Tokyo, Japan", target: 4500, saved: 3100, date: "2026-08-15" },
    { id: "vac_2", name: "Alps Skiing Trip", destination: "Chamonix, France", target: 3000, saved: 850, date: "2026-12-20" }
  ]);

  // --- LIVE MATHEMATICAL CALCULATORS ---
  const totalAssets = accounts.reduce((acc, curr) => acc + curr.balance, 0);
  const liquidCash = accounts.filter(a => ["checking", "savings"].includes(a.type)).reduce((acc, curr) => acc + curr.balance, 0);
  const upcomingBillsTotal = subscriptions.reduce((acc, curr) => acc + curr.amount, 0);
  
  const totalBudgetLimit = categories.reduce((acc, curr) => acc + curr.limit, 0);
  const totalBudgetSpent = categories.reduce((acc, curr) => acc + curr.spent, 0);
  const netCashRemaining = totalBudgetLimit - totalBudgetSpent;

  // --- PREDICTIVE TRANSACTION ALGORITHMS ---
  const evaluatePurchaseAffordability = (e: React.FormEvent) => {
    e.preventDefault();
    const cost = parseFloat(purchaseCost) || 0;
    if (cost <= 0) return;

    const safetyBuffer = 1500; 
    const accessibleSpendCap = liquidCash - upcomingBillsTotal - safetyBuffer;

    if (cost <= accessibleSpendCap * 0.1) {
      setPurchaseVerdict({
        decision: "Approved ✔",
        message: `Perfectly safe to purchase. This item represents less than 10% of your remaining flexible budget margin ($${Math.round(accessibleSpendCap).toLocaleString()}), keeping your protection cash completely uncompromised.`
      });
    } else if (cost <= accessibleSpendCap) {
      setPurchaseVerdict({
        decision: "Caution Required ⚠️",
        message: "Affordable, but structural adjustments recommended. This single asset acquisition drawing down your remaining liquid margin directly delays active vacation funding targets."
      });
    } else {
      setPurchaseVerdict({
        decision: "Denied ✕",
        message: "High Risk Outflow Detected. This purchase breaks past allowable disposable allowance balances, threatening primary protection parameters or fixed recurring contract positions."
      });
    }
  };

  const calculateCompoundProjections = (e: React.FormEvent) => {
    e.preventDefault();
    const deposit = parseFloat(investmentInput) || 0;
    if (deposit <= 0) return;

    const monthlyRate = 0.08 / 12;
    const totalMonths = 10 * 12;
    const futureValue = deposit * (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate));
    setProjectedGrowth(Math.round(futureValue));
  };

  const handleFundVacation = (id: string, amount: number) => {
    if (liquidCash < amount) return;
    setVacations(prev => prev.map(v => v.id === id ? { ...v, saved: Math.min(v.saved + amount, v.target) } : v));
    setAccounts(prev => prev.map(a => a.id === "acc_1" ? { ...a, balance: a.balance - amount } : a));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 font-sans antialiased selection:bg-blue-500/20 flex flex-col">
      
      {/* GLOBAL HEADER BAR */}
      <header className="w-full bg-white border-b border-slate-100 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="text-xl bg-blue-500 text-white w-8 h-8 rounded-lg flex items-center justify-center font-black italic shadow-sm select-none">C</span>
          <h2 className="text-base font-black text-slate-900 tracking-tight uppercase">Capital-<span className="text-blue-500">Engine</span></h2>
        </div>
        <Link 
          href="/dashboard" 
          className="text-xs font-bold uppercase tracking-wider border border-slate-200 hover:border-blue-400 text-slate-500 hover:text-blue-500 px-4 h-9 rounded-full flex items-center transition-all select-none touch-manipulation"
        >
          ← Exit Console
        </Link>
      </header>

      {/* CORE FRAME LAYOUT SPLIT */}
      <div className="flex-1 flex flex-col md:flex-row w-full max-w-6xl mx-auto items-stretch">
        
        {/* INTERACTIVE NAVIGATION PORTAL SIDEBAR */}
        <aside className="w-full md:w-64 bg-white md:border-r border-b md:border-b-0 border-slate-100 p-4 sm:p-6 shrink-0 flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible select-none custom-scrollbar">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full text-left px-4 h-11 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center shrink-0 md:shrink border md:border-none min-w-[130px] md:min-w-0 ${
              activeTab === "overview" ? "bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-500/10" : "bg-slate-50 md:bg-transparent text-slate-500 border-slate-100 hover:bg-slate-100"
            }`}
          >
            ⦗🏦⦘ Bank Feed
          </button>
          <button
            onClick={() => setActiveTab("budget")}
            className={`w-full text-left px-4 h-11 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center shrink-0 md:shrink border md:border-none min-w-[150px] md:min-w-0 ${
              activeTab === "budget" ? "bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-500/10" : "bg-slate-50 md:bg-transparent text-slate-500 border-slate-100 hover:bg-slate-100"
            }`}
          >
            📊 Monthly Budget
          </button>
          <button
            onClick={() => setActiveTab("subscriptions")}
            className={`w-full text-left px-4 h-11 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center shrink-0 md:shrink border md:border-none min-w-[150px] md:min-w-0 ${
              activeTab === "subscriptions" ? "bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-500/10" : "bg-slate-50 md:bg-transparent text-slate-500 border-slate-100 hover:bg-slate-100"
            }`}
          >
            ⏳ My Subscriptions
          </button>
          
          {/* NEW TAB SIDEBAR ITEM: INTEGRATED SPENDING REPORTING NODE */}
          <button
            onClick={() => setActiveTab("spending")}
            className={`w-full text-left px-4 h-11 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center shrink-0 md:shrink border md:border-none min-w-[150px] md:min-w-0 ${
              activeTab === "spending" ? "bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-500/10" : "bg-slate-50 md:bg-transparent text-slate-500 border-slate-100 hover:bg-slate-100"
            }`}
          >
            🛍️ Spending Analysis
          </button>

          <button
            onClick={() => setActiveTab("simulator")}
            className={`w-full text-left px-4 h-11 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center shrink-0 md:shrink border md:border-none min-w-[150px] md:min-w-0 ${
              activeTab === "simulator" ? "bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-500/10" : "bg-slate-50 md:bg-transparent text-slate-500 border-slate-100 hover:bg-slate-100"
            }`}
          >
            🧠 Can I Afford This
          </button>
          <button
            onClick={() => setActiveTab("investments")}
            className={`w-full text-left px-4 h-11 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center shrink-0 md:shrink border md:border-none min-w-[150px] md:min-w-0 ${
              activeTab === "investments" ? "bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-500/10" : "bg-slate-50 md:bg-transparent text-slate-500 border-slate-100 hover:bg-slate-100"
            }`}
          >
            📈 Investments & Goals
          </button>
        </aside>

        {/* WORKSPACE CONTENT ROUTER */}
        <section className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === "overview" && (
            <BankFeedTab accounts={accounts} totalAssets={totalAssets} />
          )}

          {activeTab === "budget" && (
            <MonthlyBudgetTab />
          )}

          {activeTab === "subscriptions" && (
            <MySubscriptionsTab subscriptions={subscriptions} />
          )}

          {/* WORKSPACE TARGET RENDERING PIN: MOUNTS THE PREMIUM SPENDING ANALYTICS PANEL VIEW */}
          {activeTab === "spending" && (
            <SpendingTab />
          )}

          {activeTab === "simulator" && (
            <CanIAffordThisTab 
              purchaseCost={purchaseCost}
              setPurchaseCost={setPurchaseCost}
              purchaseVerdict={purchaseVerdict}
              evaluatePurchaseAffordability={evaluatePurchaseAffordability}
            />
          )}

          {activeTab === "investments" && (
            <InvestmentsAndGoalsTab 
              vacations={vacations}
              handleFundVacation={handleFundVacation}
              investmentInput={investmentInput}
              setInvestmentInput={setInvestmentInput}
              calculateCompoundProjections={calculateCompoundProjections}
              projectedGrowth={projectedGrowth}
            />
          )}
        </section>

      </div>
    </div>
  );
}