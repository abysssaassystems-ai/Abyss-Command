"use client";
import React, { useState } from "react";
import Navbar from "../../components/Navbar";

interface SystemApp {
  name: string;
  category: "Payments" | "Data" | "CRM";
  hook: string;
}

const appsData: SystemApp[] = [
  { name: "Stripe Connect", category: "Payments", hook: "Enable immediate transactional logic natively." },
  { name: "Paddle Engine", category: "Payments", hook: "Bypass global SaaS tax regulations natively." },
  { name: "Segment.io", category: "Data", hook: "Centralize customer event streams dynamically." },
  { name: "PostHog Core", category: "Data", hook: "Product analytics and session replay pipelines." },
  { name: "Salesforce Cloud", category: "CRM", hook: "Deep sync client data points natively." },
  { name: "HubSpot API", category: "CRM", hook: "Automate inbound lead distribution models instantly." },
];

export default function WebsiteIntegrations(): React.JSX.Element {
  const [filter, setFilter] = useState<"All" | "Payments" | "Data" | "CRM">("All");

  const filteredApps = appsData.filter(app => filter === "All" || app.category === filter);

  return (
    <div className="min-h-screen bg-[#4B5563] text-[#F9FAFB] font-sans pt-16">
      <Navbar />

      <section className="max-w-5xl mx-auto px-6 py-20 text-center space-y-6">
        <span className="text-xs font-bold uppercase tracking-widest text-[#00F2FE] bg-[#374151]/40 border border-gray-500/40 px-3 py-1 rounded-full text-glow">
          Native API Ecosystem Strength
        </span>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase italic">
          Uncompromised stack connectivity.
        </h1>
        <p className="text-gray-200 text-base max-w-xl mx-auto leading-relaxed">
          Our solutions are designed to bind seamlessly with the tools your team relies on daily. No patchy middleware, just bulletproof hooks.
        </p>

        {/* Filter Badges */}
        <div className="flex flex-wrap justify-center gap-2 pt-6">
          {(["All", "Payments", "Data", "CRM"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all focus:outline-none ${
                filter === cat 
                  ? "bg-white text-gray-900 border-white font-black shadow-md" 
                  : "bg-transparent text-gray-200 border-gray-400 hover:border-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Grid Render */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map((app, idx) => (
            <div key={idx} className="p-6 bg-[#374151] border border-gray-500/40 rounded-2xl flex flex-col justify-between shadow-lg hover:border-gray-400 transition-colors">
              <div>
                <span className="text-[10px] font-bold text-[#00F2FE] uppercase tracking-wider bg-[#4B5563] px-2 py-0.5 rounded-md border border-gray-500/30">
                  {app.category}
                </span>
                <h3 className="text-lg font-bold text-white uppercase mt-3 tracking-wide">{app.name}</h3>
                <p className="text-xs text-gray-300 mt-2 leading-relaxed">{app.hook}</p>
              </div>
              <div className="text-xs font-semibold text-[#00F2FE] group cursor-pointer mt-6 flex items-center hover:text-cyan-300">
                Integration Protocol Ready <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}