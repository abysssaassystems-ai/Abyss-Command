"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from "@/lib/supabaseClient";

// Ingesting all of your modular viewbar layout tabs
import ProjectProgressTab from '../../viewbars/website-client/ProjectProgressTab';
import WebMyRequestsTab from '../../viewbars/website-client/WebMyRequestsTab';
import WebsiteIntegrationsTab from '../../viewbars/website-client/WebsiteIntegrationsTab';
import WebHardwareTab from '../../viewbars/website-client/WebHardwareTab';
import MyAccountTab from '../../viewbars/website-client/MyAccountTab';
import BillingTab from '../../viewbars/website-client/BillingTab';
import BrandingTab from '../../viewbars/website-client/BrandingTab';

export default function WebDashboardOverview(): React.JSX.Element {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Read the '?tab=' variable from the URL path, fallback to 'progress' if empty
  const activeTab = searchParams.get('tab') || 'progress';

  useEffect(() => {
    const verifyDashboardAccess = async () => {
      try {
        // 1. SESSION DISCOVERY: Confirm a live, authentic token exists in application memory
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
          router.replace("/web-login");
          return;
        }

        // 2. TENANT VERIFICATION: Query the profile layer via RLS to check if they belong to this specific engine
        const { data: profile, error: profileError } = await supabase
          .from("web_login_users")
          .select("id")
          .eq("id", session.user.id)
          .maybeSingle();

        if (profileError || !profile) {
          // Valid global user, but unauthorized cross-tenant attempt (e.g. App SaaS user wandering over)
          await supabase.auth.signOut();
          router.replace("/web-login");
          return;
        }

        // Token authenticated & tenant group matches perfectly
        setIsAuthenticated(true);
      } catch (err) {
        router.replace("/web-login");
      } finally {
        setIsLoading(false);
      }
    };

    verifyDashboardAccess();

    // 3. REAL-TIME SUBSCRIPTION: Intercept background events (session timeout, remote sign-out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        router.replace("/web-login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  // Structural dictionary mapping string keys straight to your component viewbars
  const renderTabContent = () => {
    switch (activeTab) {
      case 'progress':
        return <ProjectProgressTab />;
      case 'requests':
        return <WebMyRequestsTab />;
      case 'integrations':
        return <WebsiteIntegrationsTab />;
      case 'hardware':
        return <WebHardwareTab />;
      case 'account':
        return <MyAccountTab />;
      case 'billing':
        return <BillingTab />;
      case 'branding':
        return <BrandingTab />;
      default:
        return <ProjectProgressTab />;
    }
  };

  // 4. PREVENT FOIL LEAKAGE: Block compilation loops until security handshake resolves
  if (isLoading) {
    return (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-white font-mono text-[11px] text-gray-400">
        <div className="text-center space-y-2">
          <div className="animate-pulse tracking-widest text-blue-600 font-bold">// SECURING GATEWAY CONNECTION //</div>
          <div>VERIFYING TENANT TOKENS...</div>
        </div>
      </div>
    );
  }

  // Safety net during redirect sequences
  if (!isAuthenticated) {
    return <></>;
  }

  return (
    <div className="w-full h-full transition-all duration-300">
      {renderTabContent()}
    </div>
  );
}