"use client";

import React from "react";
import { VacationTrip } from "@/app/dashboard/budget/page";

interface InvestmentsAndGoalsTabProps {
  vacations: VacationTrip[];
  handleFundVacation: (id: string, amount: number) => void;
  investmentInput: string;
  setInvestmentInput: (val: string) => void;
  calculateCompoundProjections: (e: React.FormEvent) => void;
  projectedGrowth: number | null;
}

export default function InvestmentsAndGoalsTab({ 
  vacations, 
  handleFundVacation, 
  investmentInput, 
  setInvestmentInput, 
  calculateCompoundProjections, 
  projectedGrowth 
}: InvestmentsAndGoalsTabProps) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="border-b border-slate-200/60 pb-4">
        <h3 className="text-xl font-black text-slate-900 tracking-tight">Compound Matrix Projections</h3>
        <p className="text-xs text-slate-400 font-medium mt-0.5">Evaluate capital appreciation horizons alongside target vacation savings goals.</p>
      </div>

      {/* Vacation Goal List Section */}
      <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 space-y-4">
        <span className="text-xs font-extrabold text-slate-400 block uppercase tracking-wider select-none">Vacation Funding Targets</span>
        <div className="space-y-3">
          {vacations.map((vac) => {
            const fundingPercent = Math.min((vac.saved / vac.target) * 100, 100);
            return (
              <div key={vac.id} className="border border-slate-100 rounded-xl p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white transition-shadow hover:shadow-sm">
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-black text-slate-800 truncate">{vac.name}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Target Date: {vac.date}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${fundingPercent}%` }} 
                      />
                    </div>
                    <span className="text-[11px] font-bold text-slate-600 shrink-0 tabular-nums">
                      ${vac.saved} <span className="text-slate-300 font-normal">/</span> ${vac.target}
                    </span>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => handleFundVacation(vac.id, 100)}
                  className="w-full sm:w-auto bg-blue-50 border border-blue-100 text-blue-600 font-bold text-xs px-4 h-11 sm:h-9 rounded-xl hover:bg-blue-100/60 transition-all shadow-sm flex items-center justify-center touch-manipulation active:scale-95 select-none"
                >
                  ＋ Allocate $100
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Compound Projections Module */}
      <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 select-none">
          <span className="text-lg">📈</span>
          <span className="text-xs font-extrabold text-slate-400 block uppercase tracking-wider">10-Year Growth Compounder</span>
        </div>
        
        <form onSubmit={calculateCompoundProjections} className="flex flex-col sm:flex-row gap-3 items-stretch">
          <div className="relative flex items-center flex-1">
            <span className="absolute left-3.5 font-bold text-slate-400 text-xs select-none">Monthly Capital:</span>
            <input 
              type="number" 
              placeholder="0" 
              value={investmentInput} 
              onChange={(e) => setInvestmentInput(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-28 pr-4 h-11 text-base sm:text-xs font-bold text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-all"
            />
          </div>
          <button 
            type="submit" 
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 h-11 rounded-xl uppercase tracking-wider transition-all shadow-sm touch-manipulation active:scale-98"
          >
            Compute Yield
          </button>
        </form>

        {projectedGrowth !== null && (
          <div className="p-4 rounded-xl bg-blue-50/40 border border-blue-100/50 text-left animate-fadeIn">
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Compounding this sum monthly at an estimated <strong className="text-blue-600 font-extrabold">8% annual index average yield</strong> prints a calculated asset valuation footprint of <strong className="text-slate-900 font-black tabular-nums">${projectedGrowth.toLocaleString()}</strong> over a 10-year holding timeline.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}