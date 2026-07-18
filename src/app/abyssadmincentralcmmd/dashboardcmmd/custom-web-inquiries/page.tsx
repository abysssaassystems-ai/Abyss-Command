"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface CustomInquiry {
  id: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  involves_hardware: boolean;
  hardware_units: number;
  screen_layouts: number;
  api_gateways: number;
  sms_volume: number;
  is_not_for_profit: boolean;
  calculated_quote: number;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
}

export default function CustomWebInquiriesDashboard(): React.JSX.Element {
  const [inquiries, setInquiries] = useState<CustomInquiry[]>([]);
  const [activeTab, setActiveTab] = useState<"pending" | "archive">("pending");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 1. DATA READ SWEEP: Sync system state layout to real-time Supabase telemetry rows
  useEffect(() => {
    async function fetchCustomInquiries() {
      try {
        const { data, error } = await supabase
          .from('custom_web_inquiries')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          setInquiries(data);
        } else {
          console.error("SUPABASE_DATA_FETCH_CRITICAL:", error?.message);
        }
      } catch (err) {
        console.error("NET_HANDSHAKE_TIMEOUT:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCustomInquiries();
  }, []);

  // 2. DATA MUTATION SWEEP: Push active workflow decisions back into live database
  const updateInquiryStatus = async (id: string, newStatus: 'pending' | 'accepted' | 'declined') => {
    try {
      const { error } = await supabase
        .from('custom_web_inquiries')
        .update({ status: newStatus })
        .eq('id', id);

      if (!error) {
        // Safe tracking state mapper forces UI updates on the fly
        setInquiries(prev => prev.map(item => 
          item.id === id ? { ...item, status: newStatus } : item
        ));
      } else {
        console.error("SUPABASE_MUTATION_DENIED:", error.message);
      }
    } catch (err) {
      console.error("NET_MUTATION_CRITICAL_FAILURE:", err);
    }
  };

  // ----------------------------------------------------
  // Native Communications Link Compilers
  // ----------------------------------------------------
  const compileSmsLink = (item: CustomInquiry, type: 'accepted' | 'declined') => {
    const baseMessage = type === 'accepted'
      ? `Hi ${item.contact_name}, this is Abyss Systems. Great news! Your custom framework blueprint request for ${item.company_name} ($${item.calculated_quote.toFixed(2)}+) has been approved by our engineering squad. Let's schedule a call to lock down your production deployment block.`
      : `Hi ${item.contact_name}. We reviewed your custom configuration plan for ${item.company_name}. Unfortunately, the requested hardware parameters sit outside our core node cluster capabilities at this time.`;
    
    return `sms:${item.contact_phone}?body=${encodeURIComponent(baseMessage)}`;
  };

  const compileMailLink = (item: CustomInquiry, type: 'accepted' | 'declined') => {
    const subject = type === 'accepted' 
      ? `ABYSS CORE // Custom Architecture Approved: ${item.company_name}` 
      : `ABYSS CORE // Framework Specifications Notice`;
      
    const body = type === 'accepted'
      ? `Hi ${item.contact_name},\n\nYour recent structural scope submittal for ${item.company_name} has cleared our base engineering evaluation metrics.\n\nSummary Specs:\n- Layout Screens: ${item.screen_layouts}\n- API Integrations: ${item.api_gateways}\n- Hardware Clusters: ${item.involves_hardware ? `${item.hardware_units} Units` : 'None'}\n\nEstimated Baseline Blueprint Investment: $${item.calculated_quote.toFixed(2)}+\n\nReply directly to this data line thread to coordinate deployment windows.`
      : `Hi ${item.contact_name},\n\nThank you for submitting your custom platform requirements layout for ${item.company_name}.\n\nAfter rendering data simulations, your parameter requests require custom legacy configurations outside our active single-feature micro-node arrays. We will archive this profile file.`;

    return `mailto:${item.contact_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const pendingList = inquiries.filter(i => i.status === 'pending');
  const archiveList = inquiries.filter(i => i.status === 'accepted' || i.status === 'declined');
  const visibleList = activeTab === 'pending' ? pendingList : archiveList;

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto py-32 text-center select-none">
        <span className="text-xs font-mono font-bold tracking-widest text-[#00F2FE] uppercase block animate-pulse">
          // ACCESSING CLOUD NODES :: PARSING LIVE CALCULATOR LEAD MATRIX FLOW...
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 select-none">
      
      {/* Structural Tracking Header */}
      <header className="flex flex-col md:flex-row md:justify-between md:items-center bg-[#374151] border border-gray-500/40 p-6 rounded-3xl shadow-lg gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#00F2FE] uppercase block">// MODULE :: CUSTOM_INQUIRIES</span>
          <h2 className="text-2xl font-black text-white uppercase italic mt-1">Pipeline Submittal Hub</h2>
        </div>

        <div className="flex bg-[#4B5563] p-1 border border-gray-500/20 rounded-xl gap-1">
          <button 
            type="button"
            onClick={() => setActiveTab("pending")}
            className={`px-5 py-2 font-bold text-xs uppercase tracking-wider rounded-lg transition-all ${activeTab === 'pending' ? 'bg-[#00B8C4] text-gray-900 shadow-md font-black' : 'text-gray-300 hover:text-white'}`}
          >
            Pending Influx ({pendingList.length})
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab("archive")}
            className={`px-5 py-2 font-bold text-xs uppercase tracking-wider rounded-lg transition-all ${activeTab === 'archive' ? 'bg-[#00B8C4] text-gray-900 shadow-md font-black' : 'text-gray-300 hover:text-white'}`}
          >
            Archive Logs ({archiveList.length})
          </button>
        </div>
      </header>

      {/* Main Framework Processing Feed */}
      <section className="space-y-6">
        {visibleList.length === 0 ? (
          <div className="text-center py-16 bg-[#374151]/40 border border-gray-500/20 rounded-2xl text-xs font-mono text-gray-400 uppercase tracking-wider">
            No pipeline records found in target query block.
          </div>
        ) : (
          visibleList.map((item) => {
            const formattedDate = new Date(item.created_at).toLocaleDateString("en-US", {
              month: "long",
              day: "2-digit",
              year: "numeric"
            });

            return (
              <div 
                key={item.id} 
                className="bg-[#374151] border border-gray-500/40 p-6 rounded-3xl shadow-md transition-all flex flex-col justify-between gap-6 hover:border-gray-400 relative"
              >
                {/* Card Meta Header Info */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-start border-b border-gray-500/20 pb-4 gap-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xl font-black text-white uppercase italic tracking-wide">{item.company_name}</h3>
                      {item.is_not_for_profit && (
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                          Not-For-Profit
                        </span>
                      )}
                      {item.status !== 'pending' && (
                        <span className={`text-[9px] font-bold uppercase tracking-wider border px-2 py-0.5 rounded ${
                          item.status === 'accepted' ? 'bg-cyan-500/10 text-[#00F2FE] border-[#00F2FE]/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                          {item.status}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1 font-mono">
                      Lead Identity: {item.contact_name} // {item.contact_email} // {item.contact_phone}
                    </p>
                  </div>
                  
                  <div className="text-left md:text-right">
                    <span className="text-2xl font-black text-[#00F2FE] text-glow font-mono">${item.calculated_quote.toFixed(2)}+</span>
                    <span className="text-[10px] text-gray-400 block font-mono">Scope Influx Date: {formattedDate}</span>
                  </div>
                </div>

                {/* Slider System Resource Allocation Layout Specifications */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#4B5563]/20 border border-gray-500/10 p-4 rounded-xl text-xs font-mono">
                  <div>
                    <span className="text-gray-400 block text-[9px] uppercase tracking-wider">Interface Panels</span>
                    <span className="text-white font-bold">{item.screen_layouts} Core Layouts</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[9px] uppercase tracking-wider">API Handshakes</span>
                    <span className="text-white font-bold">{item.api_gateways} Gateways</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[9px] uppercase tracking-wider">SMS Pipeline Load</span>
                    <span className="text-white font-bold">{item.sms_volume.toLocaleString()} /mo</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[9px] uppercase tracking-wider">Hardware Subsystems</span>
                    <span className={item.involves_hardware ? "text-[#00F2FE] font-bold" : "text-gray-300"}>
                      {item.involves_hardware ? `${item.hardware_units} Units Linked` : "None"}
                    </span>
                  </div>
                </div>

                {/* Dynamic Context Action Logic Panels */}
                {activeTab === "pending" ? (
                  <div className="flex flex-wrap gap-3 items-center pt-3 border-t border-gray-500/20">
                    <button
                      type="button"
                      onClick={() => updateInquiryStatus(item.id, "accepted")}
                      className="px-5 py-2.5 bg-gradient-to-r from-[#00B8C4] to-[#00F2FE] text-gray-900 font-black text-xs uppercase tracking-wider rounded-xl hover:opacity-95 focus:outline-none"
                    >
                      Accept Build Framework
                    </button>
                    <button
                      type="button"
                      onClick={() => updateInquiryStatus(item.id, "declined")}
                      className="px-5 py-2.5 bg-transparent border border-gray-500/40 text-rose-400 hover:bg-rose-500 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl focus:outline-none"
                    >
                      Decline Build Profile
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-gray-500/20">
                    {/* Native Dispatcher Actions */}
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={compileSmsLink(item, item.status as 'accepted' | 'declined')}
                        className="px-4 py-2 bg-[#4B5563] border border-gray-500/30 text-[#00F2FE] text-glow font-bold text-[10px] uppercase tracking-wider rounded-xl flex items-center transition-all hover:border-[#00F2FE]"
                      >
                        💬 Dispatch Automated SMS
                      </a>
                      <a
                        href={compileMailLink(item, item.status as 'accepted' | 'declined')}
                        className="px-4 py-2 bg-[#4B5563] border border-gray-500/30 text-white font-bold text-[10px] uppercase tracking-wider rounded-xl flex items-center transition-all hover:border-white"
                      >
                        ✉️ Dispatch System Email
                      </a>
                    </div>

                    {/* Operational Undo Recovery Mechanism */}
                    <button
                      type="button"
                      onClick={() => updateInquiryStatus(item.id, "pending")}
                      className="text-[10px] font-mono font-bold text-gray-400 hover:text-white uppercase tracking-widest focus:outline-none bg-transparent px-3 py-1.5 rounded border border-gray-500/10 hover:border-gray-500/40 transition"
                    >
                      ↺ Undo Decision Node
                    </button>
                  </div>
                )}

              </div>
            );
          })
        )}
      </section>

    </div>
  );
}