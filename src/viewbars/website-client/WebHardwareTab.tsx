"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface HardwareDevice {
  id: string;
  device_name: string;
  device_serial: string;
  device_type: string;
  status: 'online' | 'offline' | 'syncing';
  conduit_state: string;
  last_pulse_at: string | null;
}

export default function WebHardwareTab(): React.JSX.Element {
  const [devices, setDevices] = useState<HardwareDevice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const aggregateHardwareTopology = async () => {
      try {
        setIsLoading(true);
        setErrorMsg(null);

        // 1. SESSION INTEGRITY RESOLUTION: Pull current session user context safely
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          setErrorMsg("SECURITY_TOKEN_INVALID: Workspace perimeter authorization failed.");
          return;
        }

        // 2. DATA CHANNEL ACQUISITION: Query the explicit hardware matrix table matched via UUID
        const { data, error: dbError } = await supabase
          .from('client_hardware_devices')
          .select('id, device_name, device_serial, device_type, status, conduit_state, last_pulse_at')
          .eq('user_id', user.id)
          .order('device_name', { ascending: true });

        if (dbError) {
          throw new Error(`TOPOLOGY_FETCH_FAULT: ${dbError.message}`);
        }

        setDevices(data || []);
      } catch (err: any) {
        setErrorMsg(err.message || "UNCAUGHT_IOT_HARDWARE_DISCOVERY_EXCEPTION");
      } finally {
        setIsLoading(false);
      }
    };

    aggregateHardwareTopology();
  }, []);

  const formatTimestamp = (isoString: string | null) => {
    if (!isoString) return "NEVER";
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }) + " UTC";
  };

  if (isLoading) {
    return (
      <div className="w-full h-48 flex items-center justify-center font-mono text-[11px] text-gray-400">
        <div className="text-center space-y-2">
          <div className="animate-pulse tracking-widest text-[#00F2FE] font-bold">// DISCOVERING ONSITE IOT CONDUITS //</div>
          <div>POLLING PERIPHERAL REGISTERS...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn select-none max-w-5xl mx-auto">
      
      {/* Header Matrix Block */}
      <div className="bg-[#374151] border border-gray-500/40 p-6 rounded-3xl shadow-lg">
        <span className="text-[10px] font-mono font-bold tracking-widest text-[#00F2FE] uppercase block">// IOT LAYER MODIFIERS</span>
        <h2 className="text-xl font-black text-white uppercase italic mt-1">Physical Device System Matrix</h2>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl font-mono text-[11px] text-rose-400">
          ⚠ BUS_ERROR_INGESTION_HALT: {errorMsg}
        </div>
      )}

      {/* Main Dynamic Peripheral Node Listing Loop */}
      {devices.length === 0 ? (
        <div className="bg-[#374151] border border-gray-500/30 rounded-3xl p-8 text-center font-mono text-xs text-gray-400 italic">
          // NO REGISTER ASSETS CURRENTLY ASSOCIATED WITH THIS INTERFACE PROFILE NODE //
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {devices.map((device) => (
            <div 
              key={device.id} 
              className="bg-[#374151] border border-gray-500/40 p-5 rounded-3xl space-y-3 shadow-md flex flex-col justify-between transition-all hover:border-gray-500/60"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-black text-white uppercase font-mono tracking-wide flex items-center gap-1.5">
                    <span>{device.device_type === 'register' ? '📟' : '🖨'}</span> 
                    {device.device_name}
                  </h3>
                  
                  {/* Status Indicator Mapping Module */}
                  <span className={`h-2.5 w-2.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)] ${
                    device.status === 'online' 
                      ? 'bg-emerald-400 animate-pulse' 
                      : device.status === 'syncing' 
                      ? 'bg-amber-400 animate-bounce' 
                      : 'bg-rose-500'
                  }`} />
                </div>
                
                <div className="flex justify-between font-mono text-[9px] text-gray-400">
                  <span>SERIAL: {device.device_serial}</span>
                  <span>LAST_PULSE: {formatTimestamp(device.last_pulse_at)}</span>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed font-sans pt-1">
                  Establishes an active secure link between your real-world checkout desk configurations and your digital shop database.
                </p>
              </div>

              <div className="p-2.5 bg-gray-950/20 border border-gray-500/10 rounded-xl font-mono text-[9px] text-gray-400 flex justify-between items-center">
                <span>CONDUIT_STATE: <span className="text-white font-semibold">{device.conduit_state}</span></span>
                <span className="text-[8px] uppercase tracking-wider font-bold opacity-60">LINK_SECURE</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}