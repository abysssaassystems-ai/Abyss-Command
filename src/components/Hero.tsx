import React from 'react';

export default function Hero() {
  return (
    <header className="max-w-5xl mx-auto text-center pt-20 pb-12 px-4">
      {/* High-tracking sub-heading label */}
      <p className="text-xs uppercase tracking-[0.3em] text-[#00F2FE] font-bold mb-4">
        The Unbundled Micro-SaaS Ecosystem
      </p>
      
      {/* Aggressive italicized display typography */}
      <h1 className="text-5xl md:text-7xl font-black italic tracking-tight text-white uppercase leading-none">
        Build Your Workflow <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F2FE] to-[#00B8C4]">
          Node By Single Node
        </span>
      </h1>

      <p className="mt-8 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
        Stop overpaying for bloated, all-in-one software suites. Access our continuous catalogue of single-feature utility engines for exactly $5 a month per module. 
      </p>
    </header>
  );
}