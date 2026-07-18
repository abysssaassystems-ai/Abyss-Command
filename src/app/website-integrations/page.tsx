"use client";
import React, { useState } from "react";
import Navbar from "../../components/Navbar";

interface IntegrationExample {
  name: string;
  hook: string;
  details: string;
  logoBg: string;
  logoLetter: string;
}

interface IntegrationCategory {
  id: string;
  title: string;
  definition: string;
  examples: IntegrationExample[];
}

const integrationRegistry: IntegrationCategory[] = [
  {
    id: "pos-systems",
    title: "Point of Sale (POS) Store Sync",
    definition: "Connect your physical store's cash registers directly with your website. This keeps your online shop and real-world store stock counts perfectly matching automatically whenever someone buys an item.",
    examples: [
      { 
        name: "Square", 
        hook: "Connects your shop's register to your online shop inventory instantly.",
        details: "Automatically shifts inventory counts online the exact second an item is scanned and bought at your physical retail counter.",
        logoBg: "bg-white text-black",
        logoLetter: "■"
      },
      { 
        name: "Clover", 
        hook: "Sends your live register checkouts straight to your online dashboard.",
        details: "Feeds onsite customer purchase points directly into your main tracking screen for easy overview analytics.",
        logoBg: "bg-[#00a651] text-white",
        logoLetter: "♣"
      },
      { 
        name: "Lightspeed", 
        hook: "Keeps stock matching perfectly across multiple store locations.",
        details: "Perfect for brands running two or more real-world storefronts alongside a digital shopping cart framework.",
        logoBg: "bg-[#ff1f4b] text-white",
        logoLetter: "L"
      }
    ]
  },
  {
    id: "gov-catalogs",
    title: "Government & Bid Catalogs",
    definition: "Safe data feeds designed to pull in and track open government contracts, public bidding forms, and official compliance lists automatically without you having to check them by hand every single day.",
    examples: [
      { 
        name: "SAM.gov", 
        hook: "Tracks and displays new public government contract openings automatically.",
        details: "Scans active federal contract postings and alerts your team the moment a relevant assignment matching your criteria goes live.",
        logoBg: "bg-[#112e51] text-white",
        logoLetter: "S" 
      },
      { 
        name: "FedBizOpps", 
        hook: "Brings contract updates straight to your dashboard.",
        details: "Bypasses slow email alert formats, dropping updated requirements text directly onto your internal workspace notice lines.",
        logoBg: "bg-[#f0c14b] text-gray-900",
        logoLetter: "F"
      },
      { 
        name: "OpenGov", 
        hook: "Shows public financial transparency records in easy-to-read charts.",
        details: "Transforms dry public record documents and data sheets into clean interactive graphics.",
        logoBg: "bg-[#007aff] text-white",
        logoLetter: "O"
      }
    ]
  },
  {
    id: "payments-tax",
    title: "Global Payments & Tax Setup",
    definition: "Accept credit cards safely from customers all over the world, split payouts automatically between business partners, and take care of complicated local sales taxes without getting penalized.",
    examples: [
      { 
        name: "Stripe", 
        hook: "Handles custom card checkouts and splits money between accounts easily.",
        details: "Allows you to securely save customer cards, handle monthly subscriptions, and distribute marketplace earnings automatically.",
        logoBg: "bg-[#635bff] text-white",
        logoLetter: "S"
      },
      { 
        name: "Paddle", 
        hook: "Takes care of international software sales tax rules for you.",
        details: "Acts as your global sales shield by instantly filing and processing local country taxes so you don't have to manage foreign tax audits.",
        logoBg: "bg-[#101010] text-[#00ffcc]",
        logoLetter: "P"
      },
      { 
        name: "Adyen", 
        hook: "Lets you accept standard local payment methods across any continent.",
        details: "Gives global buyers access to popular local bank transfers and country-specific credit systems directly on your page.",
        logoBg: "bg-[#00ff66] text-gray-950",
        logoLetter: "A"
      }
    ]
  },
  {
    id: "data-orchestration",
    title: "User Tracking & Live Analytics",
    definition: "See exactly how people use your app or website in real-time. It securely tracks mouse clicks and page visits so you can fix confusing layouts based on real customer habits.",
    examples: [
      { 
        name: "Segment", 
        hook: "Collects customer habits and sends them to your marketing tools.",
        details: "Gathers website action paths once, then instantly updates your email software, advertising pixels, and backend logs all at the same time.",
        logoBg: "bg-[#52ba5a] text-white",
        logoLetter: "S"
      },
      { 
        name: "PostHog", 
        hook: "Records video replays of user sessions to show where people get stuck.",
        details: "Provides complete visual readouts of live user journeys, showing exactly why users stop filling out your forms or signups.",
        logoBg: "bg-[#ffa500] text-black",
        logoLetter: "H"
      },
      { 
        name: "Apache Kafka", 
        hook: "Streams massive amounts of real-time user activity to your databases.",
        details: "Built for systems dealing with millions of concurrent actions that need to save massive log data streams every single millisecond.",
        logoBg: "bg-stone-200 text-stone-900",
        logoLetter: "K"
      }
    ]
  },
  {
    id: "crm-hubs",
    title: "CRM Pipelines & Lead Management",
    definition: "Keep your website contact forms connected straight to your active sales desks. When a new customer sends a message, your sales and support teams will see their details instantly.",
    examples: [
      { 
        name: "Salesforce", 
        hook: "Saves client information and edits customer profiles automatically.",
        details: "Connects your website lead captures to your enterprise team's central pipeline records instantly.",
        logoBg: "bg-[#00a1e0] text-white",
        logoLetter: "S"
      },
      { 
        name: "HubSpot", 
        hook: "Alerts your sales team the moment a hot customer fills out a form.",
        details: "Triggers instant notifications to sales reps so you can call back interested clients while they are still looking at your page.",
        logoBg: "bg-[#ff7a59] text-white",
        logoLetter: "H"
      },
      { 
        name: "Zoho", 
        hook: "Keeps absolute track of all customer email chains and contact histories.",
        details: "Pulls incoming message histories into a clean timeline layout so your support reps always know past user details.",
        logoBg: "bg-[#e51937] text-white",
        logoLetter: "Z"
      }
    ]
  }
];

export default function WebsiteIntegrations(): React.JSX.Element {
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>("pos-systems");
  const [expandedExampleName, setExpandedExampleName] = useState<string | null>(null);

  const toggleCategory = (id: string) => {
    setExpandedCategoryId(expandedCategoryId === id ? null : id);
    setExpandedExampleName(null); // Reset nested child accordion on main parent change
  };

  const toggleExample = (name: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Stop parent click events from firing accidentally
    setExpandedExampleName(expandedExampleName === name ? null : name);
  };

  return (
    <div className="min-h-screen bg-[#4B5563] text-[#F9FAFB] font-sans pt-16 select-none">
      <Navbar />

      {/* Inviting Welcoming Page Header */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center space-y-6">
        <span className="text-xs font-semibold tracking-widest text-[#00F2FE] bg-[#374151]/70 border border-gray-500/40 px-4 py-1.5 rounded-full text-glow uppercase">
          ✦ Simplified App Connections
        </span>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase italic">
          Connect the Tools You Already Love
        </h1>
        <p className="text-gray-200 text-base max-w-xl mx-auto leading-relaxed font-sans">
          Make your favorite software apps talk to each other automatically. We build direct, clean pipelines into your daily business platforms with zero messy setups.
        </p>
      </section>

      {/* Main Accordion Viewport Terminal */}
      <section className="max-w-4xl mx-auto px-6 pb-32 space-y-4">
        {integrationRegistry.map((category) => {
          const isCategoryExpanded = expandedCategoryId === category.id;

          return (
            <div 
              key={category.id} 
              className={`bg-[#374151] border rounded-3xl shadow-xl overflow-hidden transition-all duration-300 ${
                isCategoryExpanded ? 'border-[#00F2FE]/60 shadow-[#00F2FE]/5' : 'border-gray-500/20 hover:border-gray-400'
              }`}
            >
              {/* Primary Category Accordion Button */}
              <button
                type="button"
                onClick={() => toggleCategory(category.id)}
                className="w-full p-6 text-left flex justify-between items-center bg-[#374151] focus:outline-none transition-colors duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className={`h-2 w-2 rounded-full transition-all duration-300 ${isCategoryExpanded ? 'bg-[#00F2FE] text-glow animate-pulse' : 'bg-gray-500'}`} />
                  <h3 className="text-sm md:text-base font-black text-white uppercase tracking-wider font-mono">
                    {category.title}
                  </h3>
                </div>
                <div className="font-mono text-[11px] font-bold text-gray-400 px-3 py-1 bg-[#4B5563]/50 border border-gray-500/20 rounded-xl">
                  {isCategoryExpanded ? "HIDE DETAILS" : "VIEW DETAILS"}
                </div>
              </button>

              {/* Category Drawer Body */}
              <div 
                className={`transition-all duration-300 ease-in-out ${
                  isCategoryExpanded ? 'max-h-[1400px] border-t border-gray-500/20 p-6 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                }`}
              >
                {/* Simplified Definition Box */}
                <div className="space-y-1.5 mb-6">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-gray-400 block">// WHAT THIS DOES</span>
                  <p className="text-xs md:text-sm text-gray-200 leading-relaxed bg-[#4B5563]/20 border border-gray-500/10 p-4 rounded-xl font-sans">
                    {category.definition}
                  </p>
                </div>

                {/* Nested Example Dropdown Blocks Container */}
                <div className="space-y-3 pt-2">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#00F2FE] text-glow block">
                    // CHOOSE YOUR INTEGRATION PLATFORM ({category.examples.length})
                  </span>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {category.examples.map((example, idx) => {
                      const isExampleExpanded = expandedExampleName === example.name;

                      return (
                        <div 
                          key={idx}
                          className={`border rounded-2xl transition-all duration-200 bg-[#4B5563]/20 ${
                            isExampleExpanded ? 'border-gray-400 bg-[#4B5563]/40' : 'border-gray-500/10 hover:border-gray-500/30'
                          }`}
                        >
                          {/* Nested Example Accordion Trigger Button */}
                          <button
                            type="button"
                            onClick={(e) => toggleExample(example.name, e)}
                            className="w-full p-4 flex items-center justify-between text-left focus:outline-none"
                          >
                            <div className="flex items-center space-x-3">
                              {/* Custom Inline Logo Visual Block */}
                              <div className={`h-8 w-8 rounded-xl flex items-center justify-center text-xs font-black font-mono shadow-inner ${example.logoBg}`}>
                                {example.logoLetter}
                              </div>
                              <div>
                                <h4 className="text-xs font-black font-mono text-white uppercase">{example.name} Integration</h4>
                                <p className="text-[11px] text-gray-300 font-sans mt-0.5">{example.hook}</p>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono font-bold text-gray-400 px-2 py-0.5 bg-[#374151] rounded border border-gray-500/10">
                              {isExampleExpanded ? "CLOSE" : "EXPAND"}
                            </span>
                          </button>

                          {/* Nested Example Deep Details Content Panel */}
                          <div 
                            className={`transition-all duration-200 ease-in-out overflow-hidden ${
                              isExampleExpanded ? 'max-h-[300px] border-t border-gray-500/10 p-4 opacity-100 bg-[#374151]/30' : 'max-h-0 opacity-0 pointer-events-none'
                            }`}
                          >
                            <div className="space-y-1">
                              <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-[#00F2FE] block">// PRODUCTION USE CASE</span>
                              <p className="text-xs text-gray-200 leading-relaxed font-sans">{example.details}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Safe Connection Footer Label */}
                <div className="mt-6 pt-4 border-t border-gray-500/10 flex justify-between items-center text-[9px] font-mono text-gray-400">
                  <span>CONNECTION PATH: SECURE / VERIFIED</span>
                  <span className="text-[#00F2FE] font-bold">READY TO RUN</span>
                </div>

              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}