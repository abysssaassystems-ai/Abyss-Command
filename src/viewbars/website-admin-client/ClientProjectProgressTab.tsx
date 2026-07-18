"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface ClientUser {
  id: string;
  email: string;
  created_at: string;
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

export default function ClientProjectProgressTab({ client }: { client: ClientUser }): React.JSX.Element {
  const [metrics, setMetrics] = useState<ProgressMetrics>({
    api_integrations: 0,
    hardware_integrations: 0,
    web_storage_setup: 0,
    website_frontend: 0,
    website_backend: 0,
    ui: 0,
    final_testing: 0,
    is_finalized: false
  });

  const [isSaving, setIsSubmitting] = useState<boolean>(false);
  const [logMsg, setLogMsg] = useState<string | null>(null);

  // 1. POLLING RUN: Read live database values on active card selections
  useEffect(() => {
    if (!client?.email) return;
    setLogMsg(null);
    
    async function pullCurrentProgress() {
      const { data, error } = await supabase
        .from('client_project_progress')
        .select('*')
        .eq('client_email', client.email)
        .maybeSingle();

      if (!error && data) {
        setMetrics({
          api_integrations: Math.min(100, Math.max(0, data.api_integrations || 0)),
          hardware_integrations: Math.min(100, Math.max(0, data.hardware_integrations || 0)),
          web_storage_setup: Math.min(100, Math.max(0, data.web_storage_setup || 0)),
          website_frontend: Math.min(100, Math.max(0, data.website_frontend || 0)),
          website_backend: Math.min(100, Math.max(0, data.website_backend || 0)),
          ui: Math.min(100, Math.max(0, data.ui || 0)),
          final_testing: Math.min(100, Math.max(0, data.final_testing || 0)),
          is_finalized: data.is_finalized || false
        });
      } else {
        // Fallback default structure resets
        setMetrics({
          api_integrations: 0,
          hardware_integrations: 0,
          web_storage_setup: 0,
          website_frontend: 0,
          website_backend: 0,
          ui: 0,
          final_testing: 0,
          is_finalized: false
        });
      }
    }
    pullCurrentProgress();
  }, [client]);

  // 2. TRANSACTION DISPATCH: Initial lock down of baseline parameters to schema
  const handleCommitWizard = async () => {
    setIsSubmitting(true);
    setLogMsg(null);

    try {
      const { error } = await supabase
        .from('client_project_progress')
        .upsert({
          client_email: client.email,
          api_integrations: Math.min(100, metrics.api_integrations),
          hardware_integrations: Math.min(100, metrics.hardware_integrations),
          web_storage_setup: Math.min(100, metrics.web_storage_setup),
          website_frontend: Math.min(100, metrics.website_frontend),
          website_backend: Math.min(100, metrics.website_backend),
          ui: Math.min(100, metrics.ui),
          final_testing: Math.min(100, metrics.final_testing),
          is_finalized: true,
          updated_at: new Date().toISOString()
        });

      if (!error) {
        setMetrics(prev => ({ ...prev, is_finalized: true }));
        setLogMsg("PROGRESS_MUTATION_LOCKED: Project state finalized. UI transformed into direct status switches.");
      } else {
        setLogMsg(`MUTATION_ERROR: ${error.message}`);
      }
    } catch (err: any) {
      setLogMsg(`EXCEPTION: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. POST-SUBMISSION INSTANT UPDATE: Direct live-sync when switching statuses on finalized profiles
  const handleStatusSwitch = async (key: keyof Omit<ProgressMetrics, 'is_finalized'>, targetStatus: 'in-progress' | 'completed') => {
    if (!metrics.is_finalized || !client?.email) return;
    
    // Assign 50% for standard in-progress visibility and 100% for completed states
    const targetValue = targetStatus === 'completed' ? 100 : 50;
    
    const updatedMetrics = {
      ...metrics,
      [key]: targetValue
    };

    // Update local state instantaneously for snappy UI response
    setMetrics(updatedMetrics);

    try {
      const { error } = await supabase
        .from('client_project_progress')
        .upsert({
          client_email: client.email,
          ...updatedMetrics,
          updated_at: new Date().toISOString()
        });

      if (error) {
        setLogMsg(`LIVE_SYNC_FAULT: Could not update cloud state. ${error.message}`);
      }
    } catch (err: any) {
      setLogMsg(`LIVE_EXCEPTION: ${err.message}`);
    }
  };

  const renderWizardSlider = (label: string, stateKey: keyof Omit<ProgressMetrics, 'is_finalized'>) => {
    const isCompleted = metrics[stateKey] === 100;

    return (
      <div 
        className={`p-4 border rounded-2xl transition-all select-none bg-gray-950/10 border-gray-500/10 hover:border-gray-500/20`}
      >
        <div className="flex justify-between items-center font-mono text-xs mb-2.5">
          <span className={`font-bold ${metrics.is_finalized && isCompleted ? 'text-emerald-400' : 'text-white'}`}>
            {metrics.is_finalized && isCompleted ? "✓ " : "⚡ "} {label}
          </span>
          <span className={`font-black ${metrics.is_finalized && isCompleted ? 'text-emerald-400' : 'text-[#00F2FE]'}`}>
            {metrics[stateKey]}%
          </span>
        </div>

        {/* CONDITION STATE A: Pre-Submission Mode (Standard Range Sliders) */}
        {!metrics.is_finalized ? (
          <div className="space-y-2">
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={metrics[stateKey]}
              onChange={(e) => {
                const parsedVal = parseInt(e.target.value) || 0;
                // Double protection guard to strictly seal data between 0% and 100%
                const constrainedVal = Math.min(100, Math.max(0, parsedVal));
                setMetrics({ ...metrics, [stateKey]: constrainedVal });
              }}
              className="w-full h-1.5 bg-[#4B5563] rounded-lg appearance-none cursor-pointer accent-[#00F2FE]"
            />
          </div>
        ) : (
          /* CONDITION STATE B: Post-Submission Mode (Interactive Status Grid Switches) */
          <div className="space-y-3 font-mono text-[10px]">
            {/* Visual Mini Progress Bar indicator */}
            <div className="w-full h-1 bg-gray-950/40 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${isCompleted ? 'bg-emerald-500' : 'bg-amber-400'}`}
                style={{ width: `${metrics[stateKey]}%` }}
              />
            </div>
            
            {/* Split Switcher Buttons */}
            <div className="flex gap-2 pt-0.5">
              <button
                type="button"
                onClick={() => handleStatusSwitch(stateKey, 'in-progress')}
                className={`flex-1 py-1.5 rounded-lg border font-bold uppercase transition-all focus:outline-none ${
                  !isCompleted 
                    ? 'bg-amber-500/20 border-amber-400 text-amber-400 font-black shadow-[0_0_8px_rgba(245,158,11,0.05)]' 
                    : 'bg-transparent border-gray-500/10 text-gray-500 hover:text-gray-400 hover:border-gray-500/20'
                }`}
              >
                ⚙ In Progress
              </button>
              
              <button
                type="button"
                onClick={() => handleStatusSwitch(stateKey, 'completed')}
                className={`flex-1 py-1.5 rounded-lg border font-bold uppercase transition-all focus:outline-none ${
                  isCompleted 
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400 font-black shadow-[0_0_8px_rgba(16,185,129,0.05)]' 
                    : 'bg-transparent border-gray-500/10 text-gray-500 hover:text-gray-400 hover:border-gray-500/20'
                }`}
              >
                ✓ Completed
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Control Navigation Header Line */}
      <div className="flex justify-between items-center flex-wrap gap-3 border-b border-gray-500/10 pb-3">
        <div>
          <span className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider block">// PIPELINE WIZARD ARCHITECTURE</span>
          <h3 className="text-sm font-black text-white uppercase font-mono">Milestone Configuration Core</h3>
        </div>
        <button
          type="button"
          onClick={handleCommitWizard}
          disabled={isSaving || metrics.is_finalized}
          className={`px-5 py-2 rounded-xl font-mono font-bold text-[10px] uppercase tracking-wider border transition-all focus:outline-none ${
            metrics.is_finalized 
              ? 'bg-transparent border-emerald-500/30 text-emerald-400 font-black cursor-default' 
              : 'bg-gradient-to-r from-[#00B8C4] to-[#00F2FE] text-gray-900 font-black border-transparent shadow-lg hover:opacity-90 disabled:opacity-40'
          }`}
        >
          {metrics.is_finalized ? "🔒 METRIC NODE MODULE LOCKED" : "⚡ FINALIZE PROJECT LAYOUT"}
        </button>
      </div>

      {logMsg && (
        <div className="p-3 bg-gray-950/20 border border-[#00F2FE]/20 rounded-xl font-mono text-[10px] text-gray-300 leading-relaxed">
          // {logMsg}
        </div>
      )}

      {metrics.is_finalized && (
        <p className="text-[11px] font-sans text-gray-400 italic bg-black/10 p-3 rounded-xl border border-gray-500/5 text-center">
          💡 This profile has been finalized. Click **`In Progress`** or **`Completed`** on any block to dynamically update the live cloud channel.
        </p>
      )}

      {/* Grid of Sliders */}
      <div className="grid sm:grid-cols-2 gap-4">
        {renderWizardSlider("API Integrations Network", "api_integrations")}
        {renderWizardSlider("Hardware Register Hooksets", "hardware_integrations")}
        {renderWizardSlider("Web Cloud Storage Setup", "web_storage_setup")}
        {renderWizardSlider("Website Frontend Code Layer", "website_frontend")}
        {renderWizardSlider("Website Backend Controller Core", "website_backend")}
        {renderWizardSlider("User Interface UX Theme Map", "ui")}
        {renderWizardSlider("Final Security Sandbox Testing", "final_testing")}
      </div>

    </div>
  );
}