"use client";

import React, { useState } from "react";
import Link from "next/link";
import PersonalCatalogue from "@/components/PersonalCatalogue";
import BusinessCatalogue from "@/components/BusinessCatalogue";
import BudgetSidebar from "@/components/nodes/BudgetSidebar";

const HealthTrackerCard = () => (
  <div className="bg-[#121824] border border-gray-800 rounded-2xl p-6 border-l-4 border-l-[#00F2FE] flex flex-col justify-between h-full shadow-lg">
    <div>
      <span className="text-[10px] text-[#00F2FE] font-mono tracking-wider block mb-1">// SYSTEM SUBSYSTEM ACTIVE</span>
      <h3 className="text-lg font-bold text-white uppercase italic tracking-tight">Bio-Engine Console</h3>
      <p className="text-xs text-gray-400 mt-2 leading-relaxed">Integrated tracking metrics for lifestyle habits, nutrition logs, and workout vectors.</p>
    </div>
    <div className="mt-6 flex justify-end">
      <Link 
        href="/dashboard/health"
        className="text-[10px] uppercase font-bold tracking-wider bg-[#0B0F17] border border-gray-800 hover:border-[#00F2FE] text-gray-300 hover:text-[#00F2FE] px-4 py-2 rounded-xl transition-all"
      >
        Open Module Console →
      </Link>
    </div>
  </div>
);

const HabitStreakCard = () => (
  <div className="bg-[#121824] border border-gray-800 rounded-2xl p-6 border-l-4 border-l-purple-500 shadow-lg">
    <span className="text-[10px] text-purple-400 font-mono tracking-wider block mb-1">// COGNITIVE PATTERN LOOP</span>
    <h3 className="text-lg font-bold text-white uppercase italic tracking-tight">Habit Streak Engine</h3>
    <p className="text-xs text-gray-400 mt-2 mb-4 leading-relaxed">Automated consecutive checkpoint frequency tracking metrics.</p>
    <div className="flex gap-1">
      {[...Array(7)].map((_, i) => (
        <div key={i} className={`w-6 h-6 rounded-md border text-[10px] flex items-center justify-center font-bold ${i < 4 ? 'bg-purple-500/10 border-purple-500 text-purple-400' : 'bg-[#0B0F17] border-gray-800 text-gray-600'}`}>{i + 1}</div>
      ))}
    </div>
  </div>
);

const MicroLedgerCard = () => (
  <div className="bg-[#121824] border border-gray-800 rounded-2xl p-6 border-l-4 border-l-emerald-500 shadow-lg">
    <span className="text-[10px] text-emerald-400 font-mono tracking-wider block mb-1">// TRANSACTION INGEST</span>
    <h3 className="text-lg font-bold text-white uppercase italic tracking-tight">Minimalist Ledger</h3>
    <div className="text-2xl font-mono font-black text-emerald-400 mt-3">$0.00 <span className="text-xs text-gray-500 font-normal font-sans">this cycle</span></div>
  </div>
);

// 🆕 NEW: THE DEDICATED MEDIA GATEWAY CARD
const MediaTrackerCard = () => (
  <div className="bg-[#121824] border border-gray-800 rounded-2xl p-6 border-l-4 border-l-amber-500 flex flex-col justify-between h-full shadow-lg">
    <div>
      <span className="text-[10px] text-amber-400 font-mono tracking-wider block mb-1">// ENTERPRISE RUNTIME</span>
      <h3 className="text-lg font-bold text-white uppercase italic tracking-tight">My Media</h3>
      <p className="text-xs text-gray-400 mt-2 leading-relaxed">Integrated unified tracking metrics for shows, movies, books, and gaming libraries.</p>
    </div>
    <div className="mt-6 flex justify-end">
      <Link 
        href="/dashboard/media"
        className="text-[10px] uppercase font-bold tracking-wider bg-[#0B0F17] border border-gray-800 hover:border-amber-500 text-gray-300 hover:text-amber-400 px-4 py-2 rounded-xl transition-all"
      >
        Open Full Console →
      </Link>
    </div>
  </div>
);

const GenericBusinessCard = ({ title }: { title: string }) => (
  <div className="bg-[#121824] border border-gray-800 rounded-2xl p-6 border-l-4 border-l-amber-500 shadow-lg">
    <span className="text-[10px] text-amber-400 font-mono tracking-wider block mb-1">// ENTERPRISE RUNTIME</span>
    <h3 className="text-lg font-bold text-white uppercase italic tracking-tight">{title}</h3>
    <p className="text-xs text-gray-500 mt-2 leading-relaxed">Background automation models running continuous system diagnostics checking workflows...</p>
  </div>
);

const CATALOGUE_COMPONENTS: Record<string, React.ComponentType<any>> = {
  "health-tracker": HealthTrackerCard,
  "habit-streak": HabitStreakCard,
  "micro-ledger": MicroLedgerCard,
  "my-media": MediaTrackerCard, // 🌟 FIXED: Pointing directly to the card link component now
  "inquiry-router": () => <GenericBusinessCard title="Inquiry Router Engine" />,
  "scheduling-link": () => <GenericBusinessCard title="Scheduling Engine" />,
  "budget": BudgetSidebar,
  "statement-detector": () => <GenericBusinessCard title="Statement Fluctuation Detector" />,
};

interface ActiveNode {
  id: string;
  title: string;
}

export default function Dashboard() {
  const [deployedNodes, setDeployedNodes] = useState<ActiveNode[]>([]);

  const handleDeployNode = (id: string, title: string) => {
    if (deployedNodes.find((node) => node.id === id)) return;
    setDeployedNodes([...deployedNodes, { id, title }]);
  };

  const handleRemoveNode = (id: string) => {
    setDeployedNodes(deployedNodes.filter((node) => node.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white p-6 lg:p-10 font-sans antialiased">
      
      {/* Active Grid Canvas */}
      <div className="max-w-5xl mx-auto mb-16">
        <div className="border-b border-gray-800 pb-6 mb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-[#00F2FE] font-bold mb-2">// DESKTOP WORKSPACE</p>
          <h1 className="text-4xl font-black italic uppercase tracking-tight">
            Active Node <span className="text-[#00B8C4]">Runtime</span>
          </h1>
          <p className="text-sm text-gray-500 mt-2">Real-time modular testing matrix running within this cloud context environment.</p>
        </div>

        {deployedNodes.length === 0 ? (
          <div className="border border-dashed border-gray-800 rounded-[2rem] p-16 text-center text-gray-500 font-medium">
            No active nodes currently deployed. Scroll down to select individual modules from your infrastructure catalogues.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deployedNodes.map((node) => {
              const VisualCard = CATALOGUE_COMPONENTS[node.id];
              return (
                <div key={node.id} className="relative group animate-fadeIn">
                  <button 
                    onClick={() => handleRemoveNode(node.id)}
                    className="absolute top-4 right-4 Carver z-10 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 opacity-0 group-hover:opacity-100 transition-all text-[9px] font-bold font-mono uppercase px-2 py-1 rounded border border-rose-500/20 select-none"
                  >
                    Undeploy
                  </button>
                  {VisualCard ? <VisualCard /> : <GenericBusinessCard title={node.title} />}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <hr className="border-gray-900 max-w-5xl mx-auto my-12" />

      {/* Catalog Entry Drawers Passing Down Native Handlers */}
      <PersonalCatalogue onDeployNode={handleDeployNode} />
      <BusinessCatalogue onDeployNode={handleDeployNode} />

    </div>
  );
}