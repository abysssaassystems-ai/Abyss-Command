"use client";
import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

const personalModules = [
  {
    id: "health-tracker",
    title: "Health & Sleep Tracker",
    desc: "A hyper-focused nutrition, daily fitness, and sleep quality logger. Zero bloat, instant metrics tracking.",
    metric: "Data resets monthly",
    status: "Ready to Deploy",
    icon: "🍏"
  },
  {
    id: "habit-streak",
    title: "Habit Streak Engine",
    desc: "A rolling 30-day psychological commitment tracker. Visualizes recurring routines with automated text nudges.",
    metric: "Evolving matrix",
    status: "Ready to Deploy",
    icon: "🔥"
  },
  {
    id: "budget",
    title: "Personal Finance App",
    desc: "A bright, scannable wealth engine with budget thresholds, portfolio views, and predictive 'Can I Buy This?' simulators.",
    metric: "Resets every 30 days",
    status: "Ready to Deploy",
    icon: "📊"
  },
  {
    id: "build-house",
    title: "My Dream House",
    desc: "A spatial visual asset board to map architectures, target renovation costs, and catalog interior blue-prints.",
    metric: "Static storage",
    status: "Ready to Deploy",
    icon: "🏡"
  },
  {
    id: "my-journal",
    title: "My Journal",
    desc: "A private plaintext encryption journal box. Clean tracking matrix with semantic mood analytics maps.",
    metric: "Evolving matrix",
    status: "Ready to Deploy",
    icon: "✍️"
  },
  {
    id: "my-cookbook",
    title: "My Cookbook",
    desc: "A kitchen management system to archive family recipes, map meal preparation logs, and scale portion sizes dynamically.",
    metric: "Static storage",
    status: "Ready to Deploy",
    icon: "🍳"
  },
  {
    id: "my-media",
    title: "My Media",
    desc: "An asset collection tray to rank books, log movie completion checkmarks, and track active watchlists.",
    metric: "Evolving matrix",
    status: "Ready to Deploy",
    icon: "🎬"
  },
  {
    id: "shopping-wishlist",
    title: "My Shopping Wishlist",
    desc: "A priority checkout indexer tracking discount price modifications, savings targets, and merchant links.",
    metric: "Evolving matrix",
    status: "Ready to Deploy",
    icon: "🛒"
  },
  {
    id: "my-pets",
    title: "My Pets",
    desc: "A health ledger for your animals tracking medication cycles, veterinary records, and dietary timelines.",
    metric: "Evolving matrix",
    status: "Ready to Deploy",
    icon: "🐾"
  },
  {
    id: "my-car",
    title: "My Custom Car",
    desc: "Automotive maintenance log for tracking oil degradation intervals, parts installations, and hardware budgets.",
    metric: "Static storage",
    status: "Ready to Deploy",
    icon: "🔧"
  },
  {
    id: "my-roommate",
    title: "My Roommate Hub",
    desc: "Shared household chore matrix boards, rent sub-allocations, and collaborative shopping item lists.",
    metric: "Evolving matrix",
    status: "Ready to Deploy",
    icon: "🏢"
  },
  {
    id: "link-friend",
    title: "Friend Core Grid",
    desc: "A personal social CRM tracking birthdays, key relationship interactions, and communication intervals.",
    metric: "Evolving matrix",
    status: "Ready to Deploy",
    icon: "👥"
  },
  {
    id: "my-skilltree",
    title: "My Knowledge",
    desc: "A visual capability mapping model to layout customized professional learning targets and milestones.",
    metric: "Resets every 30 days",
    status: "In Pipeline",
    icon: "🧠"
  }
];

export default function PersonalCataloguePage(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans antialiased select-none pb-24">
      {/* Global Interface Header Menu */}
      <Navbar />

      <section className="max-w-5xl mx-auto px-6 pt-16">
        {/* Module Header Descriptor Title */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-purple-600 font-bold mb-1">
            // AVAILABLE LIFESTYLE SYSTEM NODES
          </p>
          <h1 className="text-3xl font-black italic uppercase tracking-tight text-gray-900">
            Personal Use <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Catalogue</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1 font-sans">
            Lightweight lifestyle nodes to optimize your daily routines and personal operations.
          </p>
        </div>

        {/* Dynamic Items Inventory Matrix Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {personalModules.map((node) => {
            const isAvailable = node.status === 'Ready to Deploy';

            return (
              /* Multi-color crisp gradient border wrapper frame */
              <div 
                key={node.id} 
                className={`p-[1px] bg-gradient-to-br from-gray-200 via-purple-600 to-blue-500 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md group ${
                  !isAvailable ? 'opacity-50' : ''
                }`}
              >
                <div className="bg-white rounded-[15px] p-6 h-full flex flex-col justify-between relative overflow-hidden">
                  
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-gray-50 rounded border border-gray-200 text-gray-600 font-bold">
                        {node.metric}
                      </span>
                      <span className={`text-[10px] uppercase tracking-wider font-bold ${isAvailable ? 'text-purple-600' : 'text-gray-400'}`}>
                        • {node.status}
                      </span>
                    </div>

                    {/* Inline Functional Identity Header */}
                    <div className="flex items-start gap-3 mt-1">
                      <span className="text-2xl p-2 bg-gray-50 rounded-xl border border-gray-100 flex-shrink-0">
                        {node.icon}
                      </span>
                      <h3 className="text-base font-black text-gray-900 uppercase italic leading-snug group-hover:text-blue-600 transition-colors pt-1">
                        {node.title}
                      </h3>
                    </div>

                    <p className="text-xs text-gray-500 mt-4 leading-relaxed font-medium">
                      {node.desc}
                    </p>
                  </div>

                  {/* Pricing Actions Core Layout */}
                  <div className="mt-6 pt-4 border-t border-gray-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-mono font-black text-gray-900">
                        $9.99<span className="text-xs text-gray-400 font-normal">/mo</span>
                      </span>
                      
                      {isAvailable ? (
                        <Link 
                          href="/login"
                          className="text-[10px] uppercase font-bold tracking-wider px-4 py-2 rounded-xl bg-white border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transition-all text-center shadow-sm"
                        >
                          Purchase Module
                        </Link>
                      ) : (
                        <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-400 block text-center cursor-not-allowed">
                          Staged Node
                        </span>
                      )}
                    </div>
                    
                    {/* Prompt Text Indicator */}
                    {isAvailable && (
                      <span className="text-[9px] font-mono text-gray-400 block text-right uppercase tracking-wider font-bold">
                        ⚠️ Sign in to purchase
                      </span>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}