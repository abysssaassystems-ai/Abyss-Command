"use client";
import React from 'react';

export default function ClientRequestsTab(): React.JSX.Element {
  return (
    <div className="space-y-4 animate-fadeIn">
      <span className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider block">// SYSTEM RETAINER PARITY</span>
      <p className="text-xs text-gray-300 font-sans leading-relaxed">
        Adjust infrastructure pricing configurations or apply transaction updates for this client's baseline node allocations below.
      </p>
      <div className="p-4 bg-gray-950/20 border border-gray-500/10 rounded-2xl font-mono text-xs flex justify-between items-center text-gray-300">
        <span>Hosting Node Surcharge:</span>
        <span className="text-[#00F2FE] font-bold">$10.00 / Month</span>
      </div>
    </div>
  );
}