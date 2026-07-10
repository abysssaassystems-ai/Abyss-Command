'use client'; // 1. Add client directive to use the router navigation

import React from 'react';
import { useRouter } from 'next/navigation'; // 2. Import the router
import Link from 'next/link'; 
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import PersonalCatalogue from '../components/PersonalCatalogue'; 
import BusinessCatalogue from '../components/BusinessCatalogue'; 

export default function LandingPage() {
  const router = useRouter();

  // 3. Define a handler that routes users to login if they click a node on the landing page
  const handleLandingDeployRedirect = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#4B5563] text-[#F9FAFB] font-sans antialiased">
      
      <Navbar />
      <Hero />

      {/* Primary Highlight Promo Block */}
      <main className="max-w-5xl mx-auto px-4 pb-12">
        <div className="w-full bg-[#374151] border border-gray-500/30 rounded-[2rem] p-8 md:p-12 relative overflow-hidden shadow-xl">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#00F2FE]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="max-w-xl">
              <p className="text-xs font-bold tracking-widest text-[#00F2FE] text-glow uppercase mb-2">
                • Active Deployments • June 2026
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold italic uppercase tracking-tight text-white">
                The Launch Catalogue <br />
                <span className="text-[#00F2FE]">Is Now Open for Access</span>
              </h2>
              <p className="mt-3 text-sm text-gray-300 leading-relaxed">
                Deploy individual backend engines and functional modules directly to your centralized workspace shell with an absolute flat pricing tier.
              </p>
              
              <div className="mt-6 flex flex-wrap gap-4 text-xs font-mono text-gray-400">
                <span>⚡ Setup: Under 60 Sec</span>
                <span>🔒 Security: Centralized SSO</span>
                <span>🛠️ Cost: $5/mo Per Node</span>
              </div>
            </div>

            <div className="flex-shrink-0 w-full md:w-auto">
              <Link 
                href="/login" 
                className="inline-block w-full md:w-auto text-center bg-transparent border-2 border-[#00F2FE] text-[#00F2FE] px-8 py-4 rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-[#00F2FE] hover:text-gray-900 transition shadow-[0_4px_20px_rgba(0,242,254,0.2)]"
              >
                Launch Your First Node →
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* 4. Pass the redirect handler as the required onDeployNode prop to satisfy the TypeScript compiler */}
      <PersonalCatalogue onDeployNode={handleLandingDeployRedirect} />
      <BusinessCatalogue onDeployNode={handleLandingDeployRedirect} />

    </div>
  );
}