"use client";
import React, { useState } from "react";
import Link from "next/link";
import BudgetSidebar from "@/components/nodes/BudgetSidebar";

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

  const handleRemoveNode = (id: string) => {
    setDeployedNodes(deployedNodes.filter((node) => node.id !== id));
  };

  return (
    <div className="space-y-6 animate-fadeIn select-none">
      
      {/* Title Header Block */}
      <div className="border-b border-gray-100 pb-5">
        <h1 className="text-3xl font-black italic uppercase tracking-tight text-gray-900">
          Active Workspace <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Online</span>
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
                /* Dynamic multi-color gradient border frame container wrapper */
                <div key={node.id} className="p-[1px] bg-gradient-to-br from-purple-600 via-blue-500 to-gray-300 rounded-3xl shadow-md group relative animate-fadeIn transition-all duration-300 hover:shadow-lg">
                  <button 
                    type="button"
                    onClick={() => handleRemoveNode(node.id)}
                    className="absolute top-4 right-4 z-20 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 opacity-0 group-hover:opacity-100 transition-all text-[9px] font-bold font-mono uppercase px-2 py-1 rounded-lg"
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