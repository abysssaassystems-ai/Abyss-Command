"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface StandardPackageInquiry {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  selected_framework: 'startup' | 'established' | 'growth' | 'enterprise';
  custom_message: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
}

// Fixed framework map matching your intake configurations
const packagePricing = {
  startup: { name: "Startup Framework", price: "$799" },
  established: { name: "Established System", price: "$1,999" },
  growth: { name: "Growth Ecosystem", price: "$2,999+" },
  enterprise: { name: "Enterprise Core", price: "$4,999+" }
};

export default function StandardPackageInquiriesDashboard(): React.JSX.Element {
  const [packageInquiries, setPackageInquiries] = useState<StandardPackageInquiry[]>([]);
  const [activeTab, setActiveTab] = useState<"pending" | "archive">("pending");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 1. DATA READ SWEEP: Hydrate state engine with production values from Supabase
  useEffect(() => {
    async function fetchPackageInquiries() {
      try {
        const { data, error } = await supabase
          .from('standard_package_inquiries')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          setPackageInquiries(data);
        } else {
          console.error("SUPABASE_DATA_FETCH_CRITICAL:", error?.message);
        }
      } catch (err) {
        console.error("NET_HANDSHAKE_TIMEOUT:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPackageInquiries();
  }, []);

  // 2. DATA MUTATION sweep: Commit pipeline step updates straight to Supabase
  const updateInquiryStatus = async (id: string, newStatus: 'pending' | 'accepted' | 'declined') => {
    try {
      const { error } = await supabase
        .from('standard_package_inquiries')
        .update({ status: newStatus })
        .eq('id', id);

      if (!error) {
        // Optimistic UI refresh wrapper updates active list instances instantly
        setPackageInquiries(prev => prev.map(item => 
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
  // Communications Protocol Generation Links
  // ----------------------------------------------------
  const compileSmsLink = (item: StandardPackageInquiry, type: 'accepted' | 'declined') => {
    const pkg = packagePricing[item.selected_framework];
    const baseMessage = type === 'accepted'
      ? `Hi ${item.client_name}, this is Abyss Systems. Your order layout request for the ${pkg.name} package (${pkg.price}) has cleared initial system verification! Let's arrange a quick integration sync to deploy your design assets.`
      : `Hi ${item.client_name}. Thank you for reaching out regarding our ${pkg.name}. Unfortunately, our active development sprints are full for this package tier this quarter. We have logged your profile for future openings.`;

    return `sms:${item.client_phone}?body=${encodeURIComponent(baseMessage)}`;
  };

  const compileMailLink = (item: StandardPackageInquiry, type: 'accepted' | 'declined') => {
    const pkg = packagePricing[item.selected_framework];
    const subject = type === 'accepted'
      ? `ABYSS CORE // Package Framework Order Approved: ${pkg.name}`
      : `ABYSS CORE // System Resource Capacity Notice`;

    const body = type === 'accepted'
      ? `Hi ${item.client_name},\n\nYour application selection request for the standard ${pkg.name} matrix has been accepted into our active deployment queue.\n\nSelected Deployment Parameters:\n- Tier Structure: ${pkg.name}\n- Base Invariant Rate: ${pkg.price} Flat\n\nYour provided brief details:\n"${item.custom_message}"\n\nReply directly to this data connection node to proceed with credential ingestion workflows.`
      : `Hi ${item.client_name},\n\nThank you for choosing Abyss Systems for your framework footprint alignment.\n\nDue to heavy volume constraints across our fixed single-feature production channels, we are archiving your application request for the ${pkg.name} architecture at this time.`;

    return `mailto:${item.client_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const pendingList = packageInquiries.filter(i => i.status === 'pending');
  const archiveList = packageInquiries.filter(i => i.status === 'accepted' || i.status === 'declined');
  const visibleList = activeTab === 'pending' ? pendingList : archiveList;

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto py-32 text-center select-none">
        <span className="text-xs font-mono font-bold tracking-widest text-[#00F2FE] uppercase animate-pulse">
          // ACCESSING CLOUD NODES :: INITIALIZING REAL-TIME INGESTION OVERLAYS...
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 select-none">
      
      {/* Aligned Header Tracking Module */}
      <header className="flex flex-col md:flex-row md:justify-between md:items-center bg-[#374151] border border-gray-500/40 p-6 rounded-3xl shadow-lg gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#00F2FE] uppercase block">// MODULE :: STANDARD_PACKAGE_INQUIRIES</span>
          <h2 className="text-2xl font-black text-white uppercase italic mt-1">Standard Package Inquiries</h2>
        </div>

        <div className="flex bg-[#4B5563] p-1 border border-gray-500/20 rounded-xl gap-1">
          <button 
            type="button"
            onClick={() => setActiveTab("pending")}
            className={`px-5 py-2 font-bold text-xs uppercase tracking-wider rounded-lg transition-all ${activeTab === 'pending' ? 'bg-[#00B8C4] text-gray-900 shadow-md font-black' : 'text-gray-300 hover:text-white'}`}
          >
            Pending Queue ({pendingList.length})
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

      {/* Main Database Submittal Viewport */}
      <section className="space-y-6">
        {visibleList.length === 0 ? (
          <div className="text-center py-16 bg-[#374151]/40 border border-gray-500/20 rounded-2xl text-xs font-mono text-gray-400 uppercase tracking-wider">
            No record profiles found in standard package inquiries queue block.
          </div>
        ) : (
          visibleList.map((item) => {
            const currentPkg = packagePricing[item.selected_framework];
            const formattedDate = new Date(item.created_at).toLocaleDateString("en-US", {
              month: "long",
              day: "2-digit",
              year: "numeric"
            });

            return (
              <div 
                key={item.id}
                className="bg-[#374151] border border-gray-500/40 p-6 rounded-3xl shadow-md transition-all flex flex-col justify-between gap-5 hover:border-gray-400 relative"
              >
                {/* Meta Customer Header Info Block */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-start border-b border-gray-500/20 pb-4 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xl font-black text-white uppercase italic tracking-wide">{item.client_name}</h3>
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-[#4B5563] text-gray-200 border border-gray-500/30 px-2.5 py-0.5 rounded">
                        {currentPkg.name}
                      </span>
                      {item.status !== 'pending' && (
                        <span className={`text-[9px] font-bold uppercase tracking-wider border px-2 py-0.5 rounded ${
                          item.status === 'accepted' ? 'bg-cyan-500/10 text-[#00F2FE] border-[#00F2FE]/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                          {item.status}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 font-mono pt-0.5">
                      Secure Channels: {item.client_email} // {item.client_phone}
                    </p>
                  </div>

                  <div className="text-left md:text-right">
                    <span className="text-2xl font-black text-[#00F2FE] text-glow font-mono">{currentPkg.price}</span>
                    <span className="text-[10px] text-gray-400 block font-mono">Submitted: {formattedDate}</span>
                  </div>
                </div>

                {/* Scope Core Message Ingestion */}
                <div className="space-y-1">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-gray-400 block">User Spec Project Message</span>
                  <p className="text-xs text-gray-200 leading-relaxed bg-[#4B5563]/20 border border-gray-500/10 p-4 rounded-xl italic">
                    "{item.custom_message}"
                  </p>
                </div>

                {/* Interactive State Action Controllers */}
                {activeTab === "pending" ? (
                  <div className="flex flex-wrap gap-3 items-center pt-2 border-t border-gray-500/20">
                    <button
                      type="button"
                      onClick={() => updateInquiryStatus(item.id, "accepted")}
                      className="px-5 py-2.5 bg-gradient-to-r from-[#00B8C4] to-[#00F2FE] text-gray-900 font-black text-xs uppercase tracking-wider rounded-xl hover:opacity-95 focus:outline-none"
                    >
                      Continue with project approval
                    </button>
                    <button
                      type="button"
                      onClick={() => updateInquiryStatus(item.id, "declined")}
                      className="px-5 py-2.5 bg-transparent border border-gray-500/40 text-rose-400 hover:bg-rose-500 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl focus:outline-none"
                    >
                      Reject Capacity Profile
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-gray-500/20">
                    {/* OS Automation Triggers */}
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={compileSmsLink(item, item.status as 'accepted' | 'declined')}
                        className="px-4 py-2 bg-[#4B5563] border border-gray-500/30 text-[#00F2FE] text-glow font-bold text-[10px] uppercase tracking-wider rounded-xl flex items-center transition-all hover:border-[#00F2FE]"
                      >
                        💬 Send Response SMS
                      </a>
                      <a
                        href={compileMailLink(item, item.status as 'accepted' | 'declined')}
                        className="px-4 py-2 bg-[#4B5563] border border-gray-500/30 text-white font-bold text-[10px] uppercase tracking-wider rounded-xl flex items-center transition-all hover:border-white"
                      >
                        ✉️ Send Response Email
                      </a>
                    </div>

                    {/* Operational Undo Loop Recovery Node */}
                    <button
                      type="button"
                      onClick={() => updateInquiryStatus(item.id, "pending")}
                      className="text-[10px] font-mono font-bold text-gray-400 hover:text-white uppercase tracking-widest focus:outline-none bg-transparent px-3 py-1.5 rounded border border-gray-500/10 hover:border-gray-500/40 transition"
                    >
                      ↺ Undo State Decision
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