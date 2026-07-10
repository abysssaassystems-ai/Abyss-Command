'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, AlertCircle, CheckCircle2, Loader2, FileText, Info } from 'lucide-react';

type ImportStatus = 'idle' | 'dragging' | 'parsing' | 'syncing' | 'success' | 'error';

export default function ImportTab() {
  const [status, setStatus] = useState<ImportStatus>('idle');
  const [fileName, setFileName] = useState<string>('');
  const [progressMessage, setProgressMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Mock processing pipeline simulating CSV data map and ingestion string batching
  const processFile = async (file: File) => {
    // Validate file type extension
    const isZip = file.name.endsWith('.zip');
    const isCsv = file.name.endsWith('.csv');
    const isJson = file.name.endsWith('.json');

    if (!isZip && !isCsv && !isJson) {
      setErrorMessage('Invalid file type. Please upload the raw TV Time export (.zip, .csv, or .json file).');
      setStatus('error');
      return;
    }

    setFileName(file.name);
    setStatus('parsing');
    setProgressMessage('Decompressing archive and reading tracking entries...');

    try {
      // Step 1: Client side extraction/parsing simulation
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setStatus('syncing');
      setProgressMessage('Translating TV Time IDs and batch-upserting rows to Supabase...');

      // Step 2: Supabase bulk serialization lookup loop simulation 
      await new Promise((resolve) => setTimeout(resolve, 2500));
      setStatus('success');
    } catch (err) {
      setErrorMessage('An unexpected serialization error occurred while matching IDs to TMDB records.');
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
    <div className="w-full max-w-2xl mx-auto space-y-6 pt-4 animate-fade-in">
      
      {/* ⚠️ SYSTEM CRITICAL DEADLINE NOTICE BANNER */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-3 text-amber-400">
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-extrabold uppercase tracking-wide">TV Time Database Shutdown Notice</p>
          <p className="text-zinc-400 font-medium leading-relaxed">
            TV Time is permanently shutting down its services on <span className="text-zinc-200 font-bold">July 15, 2026</span>. After this date, your history logs will be wiped clean. Request your GDPR data download via their mobile app now to migrate your list records instantly.
          </p>
        </div>
      </div>

      {/* DETAILED USER INSTRUCTIONS ACORDION PANEL */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
          <Info className="w-4 h-4 text-zinc-500" /> How to get your TV Time Archive
        </h3>
        <ol className="text-xs text-zinc-400 space-y-2 pl-4 list-decimal marker:text-zinc-600 marker:font-bold">
          <li>Open the TV Time mobile app, navigate to <span className="text-zinc-200 font-semibold">Settings</span>.</li>
          <li>Tap <span className="text-zinc-200 font-semibold">Privacy / Account Options</span> and click <span className="text-zinc-200 font-semibold">Request Personal Data Archive</span>.</li>
          <li>Within a few hours, TV Time will email you a download link containing your history <span className="text-zinc-200 font-mono font-bold">.zip</span> payload folder. Drop that file here.</li>
        </ol>
      </div>

      {/* CORE ACTIVE DROP-ZONE ELEMENT */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => status === 'idle' && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all min-h-[280px] flex flex-col items-center justify-center gap-4 cursor-pointer bg-zinc-950/30 ${
          status === 'dragging' ? 'border-amber-500 bg-amber-500/5' : 'border-zinc-800 hover:border-zinc-700/80'
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

        {/* STATE A: STANDBY IDLE */}
        {(status === 'idle' || status === 'dragging') && (
          <>
            <div className="p-4 bg-zinc-900 rounded-full border border-zinc-800 text-zinc-400 group-hover:text-zinc-200 transition-colors">
              <UploadCloud className={`w-8 h-8 ${status === 'dragging' ? 'text-amber-500 animate-bounce' : ''}`} />
            </div>
            <div className="space-y-1.5">
              <p className="text-sm font-bold text-zinc-200">
                {status === 'dragging' ? 'Drop the file right here!' : 'Drag & Drop your export backup here'}
              </p>
              <p className="text-xs text-zinc-500">
                Supports standard <span className="font-mono">.zip</span> bundles, parsed tracking <span className="font-mono">.csv</span> arrays, or JSON file metrics
              </p>
            </div>
            <button className="px-4 py-2 bg-zinc-900 text-zinc-200 text-xs font-bold rounded-lg border border-zinc-800 hover:bg-zinc-800 transition-colors mt-2">
              Browse Files
            </button>
          </>
        )}

        {/* STATE B: RUNNING CONVERSION OPERATIONS */}
        {(status === 'parsing' || status === 'syncing') && (
          <>
            <div className="p-4 bg-zinc-900 rounded-full border border-zinc-800 text-amber-500 relative">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <div className="space-y-2 w-full max-w-xs">
              <p className="text-sm font-bold text-zinc-200 flex items-center justify-center gap-2">
                <FileText className="w-4 h-4 text-zinc-500" /> {fileName}
              </p>
              <p className="text-xs text-amber-400 font-medium animate-pulse">{progressMessage}</p>
              <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-800 mt-2">
                <div className={`h-full bg-amber-500 rounded-full transition-all duration-500 ${status === 'parsing' ? 'w-1/3' : 'w-3/4'}`} />
              </div>
            </div>
          </>
        )}

        {/* STATE C: PROCESSING COMPLETE SUCCESS */}
        {status === 'success' && (
          <>
            <div className="p-4 bg-emerald-500/10 rounded-full border border-emerald-500/30 text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <p className="text-sm font-bold text-zinc-100">Migration Successfully Complete!</p>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">
                Your historical watchlist records and watched episode checkpoints have been translated and loaded into your catalog dashboard.
              </p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); resetImporter(); }}
              className="px-4 py-2 bg-emerald-500 text-black text-xs font-bold rounded-lg hover:bg-emerald-400 transition-colors shadow-md mt-2"
            >
              Go to Overview
            </button>
          </>
        )}

        {/* STATE D: ERROR EXCEPTION BOUNDARY */}
        {status === 'error' && (
          <>
            <div className="p-4 bg-rose-500/10 rounded-full border border-rose-500/30 text-rose-400">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <p className="text-sm font-bold text-zinc-100">Migration Interrupted</p>
              <p className="text-xs text-rose-400 max-w-xs mx-auto leading-relaxed font-medium">
                {errorMessage}
              </p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); resetImporter(); }}
              className="px-4 py-2 bg-zinc-900 text-zinc-200 text-xs font-bold rounded-lg border border-zinc-800 hover:bg-zinc-800 transition-colors mt-2"
            >
              Try Another File
            </button>
          </>
        )}

      </div>

    </div>
  );
}