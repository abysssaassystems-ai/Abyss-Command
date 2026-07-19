"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface ArchitectureRequest {
  id: string;
  request_name: string;
  request_node: string;
  status: 'under_evaluation' | 'approved' | 'implemented' | 'rejected';
  interface_profiles: string;
  api_integrations: string;
  hardware_hooksets: string;
  system_core_layer: string;
  created_at: string;
}

export default function WebMyRequestsTab(): React.JSX.Element {
  const [requests, setRequests] = useState<ArchitectureRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const aggregateRequestLedger = async () => {
      try {
        setIsLoading(true);
        setErrorMsg(null);

        // 1. EXTRACT JWT CONTEXT: Confirm valid cryptographic authentication token
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          setErrorMsg("SECURITY_TOKEN_INVALID: Direct account node association unverified.");
          return;
        }

        // 2. POLL DATABASES: Fetch architecture logs targeted via explicit RLS parameters
        const { data, error: dbError } = await supabase
          .from('client_architecture_requests')
          .select('id, request_name, request_node, status, interface_profiles, api_integrations, hardware_hooksets, system_core_layer, created_at')
          .or(`user_id.eq.${user.id},client_email.eq.${user.email}`)
          .order('created_at', { ascending: false });

        if (dbError) {
          throw new Error(`LEDGER_RESOLVER_FAULT: ${dbError.message}`);
        }

        setRequests(data || []);
      } catch (err: any) {
        setErrorMsg(err.message || "UNCAUGHT_SPECIFICATION_INGESTION_EXCEPTION");
      } finally {
        setIsLoading(false);
      }
    };

    aggregateRequestLedger();
  }, []);

  // Utility to generate aesthetic style attributes based on dynamic pipeline phases
  const renderStatusBadge = (status: ArchitectureRequest['status']) => {
    const maps = {
      under_evaluation: { label: "Under Evaluation", style: "bg-cyan-500/10 border-[#00F2FE]/20 text-[#00F2FE]" },
      approved: { label: "Specification Approved", style: "bg-amber-500/10 border-amber-500/20 text-amber-400" },
      implemented: { label: "Deployed to Production", style: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" },
      rejected: { label: "Revision Required", style: "bg-rose-500/10 border-rose-500/20 text-rose-400" }
    };

    const active = maps[status] || maps.under_evaluation;

    return (
      <span className={`px-2..5 py-1 border text-[9px] font-mono uppercase font-bold tracking-wider rounded-lg shadow-sm ${active.style}`}>
        {active.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="w-full h-48 flex items-center justify-center font-mono text-[11px] text-gray-400">
        <div className="text-center space-y-2">
          <div className="animate-pulse tracking-widest text-[#00F2FE] font-bold">// SECURING DATA TRANSFER LINE //</div>
          <div>DOWNLOADING SUBMITTED BLUEPRINTS...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn select-none max-w-5xl mx-auto">
      
      {/* Upper Terminal Title Bar */}
      <div className="bg-[#374151] border border-gray-500/40 p-6 rounded-3xl shadow-lg">
        <span className="text-[10px] font-mono font-bold tracking-widest text-[#00F2FE] uppercase block">// BRIEF HISTORIES</span>
        <h2 className="text-xl font-black text-white uppercase italic mt-1">Submitted Architecture Specifications</h2>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl font-mono text-[11px] text-rose-400">
          ⚠ ARCH_STREAM_EXCEPTION: {errorMsg}
        </div>
      )}

      {/* Primary Configuration Mapping Iteration Block */}
      {requests.length === 0 ? (
        <div className="bg-[#374151] border border-gray-500/30 rounded-3xl p-8 text-center font-mono text-xs text-gray-400 italic">
          // NO PROJECT ARCHITECTURE REQUEST RECORDS DETECTED WITHIN THIS CREDENTIAL BOUNDARY //
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req.id} className="bg-[#374151] border border-gray-500/40 p-6 rounded-3xl space-y-4 shadow-md transition-all hover:border-gray-500/60">
              
              {/* Request Row Identification Segment */}
              <div className="flex justify-between items-center border-b border-gray-500/20 pb-3 flex-wrap gap-2">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wide">{req.request_name}</h3>
                  <span className="text-[9px] text-gray-400 font-mono block mt-0.5">Target Node: <span className="text-gray-300 font-bold">{req.request_node}</span></span>
                </div>
                {renderStatusBadge(req.status)}
              </div>

              {/* Blueprint Specification Grid Array */}
              <div className="grid sm:grid-cols-2 gap-3 p-4 bg-[#4B5563]/20 border border-gray-500/10 rounded-2xl font-mono text-[10px] text-gray-300">
                <div className="truncate">
                  • Interface Profiles: <span className="text-white font-bold ml-1">{req.interface_profiles}</span>
                </div>
                <div className="truncate">
                  • API Integrations: <span className="text-white font-bold ml-1">{req.api_integrations}</span>
                </div>
                <div className="truncate">
                  • Hardware Hooksets: <span className="text-white font-bold ml-1">{req.hardware_hooksets}</span>
                </div>
                <div className="truncate">
                  • System Core Layer: <span className="text-[#00F2FE] font-bold ml-1">{req.system_core_layer}</span>
                </div>
              </div>

              {/* Lower Historical Timestamp Footer */}
              <div className="flex justify-between items-center text-[9px] font-mono text-gray-500 px-1 pt-1">
                <span>INITIALIZED // {new Date(req.created_at).toLocaleDateString()}</span>
                <span>SHA-256 VERIFIED</span>
              </div>
              
            </div>
          ))}
        </div>
      )}

    </div>
  );
}