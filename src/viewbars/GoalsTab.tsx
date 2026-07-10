"use client";

import React, { useState } from "react";

// =========================================================================
// TYPE STRUCTURAL ENGINE DEFINITIONS
// =========================================================================
export type PrimaryGoalObjective = "aggressive_cut" | "steady_fat_loss" | "body_recomp" | "clean_bulk" | "circadian_repair";
export type ChronotypeShift = "day_shift" | "night_shift" | "rotating_shift";

export interface IntakeBiometrics {
  currentWeightKg: number;
  targetWeightKg: number;
  heightCm: number;
  ageYears: number;
  biologicalSex: "male" | "female";
  estimatedBodyFatPct: number;
  chronotype: ChronotypeShift;
  avgSleepHours: number;
  avgWaterOunces: number;
  supplements: {
    creatine: boolean;
    caffeine: boolean;
    proteinPowder: boolean;
    omega3: boolean;
  };
}

export interface SimulationWeekFrame {
  weekNumber: number;
  projectedWeightKg: number;
  estimatedLeanMassKg: number;
  estimatedFatMassKg: number;
  metabolicAdaptationDeltaCals: number;
  dailyCaloricTarget: number;
}

export interface SimulationResultPayload {
  achievabilityScore: number;
  estimatedWeeksToTarget: number;
  finalProjectedWeight: number;
  crashDietWarning: boolean;
  circadianPenaltyActive: boolean;
  weeklyTimeline: SimulationWeekFrame[];
  clinicalInsights: string[];
}

export default function GoalsTab() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isSimulated, setIsSimulated] = useState<boolean>(false);
  const [currentSubView, setCurrentSubView] = useState<"intake" | "results">("intake");
  const [activeObjective, setActiveObjective] = useState<PrimaryGoalObjective>("steady_fat_loss");
  const [isLoadingSim, setIsLoadingSim] = useState<boolean>(false);
  const [simulationOutput, setSimulationOutput] = useState<SimulationResultPayload | null>(null);

  const [biometrics, setBiometrics] = useState<IntakeBiometrics>({
    currentWeightKg: 82,
    targetWeightKg: 75,
    heightCm: 180,
    ageYears: 28,
    biologicalSex: "male",
    estimatedBodyFatPct: 22,
    chronotype: "day_shift",
    avgSleepHours: 6.5,
    avgWaterOunces: 64,
    supplements: {
      creatine: false,
      caffeine: false,
      proteinPowder: false,
      omega3: false,
    },
  });

  const lbsToKg = (lbs: number) => parseFloat((lbs * 0.45359237).toFixed(1));
  const kgToLbs = (kg: number) => Math.round(kg * 2.20462);

  // =========================================================================
  // METABOLIC SIMULATION ENGINE
  // =========================================================================
  const runKineticSimulationModel = () => {
    setIsLoadingSim(true);
    
    setTimeout(() => {
      const {
        currentWeightKg,
        targetWeightKg,
        heightCm,
        ageYears,
        biologicalSex,
        estimatedBodyFatPct,
        chronotype,
        avgSleepHours,
        avgWaterOunces,
        supplements,
      } = biometrics;

      const fatMassKg = currentWeightKg * (estimatedBodyFatPct / 100);
      const leanMassKg = currentWeightKg - fatMassKg;
      
      let baseBmr = 370 + (21.6 * leanMassKg);
      
      if (!estimatedBodyFatPct || estimatedBodyFatPct <= 0) {
        baseBmr = biologicalSex === "male"
          ? (10 * currentWeightKg) + (6.25 * heightCm) - (5 * ageYears) + 5
          : (10 * currentWeightKg) + (6.25 * heightCm) - (5 * ageYears) - 161;
      }

      let baseTdee = baseBmr * 1.45;
      let metabolicEfficiencyModifier = 1.0;

      if (chronotype === "night_shift") {
        metabolicEfficiencyModifier -= 0.06;
      } else if (chronotype === "rotating_shift") {
        metabolicEfficiencyModifier -= 0.03;
      }

      if (supplements.caffeine) baseTdee += 60;

      // Fixed: Properly initialize the simulation variables with default state
      let weeklyMacroTargetCalories = Math.round(baseTdee - 400);
      let expectedWeeklyWeightChangeKg = -0.4;

      if (activeObjective === "clean_bulk") {
        weeklyMacroTargetCalories = Math.round(baseTdee + 300);
        expectedWeeklyWeightChangeKg = 0.15;
      } else if (activeObjective === "body_recomp") {
        weeklyMacroTargetCalories = Math.round(baseTdee - 150);
        expectedWeeklyWeightChangeKg = -0.05;
      } else if (activeObjective === "aggressive_cut") {
        weeklyMacroTargetCalories = Math.round(baseTdee - 750);
        expectedWeeklyWeightChangeKg = -0.75;
      } else if (activeObjective === "steady_fat_loss") {
        weeklyMacroTargetCalories = Math.round(baseTdee - 400);
        expectedWeeklyWeightChangeKg = -0.4;
      } else if (activeObjective === "circadian_repair") {
        weeklyMacroTargetCalories = Math.round(baseTdee);
        expectedWeeklyWeightChangeKg = 0;
      }

      let simulatedWeight = currentWeightKg;
      let currentLeanMass = leanMassKg;
      let currentFatMass = fatMassKg;
      let runningMetabolicAdaptation = 0;
      
      const timelineFrames: SimulationWeekFrame[] = [];
      const insights: string[] = [];

      for (let w = 1; w <= 24; w++) {
        const localTdee = (baseTdee * metabolicEfficiencyModifier) - runningMetabolicAdaptation;
        let caloricDeficitSurplus = weeklyMacroTargetCalories - localTdee;

        if (weeklyMacroTargetCalories < 1200) {
          weeklyMacroTargetCalories = 1200;
          caloricDeficitSurplus = weeklyMacroTargetCalories - localTdee;
        }

        const weeklyWeightDeltaKg = (caloricDeficitSurplus * 7) / 7700;
        
        let fatCatabolicRatio = 0.75; 
        if (avgSleepHours < 6) fatCatabolicRatio = 0.55;
        else if (avgSleepHours >= 8) fatCatabolicRatio = 0.85;

        if (supplements.proteinPowder) fatCatabolicRatio += 0.03;

        if (weeklyWeightDeltaKg < 0) {
          const fatLost = weeklyWeightDeltaKg * fatCatabolicRatio;
          const leanLost = weeklyWeightDeltaKg * (1 - fatCatabolicRatio);
          currentFatMass += fatLost;
          currentLeanMass += leanLost;
        } else {
          let leanGainedRatio = 0.4;
          if (supplements.creatine) leanGainedRatio += 0.08;
          if (avgSleepHours >= 7.5) leanGainedRatio += 0.05;

          const leanGained = weeklyWeightDeltaKg * leanGainedRatio;
          const fatGained = weeklyWeightDeltaKg * (1 - leanGainedRatio);
          currentLeanMass += leanGained;
          currentFatMass += fatGained;
        }

        simulatedWeight += weeklyWeightDeltaKg;

        if (caloricDeficitSurplus < 0) {
          runningMetabolicAdaptation += Math.abs(caloricDeficitSurplus) * 0.015;
        }

        timelineFrames.push({
          weekNumber: w,
          projectedWeightKg: parseFloat(simulatedWeight.toFixed(2)),
          estimatedLeanMassKg: parseFloat(currentLeanMass.toFixed(2)),
          estimatedFatMassKg: parseFloat(currentFatMass.toFixed(2)),
          metabolicAdaptationDeltaCals: Math.round(runningMetabolicAdaptation),
          dailyCaloricTarget: Math.round(weeklyMacroTargetCalories),
        });

        if (caloricDeficitSurplus < 0 && simulatedWeight <= targetWeightKg) break;
        if (caloricDeficitSurplus > 0 && simulatedWeight >= targetWeightKg) break;
      }

      let crashDietWarning = false;
      let achievabilityScore = 85;

      const expectedDuration = timelineFrames.length;
      const weeklyRatePct = (Math.abs(timelineFrames[0]?.projectedWeightKg - (timelineFrames[1]?.projectedWeightKg || timelineFrames[0]?.projectedWeightKg)) / currentWeightKg) * 100;

      if (weeklyRatePct > 1.2) {
        crashDietWarning = true;
        achievabilityScore -= 30;
        insights.push("CRITICAL ALERT: Your projected weight loss velocity is too high. This increases muscle-wasting risks.");
      }

      if (chronotype === "night_shift" || chronotype === "rotating_shift") {
        achievabilityScore -= 12;
        insights.push("CIRCADIAN DISRUPTION: Night/rotating shifts can cause minor leptin resistance, penalizing baseline energy efficiency by 6%.");
      }

      if (avgSleepHours < 6.5) {
        achievabilityScore -= 15;
        insights.push("SLEEP SHORTAGE ALERT: Sleeping less than 6.5 hours raises cortisol, causing your body to prioritize burning lean muscle over fat.");
      }

      if (avgWaterOunces < 80) {
        achievabilityScore -= 8;
        insights.push("HYDRATION ALERT: Insufficient hydration slows lipolysis. Drinking more than 90 oz will optimize your fat loss rate.");
      }

      setSimulationOutput({
        achievabilityScore: Math.max(10, Math.min(100, achievabilityScore)),
        estimatedWeeksToTarget: expectedDuration,
        finalProjectedWeight: parseFloat(simulatedWeight.toFixed(1)),
        crashDietWarning,
        circadianPenaltyActive: chronotype !== "day_shift",
        weeklyTimeline: timelineFrames,
        clinicalInsights: insights.length === 0 ? ["All systems aligned. Your timeline projections fall within safe physiological limits."] : insights,
      });

      setIsSimulated(true);
      setCurrentSubView("results");
      setIsLoadingSim(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12 animate-fadeIn text-slate-800">
      
      {/* 1. HEADER */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-extrabold block mb-1">
            // BIOMETRIC PROJECTION HUB
          </span>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Biometric Predictive Console
          </h1>
          <p className="text-sm text-slate-500 mt-1.5 font-medium">
            Run predictive simulations across macronutrient variables, shift configurations, and metabolic adaptation timelines.
          </p>
        </div>

        {isSimulated && (
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/60 text-xs font-bold uppercase tracking-wider">
            <button 
              onClick={() => setCurrentSubView("intake")}
              className={`px-3 py-1.5 rounded-lg transition-all ${currentSubView === "intake" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
            >
              Tune Form
            </button>
            <button 
              onClick={() => setCurrentSubView("results")}
              className={`px-3 py-1.5 rounded-lg transition-all ${currentSubView === "results" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
            >
              Results
            </button>
          </div>
        )}
      </div>

      {/* =========================================================================
          VIEW PANEL: FORM INTAKE WIZARD
          ========================================================================= */}
      {currentSubView === "intake" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          <div className="md:col-span-1 space-y-2">
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest block mb-2 px-1">// ASSESSMENT CHANNELS</span>
            {[
              { step: 1, label: "Basics & Anthropometrics", icon: "📐" },
              { step: 2, label: "Circadian & Shifts", icon: "🌙" },
              { step: 3, label: "Ergogenic Supplement Stack", icon: "💊" },
              { step: 4, label: "Target Vectors & Strategy", icon: "🎯" }
            ].map((s) => (
              <button
                key={s.step}
                onClick={() => setActiveStep(s.step)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs uppercase font-extrabold tracking-wider border transition-all ${
                  activeStep === s.step 
                    ? "bg-slate-900 text-white border-slate-900 shadow-md" 
                    : "bg-white text-slate-400 border-slate-200/60 hover:text-slate-700 hover:bg-slate-100/60"
                }`}
              >
                <span className="text-sm select-none">{s.icon}</span>
                <span className="truncate">{s.label}</span>
              </button>
            ))}

            <div className="pt-4">
              <button
                onClick={runKineticSimulationModel}
                disabled={isLoadingSim}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs uppercase tracking-widest py-3.5 rounded-xl shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoadingSim ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  "Run Simulation ⚡"
                )}
              </button>
            </div>
          </div>

          <div className="md:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm min-h-[360px] flex flex-col justify-between">
            <div className="w-full">
              {activeStep === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="border-b border-slate-50 pb-2">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Step 1: Physical Telemetry</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-wider block mb-1">Current Weight</label>
                      <div className="relative flex items-center">
                        <input 
                          type="number" 
                          value={kgToLbs(biometrics.currentWeightKg)} 
                          onChange={(e) => setBiometrics({ ...biometrics, currentWeightKg: lbsToKg(Number(e.target.value) || 0) })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-black font-mono outline-none focus:border-blue-500"
                        />
                        <span className="absolute right-3 text-xs text-slate-400 font-bold">lbs</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-wider block mb-1">Target Weight</label>
                      <div className="relative flex items-center">
                        <input 
                          type="number" 
                          value={kgToLbs(biometrics.targetWeightKg)} 
                          onChange={(e) => setBiometrics({ ...biometrics, targetWeightKg: lbsToKg(Number(e.target.value) || 0) })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-black font-mono outline-none text-blue-600 focus:border-blue-500"
                        />
                        <span className="absolute right-3 text-xs text-slate-400 font-bold">lbs</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-wider block mb-1">Height</label>
                      <div className="relative flex items-center">
                        <input 
                          type="number" 
                          value={biometrics.heightCm} 
                          onChange={(e) => setBiometrics({ ...biometrics, heightCm: Number(e.target.value) || 0 })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-black font-mono outline-none focus:border-blue-500"
                        />
                        <span className="absolute right-3 text-xs text-slate-400 font-bold">cm</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-wider block mb-1">Age</label>
                      <input 
                        type="number" 
                        value={biometrics.ageYears} 
                        onChange={(e) => setBiometrics({ ...biometrics, ageYears: Number(e.target.value) || 0 })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-black font-mono outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-wider block mb-1">Body Fat % (Optional)</label>
                      <div className="relative flex items-center">
                        <input 
                          type="number" 
                          placeholder="Leave blank for automatic fallback calculations..."
                          value={biometrics.estimatedBodyFatPct || ""} 
                          onChange={(e) => setBiometrics({ ...biometrics, estimatedBodyFatPct: Number(e.target.value) || 0 })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-black font-mono outline-none focus:border-blue-500"
                        />
                        <span className="absolute right-3 text-xs text-slate-400 font-bold">%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="border-b border-slate-50 pb-2">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Step 2: Circadian Infrastructure</h3>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-wider block mb-1.5">Employment Shift</label>
                      <div className="grid grid-cols-3 gap-2 text-[10px] uppercase font-extrabold tracking-wider">
                        {(["day_shift", "night_shift", "rotating_shift"] as ChronotypeShift[]).map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setBiometrics({ ...biometrics, chronotype: c })}
                            className={`py-2 px-1 rounded-xl border text-center transition-all ${
                              biometrics.chronotype === c
                                ? "bg-blue-50 text-blue-700 border-blue-400 shadow-sm"
                                : "bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            {c.replace("_", " ")}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-wider block mb-1">Average Sleep</label>
                        <div className="relative flex items-center">
                          <input 
                            type="number" 
                            step="0.5"
                            value={biometrics.avgSleepHours} 
                            onChange={(e) => setBiometrics({ ...biometrics, avgSleepHours: parseFloat(e.target.value) || 0 })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-black font-mono outline-none focus:border-blue-500"
                          />
                          <span className="absolute right-3 text-xs text-slate-400 font-bold">hrs</span>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-wider block mb-1">Water Intake</label>
                        <div className="relative flex items-center">
                          <input 
                            type="number" 
                            value={biometrics.avgWaterOunces} 
                            onChange={(e) => setBiometrics({ ...biometrics, avgWaterOunces: parseInt(e.target.value) || 0 })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-black font-mono outline-none focus:border-blue-500"
                          />
                          <span className="absolute right-3 text-xs text-slate-400 font-bold">fl oz</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="border-b border-slate-50 pb-2">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Step 3: Supplement Stack</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { key: "creatine", title: "Creatine Monohydrate", desc: "Expands lean hydration reserves, increasing cell volume." },
                      { key: "caffeine", title: "Active Caffeine / Thermogenics", desc: "Slightly accelerates metabolism by ~60 kcal/day." },
                      { key: "proteinPowder", title: "Protein Powder Supplement", desc: "Protects muscle preservation flags during fat deficits." },
                      { key: "omega3", title: "Omega-3 Fatty Acids", desc: "Reduces cellular strain and balances long-term response rules." }
                    ].map((s) => {
                      const isActive = (biometrics.supplements as any)[s.key];
                      return (
                        <div 
                          key={s.key}
                          onClick={() => setBiometrics({
                            ...biometrics,
                            supplements: { ...biometrics.supplements, [s.key]: !isActive }
                          })}
                          className={`p-3.5 border rounded-xl text-left cursor-pointer transition-all flex items-start gap-3 select-none ${
                            isActive ? "bg-emerald-50/50 border-emerald-400 shadow-sm" : "bg-white border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          <div className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center font-mono text-[10px] font-black shrink-0 ${isActive ? "bg-emerald-500 border-emerald-600 text-white" : "bg-slate-50 border-slate-300"}`}>
                            {isActive ? "✓" : ""}
                          </div>
                          <div>
                            <span className="text-xs font-black text-slate-800 block leading-tight">{s.title}</span>
                            <span className="text-[10px] text-slate-400 font-medium block mt-1 leading-normal">{s.desc}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeStep === 4 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="border-b border-slate-50 pb-2">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Step 4: Strategy Mode</h3>
                  </div>

                  <div className="space-y-3">
                    {[
                      { id: "steady_fat_loss", label: "🎯 Controlled Fat Loss", desc: "Optimizes fat oxidation while maintaining hard muscular structures. (TDEE - 15%)" },
                      { id: "aggressive_cut", label: "⚡ High Velocity Aggressive Cut", desc: "Accelerates short-term weight drop metrics. (TDEE - 25%)" },
                      { id: "body_recomp", label: "⚖️ Neuromuscular Recomposition", desc: "Triggers minor muscle gains and fat loss at the same time. (TDEE - 5%)" },
                      { id: "clean_bulk", label: "💪 Hypertrophic Lean Bulk", desc: "Provides energy surpluses to support new lean muscle tissue growth. (TDEE + 10%)" }
                    ].map((g) => (
                      <div
                        key={g.id}
                        onClick={() => setActiveObjective(g.id as PrimaryGoalObjective)}
                        className={`p-3 border rounded-xl cursor-pointer text-left transition-all ${
                          activeObjective === g.id ? "bg-blue-50/50 border-blue-500 shadow-sm" : "bg-white border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <span className="text-xs font-black text-slate-800 block">{g.label}</span>
                        <span className="text-[11px] text-slate-400 font-medium block mt-0.5">{g.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 pt-4 mt-6 flex justify-between">
              <button
                disabled={activeStep === 1}
                onClick={() => setActiveStep(prev => prev - 1)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold uppercase tracking-wide disabled:opacity-30"
              >
                ← Back
              </button>
              
              {activeStep < 4 ? (
                <button
                  onClick={() => setActiveStep(prev => prev + 1)}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wide"
                >
                  Forward →
                </button>
              ) : (
                <button
                  onClick={runKineticSimulationModel}
                  disabled={isLoadingSim}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md"
                >
                  Simulate 🚀
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW PANEL: PROJECTION TIMELINE RESULTS
          ========================================================================= */}
      {currentSubView === "results" && simulationOutput && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-center flex flex-col justify-between">
              <span className="text-[10px] text-slate-400 font-mono font-black uppercase block tracking-wider">// ACHIEVABILITY INDEX</span>
              <div className="py-2">
                <span className={`text-4xl font-black font-mono block ${simulationOutput.achievabilityScore >= 75 ? 'text-emerald-600' : simulationOutput.achievabilityScore >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>
                  {simulationOutput.achievabilityScore}%
                </span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${simulationOutput.achievabilityScore >= 75 ? 'bg-emerald-500' : simulationOutput.achievabilityScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                  style={{ width: `${simulationOutput.achievabilityScore}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-center flex flex-col justify-center">
              <span className="text-[10px] text-slate-400 font-mono font-black uppercase block tracking-wider">// ENGINE PROJECTION</span>
              <div className="py-2">
                <span className="text-4xl font-black font-mono text-slate-900 block">
                  {simulationOutput.estimatedWeeksToTarget} <span className="text-sm text-slate-400 font-sans font-bold">Weeks</span>
                </span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-center flex flex-col justify-center">
              <span className="text-[10px] text-slate-400 font-mono font-black uppercase block tracking-wider">// FINAL MASS BALANCE</span>
              <div className="py-2">
                <span className="text-4xl font-black font-mono text-blue-600 block">
                  {kgToLbs(simulationOutput.finalProjectedWeight)} <span className="text-sm text-slate-400 font-sans font-bold">lbs</span>
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">// PHYSIOLOGICAL DIAGNOSTIC INTERCEPTS</span>
            <div className="space-y-2">
              {simulationOutput.clinicalInsights.map((insight, idx) => (
                <div 
                  key={idx} 
                  className={`p-3 rounded-xl border text-xs font-semibold leading-relaxed flex items-center gap-3 ${
                    insight.includes("ALERT") ? "bg-rose-50/50 border-rose-200 text-rose-800" : "bg-slate-50 border-slate-200 text-slate-600"
                  }`}
                >
                  <span>💡</span>
                  <div>{insight}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/60">
              <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">// SIMULATION MATRIX TIMELINE</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 font-mono uppercase font-black text-slate-400 text-[10px] bg-slate-50/30">
                    <th className="px-5 py-3">Week</th>
                    <th className="px-5 py-3">Projected Weight</th>
                    <th className="px-5 py-3">Lean Muscle Mass</th>
                    <th className="px-5 py-3">Adipose Fat Mass</th>
                    <th className="px-5 py-3">Adaptation Slowdown</th>
                    <th className="px-5 py-3 text-right">Daily Calories</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                  {simulationOutput.weeklyTimeline.map((week) => (
                    <tr key={week.weekNumber} className="hover:bg-slate-50/40 transition-colors">
                      <td className="px-5 py-3 font-mono font-bold text-slate-400">W{week.weekNumber.toString().padStart(2, "0")}</td>
                      <td className="px-5 py-3 font-mono font-black text-slate-950">{kgToLbs(week.projectedWeightKg)} lbs</td>
                      <td className="px-5 py-3 text-emerald-600 font-mono font-bold">{kgToLbs(week.estimatedLeanMassKg)} lbs</td>
                      <td className="px-5 py-3 text-purple-600 font-mono">{kgToLbs(week.estimatedFatMassKg)} lbs</td>
                      <td className="px-5 py-3 text-rose-500 font-mono font-bold">-{week.metabolicAdaptationDeltaCals} kcal</td>
                      <td className="px-5 py-3 text-right font-mono font-black text-blue-600">{week.dailyCaloricTarget} kcal</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
{/* =========================================================================
          SYSTEM SIMULATION & ALGORITHMIC VARIANCE DISCLAIMER
          ========================================================================= */}
      <div className="w-full bg-slate-100/80 border border-slate-200/60 rounded-2xl p-4 mt-8 select-none">
        <div className="text-[10px] font-mono uppercase font-black text-slate-400 tracking-wider mb-1.5">
          // SYSTEM APPLICATION DATA DISCLOSURE
        </div>
        <p className="text-[11px] font-mono leading-relaxed text-slate-400 font-medium">
          <strong className="text-slate-500 font-bold font-sans uppercase text-[10px] tracking-wide block mb-1">⚠️ Predictive Simulation Notice:</strong>
          This interface generates algorithmic forecasts using generalized thermodynamic calculations and research-backed metabolic decay coefficients. Human biochemistry exhibits immense autonomous variance. Because biological feedback changes dynamically, this simulator can contain errors, miscalculations, or timeline deviations. This data layer is an idealized blueprint projection for informational purposes and does not constitute professional medical tracking or clinical prescriptive advice.
        </p>
      </div>
    </div>
  );
}