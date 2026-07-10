"use client";

import React, { useState } from "react";
// Fixed: Swapped the import origin footprint from /page to your central /types ledger
import { SupplementStackItem } from "@/app/dashboard/health/types";

interface SupplementsTabProps {
  supplementStack: SupplementStackItem[];
  setSupplementStack: React.Dispatch<React.SetStateAction<SupplementStackItem[]>>;
}

export default function SupplementsTab({ supplementStack, setSupplementStack }: SupplementsTabProps) {
  const [newName, setNewName] = useState("");
  const [newDosage, setNewDosage] = useState("");
  const [newTiming, setNewTiming] = useState<any>("morning");

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
    setNewName("");
    setNewDosage("");
  };

  const toggleCheck = (id: string) => {
    setSupplementStack(prev => prev.map(s => s.id === id ? { ...s, isTaken: !s.isTaken } : s));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#00B8C4] font-extrabold block mb-1">
          // INGEST COMPARTMENT ENGINE
        </span>
        <h1 className="text-3xl font-black tracking-tight text-white uppercase italic">
          Supplements Stack
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Left Side: Addition Entry Drawer */}
        <div className="bg-[#121824] border border-gray-800 rounded-2xl p-5 space-y-4">
          <span className="text-[10px] font-mono font-black text-gray-400 uppercase tracking-widest block">// REGISTRY ACCESS CONFIG</span>
          
          <form onSubmit={handleAddSupplement} className="space-y-3 font-mono text-xs">
            <div>
              <label className="text-[9px] text-gray-500 uppercase block mb-1">Stack Label</label>
              <input type="text" placeholder="e.g., Vitamin D3" value={newName} onChange={e => setNewName(e.target.value)} className="w-full bg-[#0B0F17] border border-gray-800 rounded-xl px-3 py-2 text-white outline-none focus:border-[#00F2FE]" />
            </div>
            <div>
              <label className="text-[9px] text-gray-500 uppercase block mb-1">Dosage Standard</label>
              <input type="text" placeholder="e.g., 5000 IU" value={newDosage} onChange={e => setNewDosage(e.target.value)} className="w-full bg-[#0B0F17] border border-gray-800 rounded-xl px-3 py-2 text-white outline-none focus:border-[#00F2FE]" />
            </div>
            <div>
              <label className="text-[9px] text-gray-500 uppercase block mb-1">Timing Phase</label>
              <select value={newTiming} onChange={e => setNewTiming(e.target.value as any)} className="w-full bg-[#0B0F17] border border-gray-800 rounded-xl px-3 py-2 text-gray-300 outline-none cursor-pointer font-bold">
                <option value="morning">Morning Split</option>
                <option value="noon">Midday Split</option>
                <option value="night">Evening Split</option>
                <option value="pre_workout">Kinetic Windows</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-[#00B8C4] to-[#00F2FE] text-[#0B0F17] font-black uppercase py-2.5 rounded-xl tracking-wider text-[10px]">
              Commit Token
            </button>
          </form>
        </div>

        {/* Right Side: Active Inventory Status Matrix */}
        <div className="md:col-span-2 space-y-3">
          {supplementStack.map(sup => (
            <div 
              key={sup.id}
              onClick={() => toggleCheck(sup.id)}
              className={`p-4 border rounded-2xl flex items-center justify-between cursor-pointer select-none transition-all ${sup.isTaken ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-[#121824] border-gray-800 hover:border-gray-700'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center font-mono text-xs font-black ${sup.isTaken ? 'bg-emerald-500 border-emerald-600 text-white' : 'bg-[#0B0F17] border-gray-700 text-transparent'}`}>✓</div>
                <div>
                  <h4 className={`text-xs font-bold tracking-tight ${sup.isTaken ? 'text-gray-400 line-through' : 'text-white'}`}>{sup.name}</h4>
                  <p className="text-[10px] font-mono text-gray-500 mt-0.5">{sup.dosage} — <span className="text-blue-400 capitalize">{sup.timing.replace('_', ' ')}</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}