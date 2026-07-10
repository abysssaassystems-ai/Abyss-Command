"use client";
import React, { useState } from "react";
import Navbar from "../../components/Navbar";

interface TierPlan {
  title: string;
  price: string;
  consumerType: string;
  features: string[];
  cta: string;
}

const tiers: Record<"startup" | "established" | "growth" | "enterprise", TierPlan> = {
  startup: {
    title: "Startup Package",
    consumerType: "Early-Stage & Informational Assets",
    price: "$799",
    features: [
      "Unlimited Pages (Informational Layouts Only)",
      "Limited Structural Links",
      "Standard Edge Distribution Architecture",
      "Pre-Rendered Core Metadata Layers"
    ],
    cta: "Provision Startup Node"
  },
  established: {
    title: "Established Business Package",
    consumerType: "Corporate & High-Velocity Content",
    price: "$1,999",
    features: [
      "Unlimited Pages Integration",
      "Unlimited Internal & Outbound Structural Links",
      "High-Performance Shell Configurations",
      "Advanced Dynamic Routing Matrices"
    ],
    cta: "Deploy Business Node"
  },
  growth: {
    title: "Growth & Web Services Package",
    consumerType: "Connected Ecosystems & Operational Scaling",
    price: "$2,999+",
    features: [
      "Unlimited Pages & Unlimited Structural Links",
      "Up to 5 Custom API Implementations Built-In",
      "Up to 5 Separate POS Data Sources Linked",
      "Integrated Event Webhook Middleware Pipelines"
    ],
    cta: "Initialize Growth Stack"
  },
  enterprise: {
    title: "Enterprise Online Plan",
    consumerType: "High-Availability Custom Clusters",
    price: "$4,999+",
    features: [
      "Unlimited Pages & Unlimited Structural Links",
      "Up to 10 Advanced API Implementations",
      "Up to 20 Separate POS Data Ingestion Sources",
      "Isolated Failover Orchestration Layers",
      "Dedicated High-Throughput Node Allocation"
    ],
    cta: "Launch Enterprise Cluster"
  }
};

export default function CreateWebsite(): React.JSX.Element {
  const [selectedTier, setSelectedTier] = useState<"startup" | "established" | "growth" | "enterprise">("startup");

  return (
    <div className="min-h-screen bg-[#4B5563] text-[#F9FAFB] font-sans pt-16">
      <Navbar />

      {/* Hero Header */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-[#00F2FE] bg-clip-text text-transparent uppercase italic">
          Zero Configuration Deployment Engine
        </h1>
        <p className="text-gray-250 text-base max-w-xl mx-auto leading-relaxed">
          We’ve systemized premium site engineering. Select the deployment framework tailored directly to your operational scale and initialize your footprint instantly.
        </p>

        {/* 4-Way Switcher Control */}
        <div className="inline-flex flex-wrap lg:flex-nowrap p-1.5 bg-[#374151] border border-gray-500/30 rounded-2xl md:rounded-full mt-4 shadow-inner gap-1 max-w-full justify-center">
          {(["startup", "established", "growth", "enterprise"] as const).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedTier(key)}
              className={`px-5 py-2.5 rounded-xl md:rounded-full font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
                selectedTier === key 
                  ? "bg-[#00B8C4] text-gray-900 shadow-md font-black" 
                  : "text-gray-300 hover:text-white"
              }`}
            >
              {tiers[key].title.split(" ")[0]} Framework
            </button>
          ))}
        </div>
      </section>

      {/* Dynamic Plan Display & Architecture Spec Sheet */}
      <section className="max-w-3xl mx-auto px-6 pb-12">
        <div className="bg-[#374151] border border-gray-500/40 p-8 md:p-10 rounded-3xl shadow-2xl flex flex-col justify-between transition-all duration-300">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#00F2FE] uppercase bg-[#4B5563] px-2.5 py-1 rounded border border-gray-500/20">
                  Target: {tiers[selectedTier].consumerType}
                </span>
                <h3 className="text-2xl font-black tracking-tight text-white uppercase italic mt-3">
                  {tiers[selectedTier].title}
                </h3>
              </div>
              <div className="text-left md:text-right">
                <span className="text-4xl font-black text-[#00F2FE] text-glow block leading-none">
                  {tiers[selectedTier].price}
                </span>
                <span className="text-xs text-gray-400 block mt-1.5">Initial Setup Project Cost</span>
              </div>
            </div>

            <hr className="border-gray-500/30" />

            <div className="space-y-3">
              <p className="text-xs uppercase tracking-wider font-bold text-gray-300 font-mono">// Core Framework Allocations</p>
              <ul className="grid sm:grid-cols-1 gap-3">
                {tiers[selectedTier].features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm text-gray-200 bg-[#4B5563]/30 border border-gray-500/10 px-4 py-3 rounded-xl">
                    <span className="text-[#00F2FE] text-glow mr-3 font-bold">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button className="w-full mt-10 py-4 bg-gradient-to-r from-[#00B8C4] to-[#00F2FE] text-gray-900 font-black text-xs uppercase tracking-widest rounded-xl shadow-lg hover:opacity-95 transition-all focus:outline-none">
            {tiers[selectedTier].cta} →
          </button>
        </div>
      </section>

      {/* Mandatory Engineering Operational Agreements Panel */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <div className="bg-[#374151]/50 border border-gray-500/30 rounded-2xl p-6 shadow-md">
          <h4 className="text-xs font-mono font-bold tracking-widest text-white uppercase mb-4 flex items-center">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00F2FE] animate-pulse mr-2" />
            Standard Architecture Operational SLA
          </h4>
          <div className="grid md:grid-cols-3 gap-4 text-xs tracking-wide">
            <div className="p-3 bg-[#4B5563]/40 border border-gray-500/20 rounded-xl">
              <span className="font-bold text-[#00F2FE] block mb-1">Project Cost</span>
              <p className="text-gray-300 text-[11px]">All frameworks incur an upfront flat engineering project cost based on selected parameters.</p>
            </div>
            <div className="p-3 bg-[#4B5563]/40 border border-gray-500/20 rounded-xl">
              <span className="font-bold text-[#00F2FE] block mb-1">Maintenance Contract</span>
              <p className="text-gray-300 text-[11px]">Continuous devops, edge routing updates, and infrastructure maintenance at exactly $10/mo.</p>
            </div>
            <div className="p-3 bg-[#4B5563]/40 border border-gray-500/20 rounded-xl">
              <span className="font-bold text-[#00F2FE] block mb-1">Hourly Modifiers</span>
              <p className="text-gray-300 text-[11px]">Any customized additions quoted longer than 1 hour default to standard engineering billing of $50/hour.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}