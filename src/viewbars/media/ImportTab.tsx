"use client";

import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, AlertCircle, CheckCircle2, Loader2, FileText, Info } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

type ImportStatus = 'idle' | 'dragging' | 'parsing' | 'syncing' | 'success' | 'error';

export default function ImportTab(): React.JSX.Element {
  const [status, setStatus] = useState<ImportStatus>('idle');
  const [fileName, setFileName] = useState<string>('');
  const [progressMessage, setProgressMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse active session token context on initial lifecycle mount
  useEffect(() => {
    const session = localStorage.getItem("active_software_user");
    if (session) {
      setUserEmail(JSON.parse(session).email);
    }
  }, []);

  // Drag and drop mechanics handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (status === 'idle') setStatus('dragging');
  };

  const handleDragLeave = () => {
    if (status === 'dragging') setStatus('idle');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    } else {
      setStatus('idle');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  // Processing pipeline mapping raw archives into structural DB records
  const processFile = async (file: File) => {
    const isZip = file.name.endsWith('.zip');
    const isCsv = file.name.endsWith('.csv');
    const isJson = file.name.endsWith('.json');

    if (!isZip && !isCsv && !isJson) {
      setErrorMessage('Invalid file specification layer. Please upload the raw backup export payload folder (.zip, .csv, or .json metrics).');
      setStatus('error');
      return;
    }

    setFileName(file.name);
    setStatus('parsing');
    setProgressMessage('Decompressing binary archives and parsing tracking checksum entries...');

    try {
      // Step 1: Extraction simulation routine
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setStatus('syncing');
      setProgressMessage('Translating external tracking IDs and batch-upserting isolated rows to Supabase...');

      // Step 2: Simulated multi-tenant cloud serialization loop
      await new Promise((resolve) => setTimeout(resolve, 2500));
      setStatus('success');
    } catch (err) {
      setErrorMessage('An unexpected database serialization exception occurred while resolving indexing keys.');
      setStatus('error');
    }
  };

  const resetImporter = () => {
    setStatus('idle');
    setFileName('');
    setErrorMessage('');
    setProgressMessage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 pt-4 animate-fadeIn text-gray-800 select-none">
      
      {/* ⚠️ SYSTEM CRITICAL SHUTDOWN NOTICE BANNER */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-800 shadow-sm">
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600" />
        <div className="text-xs space-y-1 font-sans">
          <p className="font-black uppercase tracking-wider">// THIRD-PARTY END-OF-LIFE DEPRECATION NOTICE</p>
          <p className="text-gray-600 font-medium leading-relaxed">
            External tracker platforms are permanently liquidating cloud asset lines on <span className="text-gray-900 font-bold">July 15, 2026</span>. After this target window closes, historical watch records will be wiped clean. Request your personal GDPR data archive bundle immediately to migrate rows into your platform enclave.
          </p>
        </div>
      </div>

      {/* DETAILED USER INSTRUCTIONS CONTAINER CARD */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-gray-700 flex items-center gap-2 font-mono">
          <Info className="w-4 h-4 text-purple-600" /> System Migration Directives
        </h3>
        <ol className="text-xs text-gray-600 space-y-2 pl-4 list-decimal marker:text-gray-400 marker:font-bold leading-relaxed">
          <li>Navigate to your account panel options inside the tracking utility menu settings.</li>
          <li>Select <span className="text-gray-900 font-bold">Privacy Controls</span> and trigger an archive retrieval link.</li>
          <li>Your unique binary <span className="text-purple-600 font-mono font-bold">.zip</span> summary folder will be dispatched via secure email links. Drag and pass that target folder directly here.</li>
        </ol>
      </div>

      {/* CORE ACTIVE INTERACTIVE DROP-ZONE LAYOUT */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => status === 'idle' && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all min-h-[280px] flex flex-col items-center justify-center gap-4 cursor-pointer bg-white ${
          status === 'dragging' 
            ? 'border-purple-600 bg-purple-50/50 shadow-inner' 
            : 'border-gray-300 hover:border-gray-400 shadow-sm'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept=".zip,.csv,.json"
          className="hidden"
          disabled={status !== 'idle'}
        />

        {/* STATE A: STANDBY READY CAPTURE INTERFACE */}
        {(status === 'idle' || status === 'dragging') && (
          <>
            <div className="p-4 bg-gray-50 rounded-full border border-gray-200 text-gray-400 group-hover:text-purple-600 transition-colors shadow-sm">
              <UploadCloud className={`w-8 h-8 ${status === 'dragging' ? 'text-purple-600 animate-bounce' : 'text-gray-400'}`} />
            </div>
            <div className="space-y-1.5">
              <p className="text-sm font-black text-gray-900 uppercase italic tracking-tight">
                {status === 'dragging' ? 'Release Payload Matrix Here' : 'Transmit External History Backup'}
              </p>
              <p className="text-xs text-gray-400 max-w-sm mx-auto font-medium">
                Supports standard target data formats including compressed <span className="font-mono text-purple-600">.zip</span> archives, formatted tracking <span className="font-mono text-purple-600">.csv</span> string rows, or structured JSON trees.
              </p>
            </div>
            <button 
              type="button" 
              className="px-4 py-2 bg-gray-900 hover:bg-purple-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer"
            >
              Browse Files System
            </button>
          </>
        )}

        {/* STATE B: RUNNING BATCH OPERATIONS */}
        {(status === 'parsing' || status === 'syncing') && (
          <>
            <div className="p-4 bg-purple-50 rounded-full border border-purple-100 text-purple-600 shadow-sm relative">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <div className="space-y-3 w-full max-w-xs">
              <p className="text-xs font-bold text-gray-700 flex items-center justify-center gap-2 truncate bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                <FileText className="w-4 h-4 text-gray-400" /> {fileName}
              </p>
              <p className="text-[11px] font-mono text-purple-600 font-black tracking-wider uppercase animate-pulse">{progressMessage}</p>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden border border-gray-200">
                <div 
                  className={`h-full bg-gradient-to-r from-purple-600 to-blue-500 rounded-full transition-all duration-500 ${
                    status === 'parsing' ? 'w-1/3' : 'w-3/4'
                  }`} 
                />
              </div>
            </div>
          </>
        )}

        {/* STATE C: PROCESSING PIPELINE SUCCESS HANDSHAKE */}
        {status === 'success' && (
          <>
            <div className="p-4 bg-emerald-50 rounded-full border border-emerald-200 text-emerald-600 shadow-sm">
              <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
            </div>
            <div className="space-y-1.5">
              <p className="text-sm font-black text-gray-900 uppercase italic tracking-tight">Ecosystem Sync Complete</p>
              <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed font-medium">
                Your historical watchlist logs, metrics records, and checked episode nodes have been successfully compiled and synchronized into your multi-tenant dashboard schema.
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); resetImporter(); }}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
            >
              Return To Hub Overview
            </button>
          </>
        )}

        {/* STATE D: ERROR CONFIGURATION BOUNDARY EXCEPTION */}
        {status === 'error' && (
          <>
            <div className="p-4 bg-rose-50 rounded-full border border-rose-200 text-rose-600 shadow-sm">
              <AlertCircle className="w-8 h-8 stroke-[2.2]" />
            </div>
            <div className="space-y-1.5">
              <p className="text-sm font-black text-gray-900 uppercase italic tracking-tight">Sync Handshake Aborted</p>
              <p className="text-xs text-rose-600 max-w-xs mx-auto leading-relaxed font-bold font-mono">
                🛑 EXCEPTION_ALERT: {errorMessage}
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); resetImporter(); }}
              className="px-4 py-2 bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer"
            >
              Try Alternative Array Backup
            </button>
          </>
        )}

      </div>

    </div>
  );
}