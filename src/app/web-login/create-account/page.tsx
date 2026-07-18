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
  // Step 4 access credentials variables
  account_name: string;
  username: string;
  password: string;
}

export default function CreateAccountWizard(): React.JSX.Element {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const [formData, setFormData] = useState<WizardFormData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    title: "",
    business_name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    is_certified: false,
    account_name: "",
    username: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => {
      const nextData = {
        ...prev,
        [name]: type === "checkbox" ? checked : value
      };
      
      // Auto-populate default account values during step 1 to save users repetitive typing
      if (name === "first_name" || name === "last_name") {
        const first = name === "first_name" ? value : prev.first_name;
        const last = name === "last_name" ? value : prev.last_name;
        nextData.account_name = `${first} ${last}`.trim();
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
      // 1. Ingest profile data arrays to your master onboarding tracking table
      const { error: insertOnboardingError } = await supabase
        .from("web_create_account")
        .insert([
          {
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            phone: formData.phone,
            title: formData.title,
            business_name: formData.business_name,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            is_certified: formData.is_certified,
          }
        ]);

      if (insertOnboardingError) {
        setStatusMsg({ type: "error", msg: `ONBOARDING_LEDGER_FAULT: ${insertOnboardingError.message}` });
        setIsSubmitting(false);
        return;
      }

      // 2. Commit account credentials directly to your login access structure
      const { error: insertUserError } = await supabase
        .from("web_login_users")
        .insert([
          {
            email: formData.email,
            username: formData.username,
            password: formData.password,
            account_name: formData.account_name,
            access_level: "administrator"
          }
        ]);

      if (insertUserError) {
        setStatusMsg({ type: "error", msg: `ACCESS_PROVISION_FAULT: ${insertUserError.message}` });
        setIsSubmitting(false);
        return;
      }

      setStatusMsg({
        type: "success",
        msg: "REGISTRATION_COMPLETE: Infrastructure node securely deployed. Rerouting to gateway interface..."
      });

      setTimeout(() => {
        router.push("/web-login");
      }, 1500);

    } catch (err: any) {
      setStatusMsg({ type: "error", msg: `CRITICAL_FAULT: ${err.message || err}` });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans flex items-center justify-center p-6 select-none">
      <div className="w-full max-w-xl bg-white border border-gray-200 p-8 rounded-3xl shadow-xl space-y-6">
        
        {/* Step Progression Ribbon Header */}
        <div className="border-b border-gray-100 pb-5">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono font-bold text-blue-600 tracking-widest uppercase">
              // CORE INITIALIZATION MATRIX // STEP {step} OF 4
            </span>
            <Link href="/web-login" className="text-xs text-gray-400 hover:text-gray-600">
              ✕ Cancel
            </Link>
          </div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight mt-1">
            Create Client Account
          </h1>
          <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${(step / 4) * 100}%` }} />
          </div>
        </div>

        {statusMsg && (
          <div className={`p-3.5 rounded-xl font-mono text-[11px] border leading-relaxed ${
            statusMsg.type === "success" ? "bg-blue-50 border-blue-200 text-blue-800" : "bg-rose-50 border-rose-200 text-rose-700"
          }`}>
            {statusMsg.msg}
          </div>
        )}

        {/* STEP 1: Personal & Contact Information */}
        {step === 1 && (
          <form onSubmit={handleNextStep} className="space-y-4 animate-fadeIn">
            <h3 className="text-sm font-bold uppercase tracking-wide text-gray-800 border-b border-gray-100 pb-2">
              01 // Personal Identity Profile
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-gray-700">First Name *</label>
                <input type="text" required name="first_name" value={formData.first_name} onChange={handleInputChange} placeholder="John" className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:bg-white focus:border-blue-600 transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-gray-700">Last Name *</label>
                <input type="text" required name="last_name" value={formData.last_name} onChange={handleInputChange} placeholder="Doe" className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:bg-white focus:border-blue-600 transition-all" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-gray-700">Email Address *</label>
                <input type="email" required name="email" value={formData.email} onChange={handleInputChange} placeholder="john@company.com" className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:bg-white focus:border-blue-600 transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-gray-700">Phone Number *</label>
                <input type="tel" required name="phone" value={formData.phone} onChange={handleInputChange} placeholder="(555) 000-0000" className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:bg-white focus:border-blue-600 transition-all" />
              </div>
            </div>
            <button type="submit" className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md transition-all mt-4 focus:outline-none">
              Continue to Workspace Details →
            </button>
          </form>
        )}

        {/* STEP 2: Business & Enterprise Operations Metadata */}
        {step === 2 && (
          <form onSubmit={handleNextStep} className="space-y-4 animate-fadeIn">
            <h3 className="text-sm font-bold uppercase tracking-wide text-gray-800 border-b border-gray-100 pb-2">
              02 // Business Ecosystem & Coordinates
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-gray-700">Business Name *</label>
                <input type="text" required name="business_name" value={formData.business_name} onChange={handleInputChange} placeholder="Acme Corporation" className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:bg-white focus:border-blue-600 transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-gray-700">Job Title *</label>
                <input type="text" required name="title" value={formData.title} onChange={handleInputChange} placeholder="Director of Operations" className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:bg-white focus:border-blue-600 transition-all" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase text-gray-700">Street Address *</label>
              <input type="text" required name="address" value={formData.address} onChange={handleInputChange} placeholder="123 Corporate Way, Suite 100" className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:bg-white focus:border-blue-600 transition-all" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-gray-700">City *</label>
                <input type="text" required name="city" value={formData.city} onChange={handleInputChange} placeholder="Jefferson City" className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:bg-white focus:border-blue-600 transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-gray-700">State *</label>
                <input type="text" required name="state" value={formData.state} onChange={handleInputChange} placeholder="MO" maxLength={2} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:bg-white focus:border-blue-600 uppercase transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-gray-700">Zip Code *</label>
                <input type="text" required name="zip" value={formData.zip} onChange={handleInputChange} placeholder="65101" maxLength={10} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:bg-white focus:border-blue-600 transition-all" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setStep(1)} className="w-1/3 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs uppercase rounded-xl transition-all focus:outline-none">
                ← Back
              </button>
              <button type="submit" className="w-2/3 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md transition-all focus:outline-none">
                Review & Certify →
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Liability & Accuracy Certification Acknowledgements */}
        {step === 3 && (
          <form onSubmit={handleNextStep} className="space-y-5 animate-fadeIn">
            <h3 className="text-sm font-bold uppercase tracking-wide text-gray-800 border-b border-gray-100 pb-2">
              03 // Liability Verification Record
            </h3>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs space-y-2 text-gray-700">
              <div className="flex justify-between border-b border-gray-200 pb-1.5"><span className="font-bold">Contact Name:</span><span>{formData.first_name} {formData.last_name} ({formData.title})</span></div>
              <div className="flex justify-between border-b border-gray-200 pb-1.5"><span className="font-bold">Company Node:</span><span>{formData.business_name}</span></div>
              <div className="flex justify-between border-b border-gray-200 pb-1.5"><span className="font-bold">Email Uplink:</span><span>{formData.email}</span></div>
              <div className="flex justify-between">
                <span className="font-bold">Mailing Address:</span>
                <span className="truncate max-w-[60%]">{formData.address}, {formData.city}, {formData.state}</span>
              </div>
            </div>
            <label className="flex items-start space-x-3 p-4 bg-blue-50/50 border border-blue-200 rounded-2xl cursor-pointer hover:bg-blue-50 transition-colors">
              <input
                type="checkbox"
                name="is_certified"
                checked={formData.is_certified}
                onChange={handleInputChange}
                required
                className="mt-0.5 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
              />
              <span className="text-xs text-gray-800 leading-relaxed font-medium">
                I certify that this information is complete and accurate to the best of my knowledge. I understand that providing false or misleading business specifications may result in immediate suspension of client architecture services and access privileges.
              </span>
            </label>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setStep(2)} className="w-1/3 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs uppercase rounded-xl transition-all focus:outline-none">
                ← Back
              </button>
              <button type="submit" disabled={!formData.is_certified} className="w-2/3 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md transition-all focus:outline-none disabled:opacity-40">
                Proceed to Security Setup →
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: Access Credentials Setup (Saves values straight into web_login_users) */}
        {step === 4 && (
          <form onSubmit={handleWizardSubmit} className="space-y-4 animate-fadeIn">
            <h3 className="text-sm font-bold uppercase tracking-wide text-gray-800 border-b border-gray-100 pb-2">
              04 // Access Credentials Engine
            </h3>
            
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase text-gray-700 block">Workspace Account Name *</label>
              <input type="text" required name="account_name" value={formData.account_name} onChange={handleInputChange} placeholder="Company Workspace Display Name" className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:bg-white focus:border-blue-600 transition-all" />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase text-gray-700 block">Security Handshake Route (Email) *</label>
              <input type="email" required name="email" value={formData.email} onChange={handleInputChange} placeholder="email@domain.com" className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:bg-white focus:border-blue-600 transition-all" />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-gray-700">Account Username *</label>
                <input type="text" required name="username" value={formData.username} onChange={handleInputChange} placeholder="johndoe_admin" className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:bg-white focus:border-blue-600 transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-gray-700">Account Access Password *</label>
                <input type="password" required name="password" value={formData.password} onChange={handleInputChange} placeholder="••••••••••••" className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:bg-white focus:border-blue-600 transition-all" />
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <button type="button" disabled={isSubmitting} onClick={() => setStep(3)} className="w-1/3 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs uppercase rounded-xl transition-all focus:outline-none disabled:opacity-50">
                ← Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.username || !formData.password}
                className="w-2/3 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md transition-all focus:outline-none disabled:opacity-40"
              >
                {isSubmitting ? "Finalizing Registry..." : "✓ Complete Core Setup"}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}