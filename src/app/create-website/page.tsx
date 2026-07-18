"use client";
import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import { supabase } from '@/lib/supabaseClient';

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
  
  // Intake Wizard Management States
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Data Field Collection Strings
  const [nameOrBusiness, setNameOrBusiness] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const handleIntakeSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('standard_package_inquiries')
        .insert([
          {
            client_name: nameOrBusiness,
            client_email: email,
            client_phone: phone,
            selected_framework: selectedTier,
            custom_message: notes
          }
        ]);

      if (!error) {
        setWizardStep(2);
      } else {
        // THIS WILL SHOW YOU THE EXACT Roadblock INSTANTLY
        alert(`Supabase Error: ${error.message}\nCode: ${error.code}\nDetails: ${error.details}`);
        console.error("SUPABASE_PIPELINE_ERROR:", error.message);
      }
    } catch (err: any) {
      alert(`Connection Crash: ${err.message || err}`);
      console.error("SUPABASE_UPLINK_CRITICAL_FAILURE:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeAndResetWizard = () => {
    setIsWizardOpen(false);
    setWizardStep(1);
    setNameOrBusiness("");
    setPhone("");
    setEmail("");
    setNotes("");
  };

  return (
    <div className="min-h-screen bg-[#4B5563] text-[#F9FAFB] font-sans pt-16 relative">
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
              type="button"
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

          <button 
            type="button"
            onClick={() => setIsWizardOpen(true)}
            className="w-full mt-10 py-4 bg-gradient-to-r from-[#00B8C4] to-[#00F2FE] text-gray-900 font-black text-xs uppercase tracking-widest rounded-xl shadow-lg hover:opacity-95 transition-all focus:outline-none"
          >
            Continue with project approval →
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

      {/* PROJECT APPROVAL MODAL WIZARD OVERLAY */}
      {isWizardOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 select-none">
          <div className="w-full max-w-lg bg-[#374151] border border-gray-500/40 rounded-3xl p-6 md:p-8 shadow-2xl relative animate-fadeIn overflow-hidden">
            <div className="absolute -top-20 -right-20 w-44 h-44 bg-[#00F2FE]/5 rounded-full blur-2xl pointer-events-none" />

            {/* STAGE 1: INGESTION FORM MATRIX */}
            {wizardStep === 1 ? (
              <form onSubmit={handleIntakeSubmission} className="space-y-5">
                <div className="text-left border-b border-gray-500/20 pb-3 flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-mono font-bold text-[#00F2FE] tracking-widest uppercase block">// ARCHITECTURE PROVISION MATRIX</span>
                    <h3 className="text-lg font-black text-white uppercase italic mt-1">Project Specification Data</h3>
                  </div>
                  <button
                    type="button"
                    onClick={closeAndResetWizard}
                    className="text-gray-400 hover:text-white font-mono text-xs bg-[#4B5563]/50 border border-gray-500/20 px-2 py-1 rounded-md"
                  >
                    ESC
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono font-bold uppercase text-gray-400">Name / Business Identity</label>
                    <input
                      type="text"
                      required
                      disabled={isSubmitting}
                      value={nameOrBusiness}
                      onChange={(e) => setNameOrBusiness(e.target.value)}
                      placeholder="e.g., Nexus Labs Inc."
                      className="w-full bg-[#4B5563] border border-gray-500/40 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 outline-none focus:border-[#00F2FE]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono font-bold uppercase text-gray-400">Contact Line (Phone)</label>
                    <input
                      type="tel"
                      required
                      disabled={isSubmitting}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g., +15550198833"
                      className="w-full bg-[#4B5563] border border-gray-500/40 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 outline-none focus:border-[#00F2FE]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono font-bold uppercase text-gray-400">Communication Node (Email)</label>
                  <input
                    type="email"
                    required
                    disabled={isSubmitting}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g., operations@nexuslabs.io"
                    className="w-full bg-[#4B5563] border border-gray-500/40 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 outline-none focus:border-[#00F2FE]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono font-bold uppercase text-gray-400">Functional Notes & Requirements</label>
                  <textarea
                    rows={3}
                    required
                    disabled={isSubmitting}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Describe external endpoints, design parameters, or processing workflows desired..."
                    className="w-full bg-[#4B5563] border border-gray-500/40 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 outline-none focus:border-[#00F2FE] resize-none"
                  />
                </div>

                <div className="bg-[#4B5563]/30 border border-gray-500/10 p-3 rounded-xl flex items-center justify-between text-[11px] font-mono">
                  <span className="text-gray-400 uppercase">Selected Structure Layer:</span>
                  <span className="text-[#00F2FE] font-bold uppercase italic">{tiers[selectedTier].title}</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-gradient-to-r from-[#00B8C4] to-[#00F2FE] text-gray-900 font-black text-xs uppercase tracking-widest rounded-xl shadow-lg hover:opacity-95 focus:outline-none disabled:opacity-50"
                >
                  {isSubmitting ? "Syncing to Supabase..." : "Submit Allocation Target Matrix"}
                </button>
              </form>
            ) : (
              /* STAGE 2: TARGET LOG COMPLETE READOUT */
              <div className="space-y-6 text-center py-6 animate-fadeIn">
                <div className="mx-auto w-12 h-12 bg-cyan-500/10 border border-[#00F2FE] text-[#00F2FE] text-glow rounded-full flex items-center justify-center text-xl font-bold animate-bounce">
                  ✓
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-lg font-black text-white uppercase italic tracking-tight">System Handshake Finalized</h4>
                  <p className="text-xs text-gray-200 leading-relaxed px-2 bg-[#4B5563]/20 border border-gray-500/10 p-5 rounded-2xl font-sans">
                    Thank you for contacting us! We look forward to working with you! Please expect a response within the next 32 hours for the next steps!
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeAndResetWizard}
                  className="px-6 py-2.5 bg-[#4B5563] border border-gray-500/40 hover:border-gray-400 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all focus:outline-none"
                >
                  Close Terminal Connection
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}