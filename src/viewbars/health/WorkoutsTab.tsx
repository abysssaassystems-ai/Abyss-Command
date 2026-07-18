"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Activity, 
  Flame, 
  Dumbbell, 
  Clock, 
  ClipboardList, 
  Search, 
  Zap, 
  History, 
  Plus, 
  Trash2, 
  Scale, 
  Check, 
  ChevronDown, 
  X,
  Sparkles,
  Layers,
  TrendingUp
} from "lucide-react";

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
  { id: "exe_lg_calf_raise_standing", name: "Standing Calf Raise Machine", category: "hypertrophy", primaryMuscle: "legs", metValue: 3.5, description: "Ankle plantar flexion tracking Gastrocnemius structural bounds." },
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
    title: "Push Day Framework Template",
    description: "Engineered professional split layout maximizing horizontal and vertical upper body pushing grids.",
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

export default function WorkoutsTab(): React.JSX.Element {
  // --- MULTI-TENANT ARCHITECTURE SECURE HANDSHAKE ---
  const [tenantEmail, setTenantEmail] = useState<string>("");
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
      title: "Structural Push Session",
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

  // Secure user space context provisioning
  useEffect(() => {
    const session = localStorage.getItem("active_software_user");
    if (session) {
      try {
        const parsed = JSON.parse(session);
        if (parsed?.email) {
          setTenantEmail(parsed.email);
          const cachedWeight = localStorage.getItem(`workout_weight_${parsed.email}`);
          if (cachedWeight) setUserWeightLbs(cachedWeight);
        }
      } catch (err) {
        console.error("WORKOUTS_AUTH_INIT_EXCEPTION:", err);
      }
    }
  }, []);

  // Update localized state metrics across changes
  const handleWeightChange = (val: string) => {
    setUserWeightLbs(val);
    if (tenantEmail && val) {
      localStorage.setItem(`workout_weight_${tenantEmail}`, val);
    }
  };

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

  // Live Inline Caloric Estimation Output
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
      description: newExeDesc.trim() || "User defined custom asset descriptor tracking.",
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
        id: `node_run_${Math.random().toString(36).substring(2, 11)}`,
        sets: node.sets.map((set) => ({ ...set, isCompleted: false })),
      })),
    };
    setActiveWorkout(sessionClone);
    setCurrentSubTab("active");
  };

  const handleLaunchEmptyLiveSession = () => {
    setActiveWorkout({
      id: `session_run_${Date.now()}`,
      title: "Custom Fitness Allocation Window",
      description: "Custom targeted structural exercise record.",
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
    setCurrentSubTab("active");
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
          sets: [...node.sets, { 
            id: `set_run_${Date.now()}_${node.sets.length}`, 
            reps: lastSet ? lastSet.reps : 10, 
            weightLbs: lastSet ? lastSet.weightLbs : 0, 
            isCompleted: false 
          }],
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
      title: activeWorkout.title || "Custom Kinetic Workout",
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
    <div className="space-y-6 max-w-[1100px] mx-auto pb-12 animate-fadeIn text-gray-800 select-none px-1">
      
      {/* 1. DYNAMIC HIGH-CONTRAST BALANCING TELEMETRY HEADER CARD */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xs">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-500 to-blue-500" />
        
        {/* Dynamic Scale Weight Entry Track Layer */}
        <div className="absolute top-4 right-5 flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200/60 shadow-inner">
          <Scale className="w-3.5 h-3.5 text-gray-400 stroke-[2.2]" />
          <span className="text-[9px] uppercase font-mono font-black text-gray-400 tracking-wider">Mass Baseline:</span>
          <input 
            type="number" 
            value={userWeightLbs}
            onChange={e => handleWeightChange(e.target.value)}
            className="w-12 bg-transparent text-xs font-mono font-black text-purple-600 text-center p-0 border-none focus:ring-0 outline-none text-base sm:text-xs"
          />
          <span className="text-[9px] font-mono font-bold text-gray-400 uppercase">lbs</span>
        </div>

        <div className="text-left">
          <span className="text-[10px] bg-purple-50 border border-purple-100 text-purple-600 font-mono font-black px-2.5 py-1 rounded-md tracking-wider uppercase">
            Metabolic Velocity Compensator
          </span>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 mt-2.5 mb-1 flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600" /> Kinetic Energy Allowance
          </h1>
        </div>
        
        <div className="grid grid-cols-3 justify-between items-center max-w-2xl mx-auto my-6 gap-2 px-2 text-center font-mono">
          <div>
            <span className="text-xl sm:text-2xl font-black text-gray-900 block tracking-tight tabular-nums">{baseBudgetCals}</span>
            <span className="text-[9px] text-gray-400 uppercase font-sans font-bold tracking-wider">Base Budget</span>
          </div>
          <div className="text-gray-300 font-sans font-light select-none text-xl">＋</div>
          <div>
            <span className="text-xl sm:text-2xl font-black text-emerald-600 block tracking-tight tabular-nums">+{earnedExerciseCalories}</span>
            <span className="text-[9px] text-emerald-600 font-sans font-bold tracking-wider uppercase">Exercise Offset</span>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-5 mt-4 max-w-sm mx-auto text-center">
          <span className="text-4xl font-mono font-black text-gray-900 tracking-tight block tabular-nums">
            {netCaloriesRemaining}
          </span>
          <span className="text-[10px] uppercase font-sans font-black tracking-widest text-gray-400 block mt-1.5">
            Net Remaining Volumetric Calories Left Today
          </span>
        </div>
      </div>

      {/* 2. NAVIGATION SEGMENT LAYER (Touch safe targets 44px) */}
      <div className="flex bg-gray-100 p-1 rounded-2xl text-xs font-mono font-black uppercase tracking-wider gap-1 select-none border border-gray-200/40">
        {(["templates", "browse", "active", "history"] as SubTabID[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setCurrentSubTab(tab)}
            className={`flex-1 min-w-[85px] text-center h-11 rounded-xl transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
              currentSubTab === tab 
                ? "bg-white text-purple-700 shadow-xs border border-gray-200/50" 
                : "text-gray-400 hover:text-gray-700"
            }`}
          >
            {tab === "templates" && <ClipboardList className="w-3.5 h-3.5 stroke-[2.5]" />}
            {tab === "browse" && <Search className="w-3.5 h-3.5 stroke-[2.5]" />}
            {tab === "active" && (
              <span className="relative flex h-3 w-3 items-center justify-center mr-0.5">
                {activeWorkout && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>}
                <Zap className={`w-3.5 h-3.5 stroke-[2.5] ${activeWorkout ? "text-rose-500 fill-rose-500" : ""}`} />
              </span>
            )}
            {tab === "history" && <History className="w-3.5 h-3.5 stroke-[2.5]" />}
            
            <span className="hidden sm:inline">
              {tab === "templates" && "Routines"}
              {tab === "browse" && "Exercises"}
              {tab === "active" && "Live Tracker"}
              {tab === "history" && "History"}
            </span>
          </button>
        ))}
      </div>

      {/* SUB-TAB PANELS COMPARTMENT AREA */}
      <div className="pt-2">
        
        {/* VIEW 01: ROUTINE SPLIT SCHEDULERS */}
        {currentSubTab === "templates" && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center gap-4 select-none px-1">
              <div className="text-left">
                <h2 className="text-base font-mono font-black text-gray-900 uppercase tracking-wide">Routine Templates</h2>
                <p className="text-xs text-gray-400 font-medium">Launch system splits or load clean structural tracking frames.</p>
              </div>
              <button
                type="button"
                onClick={() => handleLaunchEmptyLiveSession()}
                className="bg-purple-600 hover:bg-purple-700 border border-purple-700 text-white font-mono font-black text-[10px] uppercase tracking-wider px-4 h-11 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" /> Custom Workout
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {routineTemplates.map((rtn) => (
                <div key={rtn.id} className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col justify-between hover:border-gray-300 shadow-xs transition-all group">
                  <div className="space-y-2 text-left">
                    <h3 className="text-sm font-mono font-black text-gray-900 group-hover:text-purple-600 transition-colors uppercase tracking-tight">{rtn.title}</h3>
                    <p className="text-xs text-gray-400 font-medium leading-relaxed">{rtn.description}</p>
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {rtn.nodes.map((n, i) => (
                        <span key={i} className="bg-gray-50 text-gray-400 border border-gray-100 text-[9px] px-2 py-0.5 rounded-md font-mono font-bold uppercase tracking-wider">
                          {n.exerciseName}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-6 pt-3 border-t border-gray-100 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleLaunchLiveSession(rtn)}
                      className="bg-gray-900 hover:bg-gray-800 text-white font-mono font-black uppercase text-[10px] tracking-wider px-4 h-11 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1"
                    >
                      Initialize Session
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 02: DYNAMIC SEARCH DIAL LOGGING BROWSERS */}
        {currentSubTab === "browse" && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center gap-4 select-none px-1">
              <div className="text-left">
                <h2 className="text-base font-mono font-black text-gray-900 uppercase tracking-wide">Exercise Database Core</h2>
                <p className="text-xs text-gray-400 font-medium">Select any exercise matrix cell below to input parameters directly into current tracking buffers.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowCustomModal(true)}
                className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-black text-[10px] uppercase tracking-wider px-4 h-11 rounded-xl hover:bg-emerald-100/50 transition-all shadow-xs cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" /> Add Custom
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-3 flex flex-col sm:flex-row gap-2 shadow-xs">
              <div className="relative flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 focus-within:border-purple-500 transition-colors">
                <Search className="w-4 h-4 text-gray-300 mr-2" />
                <input 
                  type="text" 
                  placeholder="Query exercise names or targeting groups..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent py-2.5 font-sans font-semibold text-gray-800 placeholder-gray-300 w-full outline-none text-base sm:text-xs"
                />
              </div>
              <select
                value={filterMuscle}
                onChange={(e) => setFilterMuscle(e.target.value as any)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 h-11 font-mono text-[10px] font-black text-gray-500 uppercase tracking-wider outline-none cursor-pointer pr-8 shrink-0 focus:border-purple-500"
              >
                <option value="all">All Muscle Pipelines</option>
                <option value="chest">Chest Modules</option>
                <option value="back">Back Modules</option>
                <option value="legs">Lower Body Splits</option>
                <option value="shoulders">Shoulders Matrix</option>
                <option value="arms">Arms Isolation</option>
                <option value="core">Core Stabilization</option>
                <option value="cardio_vbuck">Cardio / Volumetric Burn</option>
              </select>
            </div>

            {/* MASTER INTERCEPT CONTAINER ACCORDION CELL */}
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredExerciseRegistry.length === 0 ? (
                <div className="text-center font-mono font-bold text-gray-400 uppercase tracking-wider py-12 bg-white rounded-2xl border border-gray-200 border-dashed">
                  // [ EXERCISE_QUERY_EMPTY: Adjust filter configurations ]
                </div>
              ) : (
                filteredExerciseRegistry.map((ex) => {
                  const isExpanded = expandedExerciseId === ex.id;
                  const liveBurnPreview = calculateLiveInlineBurn(ex.metValue, ex.category);

                  return (
                    <div 
                      key={ex.id} 
                      className={`bg-white border rounded-2xl shadow-xs transition-all overflow-hidden text-left ${
                        isExpanded ? 'border-purple-400 ring-4 ring-purple-500/5 shadow-xs' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div 
                        onClick={() => {
                          setExpandedExerciseId(isExpanded ? null : ex.id);
                          setInlineReps("10");
                          setInlineWeight("135");
                          setInlineMinutes("20");
                          setInlineSpeed("6.0"); 
                        }}
                        className="p-4 flex justify-between items-center cursor-pointer select-none h-14"
                      >
                        <div className="min-w-0 flex-1 pr-3">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs sm:text-sm font-mono font-black text-gray-900 tracking-tight uppercase">{ex.name}</h4>
                            {ex.isCustom && <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[8px] uppercase font-mono px-1.5 py-0.5 rounded font-black tracking-wider">Custom</span>}
                          </div>
                          <p className="text-[11px] text-gray-400 font-medium truncate mt-0.5">{ex.description}</p>
                        </div>
                        <div className="shrink-0 flex items-center gap-3">
                          <span className="bg-gray-50 border border-gray-100 text-gray-400 text-[9px] font-mono font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                            {ex.primaryMuscle.replace('_', ' ')}
                          </span>
                          <ChevronDown className={`w-3.5 h-3.5 text-gray-300 transition-transform duration-200 ${isExpanded ? "rotate-180 text-purple-600" : ""}`} />
                        </div>
                      </div>

                      {/* PARAMETER SELECTION EXPANSION GRID SUBFORM */}
                      {isExpanded && (
                        <div className="bg-gray-50/70 p-4 border-t border-gray-100 space-y-4 animate-fadeIn font-mono">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                            {ex.category === "cardio" ? (
                              <>
                                <div>
                                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider block mb-1">Duration Block</label>
                                  <div className="relative flex items-center bg-white border border-gray-200 rounded-xl px-3 focus-within:border-purple-500">
                                    <input 
                                      type="number" 
                                      value={inlineMinutes} 
                                      onChange={e => setInlineMinutes(e.target.value)}
                                      className="w-full bg-transparent py-2.5 text-sm font-sans font-bold text-gray-800 outline-none text-base sm:text-xs"
                                    />
                                    <span className="text-[10px] font-black text-gray-400 uppercase ml-1 shrink-0">mins</span>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider block mb-1">Target Velocity</label>
                                  <div className="relative flex items-center bg-white border border-gray-200 rounded-xl px-3 focus-within:border-purple-500">
                                    <input 
                                      type="number" 
                                      step="0.1"
                                      value={inlineSpeed} 
                                      onChange={e => setInlineSpeed(e.target.value)}
                                      className="w-full bg-transparent py-2.5 text-sm font-sans font-bold text-gray-800 outline-none text-base sm:text-xs"
                                    />
                                    <span className="text-[10px] font-black text-gray-400 uppercase ml-1 shrink-0">mph</span>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <>
                                <div>
                                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider block mb-1">Volume Load</label>
                                  <div className="relative flex items-center bg-white border border-gray-200 rounded-xl px-3 focus-within:border-purple-500">
                                    <input 
                                      type="number" 
                                      value={inlineReps} 
                                      onChange={e => setInlineReps(e.target.value)}
                                      className="w-full bg-transparent py-2.5 text-sm font-sans font-bold text-gray-800 outline-none text-base sm:text-xs"
                                    />
                                    <span className="text-[10px] font-black text-gray-400 uppercase ml-1 shrink-0">reps</span>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider block mb-1">Mass Metric</label>
                                  <div className="relative flex items-center bg-white border border-gray-200 rounded-xl px-3 focus-within:border-purple-500">
                                    <input 
                                      type="number" 
                                      step="5"
                                      value={inlineWeight} 
                                      onChange={e => setInlineWeight(e.target.value)}
                                      className="w-full bg-transparent py-2.5 text-sm font-sans font-bold text-gray-800 outline-none text-base sm:text-xs"
                                    />
                                    <span className="text-[10px] font-black text-gray-400 uppercase ml-1 shrink-0">lbs</span>
                                  </div>
                                </div>
                              </>
                            )}

                            <div className="bg-white border border-gray-200 rounded-xl px-3.5 flex items-center justify-between shadow-xs h-11">
                              <span className="text-[9px] font-black text-gray-400 uppercase">Est Offset</span>
                              <span className="text-sm font-black text-emerald-600 tracking-tight tabular-nums flex items-center gap-0.5">
                                +{liveBurnPreview} <span className="text-[9px] font-sans font-bold text-gray-400 uppercase tracking-normal">kcal</span>
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-3 border-t border-gray-100">
                            <p className="text-[11px] font-sans font-medium text-gray-400 leading-normal text-left">
                              Appending this transaction scales current daily thresholds to allow a cumulative payload tracking allowance of <strong className="text-purple-600 font-black">{(netCaloriesRemaining + liveBurnPreview).toLocaleString()} kcal</strong> across systems.
                            </p>
                            <div className="flex gap-2 w-full sm:w-auto shrink-0 font-mono text-[10px] font-black uppercase tracking-wider select-none">
                              {activeWorkout && (
                                <button 
                                  type="button"
                                  onClick={() => handleInjectExerciseToActiveSession(ex)}
                                  className="flex-1 sm:flex-none bg-gray-900 text-white px-4 h-9 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer shadow-xs"
                                >
                                  Inject Node
                                </button>
                              )}
                              <button 
                                type="button"
                                onClick={() => handleCommitQuickLoggedExercise(ex)}
                                className="flex-1 sm:flex-none bg-purple-600 text-white px-4 h-9 rounded-lg hover:bg-purple-700 transition-colors cursor-pointer shadow-xs"
                              >
                                Commit Feed
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* VIEW 03: LIVE WORKOUT TRACKER WITH STOPWATCH INTERCEPT */}
        {currentSubTab === "active" && (
          <div className="space-y-4 animate-fadeIn">
            {!activeWorkout ? (
              <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-12 text-center text-gray-400 select-none shadow-xs">
                <Dumbbell className="w-8 h-8 text-gray-300 mx-auto mb-2 stroke-[1.5]" />
                <h3 className="text-xs font-mono font-black text-gray-900 uppercase tracking-wider">// Active Pipeline Disengaged</h3>
                <p className="text-xs font-medium max-w-xs mx-auto mt-1 leading-relaxed">No tracking frames are running. Boot a routine template or initiate an abstract canvas below.</p>
                <button 
                  type="button" 
                  onClick={() => handleLaunchEmptyLiveSession()} 
                  className="mt-5 bg-purple-600 text-white font-mono font-black uppercase tracking-wider text-[10px] px-5 h-11 rounded-xl hover:bg-purple-700 shadow-xs cursor-pointer"
                >
                  Spawn Clean Workspace
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-left">
                <div className="bg-gray-900 text-white rounded-2xl p-5 flex flex-col sm:flex-row gap-4 justify-between sm:items-center shadow-xs">
                  <div>
                    <h2 className="text-sm font-mono font-black uppercase tracking-wider text-gray-100 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-purple-400" /> {activeWorkout.title}
                    </h2>
                    <p className="text-xs font-mono text-purple-400 mt-1 font-bold tracking-widest uppercase tabular-nums flex items-center gap-1">
                      <Clock className="w-3 h-3 text-purple-400 animate-pulse stroke-[2.5]" /> {getFormattedElapsedTime()} Execution Elapsed
                    </p>
                  </div>
                  <button 
                    type="button" 
                    onClick={handleCommitWorkoutToHistory} 
                    className="bg-purple-600 text-white font-mono font-black uppercase text-[10px] tracking-wider px-5 h-11 rounded-xl hover:bg-purple-700 shadow-sm shrink-0 cursor-pointer"
                  >
                    Serialize & Archive Record
                  </button>
                </div>

                <div className="space-y-4">
                  {activeWorkout.nodes.length === 0 ? (
                    <div className="text-center font-mono font-bold text-gray-400 py-12 bg-white rounded-2xl border border-gray-100 uppercase tracking-wider">
                      // Workspace empty. Navigate to [ Exercises ] tab to inject targeted activity nodes.
                    </div>
                  ) : (
                    activeWorkout.nodes.map((node, nodeIdx) => (
                      <div key={node.id} className="bg-white border border-gray-200 rounded-2xl shadow-xs p-4 sm:p-5 space-y-4">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2.5 select-none">
                          <h4 className="text-xs font-mono font-black text-gray-900 uppercase tracking-tight flex items-center gap-1.5">
                            <span className="text-purple-400">[{String(nodeIdx + 1).padStart(2, '0')}]</span> {node.exerciseName}
                          </h4>
                          <button 
                            type="button" 
                            onClick={() => handlePurgeNodeFromActiveSession(node.id)} 
                            className="text-gray-300 hover:text-rose-600 text-[10px] font-mono font-black uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            Purge Element
                          </button>
                        </div>

                        <div className="space-y-2">
                          {node.sets.map((set, setIdx) => (
                            <div 
                              key={set.id} 
                              className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl border text-xs gap-3 transition-colors ${
                                set.isCompleted 
                                  ? 'bg-emerald-50/50 border-emerald-200 opacity-70' 
                                  : 'bg-gray-50/50 border-gray-200/70'
                              }`}
                            >
                              <span className="text-gray-400 font-mono text-[9px] font-black uppercase tracking-wider select-none pt-1 sm:pt-0">
                                Set Token {String(setIdx + 1).padStart(2, '0')}
                              </span>
                              
                              <div className="flex items-center justify-end gap-4 font-mono text-[10px] font-black uppercase tracking-wider">
                                <div className="flex items-center gap-1.5">
                                  <input 
                                    type="number" 
                                    value={set.reps} 
                                    disabled={set.isCompleted} 
                                    onChange={e => handleUpdateActiveSetParameters(node.id, set.id, { reps: parseInt(e.target.value) || 0 })} 
                                    className="w-12 bg-white border border-gray-200 rounded-lg py-1.5 text-center font-sans font-bold text-gray-800 outline-none text-base sm:text-xs disabled:opacity-50" 
                                  />
                                  <span className="text-[9px] text-gray-400">Reps</span>
                                </div>
                                
                                <div className="flex items-center gap-1.5">
                                  <input 
                                    type="number" 
                                    step="5" 
                                    value={set.weightLbs} 
                                    disabled={set.isCompleted} 
                                    onChange={e => handleUpdateActiveSetParameters(node.id, set.id, { weightLbs: parseInt(e.target.value) || 0 })} 
                                    className="w-16 bg-white border border-gray-200 rounded-lg py-1.5 text-center font-sans font-bold text-gray-800 outline-none text-base sm:text-xs disabled:opacity-50" 
                                  />
                                  <span className="text-[9px] text-gray-400">Lbs</span>
                                </div>
                                
                                <button 
                                  type="button" 
                                  onClick={() => handleUpdateActiveSetParameters(node.id, set.id, { isCompleted: !set.isCompleted })} 
                                  className={`rounded-lg border flex items-center justify-center transition-all h-11 w-11 sm:h-8 sm:w-8 shrink-0 cursor-pointer ${
                                    set.isCompleted 
                                      ? 'bg-emerald-600 border-emerald-700 text-white shadow-xs' 
                                      : 'bg-white border-gray-300 text-transparent hover:border-gray-400'
                                  }`}
                                >
                                  <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                                </button>
                              </div>
                            </div>
                          ))}
                          
                          <button 
                            type="button" 
                            onClick={() => handleAddSetToActiveNode(node.id)} 
                            className="w-full bg-white hover:bg-gray-50 border border-gray-200 border-dashed rounded-xl py-2.5 text-[9px] font-mono font-black uppercase tracking-wider text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                          >
                            ＋ Append Set Tier
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 04: HISTORICAL DATA LEDGERS */}
        {currentSubTab === "history" && (
          <div className="space-y-4 animate-fadeIn text-left">
            <div className="px-1 select-none">
              <h2 className="text-base font-mono font-black text-gray-900 uppercase tracking-wide">Transverse Workout Logs</h2>
              <p className="text-xs text-gray-400 font-medium">Historical audit tracking lines of physical mechanical output.</p>
            </div>

            {historicalLogs.map((log) => (
              <div key={log.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-3.5 gap-3">
                  <div>
                    <h3 className="text-xs sm:text-sm font-mono font-black text-gray-900 tracking-tight uppercase">{log.title}</h3>
                    <span className="text-[10px] font-mono font-bold text-gray-400 block mt-0.5">{log.timestamp}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 font-mono text-[9px] font-black uppercase tracking-wider select-none tabular-nums">
                    <span className="bg-blue-50 text-blue-700 border border-blue-100/70 px-2.5 py-1 rounded-md">
                      {log.durationMinutes} Mins Execution
                    </span>
                    {log.totalTonnageVolume > 0 && (
                      <span className="bg-purple-50 text-purple-700 border border-purple-100/70 px-2.5 py-1 rounded-md">
                        {log.totalTonnageVolume.toLocaleString()} lbs Payload Load
                      </span>
                    )}
                    <span className="bg-orange-50 text-orange-700 border border-orange-100/70 px-2.5 py-1 rounded-md">
                      +{log.caloriesBurned} kcal Offset
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono font-bold">
                  {log.nodes.map((n, i) => (
                    <div key={i} className="bg-gray-50 border border-gray-100/70 p-3 rounded-xl flex items-center justify-between shadow-xs">
                      <span className="text-gray-700 truncate pr-2 uppercase text-[11px]">{n.exerciseName}</span>
                      <span className="text-[9px] text-purple-600 shrink-0 bg-purple-50/50 border border-purple-100 px-2 py-0.5 rounded-md font-black">
                        {n.sets.length} Tiers Logged
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =========================================================================
          MODAL CONTEXT OVERLAY LAYER SHEET
          ========================================================================= */}
      {showCustomModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full shadow-md p-6 space-y-4 animate-scaleUp text-left select-none">
            <div className="flex justify-between items-start border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-sm font-mono font-black text-gray-900 uppercase tracking-wide">Custom Exercise Provisioning</h3>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Inject verified exercise data blocks to account registries.</p>
              </div>
              <button 
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="text-gray-300 hover:text-gray-500 rounded-lg p-1 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInsertCustomExercise} className="space-y-4 font-mono text-xs">
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider block mb-1">Exercise System Label</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g., Kettlebell Gorilla Cleans" 
                  value={newExeName} 
                  onChange={(e) => setNewExeName(e.target.value)} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 font-sans font-semibold text-gray-800 placeholder-gray-300 outline-none focus:border-purple-500 text-base sm:text-xs transition-colors" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider block mb-1">Target Cluster</label>
                  <select 
                    value={newExeMuscle} 
                    onChange={(e) => setNewExeMuscle(e.target.value as any)} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2 h-11 text-[11px] text-gray-700 font-black uppercase tracking-wide outline-none cursor-pointer"
                  >
                    <option value="chest">Chest Modules</option>
                    <option value="back">Back Modules</option>
                    <option value="legs">Leg Matrices</option>
                    <option value="shoulders">Shoulder Units</option>
                    <option value="arms">Arm Isolation</option>
                    <option value="core">Core Pillars</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider block mb-1">MET Intensity Ratio</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    value={newExeMET} 
                    onChange={(e) => setNewExeMET(e.target.value)} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-center font-sans font-bold text-gray-800 outline-none focus:border-purple-500 text-base sm:text-xs tabular-nums transition-colors" 
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3 text-[10px] font-black uppercase tracking-wider select-none">
                <button 
                  type="button" 
                  onClick={() => setShowCustomModal(false)} 
                  className="px-4 h-11 rounded-xl border border-gray-200 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 h-11 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors shadow-xs cursor-pointer"
                >
                  Commit Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}