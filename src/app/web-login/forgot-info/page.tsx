"use client";
import React, { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type RecoveryType = "password" | "username" | "both" | null;

export default function ForgotInfoRecovery(): React.JSX.Element {
  const [step, setStep] = useState<number>(1);
  const [recoveryType, setRecoveryType] = useState<RecoveryType>(null);
  const [email, setEmail] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const handleTypeSelection = (type: RecoveryType) => {
    setRecoveryType(type);
    setStep(2);
    setStatusMsg(null);
  };

  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMsg(null);

    try {
      // Lookup email against registered login table to verify existence
      const { data, error } = await supabase
        .from("web_login_users")
        .select("account_name, username")
        .eq("email", email)
        .maybeSingle();

      if (error) {
        setStatusMsg({ type: "error", msg: `LOOKUP_ERROR: ${error.message}` });
        return;
      }

      if (!data) {
        setStatusMsg({ type: "error", msg: "No account found matching that email address in our system." });
        return;
      }

      // If successful, move to the final confirmation screen
      setStep(3);
    } catch (err: any) {
      setStatusMsg({ type: "error", msg: `EXCEPTION: ${err.message || err}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans flex items-center justify-center p-6 select-none">
      <div className="w-full max-w-md bg-white border border-gray-200 p-8 rounded-3xl shadow-xl space-y-6">
        
        {/* Wizard Header */}
        <div className="text-center border-b border-gray-100 pb-5 relative">
          {step > 1 && step < 3 && (
            <button 
              onClick={() => { setStep(1); setStatusMsg(null); }} 
              className="absolute left-0 top-0 mt-1 text-[10px] uppercase font-bold text-gray-400 hover:text-blue-600 transition-colors"
            >
              ← Back
            </button>
          )}
          <span className="text-[10px] font-mono font-bold text-blue-600 tracking-widest uppercase block">
            // CREDENTIAL RECOVERY // STEP {step} OF 3
          </span>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight mt-1">
            Account Access
          </h1>
          <div className="w-full max-w-[120px] mx-auto bg-gray-100 h-1 rounded-full mt-4 overflow-hidden">
            <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }} />
          </div>
        </div>

        {statusMsg && step < 3 && (
          <div className={`p-3.5 rounded-xl font-mono text-[11px] border leading-relaxed ${
            statusMsg.type === "success" ? "bg-blue-50 border-blue-200 text-blue-800" : "bg-rose-50 border-rose-200 text-rose-700"
          }`}>
            {statusMsg.msg}
          </div>
        )}

        {/* STEP 1: Select Recovery Target */}
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <p className="text-xs text-gray-500 font-sans text-center mb-6">
              What piece of information do you need help recovering today?
            </p>

            <div className="space-y-3 font-mono text-[11px]">
              <button
                onClick={() => handleTypeSelection("password")}
                className="w-full p-4 text-left border border-gray-200 rounded-2xl hover:border-blue-600 hover:bg-blue-50 transition-all flex justify-between items-center group"
              >
                <span className="font-bold text-gray-700 group-hover:text-blue-700 uppercase">Forgot Password</span>
                <span className="text-gray-400 group-hover:text-blue-600">→</span>
              </button>
              
              <button
                onClick={() => handleTypeSelection("username")}
                className="w-full p-4 text-left border border-gray-200 rounded-2xl hover:border-blue-600 hover:bg-blue-50 transition-all flex justify-between items-center group"
              >
                <span className="font-bold text-gray-700 group-hover:text-blue-700 uppercase">Forgot Username</span>
                <span className="text-gray-400 group-hover:text-blue-600">→</span>
              </button>

              <button
                onClick={() => handleTypeSelection("both")}
                className="w-full p-4 text-left border border-gray-200 rounded-2xl hover:border-blue-600 hover:bg-blue-50 transition-all flex justify-between items-center group"
              >
                <span className="font-bold text-gray-700 group-hover:text-blue-700 uppercase">Forgot Both</span>
                <span className="text-gray-400 group-hover:text-blue-600">→</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Email Verification */}
        {step === 2 && (
          <form onSubmit={handleRecoverySubmit} className="space-y-5 animate-fadeIn">
            <p className="text-xs text-gray-500 font-sans text-center">
              Please enter the email address associated with your workspace account to verify your identity.
            </p>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 block text-center">
                Registered Email Address
              </label>
              <input
                type="email"
                required
                disabled={isSubmitting}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@company.com"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-center"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !email}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md transition-all focus:outline-none disabled:opacity-50"
            >
              {isSubmitting ? "Verifying Account..." : "Dispatch Secure Link"}
            </button>
          </form>
        )}

        {/* STEP 3: Final Supabase Confirmation Notice */}
        {step === 3 && (
          <div className="space-y-6 text-center animate-fadeIn py-4">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto border border-blue-100">
              <span className="text-2xl text-blue-600">✓</span>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-black uppercase tracking-wide text-gray-900">
                Recovery Initiated
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed max-w-[280px] mx-auto bg-gray-50 p-4 rounded-xl border border-gray-200">
                A secure reset sequence has been generated. <strong className="text-gray-900 block mt-2">The reset instructions and secure link will be sent directly from Supabase.</strong> Please disregard any other reset emails.
              </p>
            </div>

            <Link
              href="/web-login"
              className="block w-full py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs uppercase tracking-widest rounded-xl transition-all border border-gray-200"
            >
              Return to Login Screen
            </Link>
          </div>
        )}

        {step < 3 && (
          <div className="pt-4 border-t border-gray-100 text-center">
            <Link
              href="/web-login"
              className="text-[10px] text-gray-400 hover:text-gray-600 font-bold uppercase tracking-wider transition-colors inline-block"
            >
              Cancel & Return to Login
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}