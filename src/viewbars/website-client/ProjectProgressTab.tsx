"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface UserProfile {
  id: string;
  email: string;
  account_name: string;
}

interface ProgressMetrics {
  api_integrations: number;
  hardware_integrations: number;
  web_storage_setup: number;
  website_frontend: number;
  website_backend: number;
  ui: number;
  final_testing: number;
  is_finalized: boolean;
}

export default function ProjectProgressTab(): React.JSX.Element {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [metrics, setMetrics] = useState<ProgressMetrics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 1. SESSION INGESTION & WEBSOCKET TELEMETRY STREAM
  useEffect(() => {
    let realtimeChannel: any = null;

    async function establishSecureTelemetryStream() {
      try {
        setIsLoading(true);
        setErrorMsg(null);

        // A. IDENTITY VERIFICATION: Pull real identity directly from crypto layer
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

        if (authError || !authUser) {
          setErrorMsg("SESSION_UNVERIFIED: Active authentication token missing.");
          return;
        }

        // Fetch user workspace context variables securely
        const { data: profileData } = await supabase
          .from('web_login_users')
          .select('id, email, account_name')
          .eq('id', authUser.id)
          .maybeSingle();

        const activeUserContext: UserProfile = {
          id: authUser.id,
          email: authUser.email || "",
          account_name: profileData?.account_name || "Nexus Partner"
        };
        
        setUser(activeUserContext);

        // B. DATA COMPILATION: Retrieve specific project metrics using dual identifier validation
        const { data: progressData, error: dbError } = await supabase
          .from('client_project_progress')
          .select('*')
          .or(`user_id.eq.${activeUserContext.id},client_email.eq.${activeUserContext.email}`)
          .maybeSingle();

        if (dbError) {
          throw new Error(`METRIC_FETCH_FAULT: ${dbError.message}`);
        }

        if (progressData) {
          setMetrics(progressData);
        }

        setIsLoading(false);

        // C. REACTIONARY STREAM: Mount secure pipeline tracking Postgres write heads in real-time
        const isolatedChannelName = `live-progress-${activeUserContext.id}-${Math.random().toString(36).substring(7)}`;
        
        // Define dynamic subscription filter string dependent on structural columns
        const channelFilter = activeUserContext.email 
          ? `client_email=eq.${activeUserContext.email}` 
          : `user_id=eq.${activeUserContext.id}`;

        realtimeChannel = supabase
          .channel(isolatedChannelName)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'client_project_progress',
              filter: channelFilter
            },
            (payload) => {
              if (payload.new) {
                setMetrics(payload.new as ProgressMetrics);
              }
            }
          )
          .subscribe();

      } catch (err: any) {
        setErrorMsg(err.message || "UNCAUGHT_TELEMETRY_STREAM_FAULT");
        setIsLoading(false);
      }
    }

    establishSecureTelemetryStream();

    // Clean up pipeline instances safely on unmount to prevent open websocket hanging loops
    return () => {
      if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel);
      }
    };
  }, []);

  // 2. WEIGHTED MATHEMATICAL COMPLETION ALGORITHM
  const structuralAnalytics = useMemo(() => {
    if (!metrics) return { globalProgress: 0, daysRemaining: 0, currentPhase: 1 };

    // Explicit task weights in days as specified
    const weights = {
      ui: 1,
      website_frontend: 1,
      website_backend: 1,
      api_integrations: 3,
      hardware_integrations: 4,
      final_testing: 3,
      web_storage_setup: 2 
    };

    // Calculate fractional remaining days for each individual module architecture
    const remainingUi = weights.ui * ((100 - (metrics.ui || 0)) / 100);
    const remainingFrontend = weights.website_frontend * ((100 - (metrics.website_frontend || 0)) / 100);
    const remainingBackend = weights.website_backend * ((100 - (metrics.website_backend || 0)) / 100);
    const remainingApi = weights.api_integrations * ((100 - (metrics.api_integrations || 0)) / 100);
    const remainingHardware = weights.hardware_integrations * ((100 - (metrics.hardware_integrations || 0)) / 100);
    const remainingTesting = weights.final_testing * ((100 - (metrics.final_testing || 0)) / 100);
    const remainingStorage = weights.web_storage_setup * ((100 - (metrics.web_storage_setup || 0)) / 100);

    // Sum total raw fractional days left on the development ledger
    const totalDaysRemaining = 
      remainingUi + remainingFrontend + remainingBackend + remainingApi + remainingHardware + remainingTesting + remainingStorage;

    // Total absolute sum baseline weight: 1 + 1 + 1 + 3 + 4 + 3 + 2 = 15 total days
    const maxProjectDays = 15;
    
    // Derived metrics calculations
    const completedProjectDays = maxProjectDays - totalDaysRemaining;
    const globalProgress = Math.max(0, Math.min(100, Math.round((completedProjectDays / maxProjectDays) * 100)));
    const daysRemaining = Math.max(0, Math.round(totalDaysRemaining));

    // Dynamic pipeline step phases mapped strictly to proportional metrics
    let currentPhase = 1;
    if (globalProgress > 90) currentPhase = 4;
    else if (globalProgress > 55) currentPhase = 3;
    else if (globalProgress > 20) currentPhase = 2;

    return { globalProgress, daysRemaining, currentPhase };
  }, [metrics]);

  // Radial chart perimeter constants
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (structuralAnalytics.globalProgress / 100) * circumference;

  if (isLoading) {
    return (
      <div className="text-center font-mono text-xs text-gray-400 py-24 animate-pulse uppercase tracking-wider">
        // Syncing with database core node channels...
      </div>
    );
  }

  return (
    <div className="space-y-6 select-none animate-fadeIn max-w-5xl mx-auto pb-12">
      
      {/* Client Context Control Header */}
      <header className="bg-[#374151] border border-gray-500/40 p-6 rounded-3xl shadow-lg flex justify-between items-center flex-wrap gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#00F2FE] uppercase block">// ENGINE TELEMETRY CHANNEL</span>
          <h2 className="text-xl font-black text-white uppercase italic mt-1">
            System Workspace Progress // <span className="text-[#00F2FE] text-glow">{user?.account_name}</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1 font-sans">
            Review live framework building cycles, environment node data, and estimated terminal release windows below.
          </p>
        </div>
        <span className="px-3 py-1.5 bg-[#4B5563] border border-gray-500/30 text-gray-300 font-mono text-[10px] rounded-xl uppercase font-bold">
          Uplink: Live / Secure
        </span>
      </header>

      {errorMsg && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl font-mono text-[11px] text-rose-400">
          ⚠ TELEMETRY_STREAM_EXCEPTION: {errorMsg}
        </div>
      )}

      {/* Primary Analytics Section: Radial Ring Graph & Linear Metric Blocks */}
      <div className="grid md:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Grid: SVG Radial Percentage Engine Diagram (5 Columns Wide) */}
        <div className="md:col-span-5 bg-[#374151] border border-gray-500/40 p-6 rounded-3xl flex flex-col items-center justify-center text-center relative overflow-hidden">
          <span className="text-[9px] font-mono font-bold tracking-wider text-gray-400 uppercase absolute top-4 left-5">// TOTAL PROGRESS VECTOR</span>
          
          <div className="relative w-44 h-44 mt-4 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r={radius} fill="transparent" stroke="#4B5563" strokeWidth="8" className="opacity-40" />
              <circle 
                cx="60" 
                cy="60" 
                r={radius} 
                fill="transparent" 
                stroke="#00F2FE" 
                strokeWidth="8" 
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
                style={{ filter: "drop-shadow(0 0 4px rgba(0, 242, 254, 0.3))" }}
              />
            </svg>
            
            <div className="absolute flex flex-col items-center justify-center font-mono">
              <span className="text-3xl font-black text-white tracking-tighter">{structuralAnalytics.globalProgress}%</span>
              <span className="text-[8px] text-gray-400 uppercase tracking-widest font-bold">Complete</span>
            </div>
          </div>

          {/* Deceleration mathematical display element */}
          <div className="w-full mt-4 p-3 bg-gray-950/20 border border-gray-500/10 rounded-xl font-mono text-[10px] flex justify-between items-center text-gray-300">
            <span>Estimated Time to Delivery:</span>
            <span className={`font-black text-xs ${structuralAnalytics.daysRemaining === 0 ? 'text-emerald-400' : 'text-[#00F2FE] animate-pulse'}`}>
              {structuralAnalytics.daysRemaining === 0 ? "RELEASE READY" : `${structuralAnalytics.daysRemaining} Days Left`}
            </span>
          </div>
        </div>

        {/* Right Grid: Linear Milestone Step Matrix (7 Columns Wide) */}
        <div className="md:col-span-7 bg-[#374151] border border-gray-500/40 p-6 rounded-3xl space-y-4 flex flex-col justify-between">
          <div>
            <span className="text-[9px] font-mono font-bold tracking-wider text-gray-400 uppercase block">// ARCHITECTURE LIFECYCLE MATRICES</span>
            <h3 className="text-md font-black text-white uppercase font-mono mt-0.5">Development Sprint Path</h3>
          </div>

          <div className="grid grid-cols-1 gap-2.5 font-mono text-[10px] w-full">
            <div className={`p-3 rounded-xl border flex justify-between items-center ${structuralAnalytics.currentPhase >= 1 ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400' : 'border-gray-500/10 text-gray-500'}`}>
              <span>01 // STRUCTURAL INTAKE BRIEF</span>
              <span className="font-bold">LOCKED</span>
            </div>
            <div className={`p-3 rounded-xl border flex justify-between items-center ${structuralAnalytics.currentPhase >= 2 ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400' : 'border-gray-500/10 text-gray-500'}`}>
              <span>02 // USER INTERFACE UX DESIGN MOCKUPS</span>
              <span className="font-bold">{structuralAnalytics.currentPhase >= 2 ? "PASSED" : "STAGED"}</span>
            </div>
            <div className={`p-3 rounded-xl border flex justify-between items-center ${structuralAnalytics.currentPhase >= 3 ? 'border-[#00F2FE]/30 bg-[#00B8C4]/5 text-[#00F2FE]' : 'border-gray-500/10 text-gray-500'}`}>
              <span>03 // CORE ENGINE PROGRAMMING CONTAINER</span>
              <span className={`font-bold ${structuralAnalytics.currentPhase === 3 ? 'animate-pulse' : ''}`}>{structuralAnalytics.currentPhase === 3 ? "ACTIVE RUNNING" : structuralAnalytics.currentPhase > 3 ? "PASSED" : "STAGED"}</span>
            </div>
            <div className={`p-3 rounded-xl border flex justify-between items-center ${structuralAnalytics.currentPhase >= 4 ? 'border-cyan-500/30 bg-cyan-500/5 text-[#00F2FE]' : 'border-gray-500/10 text-gray-500'}`}>
              <span>04 // SANDBOX STAGING DEPLOYMENT RUNS</span>
              <span className="font-bold">{structuralAnalytics.currentPhase === 4 ? "TESTING NOW" : "STAGED"}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Individual Layer Component Telemetry Bar Charts Container */}
      <div className="bg-[#374151] border border-gray-500/40 p-6 rounded-3xl space-y-4 shadow-md">
        <div>
          <span className="text-[9px] font-mono font-bold tracking-wider text-gray-400 uppercase block">// FRAMEWORK SUITE NODE PREVIEWS</span>
          <h3 className="text-md font-black text-white uppercase font-mono mt-0.5">Detailed Subsystem Track Sheets</h3>
        </div>

        {metrics ? (
          <div className="space-y-3 font-mono text-[11px]">
            {renderClientProgressLine("Ecom & Payments API Integrations Matrix", metrics.api_integrations)}
            {renderClientProgressLine("Physical Store Onsite Cash Register Linkages", metrics.hardware_integrations)}
            {renderClientProgressLine("Secure Cloud Data Multi-Tenant Storage Setup", metrics.web_storage_setup)}
            {renderClientProgressLine("Responsive Client-Facing Application Frontend Layout", metrics.website_frontend)}
            {renderClientProgressLine("Decoupled Structural Microservice Server Backend Core", metrics.website_backend)}
            {renderClientProgressLine("User Experience Aesthetics Typography & System Themes", metrics.ui)}
            {renderClientProgressLine("Final Sandbox Incubation Server Integrity Regression Testing", metrics.final_testing)}
          </div>
        ) : (
          <div className="p-8 border border-dashed border-gray-500/20 rounded-2xl text-center text-xs text-gray-400 font-mono italic animate-pulse">
            // Waiting for developer control board to compile initial metrics configurations data...
          </div>
        )}
      </div>

    </div>
  );
}

function renderClientProgressLine(label: string, value: number) {
  const isDone = value === 100;

  return (
    <div className={`p-3.5 border rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
      isDone ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-gray-950/10 border-gray-500/10'
    }`}>
      <div className="flex items-center space-x-3 truncate max-w-[80%]">
        <span className={`text-xs ${isDone ? 'text-emerald-400 font-bold' : 'text-gray-500'}`}>
          {isDone ? "✓" : "⎔"}
        </span>
        <span className={`truncate ${isDone ? 'text-emerald-300 font-bold' : 'text-white'}`}>{label}</span>
      </div>
      
      <div className="flex items-center space-x-4 flex-shrink-0">
        <div className="w-28 h-1 bg-gray-950/40 rounded-full overflow-hidden hidden sm:block">
          <div className={`h-full transition-all duration-500 ease-out ${isDone ? 'bg-emerald-500' : 'bg-[#00F2FE]'}`} style={{ width: `${value}%` }} />
        </div>
        <span className={`font-black text-right w-10 text-[10px] ${isDone ? 'text-emerald-400' : 'text-gray-300'}`}>
          {isDone ? "DONE" : `${value}%`}
        </span>
      </div>
    </div>
  );
}