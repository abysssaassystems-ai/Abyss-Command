"use client";
import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

const businessModules = [
  {
    id: "inquiry-router",
    title: "Inquiry Router Engine",
    desc: "Algorithmic communication router. Scores inbound emails via keyword frequency and deploys tie-breaker logic to team nodes.",
    metric: "Runs 24/7 background",
    status: "Ready to Deploy",
    icon: "📡"
  },
  {
    id: "scheduling-link",
    title: "Scheduling Engine",
    desc: "A streamlined, zero-bloat booking link. Connects instantly with core calendars to lock open appointments.",
    metric: "Dynamic availability",
    status: "Ready to Deploy",
    icon: "📅"
  },
  {
    id: "my-brand",
    title: "Asset Brand Guidelines",
    desc: "A centralized depository for vector logos, marketing color codes, hex layouts, and typography kits.",
    metric: "Static cloud storage",
    status: "Ready to Deploy",
    icon: "📐"
  },
  {
    id: "contract-analyzer",
    title: "Contract Analyzer",
    desc: "An automated document processor that scans contract provisions to flag liability gaps or indemnification traps.",
    metric: "Background analytics",
    status: "Ready to Deploy",
    icon: "🔍"
  },
  {
    id: "employee-training",
    title: "Employee Training Hub",
    desc: "Modular educational tracking framework to dispatch standard operating procedures and test comprehension targets.",
    metric: "Internal tracking",
    status: "Ready to Deploy",
    icon: "🎓"
  },
  {
    id: "client-onboarding",
    title: "Client Onboarding Flow",
    desc: "Automated sequence to compile consumer assets, collect intake signatures, and spin up welcome folders.",
    metric: "Dynamic pipeline",
    status: "Ready to Deploy",
    icon: "🚀"
  },
  {
    id: "survey-creator",
    title: "Survey Creator Engine",
    desc: "Form builder utility to capture client experience insights and compile real-time Net Promoter Score indices.",
    metric: "Analytics array",
    status: "Ready to Deploy",
    icon: "📊"
  },
  {
    id: "competitor-comparison",
    title: "Competitor Intel Tracker",
    desc: "Scrapes market competitor domains to map price adjustments, track feature drops, and evaluate gaps.",
    metric: "Weekly telemetry logs",
    status: "Ready to Deploy",
    icon: "🕵️‍♂️"
  },
  {
    id: "asset-locker-secure",
    title: "Secure Asset Locker",
    desc: "High-encryption locker room to securely hold API keys, master system passwords, and operational credentials.",
    metric: "AES-256 Vault Layer",
    status: "Ready to Deploy",
    icon: "🔒"
  },
  {
    id: "inventory-tracker",
    title: "Inventory Master Ledger",
    desc: "Stock tracking utility that evaluates logistics replenishment milestones and sends automated reorder triggers.",
    metric: "Realtime data sync",
    status: "Ready to Deploy",
    icon: "📦"
  },
  {
    id: "tournament-scheduler",
    title: "Tournament Bracket Generator",
    desc: "An automated scheduling module built to create single, double, or round-robin match elimination trees.",
    metric: "Dynamic pathing",
    status: "Ready to Deploy",
    icon: "🏆"
  },
  {
    id: "link-master",
    title: "Link Matrix Routing",
    desc: "A customizable short-link dispatcher built to track inbound traffic origins and run simple split tests.",
    metric: "Click delta analytics",
    status: "Ready to Deploy",
    icon: "🔗"
  },
  {
    id: "client-portal",
    title: "Asymmetric Client Portal",
    desc: "Dedicated account dashboard for enterprise accounts to monitor deliverables, download invoices, and exchange logs.",
    metric: "Isolated secure node",
    status: "Ready to Deploy",
    icon: "👥"
  },
  {
    id: "business-finance",
    title: "Statement Fluctuation Detector",
    desc: "Accounting integrity utility. Compares month-over-month account records to instantly highlight expenditure leaks and spikes.",
    metric: "30-day delta calculus",
    status: "Ready to Deploy",
    icon: "💰"
  }
];

export default function BusinessCataloguePage(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans antialiased select-none pb-24">
      {/* Global Navigation Layer */}
      <Navbar />

      <section className="max-w-5xl mx-auto px-6 pt-16">
        {/* Category Description Banner */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-blue-600 font-bold mb-1">
            // AVAILABLE INFRASTRUCTURE NODES
          </p>
          <h1 className="text-3xl font-black italic uppercase tracking-tight text-gray-900">
            Business Use <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Catalogue</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1 font-sans">
            Set-and-forget data automation models to slash enterprise overhead.
          </p>
        </div>

        {/* Catalog Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {businessModules.map((node) => (
            /* Multi-color crisp gradient border wrapper frame */
            <div key={node.id} className="p-[1px] bg-gradient-to-br from-purple-600 via-blue-500 to-gray-200 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md group">
              <div className="bg-white rounded-[15px] p-6 h-full flex flex-col justify-between relative overflow-hidden">
                
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-gray-50 rounded border border-gray-200 text-gray-600 font-bold">
                      {node.metric}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-blue-600">
                      • {node.status}
                    </span>
                  </div>

                  {/* Inline Functional Identity Header */}
                  <div className="flex items-start gap-3 mt-1">
                    <span className="text-2xl p-2 bg-gray-50 rounded-xl border border-gray-100 flex-shrink-0">
                      {node.icon}
                    </span>
                    <h3 className="text-base font-black text-gray-900 uppercase italic leading-snug group-hover:text-purple-600 transition-colors pt-1">
                      {node.title}
                    </h3>
                  </div>

                  <p className="text-xs text-gray-500 mt-4 leading-relaxed font-medium">
                    {node.desc}
                  </p>
                </div>

                {/* Pricing & Navigation Trigger Footer */}
                <div className="mt-6 pt-4 border-t border-gray-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-mono font-black text-gray-900">
                      $9.99<span className="text-xs text-gray-400 font-normal">/mo</span>
                    </span>
                    <Link 
                      href="/login"
                      className="text-[10px] uppercase font-bold tracking-wider px-4 py-2 rounded-xl bg-white border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all text-center shadow-sm"
                    >
                      Purchase Module
                    </Link>
                  </div>
                  
                  {/* Prompt Text Indicator */}
                  <span className="text-[9px] font-mono text-gray-400 block text-right uppercase tracking-wider font-bold">
                    ⚠️ Sign in to purchase
                  </span>
                </div>

              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}