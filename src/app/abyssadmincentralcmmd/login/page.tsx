"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [passcode, setPasscode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const targetAuthToken = "Gameofthronesbreakingbad1234567891792200217";

  const handleAuthenticationAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsVerifying(true);

    // Simulated parsing delay for authorization handshake
    setTimeout(() => {
      if (passcode === targetAuthToken) {
        router.push('/abyssadmincentralcmmd/dashboardcmmd');
      } else {
        setError("AUTHENTICATION_FAILURE: INVALID CORE OPERATIONAL TOKEN.");
        setIsVerifying(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#4B5563] flex items-center justify-center px-4 font-sans select-none">
      <div className="w-full max-w-md bg-[#374151] border border-gray-500/40 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#00F2FE]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center space-y-2 mb-8">
          <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#00F2FE] uppercase">// SECURE UPLINK ENVIROMENT</span>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase italic">ABYSS COMMAND</h1>
          <p className="text-xs text-gray-300 max-w-xs mx-auto">Provide master decryption string sequence to access system control dashboard.</p>
        </div>

        <form onSubmit={handleAuthenticationAttempt} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">Master Passcode Sequence</label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="••••••••••••••••••••••••••••••••"
              disabled={isVerifying}
              className="w-full bg-[#4B5563] border border-gray-500/40 rounded-xl px-4 py-3.5 text-sm font-mono text-white placeholder-gray-500 outline-none focus:border-[#00F2FE] transition duration-200"
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl text-[11px] font-mono text-rose-400 leading-normal">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isVerifying || !passcode}
            className="w-full py-4 bg-gradient-to-r from-[#00B8C4] to-[#00F2FE] text-gray-900 font-black text-xs uppercase tracking-widest rounded-xl shadow-lg hover:opacity-95 transition-all focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isVerifying ? "Verifying Token System Matrix..." : "Establish Root Connectivity"}
          </button>
        </form>
      </div>
    </div>
  );
}