"use client";
import React from 'react';

export default function BillingTab(): React.JSX.Element {
  return (
    <div className="space-y-6 animate-fadeIn select-none">
      <div className="bg-[#374151] border border-gray-500/40 p-6 rounded-3xl shadow-lg">
        <span className="text-[10px] font-mono font-bold tracking-widest text-[#00F2FE] uppercase block">// RETENTION ACCOUNTING</span>
        <h2 className="text-xl font-black text-white uppercase italic mt-1">Ledger Statements & Invoices</h2>
      </div>

      <div className="bg-[#374151] border border-[#00F2FE]/20 p-6 rounded-3xl shadow-md space-y-4 relative overflow-hidden">
        <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">✦ Autopay Settlement Matrices</h3>
        <p className="text-xs text-gray-300 leading-relaxed font-sans">
          Review architecture balances, download historical invoice records, and monitor server lifecycle retention parameters automatically.
        </p>
        <div className="p-4 bg-gray-950/30 border border-gray-500/10 rounded-xl font-mono text-xs space-y-2 text-gray-300">
          <div className="flex justify-between border-b border-white/5 pb-1">
            <span>Dynamic Development Balance:</span> 
            <span className="text-white font-bold">$0.00</span>
          </div>
          <div className="flex justify-between">
            <span>Operational Base Retainer:</span> 
            <span className="text-[#00F2FE] font-bold">$10.00 / mo</span>
          </div>
        </div>
      </div>
    </div>
  );
}