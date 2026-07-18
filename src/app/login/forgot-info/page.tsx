"use client";

import React, { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type RecoveryType = "password" | "username" | "both" | null;

export default function ForgotSoftwareInfoRecovery(): React.JSX.Element {
  const [step, setStep] = useState<number>(1);
  const [recoveryType, setRecoveryType] = useState<RecoveryType>(null);
  const [email, setEmail] = useState<string>(""); // Fixed: Initialized to clean empty string
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const handleSelection = (type: RecoveryType) => {
    setRecoveryType(type);
    setStep(2);
    setStatusMsg(null);
  };

  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMsg(null);

    const targetEmail = email.trim();

    try {
      // Native secure recovery broadcast. Bypasses client-side RLS limits safely.
      const { error } = await supabase.auth.resetPasswordForEmail(targetEmail, {
        redirectTo: `${window.location.origin}/login`, 
      });

      if (error) {
        setStatusMsg({ type: "error", msg: `SUPABASE_RECOVERY_FAULT: ${error.message}` });
        setIsSubmitting(false);
        return;
      }

      // Move to success display safely
      setStep(3);
    } catch (err: any) {
      setStatusMsg({ type: "error", msg: `RUNTIME_ERROR: ${err.message || err}` });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans flex items-center justify-center p-6 select-none">
      <div className="w-full max-w-md bg-white border border-gray-200 p-8 rounded-3xl shadow-xl space-y-6">
        
        {/* Step Flow Ribbon Header */}
        <div className="text-center border-b border-gray-100 pb-5 relative">
          {step > 1 && step < 3 && (
            <button onClick={() => { setStep(1); setStatusMsg(null); }} className="absolute left-0 top-0 mt-1 text-[10px] uppercase font-bold text-gray-400 hover:text-purple-600 transition-colors">
              ← Back
            </button>
          )}
          <span className="text-[10px] font-mono font-bold text-purple-600 tracking-widest uppercase block">
            // LOCKOUT MANAGEMENT MODULE // STEP {step} OF 3
          </span>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight mt-1">Access Recovery</h1>
          <div className="w-full max-w-[120px] mx-auto bg-gray-100 h-1 rounded-full mt-4 overflow-hidden">
            <div className="bg-purple-600 h-full transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }} />
          </div>
        </div>

        {statusMsg && step < 3 && (
          <div className={`p-3.5 rounded-xl font-mono text-[11px] border leading-relaxed ${
            statusMsg.type === "success" ? "bg-purple-50 border-purple-200 text-purple-900" : "bg-rose-50 border-rose-200 text-rose-700"
          }`}>
            {statusMsg.msg}
          </div>
        )}

        {/* STEP 1: Select Missing Target Parameter Node */}
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <p className="text-xs text-gray-500 font-sans text-center mb-5">
              Select the credential you need help restoring to your account:
            </p>
            <div className="space-y-3 font-mono text-[11px]">
              <button type="button" onClick={() => handleSelection("password")} className="w-full p-4 text-left border border-gray-200 rounded-2xl hover:border-purple-600 hover:bg-purple-50/50 transition-all flex justify-between items-center group">
                <span className="font-bold text-gray-700 group-hover:text-purple-700 uppercase">Forgot Password</span>
                <span className="text-gray-400 group-hover:text-purple-600">→</span>
              </button>
              <button type="button" onClick={() => handleSelection("username")} className="w-full p-4 text-left border border-gray-200 rounded-2xl hover:border-purple-600 hover:bg-purple-50/50 transition-all flex justify-between items-center group">
                <span className="font-bold text-gray-700 group-hover:text-purple-700 uppercase">Forgot Account Username</span>
                <span className="text-gray-400 group-hover:text-purple-600">→</span>
              </button>
              <button type="button" onClick={() => handleSelection("both")} className="w-full p-4 text-left border border-gray-200 rounded-2xl hover:border-purple-600 hover:bg-purple-50/50 transition-all flex justify-between items-center group">
                <span className="font-bold text-gray-700 group-hover:text-purple-700 uppercase">Forgot Both</span>
                <span className="text-gray-400 group-hover:text-purple-600">→</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Channel Identification Form Input */}
        {step === 2 && (
          <form onSubmit={handleRecoverySubmit} className="space-y-5 animate-fadeIn">
            <p className="text-xs text-gray-500 font-sans text-center">
              Provide the email tied to your profile for next steps.
            </p>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 block text-center">
                Registered Workspace Email Address
              </label>
              <input
                type="email"
                required
                disabled={isSubmitting}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@domain.com"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:bg-white focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all text-center"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting || !email.trim()}
              className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md transition-all focus:outline-none"
            >
              {isSubmitting ? "Transmitting Request..." : "Dispatch Secure Restoration Request"}
            </button>
          </form>
        )}

        {/* STEP 3: Final Supabase Isolation Confirmation Screen */}
        {step === 3 && (
          <div className="space-y-6 text-center animate-fadeIn py-3">
            <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto border border-purple-100">
              <span className="text-2xl text-purple-600">✓</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-black uppercase tracking-wide text-gray-900">Recovery Matrix Triggered</h3>
              <p className="text-xs text-gray-600 leading-relaxed max-w-[290px] mx-auto bg-gray-50 p-4 rounded-xl border border-gray-200">
                A secure reset sequence has been generated. <strong className="text-purple-700 block mt-2">The reset instructions and secure link will be sent directly from Supabase if an account matches.</strong>
              </p>
            </div>
            <Link
              href="/login"
              className="block w-full py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs uppercase tracking-widest rounded-xl transition-all border border-gray-200"
            >
              Return to Login Screen
            </Link>
          </div>
        )}

        {step < 3 && (
          <div className="pt-4 border-t border-gray-100 text-center">
            <Link href="/login" className="text-[10px] text-gray-400 hover:text-gray-600 font-bold uppercase tracking-wider transition-colors inline-block">
              Cancel & Return to Portal
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}