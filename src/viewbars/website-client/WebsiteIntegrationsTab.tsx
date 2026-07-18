"use client";
import React, { useState } from 'react';

export default function WebsiteIntegrationsTab(): React.JSX.Element {
  const [activeItem, setActiveItem] = useState<string | null>("stripe");

  return (
    <div className="space-y-6 animate-fadeIn select-none">
      <div className="bg-[#374151] border border-gray-500/40 p-6 rounded-3xl shadow-lg">
        <span className="text-[10px] font-mono font-bold tracking-widest text-[#00F2FE] uppercase block">// ECOSYSTEM HOOKS</span>
        <h2 className="text-xl font-black text-white uppercase italic mt-1">Active Third-Party Integrations</h2>
      </div>

      <div className="space-y-3">
        {/* Stripe Toggle Block */}
        <div className="bg-[#374151] border border-gray-500/30 rounded-2xl overflow-hidden">
          <button 
            type="button" 
            onClick={() => setActiveItem(activeItem === "stripe" ? null : "stripe")}
            className="w-full p-4 flex justify-between items-center font-mono text-xs font-bold text-white text-left focus:outline-none"
          >
            <span className="flex items-center gap-2">💳 Stripe API Gateway Integration</span>
            <span className="text-gray-400 text-[10px]">{activeItem === "stripe" ? "[ CLOSE ]" : "[ VIEW ]"}</span>
          </button>
          {activeItem === "stripe" && (
            <div className="p-4 border-t border-gray-500/20 bg-[#4B5563]/20 text-xs text-gray-300 leading-relaxed font-sans">
              Handles direct customer card checkouts, manages automated recurring software subscription parameters, and routes secure marketplace payouts natively.
            </div>
          )}
        </div>

        {/* HubSpot Toggle Block */}
        <div className="bg-[#374151] border border-gray-500/30 rounded-2xl overflow-hidden">
          <button 
            type="button" 
            onClick={() => setActiveItem(activeItem === "hubspot" ? null : "hubspot")}
            className="w-full p-4 flex justify-between items-center font-mono text-xs font-bold text-white text-left focus:outline-none"
          >
            <span className="flex items-center gap-2">🤝 HubSpot CRM Marketing Synchronizer</span>
            <span className="text-gray-400 text-[10px]">{activeItem === "hubspot" ? "[ CLOSE ]" : "[ VIEW ]"}</span>
          </button>
          {activeItem === "hubspot" && (
            <div className="p-4 border-t border-gray-500/20 bg-[#4B5563]/20 text-xs text-gray-300 leading-relaxed font-sans">
              Automatically drops incoming layout contact form entry data fields straight onto your internal corporate sales team notice tracking pipelines.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}