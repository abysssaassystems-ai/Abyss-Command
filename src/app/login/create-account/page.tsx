"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

interface WizardFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  title: string;
  business_name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  is_certified: boolean;
  account_name: string;
  username: string;
  password: string;
}

export default function CreateSoftwareAccountWizard(): React.JSX.Element {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const [formData, setFormData] = useState<WizardFormData>({
    first_name: "", last_name: "", email: "", phone: "", title: "", business_name: "",
    address: "", city: "", state: "", zip: "", is_certified: false,
    account_name: "", username: "", password: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => {
      const nextData = { ...prev, [name]: type === "checkbox" ? checked : value };
      if (name === "first_name" || name === "last_name") {
        const first = name === "first_name" ? value : prev.first_name;
        const last = name === "last_name" ? value : prev.last_name;
        nextData.account_name = `${first} ${last} (App Workspace)`.trim();
      }
      return nextData;
    });
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(prev => prev + 1);
  };

  const handleWizardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMsg(null);

    try {
      // 1. Register the core authentication account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            username: formData.username,
            account_name: formData.account_name,
          }
        }
      });

      if (authError) {
        setStatusMsg({ type: "error", msg: `AUTH_FAULT: ${authError.message}` });
        setIsSubmitting(false);
        return;
      }

      const nativeUser = authData?.user;
      if (!nativeUser) {
        setStatusMsg({ type: "error", msg: "AUTH_FAULT: Failed to generate system registration identity token." });
        setIsSubmitting(false);
        return;
      }

      // 2. Explicitly write to the clients workspace table
      const generatedSlug = `${formData.email.split("@")[0]}-${Math.random().toString(36).substring(2, 6)}`;
      const { error: clientError } = await supabase
        .from("apps_and_software_clients")
        .insert([{
          id: generatedSlug,
          user_id: nativeUser.id,
          email: formData.email,
          username: formData.username,
          account_name: formData.account_name,
          access_level: "client"
        }]);

      if (clientError) {
        setStatusMsg({ type: "error", msg: `CLIENT_TABLE_FAULT: ${clientError.message}` });
        setIsSubmitting(false);
        return;
      }

      // 3. Explicitly write to the onboarding ledger table
      const { error: onboardingError } = await supabase
        .from("apps_and_software_create_account")
        .insert([{
          user_id: nativeUser.id,
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          title: formData.title,
          business_name: formData.business_name,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          is_certified: formData.is_certified
        }]);

      if (onboardingError) {
        setStatusMsg({ type: "error", msg: `LEDGER_TABLE_FAULT: ${onboardingError.message}` });
        setIsSubmitting(false);
        return;
      }

      setStatusMsg({
        type: "success",
        msg: "REGISTRATION_COMPLETE: Secure app environment successfully provisioned. Routing to terminal gateway..."
      });

      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch (err: any) {
      setStatusMsg({ type: "error", msg: `CRITICAL_EXCEPTION: ${err.message || err}` });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans flex items-center justify-center p-6 select-none">
      <div className="w-full max-w-xl bg-white border border-gray-200 p-8 rounded-3xl shadow-xl space-y-6">
        
        {/* Wizard Progression Track */}
        <div className="border-b border-gray-100 pb-5">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono font-bold text-purple-600 tracking-widest uppercase">
              // CORE ONBOARDING SYSTEM // STEP {step} OF 4
            </span>
            <Link href="/login" className="text-xs text-gray-400 hover:text-gray-600">✕ Cancel</Link>
          </div>
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mt-1">Software Registration</h2>
          <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-full transition-all duration-300" style={{ width: `${(step / 4) * 100}%` }} />
          </div>
        </div>

        {statusMsg && (
          <div className={`p-3.5 rounded-xl font-mono text-[11px] border leading-relaxed ${
            statusMsg.type === "success" ? "bg-purple-50 border-purple-200 text-purple-900" : "bg-rose-50 border-rose-200 text-rose-700"
          }`}>
            {statusMsg.msg}
          </div>
        )}

        {/* STEP 1: Personal & Contact Specifications */}
        {step === 1 && (
          <form onSubmit={handleNextStep} className="space-y-4 animate-fadeIn">
            <h3 className="text-sm font-bold uppercase tracking-wide text-gray-800 border-b border-gray-100 pb-1">01 // Primary Personal Profile</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-gray-700">First Name *</label>
                <input type="text" required name="first_name" value={formData.first_name} onChange={handleInputChange} placeholder="Alex" className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:bg-white focus:border-purple-600" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-gray-700">Last Name *</label>
                <input type="text" required name="last_name" value={formData.last_name} onChange={handleInputChange} placeholder="Vance" className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:bg-white focus:border-purple-600" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-gray-700">Email Address *</label>
                <input type="email" required name="email" value={formData.email} onChange={handleInputChange} placeholder="alex@engine.io" className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:bg-white focus:border-purple-600" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-gray-700">Phone Number *</label>
                <input type="tel" required name="phone" value={formData.phone} onChange={handleInputChange} placeholder="(555) 123-4567" className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:bg-white focus:border-purple-600" />
              </div>
            </div>
            <button type="submit" className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md transition-all mt-3 focus:outline-none">
              Continue →
            </button>
          </form>
        )}

        {/* STEP 2: Enterprise Operations Data */}
        {step === 2 && (
          <form onSubmit={handleNextStep} className="space-y-4 animate-fadeIn">
            <h3 className="text-sm font-bold uppercase tracking-wide text-gray-800 border-b border-gray-100 pb-1">02 // Corporate Node Specifications</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-gray-700">Business Name *</label>
                <input type="text" required name="business_name" value={formData.business_name} onChange={handleInputChange} placeholder="Black Mesa Software" className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:bg-white focus:border-purple-600" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-gray-700">Operational Title *</label>
                <input type="text" required name="title" value={formData.title} onChange={handleInputChange} placeholder="Lead Systems Architect" className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:bg-white focus:border-purple-600" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase text-gray-700">Street Address *</label>
              <input type="text" required name="address" value={formData.address} onChange={handleInputChange} placeholder="456 Research Lab Blvd, Building B" className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:bg-white focus:border-purple-600" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-gray-700">City *</label>
                <input type="text" required name="city" value={formData.city} onChange={handleInputChange} placeholder="Los Alamos" className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:bg-white focus:border-purple-600" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-gray-700">State *</label>
                <input type="text" required name="state" value={formData.state} onChange={handleInputChange} placeholder="NM" maxLength={2} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:bg-white focus:border-purple-600 uppercase" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-gray-700">Zip Code *</label>
                <input type="text" required name="zip" value={formData.zip} onChange={handleInputChange} placeholder="87544" className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:bg-white focus:border-purple-600" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setStep(1)} className="w-1/3 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs uppercase rounded-xl transition-all">← Back</button>
              <button type="submit" className="w-2/3 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md transition-all">Verify Blueprint Specs →</button>
            </div>
          </form>
        )}

        {/* STEP 3: Liability & Certification Sign-off */}
        {step === 3 && (
          <form onSubmit={handleNextStep} className="space-y-5 animate-fadeIn">
            <h3 className="text-sm font-bold uppercase tracking-wide text-gray-800 border-b border-gray-100 pb-1">03 // Liability Profile Execution</h3>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs space-y-2 text-gray-700 font-mono">
              <div><strong>Name:</strong> {formData.first_name} {formData.last_name}</div>
              <div><strong>Entity:</strong> {formData.business_name} ({formData.title})</div>
              <div><strong>Contact:</strong> {formData.email}</div>
            </div>
            <label className="flex items-start space-x-3 p-4 bg-purple-50/60 border border-purple-200 rounded-2xl cursor-pointer hover:bg-purple-50 transition-colors">
              <input type="checkbox" name="is_certified" checked={formData.is_certified} onChange={handleInputChange} required className="mt-0.5 h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-600 cursor-pointer" />
              <span className="text-xs text-gray-800 leading-relaxed font-medium">
                I certify that this information is complete and accurate to the best of my knowledge. I understand that providing false or misleading business specifications may result in immediate suspension of client architecture services and access privileges.
              </span>
            </label>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setStep(2)} className="w-1/3 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs uppercase rounded-xl transition-all">← Back</button>
              <button type="submit" disabled={!formData.is_certified} className="w-2/3 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md transition-all disabled:opacity-40">Proceed to Security Layer →</button>
            </div>
          </form>
        )}

        {/* STEP 4: Access Credentials Layer Generation */}
        {step === 4 && (
          <form onSubmit={handleWizardSubmit} className="space-y-4 animate-fadeIn">
            <h3 className="text-sm font-bold uppercase tracking-wide text-gray-800 border-b border-gray-100 pb-1">04 // Security Credentials Generation</h3>
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase text-gray-700 block">Workspace Display Name *</label>
              <input type="text" required name="account_name" value={formData.account_name} onChange={handleInputChange} placeholder="Workspace Account Name Identifier" className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:bg-white focus:border-purple-600" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-gray-700">Account Username *</label>
                <input type="text" required name="username" value={formData.username} onChange={handleInputChange} placeholder="system_operator" className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:bg-white focus:border-purple-600" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-gray-700">Access Key Password *</label>
                <input type="password" required name="password" value={formData.password} onChange={handleInputChange} placeholder="••••••••••••" className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:bg-white focus:border-purple-600" />
              </div>
            </div>
            <div className="flex gap-3 pt-3">
              <button type="button" disabled={isSubmitting} onClick={() => setStep(3)} className="w-1/3 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs uppercase rounded-xl transition-all focus:outline-none disabled:opacity-50">← Back</button>
              <button type="submit" disabled={isSubmitting || !formData.username || !formData.password} className="w-2/3 py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md transition-all focus:outline-none disabled:opacity-40">
                {isSubmitting ? "Generating Vault Elements..." : "✓ Complete System Deployment"}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}