"use client";

import React from "react";
import { SubscriptionBill } from "@/app/dashboard/budget/page";

interface MySubscriptionsTabProps {
  subscriptions: SubscriptionBill[];
}

export default function MySubscriptionsTab({ subscriptions }: MySubscriptionsTabProps) {
  const accumulatedSubscriptionsTotal = subscriptions.reduce((sum, curr) => sum + curr.amount, 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="border-b border-slate-200/60 pb-4">
        <h3 className="text-xl font-black text-slate-900 tracking-tight">Recurring Ledger</h3>
        <p className="text-xs text-slate-400 font-medium mt-0.5">Monitoring continuous software services, renewals, and recurring contract milestones.</p>
      </div>

      {/* Subscription Load Card */}
      <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 flex justify-between items-center">
        <div>
          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Monthly Fixed Load</span>
          <h4 className="text-2xl font-black text-slate-900 mt-1 tabular-nums">${accumulatedSubscriptionsTotal.toFixed(2)}</h4>
        </div>
        <span className="text-xs bg-rose-50 border border-rose-100 text-rose-500 font-bold px-3 py-1.5 rounded-xl">
          {subscriptions.length} Active Plans
        </span>
      </div>

      {/* Subscription Cards Item Stream */}
      <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 divide-y divide-slate-100">
        {subscriptions.map((sub) => (
          <div key={sub.id} className="py-4 flex justify-between items-center text-xs first:pt-0 last:pb-0 group">
            <div className="min-w-0">
              <h4 className="font-bold text-slate-800 tracking-tight group-hover:text-blue-500 transition-colors truncate">
                {sub.name}
              </h4>
              <span className="text-[10px] font-bold text-rose-400 block mt-0.5 select-none">
                ⏳ Auto-Renew: {sub.dueDate}
              </span>
            </div>
            <div className="text-right shrink-0 ml-4">
              <span className="font-black text-slate-900 text-sm block tabular-nums">
                ${sub.amount.toFixed(2)}
              </span>
              <span className="text-[9px] text-slate-400 block mt-0.5">per cycle</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}