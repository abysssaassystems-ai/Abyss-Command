"use client";
import React, { useState } from "react";
import Navbar from "../../components/Navbar";

interface PortfolioItem {
  id: string;
  name: string;
  tagline: string;
  tech: string[];
  color: string;
}

const portfolioShowcases: PortfolioItem[] = [
  { id: "saas", name: "Apex Ledger Corp", tagline: "Real-time algorithmic trading pipelines.", tech: ["Next.js", "Rust", "WASM"], color: "from-emerald-500 to-teal-600" },
  { id: "ecom", name: "Veloce Attire", tagline: "Headless content commerce engine scaling globally.", tech: ["GraphQL", "Shopify Plus", "Tailwind"], color: "from-indigo-500 to-violet-600" },
  { id: "crypto", name: "MintGraph Protocol", tagline: "Decentralized node visualizer and dashboard tool.", tech: ["Web3.js", "Three.js", "TypeScript"], color: "from-amber-500 to-orange-600" },
];

export default function SampleSite(): React.JSX.Element {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const current = portfolioShowcases[selectedIdx];

  return (
    <div className="min-h-screen bg-[#4B5563] text-[#F9FAFB] font-sans pt-16">
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-12 gap-12 items-center">
        {/* Pitch Copy & Interactive Selectors */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase text-[#00F2FE] text-glow tracking-widest block mb-2">Production Blueprint Gallery</span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight uppercase italic">Inspect our work in real-time.</h1>
          </div>
          <p className="text-gray-200 text-sm leading-relaxed">
            We don't do static design handoffs. Click through our actual core deployment profiles below to review layout models, UX responsiveness, and tech configurations.
          </p>

          <div className="space-y-3 pt-4">
            {portfolioShowcases.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => setSelectedIdx(idx)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedIdx === idx 
                    ? "bg-[#374151] border-gray-400 shadow-md" 
                    : "border-transparent hover:bg-[#374151]/40"
                }`}
              >
                <h3 className={`font-bold uppercase tracking-wide transition-colors ${selectedIdx === idx ? "text-[#00F2FE]" : "text-white"}`}>
                  {item.name}
                </h3>
                <p className="text-xs text-gray-300 mt-1">{item.tagline}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Display Canvas */}
        <div className="lg:col-span-7 bg-[#374151] border border-gray-500/40 p-4 rounded-3xl shadow-2xl relative group">
          <div className="absolute top-4 left-6 flex space-x-1.5 z-10">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 block" />
          </div>
          
          <div className={`w-full h-[400px] rounded-2xl bg-gradient-to-tr ${current.color} flex flex-col justify-between p-8 relative overflow-hidden transition-all duration-500`}>
            {/* Background geometric blur */}
            <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />

            <div className="relative z-10 self-end bg-gray-900/40 backdrop-blur-md px-3 py-1 rounded-md text-xs font-mono font-semibold text-white tracking-wide border border-white/10">
              Live Environment Preview
            </div>

            <div className="relative z-10 space-y-4">
              <h2 className="text-3xl font-black tracking-tight text-white uppercase italic">{current.name}</h2>
              <p className="text-white/90 text-sm max-w-sm font-medium">{current.tagline}</p>
              
              <div className="flex gap-2 pt-2">
                {current.tech.map((t) => (
                  <span key={t} className="bg-white/10 border border-white/20 px-2.5 py-1 rounded-md text-xs font-semibold text-white">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}