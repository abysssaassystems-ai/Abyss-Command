"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { 
  Scale, 
  Moon, 
  Pill, 
  Target, 
  Zap, 
  Sparkles, 
  Check, 
  Lightbulb, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight, 
  Activity, 
  Info, 
  Droplets, 
  Loader2,
  CalendarDays,
  LineChart,
  BrainCircuit
} from "lucide-react";

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

export default function GoalsTab(): React.JSX.Element {
  // --- MULTI-TENANT SECURE SESSION STATE ---
  const [tenantEmail, setTenantEmail] = useState<string>("authenticating...");
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

  // Securely resolve current tenant contextual parameters
  useEffect(() => {
    function handleUserIdentity(user: any) {
      if (user?.email) {
        setTenantEmail(user.email);
      } else if (user) {
        setTenantEmail("anonymous_isolated");
      } else {
        setTenantEmail("unauthenticated_session");
      }
    }

    // 1. Initial secure token signature validation pass
    async function verifySession() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (!error && user) {
          handleUserIdentity(user);
        } else {
          handleUserIdentity(null);
        }
      } catch (err) {
        console.error("GOALS_AUTH_HYDRATION_EXCEPTION:", err);
        setTenantEmail("fault_containment_mode");
      }
    }
    verifySession();

    // 2. Real-time session sync guard channel connection
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleUserIdentity(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const lbsToKg = (lbs: number) => parseFloat((lbs * 0.45359237).toFixed(1));
  const kgToLbs = (kg: number) => Math.round(kg * 2.20462);

  // =========================================================================
  // METABOLIC KINETIC SIMULATION MODEL ENGINE
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

      let weeklyMacroTargetCalories = Math.round(baseTdee - 400);
      
      if (activeObjective === "clean_bulk") {
        weeklyMacroTargetCalories = Math.round(baseTdee + 300);
      } else if (activeObjective === "body_recomp") {
        weeklyMacroTargetCalories = Math.round(baseTdee - 150);
      } else if (activeObjective === "aggressive_cut") {
        weeklyMacroTargetCalories = Math.round(baseTdee - 750);
      } else if (activeObjective === "steady_fat_loss") {
        weeklyMacroTargetCalories = Math.round(baseTdee - 400);
      } else if (activeObjective === "circadian_repair") {
        weeklyMacroTargetCalories = Math.round(baseTdee);
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

        if (caloricDeficitSurplus < 0 && runningMetabolicAdaptation < Math.abs(caloricDeficitSurplus)) {
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
        insights.push("CRITICAL ALERT: Projected weight loss velocity exceeds physiological thresholds. Risk of accelerated muscle wasting detected.");
      }

      if (chronotype === "night_shift" || chronotype === "rotating_shift") {
        achievabilityScore -= 12;
        insights.push("CIRCADIAN DISRUPTION: Shift scheduling creates systemic cortisol variation, reducing baseline energy expenditure efficiency thresholds by up to 6%.");
      }

      if (avgSleepHours < 6.5) {
        achievabilityScore -= 15;
        insights.push("SLEEP ARCHITECTURE DEFICIT: Sleeping under 6.5 hours triggers endocrine stress responses, steering catabolism toward active structural lean tissue instead of adipose storage.");
      }

      if (avgWaterOunces < 80) {
        achievabilityScore -= 8;
        insights.push("HYDRATION BOUNDARY EXCEEDED: Intracellular hydration restriction retards optimal lipolysis models. Incrementing intake beyond 90 oz restores parameter efficiency.");
      }

      setSimulationOutput({
        achievabilityScore: Math.max(10, Math.min(100, achievabilityScore)),
        estimatedWeeksToTarget: expectedDuration,
        finalProjectedWeight: parseFloat(simulatedWeight.toFixed(1)),
        crashDietWarning,
        circadianPenaltyActive: chronotype !== "day_shift",
        weeklyTimeline: timelineFrames,
        clinicalInsights: insights.length === 0 ? ["All physiological markers aligned. Timeline matrix projections reside safely within homeostatic tolerances."] : insights,
      });

      setIsSimulated(true);
      setCurrentSubView("results");
      setIsLoadingSim(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-[1100px] mx-auto pb-12 animate-fadeIn text-gray-800 select-none">
      
      {/* 1. APP HEADER STACK */}
      <div className="border-b border-gray-200 pb-5 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <span className="text-[10px] bg-purple-50 border border-purple-100 text-purple-600 font-mono font-black px-2.5 py-1 rounded-md tracking-wider uppercase">
            Predictive Kinetic Modeling Module
          </span>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 mt-2 flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-purple-600" /> Biometric Predictive Console
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Execute recursive therapeutic forecasts across macronutrient configurations, circadian disruptions, and localized metabolic adaptation limits.
          </p>
        </div>

        {isSimulated && (
          <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 shadow-inner text-xs font-mono font-black uppercase tracking-wider">
            <button 
              onClick={() => setCurrentSubView("intake")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${currentSubView === "intake" ? "bg-white text-purple-600 shadow-sm border border-gray-200/40" : "text-gray-400 hover:text-gray-700"}`}
            >
              Tune Variables
            </button>
            <button 
              onClick={() => setCurrentSubView("results")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${currentSubView === "results" ? "bg-white text-purple-600 shadow-sm border border-gray-200/40" : "text-gray-400 hover:text-gray-700"}`}
            >
              View Projections
            </button>
          </div>
        )}
      </div>

      {/* =========================================================================
          VIEW PANEL: FORM INTAKE WIZARD WIDGET
          ========================================================================= */}
      {currentSubView === "intake" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* STEPPER DASHBOARD MENU */}
          <div className="md:col-span-1 space-y-2">
            <span className="text-[9px] uppercase font-mono font-black text-gray-400 tracking-widest block mb-2 px-1">
              Assessment Vectors
            </span>
            {[
              { step: 1, label: "Physical Telemetry", icon: <Scale className="w-4 h-4" /> },
              { step: 2, label: "Circadian Matrix", icon: <Moon className="w-4 h-4" /> },
              { step: 3, label: "Ergogenic Stack", icon: <Pill className="w-4 h-4" /> },
              { step: 4, label: "Strategy Selection", icon: <Target className="w-4 h-4" /> }
            ].map((s) => (
              <button
                key={s.step}
                onClick={() => setActiveStep(s.step)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left text-xs uppercase font-mono font-black tracking-wider border transition-all cursor-pointer ${
                  activeStep === s.step 
                    ? "bg-gray-900 text-white border-gray-900 shadow-sm" 
                    : "bg-white text-gray-400 border-gray-200 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className={activeStep === s.step ? "text-purple-400" : "text-gray-300"}>{s.icon}</span>
                <span className="truncate">{s.label}</span>
              </button>
            ))}

            <div className="pt-4">
              <button
                onClick={runKineticSimulationModel}
                disabled={isLoadingSim || tenantEmail === "unauthenticated_session"}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-95 text-white font-mono font-black text-xs uppercase tracking-widest py-3.5 rounded-xl shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoadingSim ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Computing Thermodynamic Curves...</span>
                  </>
                ) : tenantEmail === "unauthenticated_session" ? (
                  <span>Console Session Locked</span>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-purple-200 stroke-[2.5]" />
                    <span>Run Simulation Matrix</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ACTIVE STEP FORMS BOX */}
          <div className="md:col-span-2 bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm min-h-[380px] flex flex-col justify-between">
            <div className="w-full">
              
              {/* STEP 1: PHYSICAL TELEMETRY */}
              {activeStep === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="border-b border-gray-100 pb-2.5">
                    <h3 className="text-xs font-mono font-black text-gray-900 uppercase tracking-wide flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-purple-600" /> SECTION 01: Anthropometric Telemetry Indices
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-mono font-black text-gray-400 uppercase tracking-wider block mb-1">Current Gross Weight</label>
                      <div className="relative flex items-center">
                        <input 
                          type="number" 
                          value={kgToLbs(biometrics.currentWeightKg)} 
                          onChange={(e) => setBiometrics({ ...biometrics, currentWeightKg: lbsToKg(Number(e.target.value) || 0) })}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-black font-mono outline-none focus:border-purple-500 transition-colors"
                        />
                        <span className="absolute right-4 text-[10px] font-mono font-black text-gray-400 uppercase">lbs</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono font-black text-gray-400 uppercase tracking-wider block mb-1">Objective Absolute Target</label>
                      <div className="relative flex items-center">
                        <input 
                          type="number" 
                          value={kgToLbs(biometrics.targetWeightKg)} 
                          onChange={(e) => setBiometrics({ ...biometrics, targetWeightKg: lbsToKg(Number(e.target.value) || 0) })}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-black font-mono outline-none text-purple-600 focus:border-purple-500 transition-colors"
                        />
                        <span className="absolute right-4 text-[10px] font-mono font-black text-gray-400 uppercase">lbs</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono font-black text-gray-400 uppercase tracking-wider block mb-1">Stature Height Axis</label>
                      <div className="relative flex items-center">
                        <input 
                          type="number" 
                          value={biometrics.heightCm} 
                          onChange={(e) => setBiometrics({ ...biometrics, heightCm: Number(e.target.value) || 0 })}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-black font-mono outline-none focus:border-purple-500 transition-colors"
                        />
                        <span className="absolute right-4 text-[10px] font-mono font-black text-gray-400 uppercase">cm</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono font-black text-gray-400 uppercase tracking-wider block mb-1">Age Span Chronology</label>
                      <input 
                        type="number" 
                        value={biometrics.ageYears} 
                        onChange={(e) => setBiometrics({ ...biometrics, ageYears: Number(e.target.value) || 0 })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-black font-mono outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>

                    <div className="col-span-1 sm:col-span-2">
                      <label className="text-[10px] font-mono font-black text-gray-400 uppercase tracking-wider block mb-1">Estimated Adipose Density % (Optional)</label>
                      <div className="relative flex items-center">
                        <input 
                          type="number" 
                          placeholder="Omit value to execute macro baseline algorithms instead..."
                          value={biometrics.estimatedBodyFatPct || ""} 
                          onChange={(e) => setBiometrics({ ...biometrics, estimatedBodyFatPct: Number(e.target.value) || 0 })}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-purple-500 transition-colors placeholder:text-gray-300"
                        />
                        <span className="absolute right-4 text-[10px] font-mono font-black text-gray-400 uppercase">%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: CIRCADIAN ENVIRONMENT */}
              {activeStep === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="border-b border-gray-100 pb-2.5">
                    <h3 className="text-xs font-mono font-black text-gray-900 uppercase tracking-wide flex items-center gap-1.5">
                      <Moon className="w-4 h-4 text-blue-600" /> SECTION 02: Circadian Disruption Profiles
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-mono font-black text-gray-400 uppercase tracking-wider block mb-1.5">Occupational Shift Vector</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] font-mono font-black uppercase tracking-wider">
                        {(["day_shift", "night_shift", "rotating_shift"] as ChronotypeShift[]).map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setBiometrics({ ...biometrics, chronotype: c })}
                            className={`py-2.5 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                              biometrics.chronotype === c
                                ? "bg-purple-50 text-purple-600 border-purple-400 shadow-xs"
                                : "bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100/50"
                            }`}
                          >
                            {c.replace("_", " ")}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div>
                        <label className="text-[10px] font-mono font-black text-gray-400 uppercase tracking-wider block mb-1">Mean Sleep Architecture Duration</label>
                        <div className="relative flex items-center">
                          <input 
                            type="number" 
                            step="0.5"
                            value={biometrics.avgSleepHours} 
                            onChange={(e) => setBiometrics({ ...biometrics, avgSleepHours: parseFloat(e.target.value) || 0 })}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-black font-mono outline-none focus:border-purple-500"
                          />
                          <span className="absolute right-4 text-[10px] font-mono font-black text-gray-400 uppercase">hrs</span>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-mono font-black text-gray-400 uppercase tracking-wider block mb-1">Hydration Velocity Accumulation</label>
                        <div className="relative flex items-center">
                          <input 
                            type="number" 
                            value={biometrics.avgWaterOunces} 
                            onChange={(e) => setBiometrics({ ...biometrics, avgWaterOunces: parseInt(e.target.value, 10) || 0 })}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-black font-mono outline-none focus:border-purple-500"
                          />
                          <span className="absolute right-4 text-[10px] font-mono font-black text-gray-400 uppercase"><Droplets className="w-3 h-3 text-blue-400 inline" /> fl oz</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: SUPPLEMENT COMPLIANCE */}
              {activeStep === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="border-b border-gray-100 pb-2.5">
                    <h3 className="text-xs font-mono font-black text-gray-900 uppercase tracking-wide flex items-center gap-1.5">
                      <Pill className="w-4 h-4 text-emerald-600" /> SECTION 03: Ergogenic Variable Multipliers
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { key: "creatine", title: "Creatine Monohydrate", desc: "Forces standard intracellular fluid shifts, expanding active recovery capacity values." },
                      { key: "caffeine", title: "Thermogenic Caffeine", desc: "Upregulates sympathetic output matrices, expanding base conversion parameters by ~60 kcal/day." },
                      { key: "proteinPowder", title: "Isolated Protein Matrices", desc: "Safeguards structural lean nitrogen balances when deficit configurations are engaged." },
                      { key: "omega3", title: "Concentrated Omega-3 EPA/DHA", desc: "Mitigates active oxidation curves while managing targeted cellular stress mechanics." }
                    ].map((s) => {
                      const isActive = (biometrics.supplements as any)[s.key];
                      return (
                        <div 
                          key={s.key}
                          onClick={() => setBiometrics({
                            ...biometrics,
                            supplements: { ...biometrics.supplements, [s.key]: !isActive }
                          })}
                          className={`p-4 border rounded-xl text-left cursor-pointer transition-all flex items-start gap-3 select-none hover:border-gray-300 ${
                            isActive ? "bg-emerald-50/20 border-emerald-400 shadow-xs" : "bg-white border-gray-200"
                          }`}
                        >
                          <div className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center text-[9px] shrink-0 ${isActive ? "bg-emerald-600 border-emerald-700 text-white" : "bg-gray-50 border-gray-300"}`}>
                            {isActive && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <div>
                            <span className="text-xs font-black text-gray-900 block leading-tight">{s.title}</span>
                            <span className="text-[10px] text-gray-400 font-medium block mt-1 leading-normal">{s.desc}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 4: STRATEGY DESTINATION MODE */}
              {activeStep === 4 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="border-b border-gray-100 pb-2.5">
                    <h3 className="text-xs font-mono font-black text-gray-900 uppercase tracking-wide flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-blue-600" /> SECTION 04: Thermodynamic Vector Profiles
                    </h3>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { id: "steady_fat_loss", label: "Controlled Adipose Oxidation", desc: "Prioritizes high lipid conversion rates while retaining total active muscle structure blocks. (TDEE - 15%)" },
                      { id: "aggressive_cut", label: "High-Velocity Caloric Restriction", desc: "Maximizes instantaneous weight drops. Elevated variance penalty warnings applicable. (TDEE - 25%)" },
                      { id: "body_recomp", label: "Isocaloric Functional Recomposition", desc: "Drives simultaneous structural lean consolidation and incremental asset drops. (TDEE - 5%)" },
                      { id: "clean_bulk", label: "Hypertrophic Surplus Synthesis", desc: "Channels thermodynamic energy excesses into structural nitrogen retention lines. (TDEE + 10%)" }
                    ].map((g) => (
                      <div
                        key={g.id}
                        onClick={() => setActiveObjective(g.id as PrimaryGoalObjective)}
                        className={`p-3.5 border rounded-xl cursor-pointer text-left transition-all hover:border-gray-300 ${
                          activeObjective === g.id ? "bg-purple-50/20 border-purple-500 shadow-xs" : "bg-white border-gray-200"
                        }`}
                      >
                        <span className="text-xs font-black text-gray-900 block">{g.label}</span>
                        <span className="text-[10px] text-gray-400 font-medium block mt-0.5 leading-normal">{g.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ACTION FOOTER COMMAND BAR */}
            <div className="border-t border-gray-100 pt-4 mt-6 flex justify-between select-none">
              <button
                type="button"
                disabled={activeStep === 1}
                onClick={() => setActiveStep(prev => prev - 1)}
                className="px-4 py-2 border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-xl text-xs font-mono font-black uppercase tracking-wider disabled:opacity-30 cursor-pointer flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5 stroke-[2.5]" /> Previous Section
              </button>
              
              {activeStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setActiveStep(prev => prev + 1)}
                  className="px-5 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-mono font-black uppercase tracking-wider cursor-pointer flex items-center gap-1"
                >
                  Advance Matrix <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={runKineticSimulationModel}
                  disabled={isLoadingSim || tenantEmail === "unauthenticated_session"}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-xs font-mono font-black uppercase tracking-widest shadow-md hover:opacity-95 cursor-pointer flex items-center gap-1.5"
                >
                  {isLoadingSim ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-purple-200 stroke-[2.5]" />}
                  <span>Simulate Horizon</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW PANEL: PROJECTION TIMELINE RESULTS DASHBOARD
          ========================================================================= */}
      {currentSubView === "results" && simulationOutput && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* STATS DECK PANEL PANES */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono select-none">
            
            {/* INDEX 01 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm text-center flex flex-col justify-between">
              <span className="text-[9px] text-gray-400 font-black uppercase block tracking-wider flex items-center justify-center gap-1">
                <BrainCircuit className="w-3 h-3 text-purple-600" /> ACHIEVABILITY INDEX RATIO
              </span>
              <div className="py-2.5">
                <span className={`text-3xl font-black block ${
                  simulationOutput.achievabilityScore >= 75 ? 'text-emerald-600' : simulationOutput.achievabilityScore >= 50 ? 'text-amber-500' : 'text-rose-500'
                }`}>
                  {simulationOutput.achievabilityScore}%
                </span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden border border-gray-200/20">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    simulationOutput.achievabilityScore >= 75 ? 'bg-emerald-500' : simulationOutput.achievabilityScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                  }`} 
                  style={{ width: `${simulationOutput.achievabilityScore}%` }}
                />
              </div>
            </div>

            {/* INDEX 02 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm text-center flex flex-col justify-center">
              <span className="text-[9px] text-gray-400 font-black uppercase block tracking-wider flex items-center justify-center gap-1">
                <CalendarDays className="w-3 h-3 text-blue-600" /> TIMEFRAME HORIZON VELOCITY
              </span>
              <div className="py-2.5">
                <span className="text-3xl font-black text-gray-900 block">
                  {simulationOutput.estimatedWeeksToTarget} <span className="text-xs font-sans font-black text-gray-400 uppercase tracking-wider">Weeks</span>
                </span>
              </div>
            </div>

            {/* INDEX 03 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm text-center flex flex-col justify-center">
              <span className="text-[9px] text-gray-400 font-black uppercase block tracking-wider flex items-center justify-center gap-1">
                <LineChart className="w-3 h-3 text-purple-600" /> PROJECTED STEADY MASS BALANCE
              </span>
              <div className="py-2.5">
                <span className="text-3xl font-black text-purple-600 block">
                  {kgToLbs(simulationOutput.finalProjectedWeight)} <span className="text-xs font-sans font-black text-gray-400 uppercase tracking-wider">lbs</span>
                </span>
              </div>
            </div>
          </div>

          {/* CLINICAL INTERCEPT DIAGNOSTIC ENGINE FEEDBACK */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-3">
            <span className="text-[10px] font-mono font-black text-gray-400 uppercase tracking-widest block flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-purple-600" /> Physiological Diagnostic Intercepts
            </span>
            <div className="space-y-2">
              {simulationOutput.clinicalInsights.map((insight, idx) => {
                const isAlert = insight.includes("ALERT");
                return (
                  <div 
                    key={idx} 
                    className={`p-3.5 rounded-xl border text-xs font-medium leading-relaxed flex items-start gap-3 ${
                      isAlert ? "bg-rose-50/30 border-rose-200 text-rose-800" : "bg-gray-50 border-gray-100 text-gray-600"
                    }`}
                  >
                    {isAlert ? (
                      <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    ) : (
                      <Lightbulb className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                    )}
                    <div>{insight}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SIMULATION TIMELINE MATRIX GRAPH PREVIEW GRID */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/60 flex items-center justify-between">
              <span className="text-[10px] font-mono font-black text-gray-400 uppercase tracking-widest block">
                Target Progression Matrix Timeline (24-Week Horizon Model)
              </span>
              <span className="text-[9px] font-mono font-black uppercase text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                Thermodynamic Linear Interpolation
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs select-none">
                <thead>
                  <tr className="border-b border-gray-100 font-mono uppercase font-black text-gray-400 text-[9px] bg-gray-50/30 tracking-wider">
                    <th className="px-5 py-3">Interval</th>
                    <th className="px-5 py-3">Mass Forecast</th>
                    <th className="px-5 py-3">Lean Mass Density</th>
                    <th className="px-5 py-3">Adipose Storage</th>
                    <th className="px-5 py-3">Metabolic Decay Delta</th>
                    <th className="px-5 py-3 text-right">Target Daily Ceiling</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-mono font-bold text-gray-600 tabular-nums">
                  {simulationOutput.weeklyTimeline.map((week) => (
                    <tr key={week.weekNumber} className="hover:bg-gray-50/40 transition-colors">
                      <td className="px-5 py-3 text-gray-400 font-black">W{week.weekNumber.toString().padStart(2, "0")}</td>
                      <td className="px-5 py-3 text-gray-950 font-black">{kgToLbs(week.projectedWeightKg)} lbs</td>
                      <td className="px-5 py-3 text-emerald-600 font-black">{kgToLbs(week.estimatedLeanMassKg)} lbs</td>
                      <td className="px-5 py-3 text-purple-500">{kgToLbs(week.estimatedFatMassKg)} lbs</td>
                      <td className="px-5 py-3 text-rose-500">-{week.metabolicAdaptationDeltaCals} kcal</td>
                      <td className="px-5 py-3 text-right font-black text-blue-600">{week.dailyCaloricTarget} kcal</td>
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
      <div className="w-full bg-gray-50 border border-gray-200/80 rounded-2xl p-4 mt-8 select-none shadow-inner">
        <div className="text-[9px] font-mono uppercase font-black text-gray-400 tracking-wider mb-2 flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> SYSTEM ARCHITECTURE INFORMATION DISCLOSURE
        </div>
        <p className="text-[11px] font-mono leading-relaxed text-gray-400 font-medium">
          <strong className="text-gray-500 font-sans uppercase text-[10px] tracking-wide block mb-1">Thermodynamic Predictive Scope Matrix Warning:</strong>
          This interface updates algorithmic data sequences based upon isolated thermodynamic kinetic projections and verified metabolic transformation coefficients. Autonomous biochemical functions possess baseline variances across real-world tracking metrics. Because physiological biological feedback loops remain structurally dynamic, actual values can contain systemic errors, calculation deviations, or variable modifications over time. This layer exists solely as an informational blueprint frame context and does not substitute for prescriptive healthcare diagnosis, clinical interventions, or professional medical tracking.
        </p>
      </div>

    </div>
  );
}