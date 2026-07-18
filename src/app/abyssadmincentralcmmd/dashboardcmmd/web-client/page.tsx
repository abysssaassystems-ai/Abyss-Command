"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

// Importing your clean viewbar components modularly
import ClientProjectProgressTab from'@/viewbars/website-admin-client/ClientProjectProgressTab';
import ClientRequestsTab from'@/viewbars/website-admin-client/ClientRequestsTab';
import ClientMediaTab from'@/viewbars/website-admin-client/ClientMediaTab';
import ClientTaskListTab from'@/viewbars/website-admin-client/ClientTaskListTab';

interface ClientUser {
  id: string;
  email: string;
  account_name: string;
  access_level: string;
  created_at: string;
}

interface BrandingData {
  primary_color: string;
  secondary_color: string;
  tertiary_color: string;
  logo_shape: string;
  font_style: string;
  brand_tone: string;
  ui_theme_style: string;
  company_tagline: string;
  target_audience: string;
  uploaded_file_names: string[];
}

export default function AdminClientManager(): React.JSX.Element {
  const [clients, setClients] = useState<ClientUser[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedClient, setSelectedClient] = useState<ClientUser | null>(null);
  
  // Tab controller strings aligned to match your component targets
  const [activeInspectTab, setActiveInspectTab] = useState<"overview" | "branding" | "financials" | "tasks">("overview");
  const [brandingSpecs, setBrandingSpecs] = useState<BrandingData | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [terminalLog, setTerminalLog] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  useEffect(() => {
    async function pullClientRoster() {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('web_login_users')
        .select('*')
        .order('account_name', { ascending: true });

      if (!error && data) {
        setClients(data);
      } else if (error) {
        setTerminalLog({ type: "error", msg: `ROSTER_FAULT: ${error.message}` });
      }
      setIsLoading(false);
    }
    pullClientRoster();
  }, []);

  useEffect(() => {
    if (!selectedClient) return;
    const targetEmail = selectedClient.email;
    
    async function pullClientAssets() {
      setBrandingSpecs(null);
      const { data, error } = await supabase
        .from('client_branding_assets')
        .select('*')
        .eq('client_email', targetEmail)
        .maybeSingle();

      if (!error && data) {
        setBrandingSpecs({
          primary_color: data.primary_color || "#00F2FE",
          secondary_color: data.secondary_color || "#374151",
          tertiary_color: data.tertiary_color || "#F9FAFB",
          logo_shape: data.logo_shape || "square",
          font_style: data.font_style || "sans",
          brand_tone: data.brand_tone || "professional",
          ui_theme_style: data.ui_theme_style || "modern",
          company_tagline: data.company_tagline || "",
          target_audience: data.target_audience || "",
          uploaded_file_names: data.uploaded_file_names || []
        });
      } else if (!data) {
        setBrandingSpecs({
          primary_color: "#00F2FE",
          secondary_color: "#374151",
          tertiary_color: "#F9FAFB",
          logo_shape: "square",
          font_style: "sans",
          brand_tone: "professional",
          ui_theme_style: "modern",
          company_tagline: "",
          target_audience: "",
          uploaded_file_names: []
        });
      }
    }
    pullClientAssets();
  }, [selectedClient]);

  const executeAdminOverride = async () => {
    if (!selectedClient || !brandingSpecs) return;
    setIsUpdating(true);
    setTerminalLog(null);

    const targetEmail = selectedClient.email;
    const targetName = selectedClient.account_name;

    try {
      const { error } = await supabase
        .from('client_branding_assets')
        .upsert({
          client_email: targetEmail,
          ...brandingSpecs,
          updated_at: new Date().toISOString()
        });

      if (!error) {
        setTerminalLog({ type: "success", msg: `OVERRIDE_SUCCESS: Structural adjustments locked for ${targetName}.` });
      } else {
        setTerminalLog({ type: "error", msg: `MUTATION_REJECTED: ${error.message}` });
      }
    } catch (err: any) {
      setTerminalLog({ type: "error", msg: `EXCEPTION_CAUGHT: ${err.message || err}` });
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredClients = clients.filter(c => 
    c.account_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      
      {/* Master Operations Header Banner */}
      <header className="bg-[#374151] border border-gray-500/40 p-6 rounded-3xl shadow-xl flex justify-between items-center flex-wrap gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#00F2FE] uppercase block">
            // INTERNAL ADMINISTRATIVE COMMAND DECK
          </span>
          <h1 className="text-2xl font-black text-white uppercase italic mt-1">
            Client Infrastructure Matrix Overview
          </h1>
        </div>
        <div className="text-right text-[10px] font-mono text-gray-400 uppercase">
          <span>Role Rank: Super Admin</span>
        </div>
      </header>

      {terminalLog && (
        <div className={`p-3.5 rounded-xl font-mono text-[10px] border leading-relaxed ${
          terminalLog.type === "success" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-rose-500/10 border-rose-500/30 text-rose-400"
        }`}>
          {terminalLog.msg}
        </div>
      )}

      {/* Main Framework Layout Split */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Interactive Master Control Engine (4 Columns Wide) */}
        <div className="lg:col-span-4 bg-[#374151] border border-gray-500/40 p-5 rounded-3xl space-y-4">
          <div className="space-y-1">
            <span className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider block">// REGISTRY DIRECTORY LOOKUP</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client account name or email..."
              className="w-full bg-[#4B5563]/40 border border-gray-500/30 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-[#00F2FE]"
            />
          </div>

          <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1 custom-scrollbar">
            {isLoading ? (
              <div className="text-center font-mono text-[10px] text-gray-400 py-6 animate-pulse">// SCANNING CENTRAL DB NODES...</div>
            ) : filteredClients.length === 0 ? (
              <div className="text-center font-mono text-[10px] text-gray-500 py-6">// NO CLIENT MATCH ENCOUNTERED</div>
            ) : (
              filteredClients.map((client) => {
                const isSelected = selectedClient?.id === client.id;
                return (
                  <button
                    key={client.id}
                    type="button"
                    onClick={() => { setSelectedClient(client); setTerminalLog(null); }}
                    className={`w-full text-left p-3 rounded-xl border font-mono text-xs transition-all flex flex-col gap-1 ${
                      isSelected ? 'bg-[#4B5563] border-[#00F2FE]/50 shadow-md' : 'border-transparent bg-gray-950/10 hover:bg-gray-950/20'
                    }`}
                  >
                    <span className={`font-black uppercase tracking-wide ${isSelected ? 'text-[#00F2FE]' : 'text-white'}`}>
                      {client.account_name}
                    </span>
                    <span className="text-[10px] font-sans text-gray-400 truncate">{client.email}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Detail Operations Control Terminal (8 Columns Wide) */}
        <div className="lg:col-span-8 space-y-6">
          {selectedClient ? (
            <div className="bg-[#374151] border border-gray-500/40 p-6 rounded-3xl shadow-xl space-y-6">
              
              {/* Profile Context Banner & Switch Options Ribbon */}
              <div className="flex justify-between items-center border-b border-gray-500/20 pb-4 flex-wrap gap-4">
                <div>
                  <span className="text-[9px] font-mono font-bold text-[#00F2FE] uppercase tracking-wider block">// RUNNING SPEC INSPECTION</span>
                  <h2 className="text-lg font-black text-white uppercase italic">{selectedClient.account_name} Workspace</h2>
                </div>
                
                {/* 4-Tab Control Segment Ribbon */}
                <div className="flex bg-[#4B5563]/60 border border-gray-500/20 p-1 rounded-xl text-[10px] font-mono font-bold select-none">
                  {(['overview', 'branding', 'financials', 'tasks'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveInspectTab(tab)}
                      className={`px-3 py-1 rounded-md uppercase transition-all focus:outline-none ${
                        activeInspectTab === tab ? 'bg-white text-gray-950 font-black shadow-sm' : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      {tab === 'overview' ? 'Progress' : tab === 'branding' ? 'Branding' : tab === 'financials' ? 'Requests' : 'Tasks'}
                    </button>
                  ))}
                </div>
              </div>

              {/* VIEW MOUNT SWITCH ROUTER */}
              {activeInspectTab === 'overview' && (
                <ClientProjectProgressTab client={selectedClient} />
              )}

              {activeInspectTab === 'branding' && brandingSpecs && (
                <ClientMediaTab 
                  clientEmail={selectedClient.email}
                  brandingSpecs={brandingSpecs}
                  setBrandingSpecs={setBrandingSpecs}
                  onSaveOverride={executeAdminOverride}
                  isUpdating={isUpdating}
                />
              )}

              {activeInspectTab === 'financials' && (
                <ClientRequestsTab />
              )}

              {activeInspectTab === 'tasks' && (
                <ClientTaskListTab />
              )}

            </div>
          ) : (
            <div className="bg-[#374151]/40 border border-dashed border-gray-500/40 p-24 text-center rounded-3xl font-mono text-xs text-gray-400 uppercase tracking-wider">
              [ Select a client user profile node from the registry list to initiate spec controls ]
            </div>
          )}
        </div>

      </div>
    </div>
  );
}