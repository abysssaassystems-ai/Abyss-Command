"use client";

import React, { useState, useEffect } from "react";
import { 
  Radio, 
  Calendar, 
  Ruler, 
  FileSearch, 
  GraduationCap, 
  Rocket, 
  BarChart3, 
  Radar, 
  Lock, 
  Package, 
  Trophy, 
  Link2, 
  Users, 
  Coins,
  ShieldCheck,
  Briefcase
} from "lucide-react";

interface ModuleItem {
  id: string;
  title: string;
  desc: string;
  metric: string;
  status: "Ready to Deploy" | "In Pipeline";
  icon: React.ComponentType<{ className?: string }>;
}

const BUSINESS_MODULES: ModuleItem[] = [
  {
    id: "inquiry-router",
    title: "Inquiry Router Engine",
    desc: "Algorithmic communication router. Scores inbound emails via keyword frequency and deploys tie-breaker logic to team nodes.",
    metric: "Runs 24/7 background",
    status: "Ready to Deploy",
    icon: Radio
  },
  {
    id: "scheduling-link",
    title: "Scheduling Engine",
    desc: "A streamlined, zero-bloat booking link. Connects instantly with core calendars to lock open appointments.",
    metric: "Dynamic availability",
    status: "Ready to Deploy",
    icon: Calendar
  },
  {
    id: "my-brand",
    title: "Asset Brand Guidelines",
    desc: "A centralized depository for vector logos, marketing color codes, hex layouts, and typography kits.",
    metric: "Static cloud storage",
    status: "Ready to Deploy",
    icon: Ruler
  },
  {
    id: "contract-analyzer",
    title: "Contract Analyzer",
    desc: "An automated document processor that scans contract provisions to flag liability gaps or indemnification traps.",
    metric: "Background analytics",
    status: "Ready to Deploy",
    icon: FileSearch
  },
  {
    id: "employee-training",
    title: "Employee Training Hub",
    desc: "Modular educational tracking framework to dispatch standard operating procedures and test comprehension targets.",
    metric: "Internal tracking",
    status: "Ready to Deploy",
    icon: GraduationCap
  },
  {
    id: "client-onboarding",
    title: "Client Onboarding Flow",
    desc: "Automated sequence to compile consumer assets, collect intake signatures, and spin up welcome folders.",
    metric: "Dynamic pipeline",
    status: "Ready to Deploy",
    icon: Rocket
  },
  {
    id: "survey-creator",
    title: "Survey Creator Engine",
    desc: "Form builder utility to capture client experience insights and compile real-time Net Promoter Score indices.",
    metric: "Analytics array",
    status: "Ready to Deploy",
    icon: BarChart3
  },
  {
    id: "competitor-comparison",
    title: "Competitor Intel Tracker",
    desc: "Scrapes market competitor domains to map price adjustments, track feature drops, and evaluate gaps.",
    metric: "Weekly telemetry logs",
    status: "Ready to Deploy",
    icon: Radar
  },
  {
    id: "asset-locker-secure",
    title: "Secure Asset Locker",
    desc: "High-encryption locker room to securely hold API keys, master system passwords, and operational credentials.",
    metric: "AES-256 Vault Layer",
    status: "Ready to Deploy",
    icon: Lock
  },
  {
    id: "inventory-tracker",
    title: "Inventory Master Ledger",
    desc: "Stock tracking utility that evaluates logistics replenishment milestones and sends automated reorder triggers.",
    metric: "Realtime data sync",
    status: "Ready to Deploy",
    icon: Package
  },
  {
    id: "tournament-scheduler",
    title: "Tournament Bracket Generator",
    desc: "An automated scheduling module built to create single, double, or round-robin match elimination trees.",
    metric: "Dynamic pathing",
    status: "Ready to Deploy",
    icon: Trophy
  },
  {
    id: "link-master",
    title: "Link Matrix Routing",
    desc: "A customizable short-link dispatcher built to track inbound traffic origins and run simple split tests.",
    metric: "Click delta analytics",
    status: "Ready to Deploy",
    icon: Link2
  },
  {
    id: "client-portal",
    title: "Asymmetric Client Portal",
    desc: "Dedicated account dashboard for enterprise accounts to monitor deliverables, download invoices, and exchange logs.",
    metric: "Isolated secure node",
    status: "Ready to Deploy",
    icon: Users
  },
  {
    id: "business-finance",
    title: "Statement Fluctuation Detector",
    desc: "Accounting integrity utility. Compares month-over-month account records to instantly highlight expenditure leaks and spikes.",
    metric: "30-day delta calculus",
    status: "Ready to Deploy",
    icon: Coins
  }
];

interface BusinessCatalogueProps {
  onDeployNode: (id: string, title: string) => void;
}

export default function BusinessCatalogue({ onDeployNode }: BusinessCatalogueProps): React.JSX.Element {
  // --- MULTI-TENANT ARCHITECTURE SECURE HANDSHAKE ---
  const [tenantEmail, setTenantEmail] = useState<string>("authenticating...");

  useEffect(() => {
    const session = localStorage.getItem("active_software_user");
    if (session) {
      try {
        const parsed = JSON.parse(session);
        if (parsed?.email) {
          setTenantEmail(parsed.email);
        } else {
          setTenantEmail("anonymous_isolated");
        }
      } catch (err) {
        console.error("BUSINESS_CATALOGUE_AUTH_PARSE_EXCEPTION:", err);
        setTenantEmail("fault_containment_mode");
      }
    } else {
      setTenantEmail("unauthenticated_session");
    }
  }, []);

  return (
    <section id="business" className="max-w-6xl mx-auto px-4 pt-12 pb-16 select-none">
      {/* Structural Corporate Workspace Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-zinc-100">
        <div className="text-left">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-600 stroke-[2.5]" />
            <p className="text-[10px] uppercase font-mono font-black tracking-widest text-blue-600">
              Enterprise Operations
            </p>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-zinc-900 mt-2">
            Business Automation Engines
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Production-grade integration layers engineered to optimize transactional workflow scale.
          </p>
        </div>

        {/* Real-time Tenant Identity Verification Badge */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 flex items-center gap-2 max-w-xs self-start md:self-auto text-left">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
          <div className="min-w-0">
            <p className="text-[8px] font-mono font-black text-zinc-400 uppercase tracking-wider leading-none">
              Deployer Authority
            </p>
            <p className="text-[10px] font-sans font-semibold text-zinc-600 truncate mt-0.5" title={tenantEmail}>
              {tenantEmail}
            </p>
          </div>
        </div>
      </div>

      {/* Grid Layout Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {BUSINESS_MODULES.map((node) => {
          const isAvailable = node.status === "Ready to Deploy";
          const IconComponent = node.icon;

          return (
            <div 
              key={node.id} 
              className={`bg-white border rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 group relative ${
                isAvailable 
                  ? "border-zinc-200 shadow-2xs hover:border-blue-400 hover:shadow-xs" 
                  : "border-zinc-100 bg-zinc-50/50 opacity-60 select-none"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[9px] font-mono px-2 py-0.5 bg-zinc-50 border border-zinc-200 rounded text-zinc-500 font-bold tracking-wide">
                    {node.metric}
                  </span>
                  <span className={`text-[9px] font-mono font-black uppercase tracking-wider ${
                    isAvailable ? "text-blue-600" : "text-zinc-400"
                  }`}>
                    • {node.status}
                  </span>
                </div>

                {/* Vector Graphic Technical Identity Row */}
                <div className="flex items-start gap-3.5 mt-1 text-left">
                  <div className={`p-2.5 rounded-xl border shrink-0 transition-colors ${
                    isAvailable 
                      ? "bg-zinc-50 border-zinc-200 text-zinc-700 group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:text-blue-700" 
                      : "bg-zinc-100 border-zinc-200 text-zinc-400"
                  }`}>
                    <IconComponent className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-zinc-900 tracking-tight transition-colors group-hover:text-blue-700">
                      {node.title}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-2.5 leading-relaxed font-medium">
                      {node.desc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Functional Interaction & Value Base */}
              <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between">
                <div className="flex flex-col text-left">
                  <span className="text-[9px] font-mono font-black text-zinc-400 uppercase tracking-widest leading-none">
                    Subscription
                  </span>
                  <span className="text-sm font-mono font-black text-zinc-900 mt-1">
                    $9.99<span className="text-[10px] text-zinc-400 font-normal font-sans">/mo</span>
                  </span>
                </div>

                <button 
                  type="button"
                  onClick={() => onDeployNode(node.id, node.title)}
                  disabled={!isAvailable}
                  className={`h-11 px-4 rounded-xl text-xs font-mono font-black uppercase tracking-wider transition-all shadow-2xs cursor-pointer touch-manipulation flex items-center justify-center ${
                    isAvailable 
                      ? "bg-white border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white active:scale-97" 
                      : "bg-zinc-100 border-zinc-200 text-zinc-400 cursor-not-allowed"
                  }`}
                >
                  Deploy Node
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
}