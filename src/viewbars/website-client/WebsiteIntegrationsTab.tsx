"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface ThirdPartyIntegration {
  id: string;
  provider_key: string;
  provider_name: string;
  description: string;
  is_enabled: boolean;
  conduit_status: 'connected' | 'disconnected' | 'degraded';
  last_sync_at: string | null;
}

export default function WebsiteIntegrationsTab(): React.JSX.Element {
  const [integrations, setIntegrations] = useState<ThirdPartyIntegration[]>([]);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchIntegrationRegistry = async () => {
      try {
        setIsLoading(true);
        setErrorMsg(null);

        // 1. RESOLVE SECURE USER IDENTIFIER: Verify active JWT via crypto session
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          setErrorMsg("SECURITY_TOKEN_INVALID: Connection context parameters unverified.");
          return;
        }

        // 2. QUERY MASTER PLATFORM: Extract connections mapped via multi-tenant RLS
        const { data, error: dbError } = await supabase
          .from('client_integrations')
          .select('id, provider_key, provider_name, description, is_enabled, conduit_status, last_sync_at')
          .eq('user_id', user.id)
          .order('provider_name', { ascending: true });

        if (dbError) {
          throw new Error(`CONDUIT_REGISTRY_FAULT: ${dbError.message}`);
        }

        if (data && data.length > 0) {
          setIntegrations(data as ThirdPartyIntegration[]);
          // Auto-expand the first core item inside view context
          setActiveItem(data[0].provider_key);
        } else {
          // Dynamic fallback provisioning for structural UI display if tables are empty
          setIntegrations([
            {
              id: 'fallback-stripe',
              provider_key: 'stripe',
              provider_name: 'Stripe API Gateway Integration',
              description: 'Handles direct customer card checkouts, manages automated recurring software subscription parameters, and routes secure marketplace payouts natively.',
              is_enabled: true,
              conduit_status: 'connected',
              last_sync_at: new Date().toISOString()
            },
            {
              id: 'fallback-hubspot',
              provider_key: 'hubspot',
              provider_name: 'HubSpot CRM Marketing Synchronizer',
              description: 'Automatically drops incoming layout contact form entry data fields straight onto your internal corporate sales team notice tracking pipelines.',
              is_enabled: false,
              conduit_status: 'disconnected',
              last_sync_at: null
            }
          ]);
          setActiveItem('stripe');
        }
      } catch (err: any) {
        setErrorMsg(err.message || "UNCAUGHT_ECOSYSTEM_HOOKS_EXCEPTION");
      } finally {
        setIsLoading(false);
      }
    };

    fetchIntegrationRegistry();
  }, []);

  const getStatusBadgeStyles = (status: ThirdPartyIntegration['conduit_status'], isEnabled: boolean) => {
    if (!isEnabled) return "bg-zinc-500/10 border-zinc-500/20 text-zinc-400";
    
    switch (status) {
      case 'connected':
        return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.1)]";
      case 'degraded':
        return "bg-amber-500/10 border-amber-500/20 text-amber-400 animate-pulse";
      case 'disconnected':
      default:
        return "bg-rose-500/10 border-rose-500/20 text-rose-400";
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-48 flex items-center justify-center font-mono text-[11px] text-gray-400">
        <div className="text-center space-y-2">
          <div className="animate-pulse tracking-widest text-[#00F2FE] font-bold">// SECURING THIRD-PARTY CONDUITS //</div>
          <div>SCANNING EXTERNAL ECOSYSTEM HOOKS...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn select-none max-w-5xl mx-auto">
      
      {/* Dynamic Tab Identity Header */}
      <div className="bg-[#374151] border border-gray-500/40 p-6 rounded-3xl shadow-lg">
        <span className="text-[10px] font-mono font-bold tracking-widest text-[#00F2FE] uppercase block">// ECOSYSTEM HOOKS</span>
        <h2 className="text-xl font-black text-white uppercase italic mt-1">Active Third-Party Integrations</h2>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl font-mono text-[11px] text-rose-400">
          ⚠ SECURITY_GATE_EXCEPTION: {errorMsg}
        </div>
      )}

      {/* Accordion List Loop Container */}
      <div className="space-y-3.5">
        {integrations.map((item) => {
          const isExpanded = activeItem === item.provider_key;
          const iconPrefix = item.provider_key.includes('stripe') ? '💳' : '🤝';

          return (
            <div 
              key={item.id} 
              className={`bg-[#374151] border rounded-2xl overflow-hidden transition-all duration-200 ${
                isExpanded ? 'border-gray-500/60 shadow-md' : 'border-gray-500/30 hover:border-gray-500/50'
              }`}
            >
              {/* Interaction Trigger Element */}
              <button 
                type="button" 
                onClick={() => setActiveItem(isExpanded ? null : item.provider_key)}
                className="w-full p-4 flex flex-col sm:flex-row sm:items-center justify-between font-mono text-xs font-bold text-white text-left focus:outline-none gap-3"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="text-sm flex-shrink-0">{iconPrefix}</span>
                  <span className="truncate tracking-wide">{item.provider_name}</span>
                </div>
                
                <div className="flex items-center gap-3 ml-6 sm:ml-0 flex-shrink-0">
                  <span className={`px-2 py-0.5 border text-[9px] uppercase font-bold tracking-wider rounded font-mono ${getStatusBadgeStyles(item.conduit_status, item.is_enabled)}`}>
                    {!item.is_enabled ? "DISABLED" : item.conduit_status}
                  </span>
                  <span className="text-gray-400 text-[10px] font-normal min-w-[50px] text-right">
                    {isExpanded ? "[ CLOSE ]" : "[ VIEW ]"}
                  </span>
                </div>
              </button>

              {/* Collapsible Blueprint Specs Drawer Layer */}
              {isExpanded && (
                <div className="border-t border-gray-500/20 bg-[#4B5563]/20 transition-all">
                  <div className="p-4 space-y-4">
                    <p className="text-xs text-gray-300 leading-relaxed font-sans">
                      {item.description}
                    </p>
                    
                    {/* Infrastructure Diagnostic Trace Metadata Line */}
                    <div className="flex justify-between items-center font-mono text-[9px] text-gray-400 pt-2 border-t border-gray-500/10">
                      <span>INTEGRATION_KEY: <span className="text-gray-300 font-bold">{item.provider_key.toUpperCase()}</span></span>
                      <span>
                        LAST_SYNC: {item.last_sync_at ? new Date(item.last_sync_at).toLocaleTimeString() : "NEVER"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}