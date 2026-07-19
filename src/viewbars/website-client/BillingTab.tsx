"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from "@/lib/supabaseClient";

interface BillingProfile {
  balance: number;
  monthly_retainer: number;
  payment_status: string;
  card_brand: string | null;
  card_last4: string | null;
}

interface InvoiceRecord {
  id: string;
  invoice_number: string;
  issued_at: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  download_url: string | null;
}

export default function BillingTab(): React.JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<BillingProfile | null>(null);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const aggregateBillingLedgerData = async () => {
      try {
        setIsLoading(true);
        setErrorMsg(null);

        // 1. IDENTITY DISCOVERY: Pull authenticated session context parameters
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          setErrorMsg("SESSION_UNVERIFIED: Authentication token expired or missing.");
          return;
        }

        // 2. PARALLEL DATABASE CAPTURE: Retrieve profile fields and invoices concurrently
        const [billingProfileResponse, invoicesResponse] = await Promise.all([
          supabase
            .from("web_login_users")
            .select("balance, monthly_retainer, payment_status, card_brand, card_last4")
            .eq("id", user.id)
            .maybeSingle(),
          supabase
            .from("web_invoices")
            .select("id, invoice_number, issued_at, amount, status, download_url")
            .eq("user_id", user.id)
            .order("issued_at", { ascending: false })
        ]);

        // Evaluate profile query integrity
        if (billingProfileResponse.error) {
          throw new Error(`PROFILE_FETCH_FAULT: ${billingProfileResponse.error.message}`);
        }
        
        // Evaluate transactional log query integrity
        if (invoicesResponse.error) {
          throw new Error(`LEDGER_FETCH_FAULT: ${invoicesResponse.error.message}`);
        }

        // Assign states safely
        if (billingProfileResponse.data) {
          setProfile({
            balance: Number(billingProfileResponse.data.balance) || 0.00,
            monthly_retainer: Number(billingProfileResponse.data.monthly_retainer) || 0.00,
            payment_status: billingProfileResponse.data.payment_status || "UNKNOWN",
            card_brand: billingProfileResponse.data.card_brand,
            card_last4: billingProfileResponse.data.card_last4
          });
        } else {
          setProfile({
            balance: 0.00,
            monthly_retainer: 0.00,
            payment_status: "UNLINKED",
            card_brand: null,
            card_last4: null
          });
        }

        setInvoices(invoicesResponse.data || []);
      } catch (err: any) {
        setErrorMsg(err.message || "UNCAUGHT_SYSTEM_METRIC_FAULT");
      } finally {
        setIsLoading(false);
      }
    };

    aggregateBillingLedgerData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return "N/A";
    return new Date(isoString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center font-mono text-[11px] text-gray-400">
        <div className="text-center space-y-2">
          <div className="animate-pulse tracking-widest text-[#00F2FE] font-bold">// SECURING LEDGER CONTEXT //</div>
          <div>COMPILING REAL-TIME BALANCES...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn select-none max-w-5xl mx-auto">
      
      {/* Header Panel */}
      <div className="bg-[#374151] border border-gray-500/40 p-6 rounded-3xl shadow-lg">
        <span className="text-[10px] font-mono font-bold tracking-widest text-[#00F2FE] uppercase block">// RETENTION ACCOUNTING</span>
        <h2 className="text-xl font-black text-white uppercase italic mt-1">Ledger Statements & Invoices</h2>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl font-mono text-[11px] text-rose-400">
          ⚠ ERROR_RECONCILIATION_HALT: {errorMsg}
        </div>
      )}

      {/* Main Account Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Core Matrix Status Box */}
        <div className="bg-[#374151] border border-[#00F2FE]/20 p-6 rounded-3xl shadow-md space-y-4 md:col-span-2 relative overflow-hidden">
          <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">✦ Autopay Settlement Matrices</h3>
          <p className="text-xs text-gray-300 leading-relaxed font-sans">
            Review architecture balances, download historical invoice records, and monitor server lifecycle retention parameters automatically.
          </p>
          
          <div className="p-4 bg-gray-950/30 border border-gray-500/10 rounded-xl font-mono text-xs space-y-2 text-gray-300">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span>Dynamic Development Balance:</span> 
              <span className="text-white font-bold">{formatCurrency(profile?.balance || 0)}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span>Operational Base Retainer:</span> 
              <span className="text-[#00F2FE] font-bold">{formatCurrency(profile?.monthly_retainer || 0)} / mo</span>
            </div>
          </div>
        </div>

        {/* Payment Instrument Widget */}
        <div className="bg-[#374151] border border-gray-500/30 p-6 rounded-3xl shadow-md flex flex-col justify-between font-mono">
          <div className="space-y-2">
            <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">// SETTLEMENT INSTRUMENT</span>
            <h4 className="text-xs font-black text-white uppercase tracking-wide">Primary Target</h4>
          </div>

          {profile?.card_brand && profile?.card_last4 ? (
            <div className="bg-gray-950/20 border border-gray-500/10 rounded-xl p-3 text-xs flex items-center justify-between mt-4">
              <div className="space-y-0.5">
                <span className="text-white font-bold uppercase tracking-wider text-[11px]">{profile.card_brand}</span>
                <span className="text-gray-400 block text-[10px]">•••• •••• •••• {profile.card_last4}</span>
              </div>
              <span className={`px-2 py-0.5 text-[8px] border rounded font-bold tracking-widest uppercase ${
                profile.payment_status.toLowerCase() === 'active' || profile.payment_status.toLowerCase() === 'good'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
              }`}>
                {profile.payment_status}
              </span>
            </div>
          ) : (
            <div className="text-[11px] text-gray-400 italic py-4 mt-4 border border-dashed border-gray-500/20 rounded-xl p-3 bg-gray-950/10 text-center">
              No continuous auto-settlement token linked to this node profile.
            </div>
          )}
        </div>

      </div>

      {/* Historical Ledger Invoices Section */}
      <div className="bg-[#374151] border border-gray-500/30 rounded-3xl p-6 shadow-md space-y-4">
        <div className="border-b border-gray-500/20 pb-3">
          <span className="text-[9px] font-mono text-gray-400 font-bold block uppercase tracking-wider">// STATEMENTS ARCHIVE</span>
          <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono mt-0.5">Historical Database Runs</h3>
        </div>

        {invoices.length === 0 ? (
          <div className="py-8 text-center text-xs font-mono text-gray-400 italic bg-gray-950/10 rounded-2xl border border-gray-500/5">
            // NO STATEMENTS CURRENTLY RECORDED ON THIS ACCOUNT COMPILATION NODE //
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-500/20 text-gray-400 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-bold">Statement ID</th>
                  <th className="pb-3 font-bold">Execution Date</th>
                  <th className="pb-3 font-bold">Amount</th>
                  <th className="pb-3 font-bold">Status</th>
                  <th className="pb-3 font-bold text-right">Payload</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-500/10 transition-colors group">
                    <td className="py-3.5 text-white font-bold">{invoice.invoice_number}</td>
                    <td className="py-3.5 font-sans text-[11px]">{formatDate(invoice.issued_at)}</td>
                    <td className="py-3.5">{formatCurrency(invoice.amount)}</td>
                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase border tracking-wider ${
                        invoice.status === 'paid'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : invoice.status === 'pending'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      {invoice.download_url ? (
                        <a
                          href={invoice.download_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#00F2FE] hover:underline hover:text-cyan-300 text-[11px] font-bold tracking-wide"
                        >
                          FETCH_PDF ↓
                        </a>
                      ) : (
                        <span className="text-gray-500 italic text-[10px]">UNAVAILABLE</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}