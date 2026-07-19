"use client";

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function BrandingTab(): React.JSX.Element {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Identity Parameters
  const [userId, setUserId] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  
  // Design System States
  const [primaryColor, setPrimaryColor] = useState<string>("#00F2FE");
  const [secondaryColor, setSecondaryColor] = useState<string>("#374151");
  const [tertiaryColor, setTertiaryColor] = useState<string>("#F9FAFB");
  const [logoShape, setLogoShape] = useState<"square" | "round">("square");
  const [fileList, setFileList] = useState<string[]>([]);
  
  // Branding Operational States
  const [fontStyle, setFontStyle] = useState<"sans" | "serif" | "mono">("sans");
  const [brandTone, setBrandTone] = useState<"professional" | "bold" | "casual" | "technical">("professional");
  const [uiThemeStyle, setUiThemeStyle] = useState<"modern" | "minimalist" | "cyberpunk" | "corporate">("modern");
  const [companyTagline, setCompanyTagline] = useState<string>("");
  const [targetAudience, setTargetAudience] = useState<string>("");

  // System State Monitors
  const [isOver, setIsOver] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [logStatus, setLogStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // 1. DATA FLUID HYDRATION: Secure user tracking & fetch existing metrics from database
  useEffect(() => {
    async function secureHydrateBranding() {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          setLogStatus({ type: "error", msg: "AUTH_UNVERIFIED: Active security token missing or expired." });
          return;
        }

        setUserId(user.id);
        setUserEmail(user.email || "");

        // Dual-identifier fallback matching strategy for cross-layer integrity
        const { data, error } = await supabase
          .from('client_branding_assets')
          .select('*')
          .or(`user_id.eq.${user.id},client_email.eq.${user.email}`)
          .maybeSingle();

        if (!error && data) {
          setPrimaryColor(data.primary_color || "#00F2FE");
          setSecondaryColor(data.secondary_color || "#374151");
          setTertiaryColor(data.tertiary_color || "#F9FAFB");
          setLogoShape((data.logo_shape as "square" | "round") || "square");
          setFileList(data.uploaded_file_names || []);
          setFontStyle((data.font_style as "sans" | "serif" | "mono") || "sans");
          setBrandTone((data.brand_tone as "professional" | "bold" | "casual" | "technical") || "professional");
          setUiThemeStyle((data.ui_theme_style as "modern" | "minimalist" | "cyberpunk" | "corporate") || "modern");
          setCompanyTagline(data.company_tagline || "");
          setTargetAudience(data.target_audience || "");
        }
      } catch (err) {
        setLogStatus({ type: "error", msg: "HYDRATION_FAULT: Failed resolving backend design variables." });
      }
    }
    
    secureHydrateBranding();
  }, []);

  // 2. BINARY STORAGE PIPELINE: Upload files into multi-tenant secure bucket directories
  const transferBinaryPayload = async (files: File[]) => {
    if (!userId) return;
    setLogStatus({ type: "success", msg: "UPLINK_START: Transferring binary file elements to storage bucket..." });

    for (const file of files) {
      // Deterministic folder mapping using UUID prevents filename cross-contamination
      const uniquePathName = `${userId}/${Date.now()}-${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('branding-assets')
        .upload(uniquePathName, file, { cacheControl: '3600', upsert: true });

      if (uploadError) {
        setLogStatus({ type: "error", msg: `STORAGE_FAULT: File upload aborted. ${uploadError.message}` });
        return;
      }
      
      setFileList(prev => [...prev, file.name]);
    }
    setLogStatus({ type: "success", msg: "UPLINK_COMPLETE: Assets processed successfully." });
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    if (e.dataTransfer.files) {
      transferBinaryPayload(Array.from(e.dataTransfer.files));
    }
  };

  const handleManualFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      transferBinaryPayload(Array.from(e.target.files));
    }
  };

  // 3. LEDGER SAVE SYNC: Commit client preferences directly to cloud clusters
  const commitBrandingProfile = async () => {
    if (!userId) return;
    setIsSaving(true);
    setLogStatus(null);

    try {
      const { error } = await supabase
        .from('client_branding_assets')
        .upsert({
          user_id: userId,
          client_email: userEmail,
          primary_color: primaryColor,
          secondary_color: secondaryColor,
          tertiary_color: tertiaryColor,
          logo_shape: logoShape,
          uploaded_file_names: fileList,
          font_style: fontStyle,
          brand_tone: brandTone,
          ui_theme_style: uiThemeStyle,
          company_tagline: companyTagline,
          target_audience: targetAudience,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' }); // Locks record resolution straight down to matching UUID arrays

      if (!error) {
        setLogStatus({ type: "success", msg: "IDENTITY_SYNCED: Design tokens locked onto cloud schema database records." });
      } else {
        setLogStatus({ type: "error", msg: `UPLINK_REJECTED: ${error.message}` });
      }
    } catch (err: any) {
      setLogStatus({ type: "error", msg: `CRITICAL_FAULT: ${err.message || err}` });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn select-none max-w-5xl mx-auto pb-24 px-2">
      
      {/* Dynamic Command Terminal Ribbon */}
      <div className="bg-[#374151] border border-gray-500/40 p-6 rounded-3xl shadow-lg flex justify-between items-center flex-wrap gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#00F2FE] uppercase block">// BRAND DESK CONTEXT</span>
          <h2 className="text-xl font-black text-white uppercase italic mt-1">Design System Matrix Configuration</h2>
        </div>
        <button
          type="button"
          onClick={commitBrandingProfile}
          disabled={isSaving || !userId}
          className="px-6 py-2.5 bg-gradient-to-r from-[#00B8C4] to-[#00F2FE] text-gray-900 font-black text-xs uppercase tracking-wider rounded-xl shadow-md hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          {isSaving ? "Syncing Framework..." : "Save Brand Blueprint"}
        </button>
      </div>

      {logStatus && (
        <div className={`p-3.5 rounded-xl font-mono text-[10px] border leading-relaxed ${
          logStatus.type === "success" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-rose-500/10 border-rose-500/30 text-rose-400"
        }`}>
          {logStatus.msg}
        </div>
      )}

      {/* Main Framework Grid Setup */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Input Configuration Column Tree (7 Columns Wide) */}
        <div className="lg:col-span-7 bg-[#374151] border border-gray-500/40 p-6 rounded-3xl space-y-6">
          
          {/* SECTION 1: Base Palettes & Colors */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-mono font-black text-white uppercase tracking-wider">01 // Theme Palette Array</h4>
              <span className="text-[9px] font-mono text-gray-500">HEX CHANNELS</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[11px]">
              <div className="bg-[#4B5563]/30 border border-gray-500/10 p-2 rounded-xl flex items-center justify-between">
                <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer bg-transparent border-0" />
                <span className="text-[#00F2FE] uppercase font-bold">{primaryColor}</span>
              </div>
              <div className="bg-[#4B5563]/30 border border-gray-500/10 p-2 rounded-xl flex items-center justify-between">
                <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer bg-transparent border-0" />
                <span className="text-white uppercase font-bold">{secondaryColor}</span>
              </div>
              <div className="bg-[#4B5563]/30 border border-gray-500/10 p-2 rounded-xl flex items-center justify-between">
                <input type="color" value={tertiaryColor} onChange={(e) => setTertiaryColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer bg-transparent border-0" />
                <span className="text-gray-300 uppercase font-bold">{tertiaryColor}</span>
              </div>
            </div>
          </div>

          <hr className="border-gray-500/20" />

          {/* SECTION 2: Typography Scale Matrix */}
          <div className="space-y-4">
            <div>
              <span className="text-[9px] font-mono font-bold uppercase text-gray-400 block">// TYPOGRAPHY FONT SPECIFICATION</span>
              <h4 className="text-xs font-mono font-black text-white uppercase tracking-wider mt-0.5">02 // Typography Architecture</h4>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              {(['sans', 'serif', 'mono'] as const).map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setFontStyle(style)}
                  className={`p-3 border rounded-xl font-mono text-xs uppercase transition-all focus:outline-none ${
                    fontStyle === style ? 'bg-[#00B8C4]/10 border-[#00F2FE] text-[#00F2FE] font-black' : 'border-gray-500/20 text-gray-400 hover:border-gray-500/40'
                  }`}
                >
                  {style === 'sans' && <span className="font-sans block text-sm normal-case">Aa</span>}
                  {style === 'serif' && <span className="font-serif block text-sm normal-case">Aa</span>}
                  {style === 'mono' && <span className="font-mono block text-sm normal-case">Aa</span>}
                  <span className="text-[9px] block mt-1">{style}</span>
                </button>
              ))}
            </div>
          </div>

          <hr className="border-gray-500/20" />

          {/* SECTION 3: Content Tone Configuration Parameters */}
          <div className="space-y-4">
            <div>
              <span className="text-[9px] font-mono font-bold uppercase text-gray-400 block">// INTERACTION LANGUAGE TONE</span>
              <h4 className="text-xs font-mono font-black text-white uppercase tracking-wider mt-0.5">03 // Copywriting Brand Voice</h4>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[10px]">
              {(['professional', 'bold', 'casual', 'technical'] as const).map((tone) => (
                <button
                  key={tone}
                  type="button"
                  onClick={() => setBrandTone(tone)}
                  className={`p-2.5 border rounded-xl uppercase tracking-wider transition-all focus:outline-none ${
                    brandTone === tone ? 'bg-[#00B8C4]/20 border-[#00F2FE] text-[#00F2FE] font-bold' : 'border-gray-500/10 text-gray-400 hover:border-gray-500/30'
                  }`}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-gray-500/20" />

          {/* SECTION 4: Design Framework Theme Model Selection */}
          <div className="space-y-4">
            <div>
              <span className="text-[9px] font-mono font-bold uppercase text-gray-400 block">// INTERFACE STRUCTURAL MODEL</span>
              <h4 className="text-xs font-mono font-black text-white uppercase tracking-wider mt-0.5">04 // Core Design System Layout Template</h4>
            </div>
            <div className="grid grid-cols-2 gap-2 text-left font-sans text-xs">
              {(['modern', 'minimalist', 'cyberpunk', 'corporate'] as const).map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setUiThemeStyle(style)}
                  className={`p-3 border rounded-xl flex flex-col justify-between h-16 text-left transition-all focus:outline-none ${
                    uiThemeStyle === style ? 'bg-[#00B8C4]/10 border-[#00F2FE] text-white' : 'border-gray-500/20 text-gray-400 hover:border-gray-500/40'
                  }`}
                >
                  <span className="font-bold uppercase font-mono text-[10px] tracking-wide block">{style} style</span>
                  <span className="text-[9px] opacity-70 block">
                    {style === 'modern' && "Fluid structural spaces & grids."}
                    {style === 'minimalist' && "Ultra light padding, pure clean lines."}
                    {style === 'cyberpunk' && "High contrast neons over dark slates."}
                    {style === 'corporate' && "Classic layouts optimized for enterprise trust."}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <hr className="border-gray-500/20" />

          {/* SECTION 5: Core Identity Value Inputs */}
          <div className="space-y-4">
            <div>
              <span className="text-[9px] font-mono font-bold uppercase text-gray-400 block">// ARCHITECTURE MISSION CORE</span>
              <h4 className="text-xs font-mono font-black text-white uppercase tracking-wider mt-0.5">05 // Identity Metrics & Narrative Content</h4>
            </div>
            
            <div className="space-y-3 font-sans text-xs">
              <div className="space-y-1.5">
                <label className="text-[9px] font-mono font-bold uppercase text-gray-400">Primary Company Tagline / Hook Statement</label>
                <input 
                  type="text" 
                  value={companyTagline} 
                  onChange={(e) => setCompanyTagline(e.target.value)} 
                  placeholder="e.g., Empowering global retail operations with automated intelligence networks."
                  className="w-full bg-[#4B5563]/30 border border-gray-500/30 rounded-xl px-3.5 py-2.5 text-white placeholder-gray-500 outline-none focus:border-[#00F2FE]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-mono font-bold uppercase text-gray-400">Target Audience Description / Market Demographics</label>
                <textarea 
                  rows={2}
                  value={targetAudience} 
                  onChange={(e) => setTargetAudience(e.target.value)} 
                  placeholder="e.g., Independent franchise operators, mid-market business chains, tech-forward retailers."
                  className="w-full bg-[#4B5563]/30 border border-gray-500/30 rounded-xl px-3.5 py-2.5 text-white placeholder-gray-500 outline-none focus:border-[#00F2FE] resize-none"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Output Dashboard Column (5 Columns Wide) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Logo Frame Geometry Controls */}
          <div className="bg-[#374151] border border-gray-500/40 p-5 rounded-3xl space-y-3">
            <span className="text-[9px] font-mono font-bold uppercase text-gray-400 block">// CONTAINER GEOMETRY MATRIX</span>
            <div className="flex gap-2 text-center font-mono text-[10px]">
              <button type="button" onClick={() => setLogoShape("square")} className={`flex-1 p-2 border rounded-xl transition-all ${logoShape === 'square' ? 'border-[#00F2FE] text-[#00F2FE] bg-[#00B8C4]/5' : 'border-gray-500/10 text-gray-400'}`}>■ SQUARE</button>
              <button type="button" onClick={() => setLogoShape("round")} className={`flex-1 p-2 border rounded-xl transition-all ${logoShape === 'round' ? 'border-[#00F2FE] text-[#00F2FE] bg-[#00B8C4]/5' : 'border-gray-500/10 text-gray-400'}`}>● ROUND</button>
            </div>
          </div>

          {/* Asset Dropzone Module Link */}
          <div className="bg-[#374151] border border-gray-500/40 p-5 rounded-3xl space-y-3">
            <span className="text-[9px] font-mono font-bold uppercase text-gray-400 block">// STORAGE INGESTION PORT</span>
            <div 
              onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
              onDragLeave={() => setIsOver(false)}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                isOver ? 'border-[#00F2FE] bg-[#00F2FE]/5 text-white' : 'border-gray-500/30 text-gray-400 hover:border-gray-400'
              }`}
            >
              <span className="text-xl mb-1">📥</span>
              <span className="text-[11px] font-mono font-bold text-white uppercase block">Drop Assets to Vault</span>
              <span className="text-[9px] text-gray-500 font-sans block mt-0.5">Click to browse your hard drive</span>
              <input type="file" ref={fileInputRef} multiple className="hidden" onChange={handleManualFileSelect} accept="image/*,application/pdf" />
            </div>

            {/* Displaying Uploaded Storage Rows */}
            {fileList.length > 0 && (
              <div className="space-y-1.5 max-h-[120px] overflow-y-auto pt-2 border-t border-gray-500/10 custom-scrollbar">
                {fileList.map((name, i) => (
                  <div key={i} className="p-2 bg-gray-950/20 border border-gray-500/10 rounded-lg text-[9px] font-mono text-gray-300 truncate flex items-center gap-1.5">
                    <span>✓</span> {name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Real-Time Live System Component Previews */}
          <div className="bg-[#374151] border border-gray-500/40 p-5 rounded-3xl space-y-3">
            <span className="text-[9px] font-mono font-bold uppercase text-gray-400 block">// DYNAMIC DESIGN ENVIRONMENT PREVIEW</span>
            
            <div 
              className="p-4 rounded-2xl border border-white/5 transition-all shadow-inner relative overflow-hidden flex flex-col justify-between min-h-[140px]" 
              style={{ backgroundColor: tertiaryColor, fontFamily: fontStyle === 'mono' ? 'monospace' : fontStyle === 'serif' ? 'serif' : 'sans-serif' }}
            >
              {/* Card Header Layer */}
              <div className="flex items-center justify-between border-b border-black/5 pb-2">
                <div className="flex items-center space-x-2">
                  <div 
                    className="h-7 w-7 text-[9px] font-black flex items-center justify-center border border-white/10 transition-all duration-300 text-glow shadow-md"
                    style={{ backgroundColor: primaryColor, color: secondaryColor, borderRadius: logoShape === 'round' ? '9999px' : '6px' }}
                  >
                    Ω
                  </div>
                  <span className="text-[11px] font-bold tracking-tight uppercase" style={{ color: secondaryColor }}>
                    {uiThemeStyle === 'cyberpunk' ? '🎯 MATRIX_MOCK' : 'Component Interface'}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[8px] font-mono uppercase font-bold text-gray-950 shadow-sm" style={{ backgroundColor: primaryColor }}>Action</span>
              </div>

              {/* Dynamic Tagline Text Preview Render Output */}
              <div className="py-2">
                <p className="text-[10px] leading-relaxed font-semibold line-clamp-2" style={{ color: secondaryColor }}>
                  {companyTagline || "Provide a tagline on the left to review typography weights within this simulated platform sheet..."}
                </p>
              </div>

              {/* Card Bottom Meta Specs */}
              <div className="pt-2 border-t border-black/5 flex justify-between text-[8px] font-mono tracking-wider opacity-60" style={{ color: secondaryColor }}>
                <span>TONE: {brandTone}</span>
                <span>THEME: {uiThemeStyle}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}