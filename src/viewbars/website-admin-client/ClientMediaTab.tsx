"use client";
import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

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
  is_approved?: boolean;
}

interface MediaTabProps {
  clientEmail: string;
  brandingSpecs: BrandingData;
  setBrandingSpecs: React.Dispatch<React.SetStateAction<BrandingData | null>>;
  onSaveOverride: () => Promise<void>;
  isUpdating: boolean;
}

export default function ClientMediaTab({
  clientEmail,
  brandingSpecs,
  setBrandingSpecs,
  onSaveOverride,
  isUpdating
}: MediaTabProps): React.JSX.Element {
  const [approvalStatus, setApprovalStatus] = useState<string | null>(null);

  const getPublicUrl = (fileName: string) => {
    const { data } = supabase.storage.from('branding-assets').getPublicUrl(fileName);
    return data?.publicUrl || "";
  };

  const handleDownloadAsset = (fileName: string) => {
    const url = getPublicUrl(fileName);
    if (!url) return;
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.target = '_blank';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  // Toggles the RLS-approved corporate design profile switch on the cloud ledger
  const toggleApprovalGate = async () => {
    if (!clientEmail) return;
    setApprovalStatus("Processing signature...");
    const nextState = !brandingSpecs.is_approved;

    try {
      const { error } = await supabase
        .from('client_branding_assets')
        .update({ is_approved: nextState })
        .eq('client_email', clientEmail);

      if (!error) {
        setBrandingSpecs(prev => prev ? { ...prev, is_approved: nextState } : null);
        setApprovalStatus(nextState ? "APPROVED: Profile status finalized." : "REVOKED: Layout opened for editing.");
      } else {
        setApprovalStatus(`ERROR: ${error.message}`);
      }
    } catch (err: any) {
      setApprovalStatus(`FAULT: ${err.message || err}`);
    }
  };

  const isImageFile = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase() || "";
    return ['png', 'jpg', 'jpeg', 'svg', 'webp', 'gif'].includes(ext);
  };

  return (
    <div className="space-y-6 animate-fadeIn select-none">
      
      {/* Configuration Header Area */}
      <div className="flex justify-between items-center flex-wrap gap-3 border-b border-gray-500/10 pb-3">
        <div>
          <span className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider block">// ASSET MANAGEMENT CONSOLE</span>
          <h3 className="text-sm font-black text-white uppercase font-mono">Branding Configuration Desk</h3>
        </div>
        <div className="flex gap-2">
          <button 
            type="button" 
            onClick={toggleApprovalGate} 
            className={`px-4 py-1.5 rounded-lg text-[10px] font-mono font-bold border transition-all ${
              brandingSpecs.is_approved 
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.1)]' 
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}
          >
            {brandingSpecs.is_approved ? "✓ SIGNED & APPROVED" : "⚠️ APPROVE DESIGN BLUEPRINT"}
          </button>
          <button type="button" onClick={onSaveOverride} disabled={isUpdating} className="px-4 py-1.5 bg-[#4B5563] border border-gray-500/30 text-white hover:border-[#00F2FE] rounded-lg text-[10px] font-mono font-bold transition-all disabled:opacity-40">
            {isUpdating ? "SAVING..." : "[ SAVE OVERRIDES ]"}
          </button>
        </div>
      </div>

      {approvalStatus && (
        <div className="p-3 bg-gray-950/20 border border-gray-500/20 rounded-xl font-mono text-[10px] text-gray-300">
          ⚙ SYSTEM_LOG // {approvalStatus}
        </div>
      )}

      {/* Renders the corporate asset summary box when approval metrics pass validation */}
      {brandingSpecs.is_approved && (
        <div className="p-5 bg-gradient-to-r from-emerald-950/20 to-teal-950/20 border border-emerald-500/30 rounded-2xl space-y-3 shadow-xl">
          <span className="text-[8px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">✦ APPROVED PLATFORM DESIGN SYSTEM SUMMARY</span>
          <p className="text-xs text-gray-200 leading-relaxed font-sans">
            This design system profile has been verified and locked. Our engineering layers are currently compiling the UI components using the following specifications:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono text-gray-300 bg-black/10 p-3 rounded-xl border border-gray-500/5">
            <div>🎨 PRIMARY: <span className="text-white font-bold">{brandingSpecs.primary_color}</span></div>
            <div>📐 SHAPE: <span className="text-white font-bold uppercase">{brandingSpecs.logo_shape}</span></div>
            <div>🔤 FONTS: <span className="text-white font-bold uppercase">{brandingSpecs.font_style}</span></div>
            <div>🎙️ VOICE: <span className="text-white font-bold uppercase">{brandingSpecs.brand_tone}</span></div>
          </div>
        </div>
      )}

      {/* Text Metrics Data Inputs Container */}
      <div className="grid sm:grid-cols-3 gap-3 font-mono text-[10px]">
        <div className="space-y-1">
          <label className="text-gray-400 text-[9px] block">PRIMARY COLOR</label>
          <input type="text" value={brandingSpecs.primary_color} onChange={(e) => setBrandingSpecs({...brandingSpecs, primary_color: e.target.value})} className="w-full bg-[#4B5563]/50 border border-gray-500/20 rounded-xl p-2 uppercase text-[#00F2FE] outline-none font-bold" />
        </div>
        <div className="space-y-1">
          <label className="text-gray-400 text-[9px] block">SECONDARY ACCENT</label>
          <input type="text" value={brandingSpecs.secondary_color} onChange={(e) => setBrandingSpecs({...brandingSpecs, secondary_color: e.target.value})} className="w-full bg-[#4B5563]/50 border border-gray-500/20 rounded-xl p-2 uppercase text-white outline-none font-bold" />
        </div>
        <div className="space-y-1">
          <label className="text-gray-400 text-[9px] block">SURFACE TINT</label>
          <input type="text" value={brandingSpecs.tertiary_color} onChange={(e) => setBrandingSpecs({...brandingSpecs, tertiary_color: e.target.value})} className="w-full bg-[#4B5563]/50 border border-gray-500/20 rounded-xl p-2 uppercase text-white outline-none font-bold" />
        </div>
      </div>

      {/* Media submittal viewer layout panel */}
      <div className="space-y-2 pt-2">
        <span className="text-[9px] font-mono font-bold text-gray-400 uppercase block">// SUBMITTED ASSETS PREVIEW MATRIX</span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {brandingSpecs.uploaded_file_names?.map((name, idx) => {
            const fileUrl = getPublicUrl(name);
            const isImg = isImageFile(name);

            return (
              <div key={idx} className="bg-gray-950/20 border border-gray-500/20 p-3 rounded-2xl flex flex-col justify-between space-y-3 relative group overflow-hidden">
                {/* Visual Image Render Frame */}
                <div className="w-full h-24 bg-[#4B5563]/30 rounded-xl flex items-center justify-center overflow-hidden border border-gray-500/10 relative">
                  {isImg && fileUrl ? (
                    <img src={fileUrl} alt={name} className="w-full h-full object-contain p-1 transform group-hover:scale-105 transition-transform" />
                  ) : (
                    <span className="text-[20px]">📄</span>
                  )}
                </div>
                
                {/* Meta details array controller label */}
                <div className="space-y-1.5 font-mono text-[9px] w-full">
                  <p className="text-white font-bold truncate block">{name}</p>
                  <button 
                    type="button" 
                    onClick={() => handleDownloadAsset(name)} 
                    className="w-full py-1.5 bg-[#4B5563]/40 border border-gray-500/20 rounded-lg text-center text-[#00F2FE] font-bold uppercase hover:bg-[#4B5563] transition-colors"
                  >
                    Download File ↓
                  </button>
                </div>
              </div>
            );
          })}
          {(!brandingSpecs.uploaded_file_names || brandingSpecs.uploaded_file_names.length === 0) && (
            <div className="col-span-full p-6 text-center border border-dashed border-gray-500/20 rounded-xl text-xs font-mono text-gray-500">
              // NO UPLOADED BINARY MEDIA SUBMITTALS DISCOVERED
            </div>
          )}
        </div>
      </div>

    </div>
  );
}