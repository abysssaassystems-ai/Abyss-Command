"use client";
import React, { useState } from "react";
import Navbar from "../../components/Navbar";

interface CapabilityItem {
  id: string;
  name: string;
  summary: string;
  description: string;
  color: string;
  features: string[];
  mockType: 
    | "graphics" | "wizard" | "online-pos" | "hardware-pos" | "tours" 
    | "scheduling" | "updates" | "sms" | "portals" | "billing" 
    | "lead-routing" | "multi-location" | "marketing-roi" | "recruiting";
}

const capabilityShowcases: CapabilityItem[] = [
  {
    id: "portals",
    name: "Secure Client Dashboards",
    summary: "Private user profiles, statements, and file systems.",
    description: "Eliminate repetitive customer support calls. Give your clients secure, password-protected profile areas where they can download invoices, manage contracts, and track ongoing account files completely on their own.",
    color: "from-cyan-600 via-blue-600 to-indigo-700",
    features: ["Encrypted user login boundaries", "Custom profile document storage nodes", "Self-service client support tracking networks"],
    mockType: "portals"
  },
  {
    id: "billing",
    name: "Automated Billing Hubs",
    summary: "Self-managing subscription updates and card retries.",
    description: "Keep cash flow predictable. Build automatic credit card expiration reminders, recurring product billing cycles, and automated failed payment collection routines straight into your app engine.",
    color: "from-emerald-500 via-teal-600 to-cyan-600",
    features: ["Automatic stripe dunning mechanics", "Instant client invoice downloads", "One-click layout plan transitions"],
    mockType: "billing"
  },
  {
    id: "lead-routing",
    name: "Smart CRM Lead Routers",
    summary: "Instant value assessment and sales desk assignment.",
    description: "Stop letting valuable inbound inquiries turn cold. Our ingestion systems automatically evaluate form responses, grade estimated project value, and route high-tier leads to your senior sales reps instantly.",
    color: "from-violet-600 via-purple-600 to-pink-600",
    features: ["Custom algorithmic score modifiers", "Instant phone text routing alerts", "Zero lead data loss fallback queues"],
    mockType: "lead-routing"
  },
  {
    id: "multi-location",
    name: "Multi-Store Headquarters",
    summary: "Universal control layouts across multiple physical chains.",
    description: "Perfect for growing brands. Update restaurant menus, operating hours, holiday messages, or seasonal product availability across 50 locations simultaneously with one central entry field click.",
    color: "from-amber-500 via-orange-600 to-red-600",
    features: ["Universal single-source database links", "Individual branch manager access roles", "Instant regional geolocation filtering"],
    mockType: "multi-location"
  },
  {
    id: "marketing-roi",
    name: "Privacy-First ROI Trackers",
    summary: "Server-side marketing logs that bypass browser ad-blockers.",
    description: "Stop spending money blindly on ads. By shifting your analytics trackers from the browser straight to your web server, you bypass ad-blockers to see exactly which marketing campaigns drive true revenue.",
    color: "from-fuchsia-600 to-rose-700",
    features: ["Apple iOS 14+ ad tracking workaround", "100% cookie-free compliance layers", "Direct marketing ad platform syncing"],
    mockType: "marketing-roi"
  },
  {
    id: "recruiting",
    name: "Custom Recruitment Portals",
    summary: "Ditch expensive hiring software with in-house applicant engines.",
    description: "Save thousands on costly third-party recruiting apps. Collect job applications, parse incoming PDF resumes, and let your hiring managers submit interview evaluation notes on your own private domain.",
    color: "from-slate-700 via-stone-600 to-zinc-800",
    features: ["Secure employee review layouts", "Automated email interview booking", "Drag-and-drop hiring status pipelines"],
    mockType: "recruiting"
  },
  {
    id: "graphics",
    name: "Interactive Graphics",
    summary: "Engaging visual data maps and 3D web elements.",
    description: "Move beyond boring flat photos. We build charts, maps, and products that animate smoothly as users scroll, hover, or click, making your site stand out from competitors.",
    color: "from-indigo-500 via-purple-500 to-pink-500",
    features: ["Sub-millisecond chart load times", "Smooth mouse-hover effect loops", "Mobile-optimized finger controls"],
    mockType: "graphics"
  },
  {
    id: "wizard",
    name: "Interactive Wizards",
    summary: "Step-by-step customer onboarding question steps.",
    description: "Stop scaring customers away with massive forms. We split complex customer onboarding questionnaires or custom order processes into easy, bite-sized click paths.",
    color: "from-cyan-500 to-blue-600",
    features: ["Dynamic step verification blocks", "Live save-progress history nodes", "Instant data sync to admin side panels"],
    mockType: "wizard"
  },
  {
    id: "online-pos",
    name: "Dynamic Online Point of Sale",
    summary: "Instant web checkouts and subscription engines.",
    description: "A fast online shopping cart framework built for immediate payment handshakes. Process credit cards, set up ongoing subscriptions, and distribute platform payouts safely.",
    color: "from-emerald-500 to-teal-600",
    features: ["One-click modern card validation setups", "Transnational marketplace splitting networks", "Auto international sales tax configuration"],
    mockType: "online-pos"
  },
  {
    id: "hardware-pos",
    name: "Online to Hardware POS Link",
    summary: "Connecting web stock directly with store cash registers.",
    description: "Link your physical brick-and-mortar checkout hardware directly with your website. When an item is bought counter-side, your online inventory count updates automatically.",
    color: "from-amber-500 to-orange-600",
    features: ["Real-time counter register sync hooks", "Multi-warehouse automatic distribution arrays", "Onsite barcode scanner data ingestion ready"],
    mockType: "hardware-pos"
  },
  {
    id: "tours",
    name: "Virtual Online Tours",
    summary: "Immersive 360-degree digital interior walkthroughs.",
    description: "Let digital visitors explore physical properties, venues, or real estate listings directly inside their browser window with no app downloads required.",
    color: "from-fuchsia-600 to-pink-700",
    features: ["Hardware accelerated 360 view grids", "Hotspot metadata popover injection labels", "High fidelity mobile rendering pipelines"],
    mockType: "tours"
  },
  {
    id: "scheduling",
    name: "Smart Scheduling Engines",
    summary: "Real-time calendar booking and staff routing grids.",
    description: "Clients can check real-time availability, select services, and secure appointments directly on your site without you picking up the phone.",
    color: "from-violet-600 to-indigo-700",
    features: ["Automatic customer calendar sync updates", "Conflict-free worker route map matrices", "Real-time reservation deposit processing"],
    mockType: "scheduling"
  },
  {
    id: "updates",
    name: "Automated Content Updates",
    summary: "Self-managing web systems requiring zero code.",
    description: "Connect your front page to easy-to-use editor panels. Change text, update inventory profiles, or upload project photos instantly without editing lines of code.",
    color: "from-blue-600 to-cyan-600",
    features: ["Instant cloud image layout formatting", "Multi-tenant revision history restore points", "One-click layout publishing nodes"],
    mockType: "updates"
  },
  {
    id: "sms",
    name: "Automated SMS Alerts",
    summary: "Instant text message dispatch notification engines.",
    description: "Keep employees and patrons updated by text. Send instant transactional receipts, dispatch notifications, or account change confirmations instantly.",
    color: "from-rose-500 to-red-600",
    features: ["Worldwide rapid delivery carriers", "Dynamic form field message templates", "Opt-out list tracking compliance nodes"],
    mockType: "sms"
  }
];

export default function SampleSite(): React.JSX.Element {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const current = capabilityShowcases[selectedIdx];

  return (
    <div className="min-h-screen bg-[#4B5563] text-[#F9FAFB] font-sans pt-16 select-none">
      <Navbar />

      {/* Main Core Showcase Header */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-6 text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase italic">
          View all aspects of what we can add to your new custom made website.
        </h1>
        <p className="text-[#00F2FE] text-xs font-mono font-bold tracking-widest uppercase text-glow bg-[#374151]/50 border border-gray-500/30 inline-block px-4 py-2 rounded-full">
          // These scratch the surface of our full capabilities
        </p>
      </section>

      {/* Interactive Architecture Viewport Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-24 grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column Controls Menu */}
        <div className="lg:col-span-5 space-y-2 max-h-[660px] overflow-y-auto pr-2 custom-scrollbar">
          {capabilityShowcases.map((item, idx) => {
            const isSelected = selectedIdx === idx;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedIdx(idx)}
                className={`w-full text-left p-4 rounded-2xl border text-xs tracking-wide transition-all duration-200 flex items-center justify-between ${
                  isSelected 
                    ? "bg-[#374151] border-[#00F2FE]/50 shadow-lg" 
                    : "border-gray-500/10 hover:bg-[#374151]/30 hover:border-gray-500/30"
                }`}
              >
                <div>
                  <h3 className={`font-black uppercase font-mono ${isSelected ? "text-[#00F2FE] text-glow" : "text-white"}`}>
                    {item.name}
                  </h3>
                  <p className="text-gray-300 font-sans text-[11px] mt-0.5">{item.summary}</p>
                </div>
                <span className={`font-mono text-[10px] ${isSelected ? "text-[#00F2FE]" : "text-gray-500"}`}>
                  {isSelected ? "[ ACTIVE ]" : "SELECT"}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Column Canvas Matrix */}
        <div className="lg:col-span-7 bg-[#374151] border border-gray-500/40 p-5 rounded-3xl shadow-2xl space-y-6">
          
          {/* Top Window Decorative Accents */}
          <div className="flex items-center justify-between border-b border-gray-500/20 pb-3">
            <div className="flex space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 block" />
            </div>
            <span className="text-[9px] font-mono font-bold tracking-widest text-gray-400 uppercase bg-[#4B5563]/40 border border-gray-500/20 px-2 py-0.5 rounded">
              SYSTEM SCREEN CAPABILITY PREVIEW
            </span>
          </div>

          {/* Dynamic Graphic View Box */}
          <div className={`w-full h-[280px] rounded-2xl bg-gradient-to-tr ${current.color} flex items-center justify-center p-6 relative overflow-hidden transition-all duration-500 shadow-inner`}>
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
            
            {/* Contextual Visual Layout Generators */}
            <div className="relative z-10 w-full max-w-sm bg-gray-950/80 border border-white/10 p-5 rounded-xl font-mono text-[10px] text-gray-300 space-y-3 shadow-2xl">
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-white font-bold uppercase">✦ {current.name}</span>
                <span className="text-[#00F2FE] text-xs">● Live</span>
              </div>

              {current.mockType === "portals" && (
                <div className="space-y-2 py-1">
                  <div className="bg-white/5 p-3 rounded border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-white font-bold block">Welcome Back, Nexus Inc.</span>
                      <span className="text-gray-400 text-[8px]">Account status: Verified Enterprise Partner</span>
                    </div>
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  </div>
                  <div className="p-2.5 bg-[#00F2FE]/10 border border-[#00F2FE]/30 text-[#00F2FE] rounded text-center font-bold text-[9px] cursor-pointer">
                    📥 DOWNLOAD LATEST STIPULATED QUOTE REPORT (PDF)
                  </div>
                </div>
              )}

              {current.mockType === "billing" && (
                <div className="space-y-2 py-1">
                  <div className="flex justify-between text-gray-400 border-b border-white/5 pb-1">
                    <span>Invoice #INV-204</span>
                    <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 rounded">PAID</span>
                  </div>
                  <div className="flex justify-between text-gray-400 border-b border-white/5 pb-1">
                    <span>Next Autopay Cycle</span>
                    <span className="text-white font-bold">Aug 01, 2026</span>
                  </div>
                  <p className="text-[8px] text-gray-400 text-center italic mt-1">✓ Automated retry logic loop running smoothly</p>
                </div>
              )}

              {current.mockType === "lead-routing" && (
                <div className="space-y-2 py-1">
                  <div className="p-2 bg-white/5 border border-white/10 rounded flex justify-between items-center text-[9px]">
                    <span className="text-white font-bold">Inbound: Deal Score 94/100</span>
                    <span className="text-[#00F2FE] font-bold">$4,999+ Build</span>
                  </div>
                  <div className="p-2 bg-purple-500/10 border border-purple-500/30 text-purple-300 rounded text-center text-[9px]">
                    🔄 Automatically Transferred to Senior Director Account Desk
                  </div>
                </div>
              )}

              {current.mockType === "multi-location" && (
                <div className="space-y-2 py-1">
                  <span className="text-gray-400 block text-[8px]">GLOBAL LOCATION PRICE CONTROL MATRIX</span>
                  <div className="grid grid-cols-2 gap-2 text-[8px]">
                    <div className="p-1.5 bg-white/5 border border-white/10 rounded">📍 Downtown: updated ($799)</div>
                    <div className="p-1.5 bg-white/5 border border-white/10 rounded">📍 Westside: updated ($799)</div>
                  </div>
                  <span className="text-emerald-400 block text-center text-[8px] pt-1 animate-pulse">✓ Changes broadcasted globally to 14 nodes</span>
                </div>
              )}

              {current.mockType === "marketing-roi" && (
                <div className="space-y-2 py-1 font-sans">
                  <div className="grid grid-cols-3 gap-2 text-center text-mono">
                    <div className="bg-white/5 p-2 rounded border border-white/10">
                      <span className="text-gray-400 block text-[8px] font-mono uppercase">Google Ads</span>
                      <span className="text-[#00F2FE] text-xs font-bold font-mono">$1.2k In</span>
                    </div>
                    <div className="bg-white/5 p-2 rounded border border-white/10">
                      <span className="text-gray-400 block text-[8px] font-mono uppercase">Organic</span>
                      <span className="text-[#00F2FE] text-xs font-bold font-mono">$3.4k In</span>
                    </div>
                    <div className="bg-white/5 p-2 rounded border border-white/10">
                      <span className="text-gray-400 block text-[8px] font-mono uppercase">Ad Blocked</span>
                      <span className="text-emerald-400 text-xs font-bold font-mono">Recovered</span>
                    </div>
                  </div>
                </div>
              )}

              {current.mockType === "recruiting" && (
                <div className="space-y-2 py-1">
                  <div className="flex justify-between items-center bg-white/5 p-2 rounded border border-white/10 text-[9px]">
                    <div>
                      <span className="text-white font-bold block">Candidate: James B.</span>
                      <span className="text-gray-400 text-[8px]">Role: Systems Architect</span>
                    </div>
                    <span className="px-2 py-0.5 bg-cyan-500/20 text-[#00F2FE] border border-[#00F2FE]/20 rounded font-bold">Score: 96</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-center text-[8px]">
                    <span className="p-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded">Accept Profile</span>
                    <span className="p-1 bg-white/5 border border-white/10 rounded text-gray-400">File Resume</span>
                  </div>
                </div>
              )}

              {current.mockType === "graphics" && (
                <div className="space-y-2 py-2">
                  <div className="h-2 w-3/4 bg-white/20 rounded" />
                  <div className="flex items-end gap-1.5 h-20 pt-4 justify-center">
                    <div className="w-6 h-8 bg-[#00F2FE] rounded-t animate-pulse" />
                    <div className="w-6 h-16 bg-purple-500 rounded-t" />
                    <div className="w-6 h-12 bg-pink-500 rounded-t animate-pulse" />
                    <div className="w-6 h-20 bg-white rounded-t" />
                  </div>
                </div>
              )}

              {current.mockType === "wizard" && (
                <div className="space-y-3 py-1">
                  <span className="text-gray-400 block">Step 2 of 4: Select Tier Parameters</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 border border-[#00F2FE] bg-[#00F2FE]/10 rounded text-center text-[#00F2FE] font-bold">Cloud App</div>
                    <div className="p-2 border border-white/10 rounded text-center opacity-40">Hardware Link</div>
                  </div>
                  <div className="h-7 w-full bg-white text-gray-950 rounded flex items-center justify-center font-bold text-[9px]">CONTINUE →</div>
                </div>
              )}

              {current.mockType === "online-pos" && (
                <div className="space-y-2 py-1">
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span>Base Framework Shell</span>
                    <span className="text-white font-bold">$499.00</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span>Processing Gateway Surcharge</span>
                    <span className="text-white font-bold">$0.00</span>
                  </div>
                  <div className="flex justify-between text-[#00F2FE] font-bold pt-1">
                    <span>TOTAL Builds Cost</span>
                    <span>$499.00</span>
                  </div>
                </div>
              )}

              {current.mockType === "hardware-pos" && (
                <div className="space-y-2 py-1 text-center">
                  <span className="text-gray-400 block text-[9px]">SCANNER HOOK HANDSHAKE DETECTED</span>
                  <div className="p-3 bg-white/5 border border-white/10 rounded font-bold text-white text-xs tracking-wider uppercase animate-pulse">
                    [ 📟 Cash Register Synced ]
                  </div>
                  <span className="text-gray-400 text-[8px] block">Web Parity Auto-Locked</span>
                </div>
              )}

              {current.mockType === "tours" && (
                <div className="space-y-2 py-2 text-center relative">
                  <div className="border border-white/20 px-4 py-6 rounded bg-black/40 text-white font-bold tracking-widest uppercase">
                    🔄 360° Viewing Cluster Active
                  </div>
                  <span className="text-gray-400 text-[8px] block mt-1">Drag mouse inside pane bounds to rotate spatial grid</span>
                </div>
              )}

              {current.mockType === "scheduling" && (
                <div className="space-y-2 py-1">
                  <span className="text-gray-400 block text-[9px]">SELECT AVAILABLE DEPLOYMENT TIME</span>
                  <div className="grid grid-cols-3 gap-1.5 text-center text-[9px]">
                    <span className="p-1.5 bg-[#00F2FE] text-gray-950 font-bold rounded">09:00 AM</span>
                    <span className="p-1.5 bg-white/10 border border-white/10 rounded">11:30 AM</span>
                    <span className="p-1.5 bg-white/10 border border-white/10 rounded">03:00 PM</span>
                  </div>
                </div>
              )}

              {current.mockType === "updates" && (
                <div className="space-y-2 py-1">
                  <span className="text-gray-400 block text-[9px]">CENTRAL WORKSPACE CONTROL PANEL</span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[9px]">TEXT DATA EDITED</span>
                    <span className="text-gray-400 text-[8px]">Saved 2 seconds ago</span>
                  </div>
                </div>
              )}

              {current.mockType === "sms" && (
                <div className="space-y-2 py-1 bg-black/40 border border-white/10 p-3 rounded-lg text-left">
                  <span className="text-white font-bold text-[9px] block">💬 SYSTEM MESSAGE NOTICE</span>
                  <p className="text-gray-300 text-[9px] leading-tight mt-1">"Hi Alex, your custom website order quote ($4,610.00) has been successfully verified! Tracking ID: std-98332"</p>
                </div>
              )}

            </div>
          </div>

          {/* Descriptive Information Block Layout */}
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-gray-400 block">
                // FEATURE OVERVIEW
              </span>
              <h2 className="text-xl font-black text-white uppercase italic tracking-wide">
                {current.name} Integration
              </h2>
              <p className="text-xs md:text-sm text-gray-200 leading-relaxed font-sans pt-1">
                {current.description}
              </p>
            </div>

            <hr className="border-gray-500/20" />

            {/* Core Capability Checklist Sub-List */}
            <div className="space-y-2">
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#00F2FE] text-glow block">
                // SPECIFICATION HIGHLIGHTS
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
                {current.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center bg-[#4B5563]/30 border border-gray-500/10 px-3 py-2 rounded-xl text-gray-200">
                    <span className="text-[#00F2FE] font-bold mr-2">✓</span>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}