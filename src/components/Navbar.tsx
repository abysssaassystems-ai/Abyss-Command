"use client"; // Required for Next.js app directory component loading

import React from 'react';
import Image from 'next/image';
import Link from 'next/link'; // 1. Imported Next.js Link component

export default function Navbar() {
  return (
    <nav className="w-full border-b border-gray-500/40 bg-[#374151]/95 backdrop-blur-md sticky top-0 z-50 px-8 py-6 flex items-center justify-between">
      
      {/* Brand Logo & Text Layout Wrapper */}
      <Link href="/" className="flex items-center space-x-5 group transition">
        
        {/* The Circular Cyber-Orb (Houses ONLY the Shield Symbol) */}
        <div className="relative h-20 w-20 rounded-full bg-[#4B5563] border-2 border-[#00F2FE] overflow-hidden flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(0,242,254,0.3)] group-hover:shadow-[0_0_30px_rgba(0,242,254,0.5)] group-hover:border-[#00B8C4] transition-all duration-300">
          <Image
            src="/logo-symbol.png"
            alt="ABYSS Shield Symbol"
            fill
            className="object-contain p-3 transition-transform duration-500 group-hover:scale-110" 
            priority
          />
        </div>

        {/* Typographic Text Brand Stack (Rendered outside the circle) */}
        <div className="flex flex-col justify-center select-none">
          <h1 className="text-3xl font-black tracking-widest text-white leading-none uppercase group-hover:text-[#00F2FE] transition-colors duration-300">
            ABYSS
          </h1>
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-300 mt-1.5 whitespace-nowrap">
            Development Systems
          </span>
        </div>

      </Link>
      
      {/* Central Navigation Links - Triggered via CSS Hover States */}
      <div className="hidden md:flex items-center space-x-8 text-sm font-medium uppercase tracking-wider text-gray-200">
        
        {/* 1. WALKTHROUGH DROPDOWN */}
        <div className="relative group py-4">
          <button className="flex items-center space-x-2 group-hover:text-[#00F2FE] text-gray-200 transition focus:outline-none">
            <span>About Us</span>
            <ChevronIcon />
          </button>
          
          <div className="absolute left-0 mt-2 w-60 bg-[#374151] border border-gray-500/40 rounded-xl p-2 shadow-2xl z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
            <DropdownLink href="/walkthrough#setup" title="Account Authentication" desc="Password resets & magic links" />
            <DropdownLink href="/walkthrough#sub" title="Adding a Subscription" desc="Toggling new $5/mo nodes" />
            <DropdownLink href="/walkthrough#dashboard" title="Workspace Navigation" desc="Managing your active stack" />
          </div>
        </div>

        {/* 2. CATALOGUE DROPDOWN */}
        <div className="relative group py-4">
          <button className="flex items-center space-x-2 group-hover:text-[#00F2FE] text-gray-200 transition focus:outline-none">
            <span>App Catalogue</span>
            <ChevronIcon />
          </button>
          
          <div className="absolute left-0 mt-2 w-56 bg-[#374151] border border-gray-500/40 rounded-xl p-2 shadow-2xl z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
            <DropdownLink href="/catalogue/personal" title="Personal Use" desc="Lifestyle & habits tracking" />
            <DropdownLink href="/catalogue/business" title="Business Use" desc="B2B utilities & micro-engines" />
            <DropdownLink href="/catalogue/custom" title="Custom" desc="Request" />
          </div>
        </div>

        {/* 3. ARCHITECTURE DROPDOWN */}
        <div className="relative group py-4">
          <button className="flex items-center space-x-2 group-hover:text-[#00F2FE] text-gray-200 transition focus:outline-none">
            <span>Website Creation</span>
            <ChevronIcon />
          </button>
          
          <div className="absolute left-0 mt-2 w-60 bg-[#374151] border border-gray-500/40 rounded-xl p-2 shadow-2xl z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
            <DropdownLink href="/create-website" title="Create Website" desc="The single codebase structure" />
            <DropdownLink href="/website-integrations" title="Website Integrations" desc="One login across all elements" />
            <DropdownLink href="/sample-site" title="Sample Website" desc="Unified monthly billing matrix" />
          </div>
        </div>

        {/* 4. PRICING LINK */}
        <Link href="custom-development" className="hover:text-[#00F2FE] transition px-2 py-4">
          Custom Development
        </Link>

      </div>

      {/* Right Side Action - System Login Button */}
      <div>
        {/* 2. Changed plain button to a styled Link layout addressing your login route */}
        <Link 
          href="/login" 
          className="inline-block bg-gradient-to-r from-[#00B8C4] to-[#00F2FE] text-gray-900 px-6 py-3 rounded-lg font-bold uppercase tracking-wider text-xs hover:opacity-90 transition shadow-[0_4px_15px_rgba(0,242,254,0.3)] text-center select-none"
        >
          Abyss Account Login
        </Link>
      </div>

    </nav>
  );
}

// Reusable micro-component updated to use Link uniformly
function DropdownLink({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link 
      href={href} 
      className="block p-3 rounded-lg hover:bg-[#4B5563] group/item transition text-left"
    >
      <div className="font-semibold text-sm text-white group-hover/item:text-[#00F2FE] transition">
        {title}
      </div>
      <div className="text-xs text-gray-300 mt-0.5 normal-case tracking-normal">
        {desc}
      </div>
    </Link>
  );
}

// SVG Chevron Arrow component with dynamic hover rotation
function ChevronIcon() {
  return (
    <svg 
      className="w-3 h-3 text-gray-450 transform transition-transform duration-200 ease-in-out group-hover:rotate-180 group-hover:text-[#00F2FE]" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
    </svg>
  );
}