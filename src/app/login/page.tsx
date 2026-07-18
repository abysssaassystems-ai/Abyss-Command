"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function AppsSoftwareLogin(): React.JSX.Element {
  const [identifier, setIdentifier] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorLog, setErrorLog] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorLog(null);
    console.log("🚀 LOGIN ATTEMPT INITIALIZED for:", identifier);

    try {
      let finalEmail = identifier.trim();

      // 1. Resolve Username to Email if no '@' symbol is present
      if (!finalEmail.includes('@')) {
        console.log("🔍 Input identified as username. Querying profile registry...");
        const { data: clientData, error: lookupError } = await supabase
          .from('apps_and_software_clients')
          .select('email')
          .eq('username', finalEmail)
          .maybeSingle();

        if (lookupError) {
          console.error("❌ Database lookup failed:", lookupError);
          setErrorLog(`LOOKUP_FAULT: ${lookupError.message}`);
          setIsSubmitting(false);
          return;
        }

        if (!clientData?.email) {
          console.warn("⚠️ Username not found in apps_and_software_clients");
          setErrorLog("AUTHENTICATION_FAILED: Username identifier not found in database records.");
          setIsSubmitting(false);
          return;
        }

        finalEmail = clientData.email;
        console.log("🎯 Username resolved to email target:", finalEmail);
      }

      // 2. Authenticate through Supabase Auth
      console.log("🔐 Sending credentials to Supabase Auth engine...");
      const { data, error } = await supabase.auth.signInWithPassword({
        email: finalEmail,
        password: password,
      });

      if (error) {
        console.error("❌ Supabase Auth engine rejected credentials:", error.message);
        setErrorLog(`AUTHENTICATION_FAILED: ${error.message}`);
        setIsSubmitting(false);
        return;
      }

      if (!data?.user) {
        console.error("❌ No user object inside returned payload.");
        setErrorLog("AUTHENTICATION_FAILED: No user profile returned.");
        setIsSubmitting(false);
        return;
      }

      // 3. Force entry to dashboard via native window routing
      console.log("🎉 AUTH SUCCESS! User ID:", data.user.id);
      console.log("⚡ Forcing hard redirect to clear Next.js route caches...");
      
      setIsSubmitting(false);
      window.location.href = '/dashboard';
      
    } catch (err: any) {
      console.error("💥 CRITICAL SYSTEM RUNTIME CRASH:", err);
      setErrorLog(`RUNTIME_EXCEPTION: ${err.message || err}`);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans flex items-center justify-center p-6 select-none relative">
      <div className="w-full max-w-md bg-white border border-gray-200 p-8 rounded-3xl shadow-xl space-y-6">
        
        {/* Workspace Brand Identifier */}
        <div className="text-center border-b border-gray-100 pb-5">
          <span className="text-[10px] font-mono font-bold text-purple-600 tracking-widest uppercase block">
            // APPS & software Access
          </span>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight mt-1">
            APP & SOFTWARE Login
          </h1>
          <p className="text-xs text-gray-500 font-sans mt-1">
            Provide your account login credentials to sync with your account.
          </p>
        </div>

        {errorLog && (
          <div className="p-3.5 rounded-xl font-mono text-[11px] bg-purple-50 border border-purple-200 text-purple-900 leading-relaxed break-words">
            {errorLog}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 block">
              Email / Username
            </label>
            <input
              name="identifier"
              type="text"
              required
              disabled={isSubmitting}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="operator_name or operator@system.com"
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:bg-white focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700">
                Security Password
              </label>
              <Link
                href="/login/forgot-info"
                className="text-[11px] text-purple-600 hover:text-blue-600 font-medium transition-colors"
              >
                Forgot Login?
              </Link>
            </div>
            <input
              name="password"
              type="password"
              required
              disabled={isSubmitting}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:bg-white focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md hover:shadow-lg transition-all focus:outline-none disabled:opacity-50"
          >
            {isSubmitting ? "Linking Connection Pipeline..." : "Initialize Application Session"}
          </button>
        </form>

        <div className="pt-4 border-t border-gray-100 text-center space-y-3">
          <p className="text-xs text-gray-500">Need a new account? Welcome! </p>
          <Link
            href="/login/create-account"
            className="block w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-800 font-bold text-xs uppercase tracking-wider rounded-xl transition-all text-center border border-gray-200 hover:border-purple-300"
          >
            Create Account
          </Link>
        </div>

        <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 pt-1">
          <span>PORT // 443</span>
          <span>SSL AUTH CERTIFIED</span>
        </div>

      </div>
    </div>
  );
}