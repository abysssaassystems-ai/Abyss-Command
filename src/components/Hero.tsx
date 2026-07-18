"use client";
import React from 'react';

export default function Hero(): React.JSX.Element {
  return (
    <header className="max-w-5xl mx-auto text-center pt-20 pb-12 px-4 select-none">
      {/* High-tracking sub-heading label */}
      <p className="text-xs uppercase tracking-[0.3em] text-purple-600 font-bold mb-4">
        The Unbundled Micro-SaaS Ecosystem
      </p>
      
      {/* Aggressive italicized display typography */}
      <h1 className="text-5xl md:text-7xl font-black italic tracking-tight text-gray-900 uppercase leading-none">
        Build Your Workflow <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-gray-500">
          One Node At A Time
        </span>
      </h1>

      <p className="mt-8 text-sm md:text-base text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed">
        Stop overpaying for bloated, all-in-one software suites. Access our continuous catalogue of single-feature utility engines for exactly $9.99 a month per module. Purchase more than 9 modules? Good news, our monthly stack regardless of software is capped at $99.99 a month. 
      </p>
    </header>
  );
}