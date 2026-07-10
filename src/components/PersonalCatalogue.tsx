"use client";

import React from 'react';

const personalModules = [
  {
    id: "health-tracker",
    title: "Health & Sleep Tracker",
    desc: "A hyper-focused nutrition, daily fitness, and sleep quality logger. Zero bloat, instant metrics tracking.",
    metric: "Data resets monthly",
    status: "Ready to Deploy"
  },
  {
    id: "habit-streak",
    title: "Habit Streak Engine",
    desc: "A rolling 30-day psychological commitment tracker. Visualizes recurring routines with automated text nudges.",
    metric: "Evolving matrix",
    status: "Ready to Deploy"
  },
  {
    id: "budget",
    title: "Personal Finance App",
    desc: "A bright, scannable wealth engine with budget thresholds, portfolio views, and predictive 'Can I Buy This?' simulators.",
    metric: "Resets every 30 days",
    status: "Ready to Deploy"
  },
  {
    id: "build-house",
    title: "My Dream House",
    desc: "A spatial visual asset board to map architectures, target renovation costs, and catalog interior blue-prints.",
    metric: "Static storage",
    status: "Ready to Deploy"
  },
  {
    id: "my-journal",
    title: "My Journal",
    desc: "A private plaintext encryption journal box. Clean tracking matrix with semantic mood analytics maps.",
    metric: "Evolving matrix",
    status: "Ready to Deploy"
  },
  {
    id: "my-cookbook",
    title: "My Cookbook",
    desc: "A kitchen management system to archive family recipes, map meal preparation logs, and scale portion sizes dynamically.",
    metric: "Static storage",
    status: "Ready to Deploy"
  },
  {
    id: "my-media",
    title: "My Media",
    desc: "An asset collection tray to rank books, log movie completion checkmarks, and track active watchlists.",
    metric: "Evolving matrix",
    status: "Ready to Deploy"
  },
  {
    id: "shopping-wishlist",
    title: "My Shopping Wishlist",
    desc: "A priority checkout indexer tracking discount price modifications, savings targets, and merchant links.",
    metric: "Evolving matrix",
    status: "Ready to Deploy"
  },
  {
    id: "my-pets",
    title: "My Pets",
    desc: "A health ledger for your animals tracking medication cycles, veterinary records, and dietary timelines.",
    metric: "Evolving matrix",
    status: "Ready to Deploy"
  },
  {
    id: "my-car",
    title: "My Custom Car",
    desc: "Automotive maintenance log for tracking oil degradation intervals, parts installations, and hardware budgets.",
    metric: "Static storage",
    status: "Ready to Deploy"
  },
  {
    id: "my-roommate",
    title: "My Roommate Hub",
    desc: "Shared household chore matrix boards, rent sub-allocations, and collaborative shopping item lists.",
    metric: "Evolving matrix",
    status: "Ready to Deploy"
  },
  {
    id: "link-friend",
    title: "Friend Core Grid",
    desc: "A personal social CRM tracking birthdays, key relationship interactions, and communication intervals.",
    metric: "Evolving matrix",
    status: "Ready to Deploy"
  },
  {
    id: "my-skilltree",
    title: "My Knowledge",
    desc: "A visual capability mapping model to layout customized professional learning targets and milestones.",
    metric: "Resets every 30 days",
    status: "In Pipeline"
  }
];

interface PersonalCatalogueProps {
  onDeployNode: (id: string, title: string) => void;
}

export default function PersonalCatalogue({ onDeployNode }: PersonalCatalogueProps) {
  return (
    <section id="personal" className="max-w-5xl mx-auto px-4 pt-16 pb-8">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.25em] text-[#00F2FE] text-glow font-bold mb-2">// CATEGORY SECTION</p>
        <h2 className="text-4xl font-black italic uppercase tracking-tight text-white">
          Personal Use <span className="text-[#00F2FE]">Catalogue</span>
        </h2>
        <p className="text-sm text-gray-200 mt-2">Lightweight lifestyle nodes to optimize your daily routines.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {personalModules.map((node) => (
          <div key={node.id} className="bg-[#374151] border border-gray-500/40 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between hover:border-gray-400 transition duration-300 group shadow-lg">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono px-2 py-1 bg-[#4B5563] rounded border border-gray-500/30 text-gray-200">
                  {node.metric}
                </span>
                <span className={`text-[10px] uppercase tracking-wider font-bold ${node.status === 'Ready to Deploy' ? 'text-[#00F2FE] text-glow' : 'text-gray-400'}`}>
                  • {node.status}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white uppercase italic group-hover:text-[#00F2FE] transition-colors">
                {node.title}
              </h3>
              <p className="text-xs text-gray-300 mt-3 leading-relaxed">
                {node.desc}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-500/30 flex items-center justify-between">
              <span className="text-lg font-black text-white font-mono">$5<span className="text-xs text-gray-400 font-normal">/mo</span></span>
              <button 
                type="button"
                onClick={() => onDeployNode(node.id, node.title)}
                disabled={node.status !== 'Ready to Deploy'}
                className={`text-xs uppercase font-bold tracking-wider px-4 py-2 rounded transition-all focus:outline-none ${
                  node.status === 'Ready to Deploy' 
                    ? 'bg-transparent border border-[#00F2FE] text-[#00F2FE] hover:bg-[#00F2FE] hover:text-gray-900 shadow-[0_2px_10px_rgba(0,242,254,0.1)]' 
                    : 'bg-transparent border border-gray-500 text-gray-400 cursor-not-allowed'
                }`}
              >
                {node.status === 'Ready to Deploy' ? 'Deploy Node' : 'Locked'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}