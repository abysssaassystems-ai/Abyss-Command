"use client";

import React, { useState, useEffect, useRef } from "react";

export type ExerciseCategory = "strength" | "hypertrophy" | "cardio" | "mobility";
export type MuscleGroup = "chest" | "back" | "legs" | "shoulders" | "arms" | "core" | "full_body" | "cardio_vbuck";

export interface ExerciseDefinition {
  id: string;
  name: string;
  category: ExerciseCategory;
  primaryMuscle: MuscleGroup;
  metValue: number;
  description: string;
  isCustom?: boolean;
}

export interface SetLog {
  id: string;
  reps: number;
  weightLbs: number;
  isCompleted: boolean;
  cardioMinutes?: number;
  cardioSpeedMph?: number;
}

export interface ExerciseLogNode {
  id: string;
  exerciseId: string;
  exerciseName: string;
  category: ExerciseCategory;
  primaryMuscle: MuscleGroup;
  metValue: number;
  sets: SetLog[];
}

export interface WorkoutRoutineTemplate {
  id: string;
  title: string;
  description: string;
  notes?: string;
  nodes: ExerciseLogNode[];
  isCustom?: boolean;
}

export interface HistoricalWorkoutLog {
  id: string;
  title: string;
  timestamp: string;
  durationMinutes: number;
  totalTonnageVolume: number;
  caloriesBurned: number;
  nodes: ExerciseLogNode[];
}

const MASTER_BUILTIN_EXERCISES: ExerciseDefinition[] = [
  // --- CHEST FAMILY ---
  { id: "exe_ch_bench_barbell", name: "Barbell Bench Press", category: "strength", primaryMuscle: "chest", metValue: 6.0, description: "Flat bench barbell chest press targeting pectoral clusters." },
  { id: "exe_ch_bench_dumbbell", name: "Dumbbell Bench Press", category: "hypertrophy", primaryMuscle: "chest", metValue: 5.5, description: "Flat bench dumbbell press optimizing unilateral stabilizers." },
  { id: "exe_ch_incline_barbell", name: "Incline Barbell Press", category: "strength", primaryMuscle: "chest", metValue: 6.0, description: "Incline press emphasizing clavicular head pectoral fibers." },
  { id: "exe_ch_incline_dumbbell", name: "Incline Dumbbell Press", category: "hypertrophy", primaryMuscle: "chest", metValue: 5.5, description: "Angle dumbbell press maximizing upper-chest range of motion." },
  { id: "exe_ch_decline_barbell", name: "Decline Barbell Press", category: "strength", primaryMuscle: "chest", metValue: 5.8, description: "Decline press focusing execution force on lower pec margins." },
  { id: "exe_ch_db_fly", name: "Dumbbell Chest Fly", category: "hypertrophy", primaryMuscle: "chest", metValue: 4.5, description: "Flat bench isolation movement tracking mechanical chest stretch." },
  { id: "exe_ch_cable_crossover", name: "Cable Crossover Fly", category: "hypertrophy", primaryMuscle: "chest", metValue: 4.2, description: "Continuous tension inner pectoral contraction mapping horizontal adduction." },
  { id: "exe_ch_pushup_bodyweight", name: "Push-Up (Classic)", category: "strength", primaryMuscle: "chest", metValue: 4.0, description: "Bodyweight structural push movement tracking core and chest integrity." },
  { id: "exe_ch_chest_dip", name: "Chest-Focused Dip", category: "strength", primaryMuscle: "chest", metValue: 5.0, description: "Forward leaned torso dipping loop activating lower pectoral sweeps." },
  { id: "exe_ch_pec_deck", name: "Pec Deck Machine", category: "hypertrophy", primaryMuscle: "chest", metValue: 4.0, description: "Seated machine rotational chest fly keeping stabilizers isolated." },

  // --- BACK FAMILY ---
  { id: "exe_bk_deadlift_barbell", name: "Barbell Conventional Deadlift", category: "strength", primaryMuscle: "back", metValue: 8.0, description: "Compound spinal extension pull indexing complete posterior chain load." },
  { id: "exe_bk_pullup_strict", name: "Strict Bodyweight Pull-Up", category: "strength", primaryMuscle: "back", metValue: 5.0, description: "Vertical pull tracking Latissimus dorsi contraction profile lines." },
  { id: "exe_bk_chinup", name: "Underhand Grip Chin-Up", category: "strength", primaryMuscle: "back", metValue: 5.0, description: "Supinated grip vertical pull engaging lat frames and biceps brachii." },
  { id: "exe_bk_row_barbell", name: "Barbell Bent-Over Row", category: "strength", primaryMuscle: "back", metValue: 6.0, description: "Hinged rows driving elbow pathing past rear lat boundaries." },
  { id: "exe_bk_row_dumbbell", name: "Single-Arm Dumbbell Row", category: "hypertrophy", primaryMuscle: "back", metValue: 5.0, description: "Unilateral floor support dumbbell pull maximizing deep lat stretch loops." },
  { id: "exe_bk_lat_pulldown", name: "Cable Lat Pulldown", category: "hypertrophy", primaryMuscle: "back", metValue: 4.5, description: "Seated mechanical vertical cable pull down with open hand bar grids." },
  { id: "exe_bk_seated_cable_row", name: "Seated Cable Row (V-Bar)", category: "hypertrophy", primaryMuscle: "back", metValue: 4.5, description: "Horizontal cable pull targeting mid-trapezius and rhomboid maps." },
  { id: "exe_bk_tbar_row", name: "T-Bar Landmine Row", category: "strength", primaryMuscle: "back", metValue: 5.8, description: "Semi-upright machine bar pull handling extreme core/back shear loads." },
  { id: "exe_bk_hyperextension", name: "Spinal Hyperextension (45 deg)", category: "mobility", primaryMuscle: "back", metValue: 3.5, description: "Isolated lumbar extension tracking Erector spinae isometric control." },
  { id: "exe_bk_shrug_dumbbell", name: "Dumbbell Trap Shrug", category: "hypertrophy", primaryMuscle: "back", metValue: 4.0, description: "Vertical scapular elevation isolated to upper Trapezius muscle heads." },

  // --- LEGS FAMILY ---
  { id: "exe_lg_squat_barbell", name: "Barbell Back Squat", category: "strength", primaryMuscle: "legs", metValue: 7.5, description: "Axial loaded vertical knee extension tracking absolute quadricep capacity." },
  { id: "exe_lg_front_squat", name: "Barbell Front Squat", category: "strength", primaryMuscle: "legs", metValue: 7.2, description: "Anteriorly loaded mechanical squat shifting emphasis to quad tracking lines." },
  { id: "exe_lg_leg_press", name: "45-Degree Sled Leg Press", category: "hypertrophy", primaryMuscle: "legs", metValue: 5.0, description: "Sled matrix leg press minimizing lower back shear forces." },
  { id: "exe_lg_romanian_deadlift", name: "Barbell Romanian Deadlift (RDL)", category: "hypertrophy", primaryMuscle: "legs", metValue: 6.0, description: "Hinged hip extension emphasizing eccentric hamstring stretching limits." },
  { id: "exe_lg_bulgarian_split_squat", name: "Bulgarian Split Squat", category: "hypertrophy", primaryMuscle: "legs", metValue: 6.5, description: "Elevated single leg squat identifying lateral structural imbalances." },
  { id: "exe_lg_lunge_dumbbell", name: "Walking Dumbbell Lunges", category: "hypertrophy", primaryMuscle: "legs", metValue: 6.0, description: "Dynamic locomotive knee extension working step mechanics." },
  { id: "exe_lg_leg_extension", name: "Machine Leg Extension", category: "hypertrophy", primaryMuscle: "legs", metValue: 4.0, description: "Seated anatomical isolation pathing checking Quadriceps rectus femoris." },
  { id: "exe_lg_lying_leg_curl", name: "Machine Lying Leg Curl", category: "hypertrophy", primaryMuscle: "legs", metValue: 4.0, description: "Prone isolation checking active hamstring shortening parameters." },
  { id: "exe_lg_calf_raise_standing", name: "Standing Calf Raise Machine", category: "hypertrophy", primaryMuscle: "legs", metValue: 3.5, description: "Ankle plantar flexion tracking Gastrocnemius structural bounds." }, // FIXED: Spelled hypertrophy correctly here
  { id: "exe_lg_hip_thrust", name: "Barbell Glute Hip Thrust", category: "strength", primaryMuscle: "legs", metValue: 5.5, description: "Bench supported hip extension maximizing gluteus peak contraction load." },

  // --- SHOULDERS FAMILY ---
  { id: "exe_sh_overhead_press_bb", name: "Barbell Overhead Press (OHP)", category: "strength", primaryMuscle: "shoulders", metValue: 6.5, description: "Standing vertical press validating complete overhead skeletal tracking structure." },
  { id: "exe_sh_press_dumbbell", name: "Seated Dumbbell Shoulder Press", category: "hypertrophy", primaryMuscle: "shoulders", metValue: 5.8, description: "Vertical press isolating anterior and lateral deltoid heads cleanly." },
  { id: "exe_sh_lateral_raise_db", name: "Dumbbell Lateral Raise", category: "hypertrophy", primaryMuscle: "shoulders", metValue: 4.0, description: "Lateral shoulder abduction tracking medial deltoid width profiles." },
  { id: "exe_sh_lateral_raise_cable", name: "Unilateral Cable Lateral Raise", category: "hypertrophy", primaryMuscle: "shoulders", metValue: 4.0, description: "Continuous mechanical profile line tension across medial deltoid axis." },
  { id: "exe_sh_rear_delt_fly", name: "Rear Delt Facepull (Cable)", category: "hypertrophy", primaryMuscle: "shoulders", metValue: 4.0, description: "Horizontal external rotation rope pull hitting posterior deltoid margins." },
  { id: "exe_sh_arnold_press", name: "Arnold Dumbbell Press", category: "hypertrophy", primaryMuscle: "shoulders", metValue: 5.8, description: "Rotational overhead dumbbell tracking starting from chest plane inputs." },
  { id: "exe_sh_front_raise", name: "Dumbbell Front Raise", category: "hypertrophy", primaryMuscle: "shoulders", metValue: 4.0, description: "Anterior shoulder flexion movement targeting front deltoid nodes." },

  // --- ARMS FAMILY ---
  { id: "exe_ar_bicep_curl_bb", name: "Barbell Bicep Curl", category: "hypertrophy", primaryMuscle: "arms", metValue: 4.0, description: "Supinated elbow flexion targeting short/long heads of biceps brachii." },
  { id: "exe_ar_incline_db_curl", name: "Incline Dumbbell Curl", category: "hypertrophy", primaryMuscle: "arms", metValue: 4.0, description: "Seated angle stretch maximizing biceps long head physical trace index." },
  { id: "exe_ar_hammer_curl", name: "Dumbbell Neutral Hammer Curl", category: "hypertrophy", primaryMuscle: "arms", metValue: 4.0, description: "Neutral grip forearm flexion activating Brachioradialis mechanics." },
  { id: "exe_ar_tricep_pushdown", name: "Cable Tricep Rope Pushdown", category: "hypertrophy", primaryMuscle: "arms", metValue: 4.0, description: "Elbow extension checking lateral and medial triceps brachii heads." },
  { id: "exe_ar_skull_crusher", name: "EZ-Bar Overhead Skull Crusher", category: "hypertrophy", primaryMuscle: "arms", metValue: 4.2, description: "Lying elbow extension mapping triceps long head depth thresholds." },
  { id: "exe_ar_overhead_db_ext", name: "Overhead Dumbbell Tricep Extension", category: "hypertrophy", primaryMuscle: "arms", metValue: 4.0, description: "Vertical overhead arm extension focusing force into structural elements." },

  // --- CORE FAMILY ---
  { id: "exe_cr_crunch_ab", name: "Anatomical Abdominal Crunch", category: "hypertrophy", primaryMuscle: "core", metValue: 3.0, description: "Spinal flexion compressing rectus abdominis wall tracks." },
  { id: "exe_cr_hanging_leg_raise", name: "Hanging Strict Leg Raise", category: "strength", primaryMuscle: "core", metValue: 4.0, description: "Vertical hanging bar core support driving dynamic posterior pelvic tilts." },
  { id: "exe_cr_plank_isometric", name: "Forearm Isometric Plank", category: "mobility", primaryMuscle: "core", metValue: 3.3, description: "Static anti-extension stabilization verifying complete abdominal brace matrix." },
  { id: "exe_cr_russian_twist", name: "Weighted Russian Twist", category: "hypertrophy", primaryMuscle: "core", metValue: 4.0, description: "Seated target rotational pathing triggering internal and external obliques." },

  // --- CARDIO FAMILY ---
  { id: "exe_cd_treadmill_run", name: "Treadmill Outdoor/Indoor Run", category: "cardio", primaryMuscle: "cardio_vbuck", metValue: 9.8, description: "Locomotive cardiovascular impact logging steady state kinetic burn." },
  { id: "exe_cd_stationary_bike", name: "Stationary Lifecycle Bike", category: "cardio", primaryMuscle: "cardio_vbuck", metValue: 6.8, description: "Cyclical structural aerobic index checking output endurance logs." },
  { id: "exe_cd_elliptical_trainer", name: "Low-Impact Elliptical Trainer", category: "cardio", primaryMuscle: "cardio_vbuck", metValue: 5.5, description: "Unloaded closed-chain kinetic aerobic stepping sequence tracker." },
  { id: "exe_cd_rowing_machine", name: "Concept2 Fluid Indoor Rower", category: "cardio", primaryMuscle: "cardio_vbuck", metValue: 8.5, description: "Full body pulling endurance mapping cardiovascular and muscular thresholds." },
  { id: "exe_cd_stairmaster", name: "Stair Climber Stepping Matrix", category: "cardio", primaryMuscle: "cardio_vbuck", metValue: 9.0, description: "Continuous vertical stepping load logging massive lower body metabolic burn." }
];

const PREBUILT_SYSTEM_ROUTINES: WorkoutRoutineTemplate[] = [
  {
    id: "rtn_push_hypertrophy",
    title: "Push Day Template",
    description: "Built-in professional split maximizing horizontal and vertical pushing force grids.",
    nodes: [
      {
        id: "node_p1", exerciseId: "exe_ch_bench_barbell", exerciseName: "Barbell Bench Press", category: "strength", primaryMuscle: "chest", metValue: 6.0,
        sets: [
          { id: "p1s1", reps: 10, weightLbs: 135, isCompleted: false },
          { id: "p1s2", reps: 8, weightLbs: 185, isCompleted: false },
          { id: "p1s3", reps: 6, weightLbs: 225, isCompleted: false }
        ]
      },
      {
        id: "node_p2", exerciseId: "exe_sh_press_dumbbell", exerciseName: "Seated Dumbbell Shoulder Press", category: "hypertrophy", primaryMuscle: "shoulders", metValue: 5.8,
        sets: [
          { id: "p2s1", reps: 12, weightLbs: 50, isCompleted: false },
          { id: "p2s2", reps: 10, weightLbs: 60, isCompleted: false }
        ]
      }
    ]
  }
];

type SubTabID = "templates" | "browse" | "active" | "history";

export default function WorkoutsTab() {
  const [currentSubTab, setCurrentSubTab] = useState<SubTabID>("templates");

  // Linked Budget Metrics Matrix
  const [earnedExerciseCalories, setEarnedExerciseCalories] = useState<number>(340);
  const baseBudgetCals = 1693;
  const currentFoodLoggedCals = 614;
  const netCaloriesRemaining = baseBudgetCals + earnedExerciseCalories - currentFoodLoggedCals;

  // Active Dropdown Tracker Context Nodes
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);
  const [inlineReps, setInlineReps] = useState<string>("10");
  const [inlineWeight, setInlineWeight] = useState<string>("135");
  const [inlineMinutes, setInlineMinutes] = useState<string>("20");
  const [inlineSpeed, setInlineSpeed] = useState<string>("6.0"); 
  
  // Dynamic User Base Weight Input State
  const [userWeightLbs, setUserWeightLbs] = useState<string>("181"); 

  const [exerciseLibrary, setExerciseLibrary] = useState<ExerciseDefinition[]>(MASTER_BUILTIN_EXERCISES);
  const [routineTemplates, setRoutineTemplates] = useState<WorkoutRoutineTemplate[]>(PREBUILT_SYSTEM_ROUTINES);
  const [historicalLogs, setHistoricalLogs] = useState<HistoricalWorkoutLog[]>([
    {
      id: "hist_1",
      title: "Sample Structural Push Session",
      timestamp: "Yesterday at 08:30 AM",
      durationMinutes: 45,
      totalTonnageVolume: 4320,
      caloriesBurned: 340,
      nodes: [
        {
          id: "hn1", exerciseId: "exe_ch_bench_barbell", exerciseName: "Barbell Bench Press", category: "strength", primaryMuscle: "chest", metValue: 6.0,
          sets: [
            { id: "hn1s1", reps: 10, weightLbs: 135, isCompleted: true },
            { id: "hn1s2", reps: 10, weightLbs: 135, isCompleted: true }
          ]
        }
      ]
    }
  ]);

  const [activeWorkout, setActiveWorkout] = useState<WorkoutRoutineTemplate | null>(null);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const timerReference = useRef<NodeJS.Timeout | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterMuscle, setFilterMuscle] = useState<MuscleGroup | "all">("all");
  
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [newExeName, setNewExeName] = useState("");
  const [newExeCategory, setNewExeCategory] = useState<ExerciseCategory>("strength");
  const [newExeMuscle, setNewExeMuscle] = useState<MuscleGroup>("chest");
  const [newExeMET, setNewExeMET] = useState("5.0");
  const [newExeDesc, setNewExeDesc] = useState("");

  useEffect(() => {
    if (activeWorkout) {
      timerReference.current = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerReference.current) clearInterval(timerReference.current);
      setSecondsElapsed(0);
    }
    return () => {
      if (timerReference.current) clearInterval(timerReference.current);
    };
  }, [activeWorkout]);

  const getFormattedElapsedTime = () => {
    const min = Math.floor(secondsElapsed / 60);
    const sec = secondsElapsed % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  // Thermodynamic Live Energy Variance Calculators
  const calculateLiveInlineBurn = (metValue: number, category: ExerciseCategory) => {
    const verifiedWeightLbs = Number(userWeightLbs) || 150;
    const weightKg = verifiedWeightLbs / 2.20462;

    if (category === "cardio") {
      const mins = Number(inlineMinutes) || 0;
      const speedMph = Number(inlineSpeed) || 0;
      
      let adjustedMet = metValue;
      if (speedMph > 0) {
        adjustedMet = metValue * (speedMph / 6.0); 
      }
      return Math.round(adjustedMet * 0.0175 * weightKg * mins);
    } else {
      const reps = Number(inlineReps) || 0;
      const weight = Number(inlineWeight) || 0;
      const volumeFactor = (reps * weight) / 3000;
      return Math.round(metValue * 15 * (verifiedWeightLbs / 150) * (volumeFactor || 1));
    }
  };

  const handleCommitQuickLoggedExercise = (ex: ExerciseDefinition) => {
    const finalBurn = calculateLiveInlineBurn(ex.metValue, ex.category);
    
    const quickLogNode: ExerciseLogNode = {
      id: `node_quick_${Date.now()}`,
      exerciseId: ex.id,
      exerciseName: ex.name,
      category: ex.category,
      primaryMuscle: ex.primaryMuscle,
      metValue: ex.metValue,
      sets: [
        {
          id: `set_quick_${Date.now()}`,
          reps: ex.category === "cardio" ? 0 : (Number(inlineReps) || 10),
          weightLbs: ex.category === "cardio" ? 0 : (Number(inlineWeight) || 0),
          isCompleted: true,
          cardioMinutes: ex.category === "cardio" ? Number(inlineMinutes) : undefined,
          cardioSpeedMph: ex.category === "cardio" ? Number(inlineSpeed) : undefined
        }
      ]
    };

    const newLog: HistoricalWorkoutLog = {
      id: `hist_quick_${Date.now()}`,
      title: `Quick Log: ${ex.name}`,
      timestamp: "Just now",
      durationMinutes: ex.category === "cardio" ? (Number(inlineMinutes) || 20) : 15,
      totalTonnageVolume: ex.category === "cardio" ? 0 : (Number(inlineReps) || 0) * (Number(inlineWeight) || 0),
      caloriesBurned: finalBurn,
      nodes: [quickLogNode]
    };

    setHistoricalLogs([newLog, ...historicalLogs]);
    setEarnedExerciseCalories(prev => prev + finalBurn); 
    setExpandedExerciseId(null); 
  };

  const handleInsertCustomExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExeName.trim()) return;

    const newExercise: ExerciseDefinition = {
      id: `exe_cust_${Date.now()}`,
      name: newExeName.trim(),
      category: newExeCategory,
      primaryMuscle: newExeMuscle,
      metValue: parseFloat(newExeMET) || 4.0,
      description: newExeDesc.trim() || "User defined custom exercise.",
      isCustom: true,
    };

    setExerciseLibrary([newExercise, ...exerciseLibrary]);
    setNewExeName("");
    setNewExeDesc("");
    setShowCustomModal(false);
  };

  const handleLaunchLiveSession = (template: WorkoutRoutineTemplate) => {
    const sessionClone: WorkoutRoutineTemplate = {
      ...template,
      id: `session_run_${Date.now()}`,
      nodes: template.nodes.map((node) => ({
        ...node,
        id: `node_run_${Math.random().toString(36).substr(2, 9)}`,
        sets: node.sets.map((set) => ({ ...set, isCompleted: false })),
      })),
    };
    setActiveWorkout(sessionClone);
    setCurrentSubTab("active");
  };

  const handleLaunchEmptyLiveSession = () => {
    setActiveWorkout({
      id: `session_run_${Date.now()}`,
      title: "Custom Fitness Session",
      description: "Custom targeted physical activity log.",
      nodes: [],
    });
    setCurrentSubTab("active");
  };

  const handleInjectExerciseToActiveSession = (exercise: ExerciseDefinition) => {
    if (!activeWorkout) return;
    const newNode: ExerciseLogNode = {
      id: `node_run_${Date.now()}`,
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      category: exercise.category,
      primaryMuscle: exercise.primaryMuscle,
      metValue: exercise.metValue,
      sets: [{ id: `set_run_${Date.now()}_0`, reps: 10, weightLbs: 0, isCompleted: false }],
    };
    setActiveWorkout({ ...activeWorkout, nodes: [...activeWorkout.nodes, newNode] });
  };

  const handleAddSetToActiveNode = (nodeId: string) => {
    if (!activeWorkout) return;
    setActiveWorkout({
      ...activeWorkout,
      nodes: activeWorkout.nodes.map((node) => {
        if (node.id !== nodeId) return node;
        const lastSet = node.sets[node.sets.length - 1];
        return {
          ...node,
          sets: [...node.sets, { id: `set_run_${Date.now()}_${node.sets.length}`, reps: lastSet ? lastSet.reps : 10, weightLbs: lastSet ? lastSet.weightLbs : 0, isCompleted: false }],
        };
      }),
    });
  };

  const handleUpdateActiveSetParameters = (nodeId: string, setId: string, fields: Partial<SetLog>) => {
    if (!activeWorkout) return;
    setActiveWorkout({
      ...activeWorkout,
      nodes: activeWorkout.nodes.map((node) => {
        if (node.id !== nodeId) return node;
        return { ...node, sets: node.sets.map((set) => (set.id === setId ? { ...set, ...fields } : set)) };
      }),
    });
  };

  const handlePurgeNodeFromActiveSession = (nodeId: string) => {
    if (!activeWorkout) return;
    setActiveWorkout({ ...activeWorkout, nodes: activeWorkout.nodes.filter((n) => n.id !== nodeId) });
  };

  const handleCommitWorkoutToHistory = () => {
    if (!activeWorkout) return;

    let absoluteTonnage = 0;
    activeWorkout.nodes.forEach((node) => {
      node.sets.forEach((set) => {
        if (set.isCompleted) absoluteTonnage += set.reps * set.weightLbs;
      });
    });

    const computedDurationMinutes = Math.max(1, Math.floor(secondsElapsed / 60));
    const calculatedBurn = computedDurationMinutes * 8; 

    const finalLogEntry: HistoricalWorkoutLog = {
      id: `hist_commit_${Date.now()}`,
      title: activeWorkout.title || "Custom Workout Session",
      timestamp: "Just now",
      durationMinutes: computedDurationMinutes,
      totalTonnageVolume: absoluteTonnage,
      caloriesBurned: calculatedBurn,
      nodes: activeWorkout.nodes.filter((node) => node.sets.some((s) => s.isCompleted)),
    };

    setHistoricalLogs([finalLogEntry, ...historicalLogs]);
    setEarnedExerciseCalories(prev => prev + calculatedBurn);
    setActiveWorkout(null);
    setCurrentSubTab("history");
  };

  const filteredExerciseRegistry = exerciseLibrary.filter((ex) => {
    const textMatch = ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      ex.description.toLowerCase().includes(searchQuery.toLowerCase());
    const muscleMatch = filterMuscle === "all" || ex.primaryMuscle === filterMuscle;
    return textMatch && muscleMatch;
  });

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12 text-slate-700 px-3 sm:px-0">
      
      {/* 1. LOSE IT APP STYLE INTERCONNECTED ENERGY ALLOWANCE CARD WITH LIVE WEIGHT ENTRY */}
      <div className="bg-white border border-slate-100 shadow-md rounded-[2rem] p-6 sm:p-8 text-center relative overflow-hidden transform-gpu">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-sky-400" />
        
        {/* Dynamic State Weight Tracker Module Input Layer */}
        <div className="absolute top-4 right-6 flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-xl border border-slate-100 shadow-inner">
          <span className="text-[9px] uppercase font-black text-slate-400">Scale Weight:</span>
          <input 
            type="number" 
            value={userWeightLbs}
            onChange={e => setUserWeightLbs(e.target.value)}
            className="w-10 bg-transparent text-xs font-black text-blue-500 text-center p-0 border-none focus:ring-0 outline-none"
          />
          <span className="text-[9px] font-bold text-slate-400">lbs</span>
        </div>

        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-2 sm:mt-0 mb-2 select-none">Caloric Net Allowance</p>
        
        <div className="flex justify-between items-center max-w-md mx-auto my-4 gap-2 px-2 text-sm font-bold">
          <div className="flex-1 text-center">
            <span className="text-xl sm:text-2xl font-black text-slate-800 block tabular-nums">{baseBudgetCals}</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wide select-none">Base Budget</span>
          </div>
          <div className="text-lg text-slate-300 select-none">＋</div>
          <div className="flex-1 text-center">
            <span className="text-xl sm:text-2xl font-black text-emerald-500 block tabular-nums">+{earnedExerciseCalories}</span>
            <span className="text-[10px] text-emerald-500 uppercase tracking-wide select-none">Exercise Burn</span>
          </div>
          <div className="text-lg text-slate-300 select-none">－</div>
          <div className="flex-1 text-center">
            <span className="text-xl sm:text-2xl font-black text-blue-500 block tabular-nums">{currentFoodLoggedCals}</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wide select-none">Food Logged</span>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4 mt-4 max-w-xs mx-auto">
          <span className="text-4xl font-black text-slate-900 tracking-tight block tabular-nums">
            {netCaloriesRemaining}
          </span>
          <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 block mt-1 select-none">
            Net Calories I Can Afford Today
          </span>
        </div>
      </div>

      {/* 2. FRIENDLY COMPACT SEGMENT PILL NAV BAR */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl text-xs font-bold uppercase tracking-wider overflow-x-auto gap-1 select-none">
        {(["templates", "browse", "active", "history"] as SubTabID[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setCurrentSubTab(tab)}
            className={`flex-1 min-w-[90px] text-center py-2 px-3 rounded-xl transition-all h-9 flex items-center justify-center whitespace-nowrap touch-manipulation ${
              currentSubTab === tab 
                ? "bg-white text-blue-600 shadow-sm font-extrabold" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab === "templates" && `📋 Routines`}
            {tab === "browse" && `🔍 Exercises`}
            {tab === "active" && `⚡ Live Tracker`}
            {tab === "history" && `⏳ History`}
          </button>
        ))}
      </div>

      {/* =========================================================================
          SUB-TAB VIEW: ROUTINE ROUTINGS
          ========================================================================= */}
      {currentSubTab === "templates" && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex justify-between items-center gap-4 select-none px-1">
            <div>
              <h2 className="text-base font-extrabold text-slate-800 tracking-tight">Routine Templates</h2>
              <p className="text-xs text-slate-400">Launch standard splits or create a clean custom card.</p>
            </div>
            <button
              type="button"
              onClick={() => handleLaunchEmptyLiveSession()}
              className="bg-blue-50 border border-blue-100 text-blue-600 font-bold text-xs px-4 h-9 rounded-full hover:bg-blue-100/60 transition-all shadow-sm shrink-0"
            >
              ＋ Custom Workout
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {routineTemplates.map((rtn) => (
              <div key={rtn.id} className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-all group">
                <div className="space-y-2">
                  <h3 className="text-sm font-extrabold text-slate-800 group-hover:text-blue-500 transition-colors">{rtn.title}</h3>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">{rtn.description}</p>
                  <div className="pt-1 flex flex-wrap gap-1">
                    {rtn.nodes.map((n, i) => (
                      <span key={i} className="bg-slate-50 text-slate-500 text-[10px] px-2 py-0.5 rounded-lg border border-slate-100 font-semibold">{n.exerciseName}</span>
                    ))}
                  </div>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-50 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleLaunchLiveSession(rtn)}
                    className="bg-blue-500 text-white text-xs font-bold px-4 h-9 rounded-full hover:bg-blue-600 transition-all shadow-md shadow-blue-500/10"
                  >
                    Start Workout →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB VIEW: CLICKABLE INTERCONNECTED EXERCISE LIBRARY MATRIX
          ========================================================================= */}
      {currentSubTab === "browse" && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex justify-between items-center gap-4 select-none px-1">
            <div>
              <h2 className="text-base font-extrabold text-slate-800 tracking-tight">Exercise Library</h2>
              <p className="text-xs text-slate-400">Click any component card to trigger the quick calculation logging drawer.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowCustomModal(true)}
              className="bg-emerald-50 text-emerald-600 border border-emerald-100 font-bold text-xs px-4 h-9 rounded-full hover:bg-emerald-100/60 transition-all shrink-0"
            >
              ＋ Add Custom
            </button>
          </div>

          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-3 flex flex-col sm:flex-row gap-3">
            <input 
              type="text" 
              placeholder="Search food-balancing exercises..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 h-11 text-base font-semibold text-slate-800 placeholder-slate-400 w-full outline-none focus:border-blue-400 transition-all"
            />
            <select
              value={filterMuscle}
              onChange={(e) => setFilterMuscle(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 h-11 text-xs text-slate-600 font-bold outline-none cursor-pointer pr-8 shrink-0 focus:border-blue-400"
            >
              <option value="all">All Systems</option>
              <option value="chest">Chest</option>
              <option value="back">Back</option>
              <option value="legs">Legs</option>
              <option value="shoulders">Shoulders</option>
              <option value="arms">Arms</option>
              <option value="core">Core</option>
              <option value="cardio_vbuck">Cardio / Conditioning</option>
            </select>
          </div>

          {/* MASTER FILTER RESULTS CONTAINER LIST */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredExerciseRegistry.map((ex) => {
              const isExpanded = expandedExerciseId === ex.id;
              const liveBurnPreview = calculateLiveInlineBurn(ex.metValue, ex.category);

              return (
                <div 
                  key={ex.id} 
                  className={`bg-white border rounded-2xl shadow-sm transition-all overflow-hidden ${
                    isExpanded ? 'border-blue-300 ring-4 ring-blue-500/5 shadow-md' : 'border-slate-100 hover:border-slate-200'
                  }`}
                >
                  {/* Clickable Header Trigger Container */}
                  <div 
                    onClick={() => {
                      setExpandedExerciseId(isExpanded ? null : ex.id);
                      setInlineReps("10");
                      setInlineWeight("135");
                      setInlineMinutes("20");
                      setInlineSpeed("6.0"); 
                    }}
                    className="p-4 flex justify-between items-center cursor-pointer select-none touch-manipulation"
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-black text-slate-800 tracking-tight">{ex.name}</h4>
                        {ex.isCustom && <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[8px] uppercase font-mono px-1 rounded font-bold">Custom</span>}
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium line-clamp-1 mt-0.5">{ex.description}</p>
                    </div>
                    <div className="shrink-0 flex items-center gap-3">
                      <span className="bg-blue-50 text-blue-600 text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">{ex.primaryMuscle.replace('_', ' ')}</span>
                      <span className="text-slate-300 text-xs transition-transform duration-200" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                    </div>
                  </div>

                  {/* INTERCONNECTED LIVE CALORIE DROPDOWN FORM MODULE */}
                  {isExpanded && (
                    <div className="bg-slate-50/60 p-4 border-t border-slate-50 space-y-4 animate-fadeIn">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                        {ex.category === "cardio" ? (
                          <>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Duration Parameters</label>
                              <div className="relative flex items-center">
                                <input 
                                  type="number" 
                                  value={inlineMinutes} 
                                  onChange={e => setInlineMinutes(e.target.value)}
                                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-base sm:text-sm font-bold text-slate-800 outline-none focus:border-blue-400"
                                />
                                <span className="absolute right-3 text-xs font-semibold text-slate-400">mins</span>
                              </div>
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Velocity Tracker</label>
                              <div className="relative flex items-center">
                                <input 
                                  type="number" 
                                  step="0.1"
                                  value={inlineSpeed} 
                                  onChange={e => setInlineSpeed(e.target.value)}
                                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-base sm:text-sm font-bold text-slate-800 outline-none focus:border-blue-400"
                                />
                                <span className="absolute right-3 text-xs font-semibold text-slate-400">mph</span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Volume Load</label>
                              <div className="relative flex items-center">
                                <input 
                                  type="number" 
                                  value={inlineReps} 
                                  onChange={e => setInlineReps(e.target.value)}
                                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-base sm:text-sm font-bold text-slate-800 outline-none focus:border-blue-400"
                                />
                                <span className="absolute right-3 text-xs font-semibold text-slate-400">reps</span>
                              </div>
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Mass Threshold</label>
                              <div className="relative flex items-center">
                                <input 
                                  type="number" 
                                  step="5"
                                  value={inlineWeight} 
                                  onChange={e => setInlineWeight(e.target.value)}
                                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-base sm:text-sm font-bold text-slate-800 outline-none focus:border-blue-400"
                                />
                                <span className="absolute right-3 text-xs font-semibold text-slate-400">lbs</span>
                              </div>
                            </div>
                          </>
                        )}

                        <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 flex items-center justify-between shadow-sm h-[46px] sm:h-11">
                          <span className="text-[10px] uppercase font-bold text-slate-400 pl-1">Est. Burn</span>
                          <span className="text-base font-black text-emerald-500 font-mono tracking-tight pr-1 tabular-nums">+{liveBurnPreview} <span className="text-[10px] font-sans font-normal text-slate-400">cal</span></span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-1 border-t border-slate-100">
                        <p className="text-[11px] text-slate-400 leading-normal font-medium">
                          💡 Adding this will increment your remaining balance, allowing you to afford <strong className="text-blue-500 font-extrabold">{netCaloriesRemaining + liveBurnPreview} kcal</strong> for the rest of today.
                        </p>
                        <div className="flex gap-2 w-full sm:w-auto shrink-0">
                          {activeWorkout && (
                            <button 
                              type="button"
                              onClick={() => handleInjectExerciseToActiveSession(ex)}
                              className="flex-1 sm:flex-none bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 h-9 rounded-xl transition-colors whitespace-nowrap"
                            >
                              Inject Node
                            </button>
                          )}
                          <button 
                            type="button"
                            onClick={() => handleCommitQuickLoggedExercise(ex)}
                            className="flex-1 sm:flex-none bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs px-4 h-9 rounded-xl shadow-md tracking-wide whitespace-nowrap"
                          >
                            Add to Daily Feed
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB VIEW: LIVE COMPLIANCE STOPWATCH CONTROLLER
          ========================================================================= */}
      {currentSubTab === "active" && (
        <div className="space-y-4 animate-fadeIn">
          {!activeWorkout ? (
            <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400 select-none shadow-sm">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">// No Active Tracking Session Engaged</h3>
              <p className="text-xs font-medium max-w-xs mx-auto mt-1 leading-relaxed">Launch an existing routine configuration or spin up an empty canvas module layer.</p>
              <button type="button" onClick={() => handleLaunchEmptyLiveSession()} className="mt-4 bg-blue-500 text-white text-xs font-bold px-5 h-9 rounded-full hover:bg-blue-600 shadow-md">Create Blank Canvas</button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 flex justify-between items-center shadow-md">
                <div>
                  <h2 className="text-sm font-black uppercase tracking-wide text-gray-100">{activeWorkout.title}</h2>
                  <p className="text-xs text-gray-400 mt-0.5 font-medium tabular-nums">{getFormattedElapsedTime()} elapsed</p>
                </div>
                <button type="button" onClick={handleCommitWorkoutToHistory} className="bg-blue-500 text-white text-xs font-bold px-5 h-10 rounded-full hover:bg-blue-600 shadow-lg tracking-wide shrink-0">
                  Finish Workout ✓
                </button>
              </div>

              <div className="space-y-4">
                {activeWorkout.nodes.map((node, nodeIdx) => (
                  <div key={node.id} className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-50 pb-2 select-none">
                      <h4 className="text-xs font-bold text-slate-800 capitalize"><span className="text-slate-300 mr-1 font-mono">#{nodeIdx+1}</span> {node.exerciseName}</h4>
                      <button type="button" onClick={() => handlePurgeNodeFromActiveSession(node.id)} className="text-rose-400 hover:text-rose-600 text-[10px] font-bold uppercase tracking-wider">Remove</button>
                    </div>

                    <div className="space-y-2">
                      {node.sets.map((set, setIdx) => (
                        <div key={set.id} className={`flex items-center justify-between p-2 rounded-xl border text-xs font-semibold ${set.isCompleted ? 'bg-emerald-50/40 border-emerald-100' : 'bg-white border-slate-50'}`}>
                          <span className="text-slate-400 font-mono text-[10px] pl-1 select-none">Set {setIdx+1}</span>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <input type="number" value={set.reps} disabled={set.isCompleted} onChange={e => handleUpdateActiveSetParameters(node.id, set.id, { reps: parseInt(e.target.value) || 0 })} className="w-12 bg-slate-50 border border-slate-200 rounded-lg py-1 text-center font-bold text-base sm:text-xs text-slate-800 outline-none" />
                              <span className="text-[10px] text-slate-400 select-none">reps</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <input type="number" step="5" value={set.weightLbs} disabled={set.isCompleted} onChange={e => handleUpdateActiveSetParameters(node.id, set.id, { weightLbs: parseInt(e.target.value) || 0 })} className="w-16 bg-slate-50 border border-slate-200 rounded-lg py-1 text-center font-bold text-base sm:text-xs text-slate-800 outline-none" />
                              <span className="text-[10px] text-slate-400 select-none">lbs</span>
                            </div>
                            <button type="button" onClick={() => handleUpdateActiveSetParameters(node.id, set.id, { isCompleted: !set.isCompleted })} className={`rounded-lg border flex items-center justify-center text-xs font-bold transition-all h-11 w-11 sm:h-8 sm:w-8 shrink-0 ${set.isCompleted ? 'bg-emerald-500 border-emerald-600 text-white' : 'bg-white border-slate-300 text-transparent'}`}>✓</button>
                          </div>
                        </div>
                      ))}
                      <button type="button" onClick={() => handleAddSetToActiveNode(node.id)} className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 border-dashed rounded-xl py-2 text-[10px] font-bold uppercase text-slate-400 hover:text-slate-600 transition-all">＋ Append Set</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          SUB-TAB VIEW: HISTORICAL METRIC CHRONOLOGY LOG INDEX
          ========================================================================= */}
      {currentSubTab === "history" && (
        <div className="space-y-4 animate-fadeIn">
          <div className="px-1 select-none">
            <h2 className="text-base font-extrabold text-slate-800 tracking-tight">Workout History</h2>
            <p className="text-xs text-slate-400">Review past calculated kinetic outputs and daily nutrition additions.</p>
          </div>

          {historicalLogs.map((log) => (
            <div key={log.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-50 pb-3 gap-2">
                <div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 tracking-wide uppercase">{log.title}</h3>
                  <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">{log.timestamp}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 text-[9px] font-bold select-none tabular-nums">
                  <span className="bg-blue-50 text-blue-600 border border-blue-100/40 px-2.5 py-1 rounded-lg">⏱ {log.durationMinutes} MINS</span>
                  {log.totalTonnageVolume > 0 && <span className="bg-orange-50 text-orange-600 border border-orange-100/40 px-2.5 py-1 rounded-lg">🏋 {log.totalTonnageVolume.toLocaleString()} LBS LOAD</span>}
                  <span className="bg-emerald-50 text-emerald-600 border border-emerald-100/40 px-2.5 py-1 rounded-lg">🔥 +{log.caloriesBurned} CAL OFFSET</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {log.nodes.map((n, i) => (
                  <div key={i} className="bg-slate-50/60 border border-slate-100/60 p-2.5 rounded-xl flex items-center justify-between">
                    <span className="font-bold text-slate-700 truncate pr-2">{n.exerciseName}</span>
                    <span className="text-[10px] text-slate-400 shrink-0 bg-white border border-slate-100 px-1.5 py-0.5 rounded-md font-semibold">{n.sets.length} Sets Completed</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =========================================================================
          MODAL CONTEXT WRAPPER: CUSTOM EXERCISE MATRIX ENGINE GENERATOR
          ========================================================================= */}
      {showCustomModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-[2rem] max-w-md w-full shadow-2xl p-6 space-y-4 animate-scaleUp">
            <div>
              <h3 className="text-base font-extrabold text-slate-800 tracking-tight">Create Custom Exercise</h3>
              <p className="text-xs text-slate-400">Inject dynamic exercise tokens directly into your account's registry lines.</p>
            </div>

            <form onSubmit={handleInsertCustomExercise} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Exercise Title</label>
                <input type="text" required placeholder="e.g., Kettlebell Gorilla Cleans" value={newExeName} onChange={(e) => setNewExeName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-base sm:text-xs font-semibold text-slate-800 outline-none focus:border-blue-400" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Target Muscle System</label>
                  <select value={newExeMuscle} onChange={(e) => setNewExeMuscle(e.target.value as any)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 h-11 sm:h-9 text-slate-700 font-bold outline-none cursor-pointer">
                    <option value="chest">Chest</option>
                    <option value="back">Back</option>
                    <option value="legs">Legs</option>
                    <option value="shoulders">Shoulders</option>
                    <option value="arms">Arms</option>
                    <option value="core">Core</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">MET Intensity Ratio</label>
                  <input type="number" step="0.1" value={newExeMET} onChange={(e) => setNewExeMET(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 sm:py-2 text-center text-base sm:text-xs font-bold text-slate-800 outline-none focus:border-blue-400 tabular-nums" />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2 text-xs font-bold select-none">
                <button type="button" onClick={() => setShowCustomModal(false)} className="w-24 h-11 sm:h-9 rounded-full border border-slate-200 text-slate-400 hover:text-slate-600 uppercase tracking-wider text-[10px]">Close</button>
                <button type="submit" className="w-32 h-11 sm:h-9 bg-blue-500 text-white rounded-full hover:bg-blue-600 shadow-md uppercase tracking-wider text-[10px]">Save Exercise</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}