"use client";
import React, { useState } from "react";
import Navbar from "../../components/Navbar";

interface StackMetric {
  title: string;
  desc: string;
  stat: string;
}

const capabilityData: Record<string, { heading: string; metrics: StackMetric[] }> = {
  frontend: {
    heading: "Ultra-Performance Core Interfaces",
    metrics: [
      { title: "Core Web Vitals", desc: "Consistently scoring straight 100s on lighthouse performance.", stat: "99.4%" },
      { title: "Hydration Speed", desc: "Edge-rendered, highly cacheable UI layers.", stat: "<120ms" }
    ]
  },
  backend: {
    heading: "Highly Available Distributed Graph Systems",
    metrics: [
      { title: "Uptime Commitment", desc: "Stateless architecture backed by global edge clusters.", stat: "99.99%" },
      { title: "Throughput Capacity", desc: "Auto-scaling infrastructure with concurrent task workers.", stat: "15M+" }
    ]
  }
};

export default function CustomDevelopment(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<"frontend" | "backend">("frontend");

  // Project Configuration State
  const [involvesHardware, setInvolvesHardware] = useState<boolean>(false);
  const [hardwareCount, setHardwareCount] = useState<number>(0);
  const [apiCount, setApiCount] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(1);
  const [textNotifications, setTextNotifications] = useState<number>(0);
  const [isNotForProfit, setIsNotForProfit] = useState<boolean>(false);

  // Tooltip Explanations State
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const toggleTooltip = (field: string) => {
    setActiveTooltip(activeTooltip === field ? null : field);
  };

  // Base Calculation Configuration Model
  const baseCost = 499;
  const perPageCost = 100;
  const perApiCost = 500;
  const hardwareBaseCost = involvesHardware ? 1200 : 0;
  const perHardwareCost = involvesHardware ? 150 : 0;
  const smsBaseCost = textNotifications * 0.04;

  const rawTotal = 
    baseCost + 
    (pageCount * perPageCost) + 
    (apiCount * perApiCost) + 
    hardwareBaseCost + 
    (hardwareCount * perHardwareCost) + 
    smsBaseCost;

  const finalTotal = isNotForProfit ? rawTotal * 0.8 : rawTotal;

  return (
    <div className="min-h-screen bg-[#4B5563] text-[#F9FAFB] font-sans pt-16 select-none">
      <Navbar />
      
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-12 text-center space-y-6">
        <span className="text-xs font-semibold tracking-widest text-[#00F2FE] text-glow uppercase bg-[#374151]/60 border border-gray-500/40 px-3 py-1 rounded-full">
          Custom Infrastructure Engineering
        </span>
        <h1 className="text-5xl md:text-6xl font-black tracking-tight max-w-3xl mx-auto leading-tight uppercase italic">
          We engineer systems that match your ambitions.
        </h1>
        <p className="text-gray-250 text-base max-w-xl mx-auto">
          Skip generic templates. Use our instant modular blueprints or craft a customized blueprint package engineered to hit exact specifications.
        </p>
      </section>

      {/* Interactive Project Scoping Slider Section */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="bg-[#374151] border border-gray-500/40 rounded-3xl p-6 md:p-10 shadow-2xl grid lg:grid-cols-12 gap-8 relative overflow-hidden">
          
          {/* Left Column: Config Sliders & Inputs */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-white uppercase italic">Project Matrix Scope Builder</h2>
              <p className="text-xs text-gray-300 mt-1">Adjust target operational dimensions to see a customized resource deployment matrix plan.</p>
            </div>

            <hr className="border-gray-500/20" />

            {/* Hardware Toggle */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-bold uppercase tracking-wider text-white">System Deployment Model</label>
                <button 
                  onClick={() => toggleTooltip("hardwareToggle")} 
                  className="text-[#00F2FE] hover:text-white transition text-sm focus:outline-none"
                >
                  ⓘ
                </button>
              </div>

              {activeTooltip === "hardwareToggle" && (
                <div className="p-3 bg-[#4B5563] border border-gray-500/30 rounded-xl text-xs text-gray-200 leading-relaxed max-w-md transition-all">
                  <strong>Web vs Hardware:</strong> Does your digital system connect directly to real, physical objects (like tablets, screens, scan tools, or sorting chips), or is it a platform accessed entirely through a web browser?
                </div>
              )}

              <div className="flex gap-3">
                <button 
                  onClick={() => { setInvolvesHardware(false); setHardwareCount(0); }}
                  className={`flex-1 py-3 border font-bold text-xs uppercase rounded-xl tracking-wider transition-all ${!involvesHardware ? 'bg-[#00B8C4] text-gray-900 border-[#00B8C4]' : 'border-gray-500/40 text-gray-300 hover:border-gray-400'}`}
                >
                  Pure Cloud Web App
                </button>
                <button 
                  onClick={() => setInvolvesHardware(true)}
                  className={`flex-1 py-3 border font-bold text-xs uppercase rounded-xl tracking-wider transition-all ${involvesHardware ? 'bg-[#00B8C4] text-gray-900 border-[#00B8C4]' : 'border-gray-500/40 text-gray-300 hover:border-gray-400'}`}
                >
                  Web + Hardware Integration
                </button>
              </div>
            </div>

            {/* Conditional Hardware Count Slider */}
            {involvesHardware && (
              <div className="space-y-3 bg-[#4B5563]/20 border border-gray-500/20 p-4 rounded-2xl">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-200">Hardware Component Target</label>
                    <button onClick={() => toggleTooltip("hardwareCount")} className="text-[#00F2FE] hover:text-white text-xs">ⓘ</button>
                  </div>
                  <span className="font-mono text-sm font-black text-[#00F2FE] bg-[#374151] px-2.5 py-0.5 rounded border border-gray-500/20">{hardwareCount} Units</span>
                </div>

                {activeTooltip === "hardwareCount" && (
                  <div className="p-3 bg-[#4B5563] border border-gray-500/30 rounded-xl text-xs text-gray-200 leading-relaxed max-w-md">
                    <strong>Hardware Count:</strong> The estimated number of separate computer accessories, scanning items, or visual machines that our software code needs to link with and control simultaneously.
                  </div>
                )}

                <input 
                  type="range" min="0" max="50" step="1" 
                  value={hardwareCount} 
                  onChange={(e) => setHardwareCount(Number(e.target.value))}
                  className="w-full accent-[#00F2FE] h-1 bg-[#4B5563] rounded-lg cursor-pointer"
                />
              </div>
            )}

            {/* Pages Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-200">Screen Layout Capacity</label>
                  <button onClick={() => toggleTooltip("pages")} className="text-[#00F2FE] hover:text-white text-xs">ⓘ</button>
                </div>
                <span className="font-mono text-sm font-black text-[#00F2FE] bg-[#4B5563] px-2.5 py-0.5 rounded border border-gray-500/20">{pageCount} Pages</span>
              </div>

              {activeTooltip === "pages" && (
                <div className="p-3 bg-[#4B5563] border border-gray-500/30 rounded-xl text-xs text-gray-200 leading-relaxed max-w-md">
                  <strong>Screen Layouts:</strong> The total number of individual views or user sections we need to custom design, link, and optimize for your system interface.
                </div>
              )}

              <input 
                type="range" min="1" max="40" step="1" 
                value={pageCount} 
                onChange={(e) => setPageCount(Number(e.target.value))}
                className="w-full accent-[#00F2FE] h-1 bg-[#4B5563] rounded-lg cursor-pointer"
              />
            </div>

            {/* APIs Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-200">API Gateway Handshakes</label>
                  <button onClick={() => toggleTooltip("apis")} className="text-[#00F2FE] hover:text-white text-xs">ⓘ</button>
                </div>
                <span className="font-mono text-sm font-black text-[#00F2FE] bg-[#4B5563] px-2.5 py-0.5 rounded border border-gray-500/20">{apiCount} Hubs</span>
              </div>

              {activeTooltip === "apis" && (
                <div className="p-3 bg-[#4B5563] border border-gray-500/30 rounded-xl text-xs text-gray-200 leading-relaxed max-w-md">
                  <strong>API Hubs:</strong> Digital communication pipes that allow your application to safely share data and talk to separate systems (like Stripe for money, Google Maps, or legacy databases).
                </div>
              )}

              <input 
                type="range" min="0" max="15" step="1" 
                value={apiCount} 
                onChange={(e) => setApiCount(Number(e.target.value))}
                className="w-full accent-[#00F2FE] h-1 bg-[#4B5563] rounded-lg cursor-pointer"
              />
            </div>

            {/* Text Notifications Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-200">SMS Outbound Notifications</label>
                  <button onClick={() => toggleTooltip("sms")} className="text-[#00F2FE] hover:text-white text-xs">ⓘ</button>
                </div>
                <span className="font-mono text-sm font-black text-[#00F2FE] bg-[#4B5563] px-2.5 py-0.5 rounded border border-gray-500/20">{textNotifications.toLocaleString()} /mo</span>
              </div>

              {activeTooltip === "sms" && (
                <div className="p-3 bg-[#4B5563] border border-gray-500/30 rounded-xl text-xs text-gray-200 leading-relaxed max-w-md">
                  <strong>SMS Outbound:</strong> Instant text messages dispatched directly from your app engine to notify your staff or system users when tasks finish.
                </div>
              )}

              <input 
                type="range" min="0" max="5000" step="250" 
                value={textNotifications} 
                onChange={(e) => setTextNotifications(Number(e.target.value))}
                className="w-full accent-[#00F2FE] h-1 bg-[#4B5563] rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Right Column: Live Pricing Overview Panel */}
          <div className="lg:col-span-5 bg-[#4B5563]/40 border border-gray-500/30 p-6 md:p-8 rounded-2xl flex flex-col justify-between">
            <div className="space-y-6">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#00F2FE] uppercase block">// ARCHITECTURE APPRAISAL</span>
              
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider font-mono">Dynamic Plan Overview</h3>
                <div className="text-xs space-y-2 text-gray-200 pt-2">
                  <div className="flex justify-between">
                    <span>Base Framework Shell</span>
                    <span className="font-mono">${baseCost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Layout Profiles ({pageCount})</span>
                    <span className="font-mono">${pageCount * perPageCost}</span>
                  </div>
                  {apiCount > 0 && (
                    <div className="flex justify-between">
                      <span>API Implementations ({apiCount})</span>
                      <span className="font-mono">${apiCount * perApiCost}</span>
                    </div>
                  )}
                  {involvesHardware && (
                    <div className="flex justify-between text-[#00F2FE]">
                      <span>Hardware Subsystem Stack</span>
                      <span className="font-mono">${hardwareBaseCost + (hardwareCount * perHardwareCost)}</span>
                    </div>
                  )}
                  {textNotifications > 0 && (
                    <div className="flex justify-between">
                      <span>Automated SMS Dispatch Nodes</span>
                      <span className="font-mono">${smsBaseCost.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>

              <hr className="border-gray-500/20" />

              {/* Not For Profit Discount Component */}
              <div className="flex items-center justify-between bg-[#374151] p-4 rounded-xl border border-gray-500/20">
                <div>
                  <span className="text-xs font-bold text-white block uppercase tracking-wide">Not-For-Profit Group</span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">Subtracts 20% from total build invoice</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNotForProfit(!isNotForProfit)}
                  className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${isNotForProfit ? 'bg-[#00B8C4]' : 'bg-gray-600'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-gray-900 transition-all duration-300 ${isNotForProfit ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-500/30">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">Project Cost Matrix</span>
                  <span className="text-[10px] text-gray-400 font-mono">+ $10/mo operational service charge</span>
                </div>
                <div className="text-right">
                  {isNotForProfit && <span className="text-xs line-through text-gray-400 block font-mono">${rawTotal.toFixed(2)}</span>}
                  <span className="text-3xl font-black text-[#00F2FE] text-glow font-mono">${finalTotal.toFixed(2)}+</span>
                </div>
              </div>

              <button className="w-full py-4 bg-gradient-to-r from-[#00B8C4] to-[#00F2FE] text-gray-900 font-black text-xs uppercase tracking-widest rounded-xl shadow-lg hover:opacity-95 transition-all focus:outline-none">
                Submit Architecture Scope Plan →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Value Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="flex justify-center border-b border-gray-500/30 mb-12">
          {(["frontend", "backend"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-4 font-bold text-sm uppercase tracking-wider border-b-2 transition-all ${
                activeTab === tab ? "border-[#00F2FE] text-white text-glow" : "border-transparent text-gray-300 hover:text-white"
              }`}
            >
              {tab} Architectures
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-1">
            <h2 className="text-2xl font-bold tracking-tight text-white uppercase italic mb-4">
              {capabilityData[activeTab].heading}
            </h2>
            <p className="text-sm text-gray-200 leading-relaxed">
              We eliminate technical debt from day one by locking down secure configurations, linting, and automated unit test matrices.
            </p>
          </div>

          <div className="md:col-span-2 grid sm:grid-cols-2 gap-6">
            {capabilityData[activeTab].metrics.map((metric, i) => (
              <div key={i} className="bg-[#374151] border border-gray-500/40 p-6 rounded-2xl shadow-lg">
                <div className="text-3xl font-extrabold text-[#00F2FE] text-glow mb-2">{metric.stat}</div>
                <h4 className="font-semibold text-white mb-1 uppercase tracking-wide">{metric.title}</h4>
                <p className="text-xs text-gray-300 leading-relaxed">{metric.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}