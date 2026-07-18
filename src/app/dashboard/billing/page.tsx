"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { CreditCard, FileText, Printer, Building2, User2, CheckCircle2, Cpu } from "lucide-react";

interface Invoice {
  id: string;
  invoice_number: string;
  client_email: string;
  client_name: string;
  client_phone: string;
  client_address: string;
  client_city: string;
  client_state: string;
  amount_cents: number;
  payment_status: string;
  issued_at: string;
}

export default function CorporateBillingPage(): React.JSX.Element {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Platform Corporate Identity Metadata Records Constants
  const CORE_PROVIDER = {
    companyName: "Abyss Software Architecture LLC",
    address: "702 West Boundary Runway, Floor 4",
    cityState: "San Francisco, CA 94105",
    email: "operations@abyss-software.io",
    phone: "+1 (800) 555-0192"
  };

  useEffect(() => {
    const session = localStorage.getItem("active_software_user");
    if (!session) {
      setLoading(false);
      return;
    }
    try {
      const parsed = JSON.parse(session);
      if (parsed?.email) {
        fetchInvoices(parsed.email);
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  }, []);

  async function fetchInvoices(email: string) {
    const { data, error } = await supabase
      .from("client_invoices")
      .select("*")
      .eq("client_email", email)
      .order("issued_at", { ascending: false });

    if (!error && data) {
      setInvoices(data);
      if (data.length > 0) setSelectedInvoice(data[0]);
    }
    setLoading(false);
  }

  return (
    <main className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 text-left min-h-screen bg-white text-zinc-900 select-none">
      
      {/* Dynamic Subheading Framework */}
      <div className="border-b border-zinc-200 pb-6">
        <span className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-widest block">
          Financial Ledger Management
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 font-sans mt-1">
          Billing Lifecycle & Invoices
        </h1>
      </div>

      {loading ? (
        <div className="h-64 border border-dashed border-zinc-200 rounded-2xl flex flex-col items-center justify-center text-zinc-400 font-mono text-xs gap-2">
          <Cpu className="w-5 h-5 animate-spin text-zinc-400" />
          <span>Assembling multi-tenant accounting historical data streams...</span>
        </div>
      ) : invoices.length === 0 ? (
        <div className="border border-zinc-200 rounded-2xl p-12 text-center max-w-md mx-auto text-zinc-500 text-xs font-mono">
          No receipt nodes or processing histories linked to this context signature.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: INVOICE HISTORY TIMELINE LOG */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-[10px] font-mono font-black uppercase text-zinc-400 tracking-widest block px-1">
              Historical Receipts Index
            </span>
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
              {invoices.map((inv) => (
                <button
                  key={inv.id}
                  type="button"
                  onClick={() => setSelectedInvoice(inv)}
                  className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                    selectedInvoice?.id === inv.id
                      ? "bg-zinc-950 border-zinc-950 text-white shadow-xs"
                      : "bg-white border-zinc-200 hover:border-zinc-300 text-zinc-900"
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <p className="font-mono text-xs font-bold truncate">
                      {inv.invoice_number}
                    </p>
                    <p className={`text-[10px] font-sans font-medium ${selectedInvoice?.id === inv.id ? "text-zinc-400" : "text-zinc-500"}`}>
                      {new Date(inv.issued_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right font-mono text-xs font-black">
                    ${(inv.amount_cents / 100).toFixed(2)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: DYNAMIC ENTERPRISE INVOICE SHEET DETAIL VIEW */}
          <div className="lg:col-span-7">
            {selectedInvoice && (
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 md:p-8 space-y-8 shadow-xs border-t-4 border-t-zinc-950">
                
                {/* Invoice Meta Grid Header Block */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-zinc-100">
                  <div className="space-y-1.5">
                    {/* Simplified Corporate Icon/Logo Component Block */}
                    <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white flex items-center justify-center font-mono font-black text-xs mb-2">
                      Ω
                    </div>
                    <p className="text-xs font-mono font-black text-zinc-400 uppercase tracking-widest leading-none">Corporate Ledger Ticket</p>
                    <h2 className="text-lg font-mono font-black tracking-tight text-zinc-900">{selectedInvoice.invoice_number}</h2>
                  </div>
                  <div className="sm:text-right space-y-1 font-mono text-xs text-zinc-500">
                    <p><span className="font-bold text-zinc-900">Issued Date:</span> {new Date(selectedInvoice.issued_at).toLocaleDateString()}</p>
                    <p className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md mt-1 text-[10px] uppercase">
                      <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
                      {selectedInvoice.payment_status}
                    </p>
                  </div>
                </div>

                {/* B2B Counterparty Identity Address Block */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs leading-relaxed">
                  {/* Remitter Profile Box */}
                  <div className="space-y-2 border border-zinc-100 p-4 rounded-xl bg-zinc-50/50">
                    <div className="flex items-center gap-1.5 text-zinc-400 font-mono font-black text-[9px] uppercase tracking-wider">
                      <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Issued By Provider</span>
                    </div>
                    <div className="space-y-0.5 font-sans font-medium text-zinc-600">
                      <p className="font-bold text-zinc-900">{CORE_PROVIDER.companyName}</p>
                      <p>{CORE_PROVIDER.address}</p>
                      <p>{CORE_PROVIDER.cityState}</p>
                      <p className="font-mono text-[11px] pt-1 text-zinc-400">{CORE_PROVIDER.email}</p>
                    </div>
                  </div>

                  {/* Recipient Tenant Profile Box */}
                  <div className="space-y-2 border border-zinc-100 p-4 rounded-xl bg-zinc-50/50">
                    <div className="flex items-center gap-1.5 text-zinc-400 font-mono font-black text-[9px] uppercase tracking-wider">
                      <User2 className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Invoiced Remittee Target</span>
                    </div>
                    <div className="space-y-0.5 font-sans font-medium text-zinc-600">
                      <p className="font-bold text-zinc-900">{selectedInvoice.client_name}</p>
                      <p>{selectedInvoice.client_address || "No Corporate Registration Street Found"}</p>
                      <p>{selectedInvoice.client_city || "Global Endpoint Isolation"}, {selectedInvoice.client_state || "Cloud"}</p>
                      <p className="font-mono text-[11px] pt-1 text-zinc-400">{selectedInvoice.client_email}</p>
                    </div>
                  </div>
                </div>

                {/* Quantized Line Items Ledger Frame */}
                <div className="border border-zinc-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left font-sans border-collapse text-xs">
                    <thead>
                      <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-400 font-mono font-black text-[9px] uppercase tracking-wider">
                        <th className="p-3">Infrastructure Package Provision Profile Descriptor</th>
                        <th className="p-3 text-right">Settled Allocation Quantities</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 text-zinc-700 font-medium">
                      <tr>
                        <td className="p-3">
                          <p className="font-bold text-zinc-900">Cloud Application Deployment Architecture Provision</p>
                          <p className="text-[11px] text-zinc-400 font-normal mt-0.5">Instant baseline operational hub instantiation fee metrics tracker</p>
                        </td>
                        <td className="p-3 text-right font-mono text-zinc-900 font-bold">
                          ${(selectedInvoice.amount_cents / 100).toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Bottom Balanced Ledger Computation Row Block */}
                <div className="flex justify-between items-center bg-zinc-950 text-white rounded-xl p-4 font-mono">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Capital Volume Cleared</span>
                  <span className="text-base font-black">${(selectedInvoice.amount_cents / 100).toFixed(2)}</span>
                </div>

                {/* Interactive Operational Print/Download Action Trigger Target */}
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-full h-11 border border-zinc-200 hover:border-zinc-950 text-zinc-900 text-xs font-mono font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 hover:bg-zinc-50 cursor-pointer shadow-2xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>Commit Ledger To Print / PDF</span>
                </button>

              </div>
            )}
          </div>

        </div>
      )}
    </main>
  );
}