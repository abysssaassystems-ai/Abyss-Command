"use client";

import React from "react";
import { TabID } from "./types";

interface HealthSidebarProps {
  activeTab: TabID;
  setActiveTab: (tab: TabID) => void;
}

interface SidebarNavItem {
  id: TabID;
  label: string;
  icon: string;
}

const NAVIGATION_ITEMS: SidebarNavItem[] = [
  { id: "overview", label: "Hub Overview", icon: "📊" },
  { id: "nutrition", label: "Nutrition & Logs", icon: "🥗" },
  { id: "meals", label: "Meals Database", icon: "🍳" },
  { id: "goals", label: "Biometric Goals", icon: "🎯" },
  { id: "workouts", label: "Workout Core", icon: "⚡" },
  { id: "trends", label: "Analytics & Trends", icon: "📈" },
  { id: "supplements", label: "Supplements Stack", icon: "💊" },
];

export default function HealthSidebar({ activeTab, setActiveTab }: HealthSidebarProps) {
  return (
    <aside className="w-64 bg-[#121824] border-r border-gray-800 flex flex-col justify-between hidden md:flex shrink-0 min-h-screen">
      <div className="p-6">
        {/* Core Subsystem branding */}
        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#00F2FE] font-bold mb-2">
            // SUBSYSTEM
          </p>
          <h2 className="text-xl font-black italic uppercase tracking-tight text-white">
            BIO-<span className="text-[#00B8C4]">ENGINE</span>
          </h2>
        </div>

        {/* Dynamic Nav link generation */}
        <nav className="space-y-1.5">
          {NAVIGATION_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-[#0B0F17] text-[#00F2FE] border border-gray-800 shadow-[0_0_15px_rgba(0,242,254,0.04)]"
                    : "text-gray-400 hover:text-white hover:bg-[#0B0F17]/40 border border-transparent"
                }`}
              >
                <span className={`text-sm ${isActive ? "scale-110 text-[#00F2FE]" : "opacity-70"}`}>
                  {item.icon}
                </span>
                <span className="tracking-wide">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Global Network Escape Hatch */}
      <div className="p-4 border-t border-gray-800/60">
        <a 
          href="/dashboard" 
          className="w-full block text-center text-[10px] uppercase tracking-widest font-bold border border-gray-800 bg-[#0B0F17] hover:border-[#00F2FE] text-gray-400 hover:text-[#00F2FE] py-2.5 rounded-xl transition duration-300"
        >
          ← Return to Network
        </a>
      </div>
    </aside>
  );
}