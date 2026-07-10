"use client";

import React from 'react';

const businessModules = [
  {
    id: "inquiry-router",
    title: "Inquiry Router Engine",
    desc: "Algorithmic communication router. Scores inbound emails via keyword frequency and deploys tie-breaker logic to team nodes.",
    metric: "Runs 24/7 background",
    status: "Ready to Deploy"
  },
  {
    id: "scheduling-link",
    title: "Scheduling Engine",
    desc: "A streamlined, zero-bloat booking link. Connects instantly with core calendars to lock open appointments.",
    metric: "Dynamic availability",
    status: "Ready to Deploy"
  },
  {
    id: "my-brand",
    title: "Asset Brand Guidelines",
    desc: "A centralized depository for vector logos, marketing color codes, hex layouts, and typography kits.",
    metric: "Static cloud storage",
    status: "Ready to Deploy"
  },
  {
    id: "contract-analyzer",
    title: "Contract Analyzer",
    desc: "An automated document processor that scans contract provisions to flag liability gaps or indemnification traps.",
    metric: "Background analytics",
    status: "Ready to Deploy"
  },
  {
    id: "employee-training",
    title: "Employee Training Hub",
    desc: "Modular educational tracking framework to dispatch standard operating procedures and test comprehension targets.",
    metric: "Internal tracking",
    status: "Ready to Deploy"
  },
  {
    id: "client-onboarding",
    title: "Client Onboarding Flow",
    desc: "Automated sequence to compile consumer assets, collect intake signatures, and spin up welcome folders.",
    metric: "Dynamic pipeline",
    status: "Ready to Deploy"
  },
  {
    id: "survey-creator",
    title: "Survey Creator Engine",
    desc: "Form builder utility to capture client experience insights and compile real-time Net Promoter Score indices.",
    metric: "Analytics array",
    status: "Ready to Deploy"
  },
  {
    id: "competitor-comparison",
    title: "Competitor Intel Tracker",
    desc: "Scrapes market competitor domains to map price adjustments, track feature drops, and evaluate gaps.",
    metric: "Weekly telemetry logs",
    status: "Ready to Deploy"
  },
  {
    id: "asset-locker-secure",
    title: "Secure Asset Locker",
    desc: "High-encryption locker room to securely hold API keys, master system passwords, and operational credentials.",
    metric: "AES-256 Vault Layer",
    status: "Ready to Deploy"
  },
  {
    id: "inventory-tracker",
    title: "Inventory Master Ledger",
    desc: "Stock tracking utility that evaluates logistics replenishment milestones and sends automated reorder triggers.",
    metric: "Realtime data sync",
    status: "Ready to Deploy"
  },
  {
    id: "tournament-scheduler",
    title: "Tournament Bracket Generator",
    desc: "An automated scheduling module built to create single, double, or round-robin match elimination trees.",
    metric: "Dynamic pathing",
    status: "Ready to Deploy"
  },
  {
    id: "link-master",
    title: "Link Matrix Routing",
    desc: "A customizable short-link dispatcher built to track inbound traffic origins and run simple split tests.",
    metric: "Click delta analytics",
    status: "Ready to Deploy"
  },
  {
    id: "client-portal",
    title: "Asymmetric Client Portal",
    desc: "Dedicated account dashboard for enterprise accounts to monitor deliverables, download invoices, and exchange logs.",
    metric: "Isolated secure node",
    status: "Ready to Deploy"
  },
  {
    id: "business-finance",
    title: "Statement Fluctuation Detector",
    desc: "Accounting integrity utility. Compares month-over-month account records to instantly highlight expenditure leaks and spikes.",
    metric: "30-day delta calculus",
    status: "Ready to Deploy"
  }
];

interface BusinessCatalogueProps {
  onDeployNode: (id: string, title: string) => void;
}

export default function BusinessCatalogue({ onDeployNode }: BusinessCatalogueProps) {
  return (
    <section id="business" className="max-w-5xl mx-auto px-4 pt-12 pb-24">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.25em] text-[#00F2FE] text-glow font-bold mb-2">// CATEGORY SECTION</p>
        <h2 className="text-4xl font-black italic uppercase tracking-tight text-white">
          Business Use <span className="text-[#00F2FE]">Catalogue</span>
        </h2>
        <p className="text-sm text-gray-200 mt-2">Set-and-forget data automation models to slash enterprise overhead.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {businessModules.map((node) => (
          <div key={node.id} className="bg-[#374151] border border-gray-500/40 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between hover:border-gray-400 transition duration-300 group shadow-lg">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono px-2 py-1 bg-[#4B5563] rounded border border-gray-500/30 text-gray-200">
                  {node.metric}
                </span>
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#00F2FE] text-glow">
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
                className="text-xs uppercase font-bold tracking-wider px-4 py-2 rounded bg-transparent border border-[#00F2FE] text-[#00F2FE] hover:bg-[#00F2FE] hover:text-gray-900 transition-all focus:outline-none shadow-[0_2px_10px_rgba(0,242,254,0.1)]"
              >
                Deploy Node
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}