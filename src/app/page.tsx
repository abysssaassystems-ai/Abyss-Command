"use client";

import React from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';

export default function LandingPage(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans antialiased select-none pb-24">
      <Navbar />
      <Hero />

      {/* SECTION 1: TOP INTRODUCTORY SYSTEM BLOCK */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        {/* Pixel-perfect multi-color gradient border wrapper frame */}
        <div className="p-[1px] bg-gradient-to-r from-purple-600 via-blue-500 to-gray-300 rounded-3xl shadow-xl transition-all duration-300 hover:shadow-2xl">
          <div className="w-full bg-white rounded-[23px] p-8 md:p-10 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 relative z-10">
              <div className="space-y-4 max-w-2xl">
                <span className="text-[10px] font-mono font-bold tracking-widest text-purple-600 uppercase block">
                  // SYSTEM ENGINE INITIATION // 2026
                </span>
                <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tight text-gray-900 leading-tight">
                  Get Access to Custom Made <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Software Today</span>
                </h2>
                
                <div className="grid sm:grid-cols-2 gap-3 text-xs text-gray-600 pt-2 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 font-bold">✓</span> 100% From-Scr Scratch Engineering
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-600 font-bold">✓</span> Flat Transparent Project Rates
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 font-bold">✓</span> Secure Direct Database Hooks
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-600 font-bold">✓</span> Ongoing System DevOps Support
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0">
                <Link 
                  href="/custom-development" 
                  className="inline-block w-full text-center bg-white border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-xl font-bold uppercase tracking-wider text-xs font-mono transition-all shadow-md"
                >
                  SUBMIT ACCESS APPLICATION
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE CENTRAL MISSION STATEMENT */}
      <section className="max-w-4xl mx-auto px-6 py-12 text-center space-y-4">
        <span className="text-[10px] font-mono font-bold tracking-widest text-purple-600 uppercase block">
          // OUR INITIATIVE
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase italic tracking-tight leading-none">
          Building Real Software <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-gray-400">On & Off the Cloud</span>
        </h2>
        
        {/* Visual Line Accent Divider */}
        <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full my-4 shadow-sm" />
        
        <p className="max-w-2xl mx-auto text-sm md:text-base text-gray-600 leading-relaxed font-medium">
          Our mission is to provide website development, hardware integrations, and software systems for personal and business use at an affordable price for <strong className="text-gray-950 font-black">EVERY</strong> individual or business. We offer real and personalized systems built from scratch just the way you want. Collaborate with a human who cares, not a mindless machine.
        </p>
      </section>

      {/* SECTION 3: CORE PRODUCTS CAPABILITIES */}
      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">

        {/* C-1: Website Development */}
        <div className="p-[1px] bg-gradient-to-r from-purple-600 via-blue-500 to-gray-300 rounded-3xl shadow-lg transition-all duration-300 hover:shadow-xl">
          <div className="w-full bg-white rounded-[23px] p-8 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative">
            <div className="space-y-4 max-w-xl">
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-gray-400 block">
                ✦ CORE INFRASTRUCTURE MATRIX
              </span>
              <h3 className="text-2xl font-black tracking-tight text-gray-900 uppercase italic">
                Website <span className="text-blue-600">Development</span>
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Stunning, ultra-fast frontend web platforms built with raw React and Next.js layers. Optimized for lightning-fast speeds, completely custom visuals, and high conversion checkouts out of the box.
              </p>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-gray-600 pt-1">
                <div>🔹 100% Lighthouse Speed Score</div>
                <div>🛠️ Custom Content Management</div>
                <div>📈 Built-in SEO Meta Layers</div>
                <div>📱 100% Mobile Responsive Shells</div>
              </div>
            </div>
            <Link 
              href="/create-website" 
              className="w-full md:w-auto text-center px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:opacity-95 transition-opacity"
            >
              Explore Plan Tiers →
            </Link>
          </div>
        </div>

        {/* C-2: Personal Software Apps */}
        <div className="p-[1px] bg-gradient-to-r from-gray-300 via-purple-600 to-blue-500 rounded-3xl shadow-lg transition-all duration-300 hover:shadow-xl">
          <div className="w-full bg-white rounded-[23px] p-8 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative">
            <div className="space-y-4 max-w-xl">
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-gray-400 block">
                ✦ INDIVIDUAL UTILITY MATRICES
              </span>
              <h3 className="text-2xl font-black tracking-tight text-gray-900 uppercase italic">
                Personal <span className="text-purple-600">Software Apps</span>
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Custom applications built to automate your personal life, side projects, or standalone operations. Get custom portfolio hubs, investment trackers, or personal schedule controllers built exactly to your specs.
              </p>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-gray-600 pt-1">
                <div>🔒 Isolated Private Security</div>
                <div>📊 Custom Dashboard Systems</div>
                <div>💬 Instant SMS / Email Alerts</div>
                <div>💡 Lightweight & Zero Maintenance</div>
              </div>
            </div>
            <Link 
              href="/catalogue/personal" 
              className="w-full md:w-auto text-center px-6 py-3.5 bg-transparent border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
            >
              Design Personal App →
            </Link>
          </div>
        </div>

        {/* C-3: Business Software Apps */}
        <div className="p-[1px] bg-gradient-to-r from-purple-600 via-blue-500 to-gray-300 rounded-3xl shadow-lg transition-all duration-300 hover:shadow-xl">
          <div className="w-full bg-white rounded-[23px] p-8 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative">
            <div className="space-y-4 max-w-xl">
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-gray-400 block">
                ✦ ENTERPRISE OPERATIONS CORE
              </span>
              <h3 className="text-2xl font-black tracking-tight text-gray-900 uppercase italic">
                Business <span className="text-blue-600">Software Apps</span>
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Industrial grade tools built to cut operation costs. Natively integrate hardware checkout cash registers, manage multi-location branch networks, or automate CRM lead assignment loops seamlessly.
              </p>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-gray-600 pt-1">
                <div>📟 Hardware POS Terminal Links</div>
                <div>💼 Custom Recruiting Pipelines</div>
                <div>💰 Automatic Billing Lifecycles</div>
                <div>📦 Real-time Warehouse Inventory</div>
              </div>
            </div>
            <Link 
              href="/catalogue/business" 
              className="w-full md:w-auto text-center px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:opacity-95 transition-opacity"
            >
              Deploy Business Core →
            </Link>
          </div>
        </div>

      </section>
    </div>
  );
}