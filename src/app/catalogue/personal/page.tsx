'use client'; // 1. Add client directive to enable router navigation

import React from 'react';
import { useRouter } from 'next/navigation'; // 2. Import the Next.js router
import Navbar from '@/components/Navbar';
import PersonalCatalogue from '@/components/PersonalCatalogue';

export default function PersonalCataloguePage() {
  const router = useRouter();

  // 3. Define the redirection handler for unauthenticated users
  const handleLandingDeployRedirect = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-[#F3F4F6]">
      <Navbar />
      
      {/* 4. Pass the redirect handler to fulfill the type constraint */}
      <PersonalCatalogue onDeployNode={handleLandingDeployRedirect} />
    </div>
  );
}