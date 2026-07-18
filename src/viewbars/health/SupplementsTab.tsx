"use client";

import React, { useState, useEffect } from "react";
import { SupplementStackItem } from "@/app/dashboard/my-apps/health/types";
import { 
  Pill, 
  Plus,  
  Check, 
  Circle, 
  Trash2, 
  Clock, 
  Sparkles,
  Layers
} from "lucide-react";

interface SupplementsTabProps {
  supplementStack: SupplementStackItem[];
  setSupplementStack: React.Dispatch<React.SetStateAction<SupplementStackItem[]>>;
}

export default function SupplementsTab({ 
  supplementStack, 
  setSupplementStack 
}: SupplementsTabProps): React.JSX.Element {
  // --- MULTI-TENANT ARCHITECTURE SECURE HANDSHAKE ---
  const [tenantEmail, setTenantEmail] = useState<string>("");
  const [newName, setNewName] = useState("");
  const [newDosage, setNewDosage] = useState("");
  const [newTiming, setNewTiming] = useState<"morning" | "noon" | "night" | "pre_workout">("morning");

  // Securely resolve active software partition credentials
  useEffect(() => {
    const session = localStorage.getItem("active_software_user");
    if (session) {
      try {
        const parsed = JSON.parse(session);
        if (parsed?.email) {
          setTenantEmail(parsed.email);
        }
      } catch (err) {
        console.error("SUPPLEMENTS_AUTH_HYDRATION_EXCEPTION:", err);
      }
    }
  }, []);

  const handleAddSupplement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newItem: SupplementStackItem = {
      id: `sup_custom_${Date.now()}`,
      name: newName.trim(),
      dosage: newDosage.trim() || "1 Serv",
      timing: newTiming,
      isTaken: false
    };

    setSupplementStack([...supplementStack, newItem]);
    
    // Clear transient component allocation buffers
    setNewName("");
    setNewDosage("");
    setNewTiming("morning");
  };

  const toggleCheck = (id: string) => {
    setSupplementStack(prev => prev.map(s => s.id === id ? { ...s, isTaken: !s.isTaken } : s));
  };

  const handleDeleteSupplement = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Block element click event bubbles from triggering toggle checks
    setSupplementStack(prev => prev.filter(s => s.id !== id));
  };

  // Helper utility to render stylized high-contrast context timing nodes
  const getTimingBadgeStyles = (timing: string) => {
    switch(timing) {
      case "morning": return "bg-blue-50 text-blue-700 border-blue-100";
      case "noon": return "bg-amber-50 text-amber-700 border-amber-100";
      case "night": return "bg-purple-50 text-purple-700 border-purple-100";
      case "pre_workout": return "bg-rose-50 text-rose-700 border-rose-100";
      default: return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  return (
    <div className="space-y-6 max-w-[1100px] mx-auto pb-12 animate-fadeIn text-gray-800 select-none px-1">
      
      {/* 1. ARCHITECTURAL LIGHT THEMED CONTROL HEADER */}
      <div className="border-b border-gray-200 pb-5">
        <span className="text-[10px] bg-purple-50 border border-purple-100 text-purple-600 font-mono font-black px-2.5 py-1 rounded-md tracking-wider uppercase">
          Ingest Compartment Engine
        </span>
        <h1 className="text-2xl font-black tracking-tight text-gray-900 mt-2 flex items-center gap-2">
          <Pill className="w-5 h-5 text-purple-600" /> Micronutrient Stack Console
        </h1>
        <p className="text-xs text-gray-400 font-medium mt-1">
          Configure clinical supplement compounds, scheduled nutrient timing routines, and target daily dosing records under active tenant profiles.
        </p>
      </div>

      {/* 2. MANAGEMENT LAYOUT SECTION FLEX SPLIT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* LEFT COMPONENT: STACK ENTRY CONFIGURATION DRAWER */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-xs">
          <span className="text-[9px] font-mono font-black text-gray-400 uppercase tracking-widest block">// Token Registry Provisioning</span>
          
          <form onSubmit={handleAddSupplement} className="space-y-3 font-mono text-xs">
            <div>
              <label className="text-[9px] font-black text-gray-400 uppercase block mb-1">Compound Name</label>
              <input 
                type="text" 
                required
                placeholder="e.g., Vitamin D3, CoQ10" 
                value={newName} 
                onChange={e => setNewName(e.target.value)} 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 font-sans font-semibold text-gray-800 placeholder-gray-300 outline-none focus:border-purple-500 text-base sm:text-xs transition-colors" 
              />
            </div>
            
            <div>
              <label className="text-[9px] font-black text-gray-400 uppercase block mb-1">Dosage Allocation</label>
              <input 
                type="text" 
                placeholder="e.g., 5000 IU, 200mg" 
                value={newDosage} 
                onChange={e => setNewDosage(e.target.value)} 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 font-sans font-semibold text-gray-800 placeholder-gray-300 outline-none focus:border-purple-500 text-base sm:text-xs transition-colors" 
              />
            </div>
            
            <div>
              <label className="text-[9px] font-black text-gray-400 uppercase block mb-1">Chronological Execution Window</label>
              <div className="relative flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3.5 focus-within:border-purple-500 transition-colors">
                <Clock className="w-3.5 h-3.5 text-gray-400 mr-2 shrink-0 stroke-[2.5]" />
                <select 
                  value={newTiming} 
                  onChange={e => setNewTiming(e.target.value as any)} 
                  className="w-full bg-transparent py-2.5 text-gray-800 outline-none cursor-pointer font-black uppercase tracking-wider text-[11px]"
                >
                  <option value="morning">Morning Split Sequence</option>
                  <option value="noon">Midday Split Sequence</option>
                  <option value="night">Evening Sleep Split</option>
                  <option value="pre_workout">Kinetic Activity Windows</option>
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-mono font-black uppercase py-3 rounded-xl tracking-wider text-[10px] mt-4 shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" /> Append Stack Matrix Token
            </button>
          </form>
        </div>

        {/* RIGHT COMPONENT: ACTIVE TRANSVERSE INVENTORY DISCOVERY LEDGER */}
        <div className="lg:col-span-2 space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
          {supplementStack.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 border-dashed text-center py-16 rounded-2xl text-xs text-gray-400 font-mono font-bold uppercase tracking-wider px-4">
              // [ DISCOVERY_MATRIX_VACANT: No micronutrient elements appended to active profile context ]
            </div>
          ) : (
            supplementStack.map(sup => (
              <div 
                key={sup.id}
                onClick={() => toggleCheck(sup.id)}
                className={`p-4 border rounded-xl flex items-center justify-between cursor-pointer shadow-xs transition-all group ${
                  sup.isTaken 
                    ? 'bg-gray-50/70 border-gray-200 opacity-60' 
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  
                  {/* Verified hardware scale component satisfying touch standard parameters */}
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all shrink-0 ${
                    sup.isTaken 
                      ? 'bg-purple-600 border-purple-700 text-white' 
                      : 'bg-gray-50 border-gray-200 text-transparent group-hover:border-gray-300'
                  }`}>
                    <Check className={`w-4 h-4 stroke-[3] ${sup.isTaken ? "block" : "opacity-0 group-hover:opacity-100 group-hover:text-gray-300"}`} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className={`text-xs sm:text-sm font-black tracking-tight truncate uppercase font-mono ${
                      sup.isTaken ? 'text-gray-400 line-through' : 'text-gray-900'
                    }`}>
                      {sup.name}
                    </h4>
                    
                    <div className="flex flex-wrap items-center gap-2 mt-1.5 font-mono text-[9px] font-bold uppercase tracking-wider select-none">
                      <span className="text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                        Volumetric Core: <strong className="text-gray-700 font-black">{sup.dosage}</strong>
                      </span>
                      <span className={`px-2 py-0.5 rounded border ${getTimingBadgeStyles(sup.timing)}`}>
                        Phase: {sup.timing.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Secure extraction execution module tool trigger */}
                <button 
                  type="button"
                  onClick={(e) => handleDeleteSupplement(sup.id, e)}
                  className="text-gray-300 hover:text-rose-600 border border-transparent hover:border-gray-100 w-11 h-11 rounded-xl flex items-center justify-center cursor-pointer transition-colors shrink-0"
                  title="Purge compound configuration row"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}