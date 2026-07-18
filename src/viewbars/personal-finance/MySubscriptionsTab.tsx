"use client";

import React from "react";
import { SubscriptionBill } from "@/app/dashboard/my-apps/budget/page";
import { 
  CalendarClock, 
  CreditCard, 
  DollarSign, 
  Clock, 
  Activity, 
  HelpCircle 
} from "lucide-react";

interface MySubscriptionsTabProps {
  subscriptions: SubscriptionBill[];
}

export default function MySubscriptionsTab({ subscriptions }: MySubscriptionsTabProps): React.JSX.Element {
  const accumulatedSubscriptionsTotal = subscriptions.reduce((sum, curr) => sum + curr.amount, 0);

  return (
    <div className="space-y-6 animate-fadeIn text-gray-800 select-none">
      
      {/* 1. CONTROL DECK HEADER STRIP */}
      <div className="border-b border-gray-200 pb-5">
        <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          <CalendarClock className="w-5 h-5 text-purple-600" /> Recurring Commitment Ledger
        </h3>
        <p className="text-xs text-gray-400 font-medium mt-0.5">
          Monitoring active software deployments, automated renewals, and continuous subscription milestones.
        </p>
      </div>

      {/* 2. CUMULATIVE MONTHLY RUNWAY LOAD METRIC CARD */}
      <div className="p-[1px] bg-gradient-to-r from-purple-600 via-blue-500 to-gray-200 rounded-2xl shadow-sm">
        <div className="bg-white rounded-[15px] p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-black text-gray-400 uppercase tracking-widest block">
                AGGREGATED MONTHLY FIXED LOAD
              </span>
              <h4 className="text-2xl font-mono font-black text-gray-900 mt-0.5 tracking-tight tabular-nums flex items-center">
                <DollarSign className="w-5 h-5 text-gray-400 shrink-0 stroke-[2.5]" />
                {accumulatedSubscriptionsTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h4>
            </div>
          </div>

          <span className="text-[10px] font-mono font-black uppercase tracking-wider bg-rose-50 border border-rose-100 text-rose-600 px-3 py-2 rounded-xl h-fit self-start sm:self-auto shadow-xs">
            {subscriptions.length} Monitored Channels
          </span>
        </div>
      </div>

      {/* 3. SUBSCRIPTIONS ACTIVE CONTRACT MATRIX LIST */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5 space-y-4">
        <span className="text-[10px] font-mono font-black text-gray-400 uppercase tracking-wider block ml-1">
          Active Transmission Profiles
        </span>

        <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100 bg-gray-50/10">
          {subscriptions.length > 0 ? (
            subscriptions.map((sub) => (
              <div 
                key={sub.id} 
                className="p-4 flex justify-between items-center text-xs group hover:bg-white transition-all first:rounded-t-xl last:rounded-b-xl"
              >
                <div className="min-w-0 flex items-center gap-3.5">
                  <div className="p-2 rounded-xl bg-white border border-gray-100 text-gray-400 group-hover:text-purple-600 group-hover:border-purple-100 transition-colors shadow-xs shrink-0">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-black text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors truncate">
                      {sub.name}
                    </h4>
                    <span className="text-[10px] font-mono font-bold text-purple-600 flex items-center gap-1 mt-1 uppercase">
                      <Clock className="w-3 h-3 stroke-[2.5]" /> Auto-Renew Date: <span className="text-gray-900 font-black">{sub.dueDate}</span>
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0 ml-4 font-mono bg-white px-3 py-2 rounded-xl border border-gray-100 shadow-xs group-hover:border-gray-200 transition-colors">
                  <span className="font-black text-gray-900 text-sm block tabular-nums">
                    ${sub.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className="text-[8px] text-gray-400 font-black uppercase tracking-wider block mt-0.5">
                    Per Billing Cycle
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 space-y-2 max-w-sm mx-auto">
              <HelpCircle className="w-6 h-6 text-gray-300 mx-auto" />
              <p className="text-xs font-black text-gray-400 uppercase tracking-wide font-mono">
                [ REGISTRY_VACANT ]
              </p>
              <p className="text-xs text-gray-400 leading-relaxed font-medium">
                No recurring liabilities or system vendor software parameters registered inside this pipeline pool partition.
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}