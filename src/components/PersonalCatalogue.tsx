"use client";

import React, { useState, useEffect } from "react";
import { 
  Activity, 
  Flame, 
  Wallet, 
  Home, 
  Notebook, 
  Utensils, 
  Clapperboard, 
  ShoppingCart, 
  PawPrint, 
  Wrench, 
  Building2, 
  Users, 
  Brain,
  ShieldCheck,
  Layers
} from "lucide-react";

interface ModuleItem {
  id: string;
  title: string;
  desc: string;
  metric: string;
  status: "Ready to Deploy" | "In Pipeline";
  icon: React.ComponentType<{ className?: string }>;
}

const PERSONAL_MODULES: ModuleItem[] = [
  {
    id: "health-tracker",
    title: "Health & Sleep Tracker",
    desc: "A hyper-focused nutrition, daily fitness, and sleep quality logger. Zero bloat, instant metrics tracking.",
    metric: "Data resets monthly",
    status: "Ready to Deploy",
    icon: Activity
  },
  {
    id: "habit-streak",
    title: "Habit Streak Engine",
    desc: "A rolling 30-day psychological commitment tracker. Visualizes recurring routines with automated text nudges.",
    metric: "Evolving matrix",
    status: "Ready to Deploy",
    icon: Flame
  },
  {
    id: "budget",
    title: "Personal Finance App",
    desc: "A bright, scannable wealth engine with budget thresholds, portfolio views, and predictive 'Can I Buy This?' simulators.",
    metric: "Resets every 30 days",
    status: "Ready to Deploy",
    icon: Wallet
  },
  {
    id: "build-house",
    title: "My Dream House",
    desc: "A spatial visual asset board to map architectures, target renovation costs, and catalog interior blue-prints.",
    metric: "Static storage",
    status: "Ready to Deploy",
    icon: Home
  },
  {
    id: "my-journal",
    title: "My Journal",
    desc: "A private plaintext encryption journal box. Clean tracking matrix with semantic mood analytics maps.",
    metric: "Evolving matrix",
    status: "Ready to Deploy",
    icon: Notebook
  },
  {
    id: "my-cookbook",
    title: "My Cookbook",
    desc: "A kitchen management system to archive family recipes, map meal preparation logs, and scale portion sizes dynamically.",
    metric: "Static storage",
    status: "Ready to Deploy",
    icon: Utensils
  },
  {
    id: "my-media",
    title: "My Media",
    desc: "An asset collection tray to rank books, log movie completion checkmarks, and track active watchlists.",
    metric: "Evolving matrix",
    status: "Ready to Deploy",
    icon: Clapperboard
  },
  {
    id: "shopping-wishlist",
    title: "My Shopping Wishlist",
    desc: "A priority checkout indexer tracking discount price modifications, savings targets, and merchant links.",
    metric: "Evolving matrix",
    status: "Ready to Deploy",
    icon: ShoppingCart
  },
  {
    id: "my-pets",
    title: "My Pets",
    desc: "A health ledger for your animals tracking medication cycles, veterinary records, and dietary timelines.",
    metric: "Evolving matrix",
    status: "Ready to Deploy",
    icon: PawPrint
  },
  {
    id: "my-car",
    title: "My Custom Car",
    desc: "Automotive maintenance log for tracking oil degradation intervals, parts installations, and hardware budgets.",
    metric: "Static storage",
    status: "Ready to Deploy",
    icon: Wrench
  },
  {
    id: "my-roommate",
    title: "My Roommate Hub",
    desc: "Shared household chore matrix boards, rent sub-allocations, and collaborative shopping item lists.",
    metric: "Evolving matrix",
    status: "Ready to Deploy",
    icon: Building2
  },
  {
    id: "link-friend",
    title: "Friend Core Grid",
    desc: "A personal social CRM tracking birthdays, key relationship interactions, and communication intervals.",
    metric: "Evolving matrix",
    status: "Ready to Deploy",
    icon: Users
  },
  {
    id: "my-skilltree",
    title: "My Knowledge",
    desc: "A visual capability mapping model to layout customized professional learning targets and milestones.",
    metric: "Resets every 30 days",
    status: "In Pipeline",
    icon: Brain
  }
];

interface PersonalCatalogueProps {
  onDeployNode: (id: string, title: string) => void;
}

export default function PersonalCatalogue({ onDeployNode }: PersonalCatalogueProps): React.JSX.Element {
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
        console.error("CATALOGUE_AUTH_PARSE_EXCEPTION:", err);
        setTenantEmail("fault_containment_mode");
      }
    } else {
      setTenantEmail("unauthenticated_session");
    }
  }, []);

  return (
    <section id="personal" className="max-w-6xl mx-auto px-4 pt-12 pb-16 select-none">
      {/* Structural Workspace Header Component */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-zinc-100">
        <div className="text-left">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-600 stroke-[2.5]" />
            <p className="text-[10px] uppercase font-mono font-black tracking-widest text-purple-600">
              Deployment Matrix
            </p>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-zinc-900 mt-2">
            Personal Lifestyle Ecosystem
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Isolated cloud infrastructure instances deployed directly inside your workspace context.
          </p>
        </div>

        {/* Real-time Tenant Identity Badge */}
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

      {/* Grid Configuration Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {PERSONAL_MODULES.map((node) => {
          const isAvailable = node.status === "Ready to Deploy";
          const IconComponent = node.icon;

          return (
            <div 
              key={node.id} 
              className={`bg-white border rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 group relative ${
                isAvailable 
                  ? "border-zinc-200 shadow-2xs hover:border-purple-400 hover:shadow-xs" 
                  : "border-zinc-100 bg-zinc-50/50 opacity-60 select-none"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[9px] font-mono px-2 py-0.5 bg-zinc-50 border border-zinc-200 rounded text-zinc-500 font-bold tracking-wide">
                    {node.metric}
                  </span>
                  <span className={`text-[9px] font-mono font-black uppercase tracking-wider ${
                    isAvailable ? "text-purple-600" : "text-zinc-400"
                  }`}>
                    • {node.status}
                  </span>
                </div>

                {/* Identity Icon Grid Segment */}
                <div className="flex items-start gap-3.5 mt-1 text-left">
                  <div className={`p-2.5 rounded-xl border shrink-0 transition-colors ${
                    isAvailable 
                      ? "bg-zinc-50 border-zinc-200 text-zinc-700 group-hover:bg-purple-50 group-hover:border-purple-200 group-hover:text-purple-700" 
                      : "bg-zinc-100 border-zinc-200 text-zinc-400"
                  }`}>
                    <IconComponent className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-zinc-900 tracking-tight transition-colors group-hover:text-purple-700">
                      {node.title}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-2.5 leading-relaxed font-medium">
                      {node.desc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Interaction Panel Block */}
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
                      ? "bg-white border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white active:scale-97" 
                      : "bg-zinc-100 border-zinc-200 text-zinc-400 cursor-not-allowed"
                  }`}
                >
                  {isAvailable ? "Deploy Node" : "Locked"}
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
}