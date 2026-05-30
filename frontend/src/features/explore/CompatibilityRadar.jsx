import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gamepad2,
  Compass,
  Clock,
  UserCheck,
  Zap,
  Sparkles,
  Heart,
  Sun,
  Calendar,
  MessageSquare
} from "lucide-react";
import { calculateCompatibility } from "../../utils/compatibility";
import { useAuthStore } from "../../store/useAuthStore";
import { useThemeStore } from "../../store/useThemeStore";

export default function CompatibilityRadar({ profile }) {
  const { authUser } = useAuthStore();
  const { theme } = useThemeStore();
  const [activeAxis, setActiveAxis] = useState(0);

  const { scores, metadata } = calculateCompatibility(authUser, profile);

  const axes = [
    {
      id: "socialHobbies",
      name: "Social Hobbies",
      score: scores.socialHobbies,
      icon: Gamepad2,
      activeIcon: Sparkles,
      color: "text-pink-500 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/20",
      description: (() => {
        const shared = metadata.sharedInterests;
        if (shared.length >= 3) {
          return `Incredible hobby alignment! You both love ${shared.slice(0, 3).join(", ")}.`;
        }
        if (shared.length === 2) {
          return `Great connection! Both of you share a passion for ${shared.join(" & ")}.`;
        }
        if (shared.length === 1) {
          return `Nice overlap! You both share an interest in ${shared[0]}.`;
        }
        return "Different hobbies, great learning opportunities! Your unique interests can spark exciting conversations.";
      })()
    },
    {
      id: "culturalVibes",
      name: "Cultural Vibes",
      score: scores.culturalVibes,
      icon: Compass,
      activeIcon: Heart,
      color: "text-purple-500 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/20",
      description: scores.culturalVibes >= 85
        ? "Absolute kindred spirits! Your general vibes, humor, and lifestyle indicators are highly synced."
        : scores.culturalVibes >= 75
        ? "Strong cultural harmony. You share similar outlooks and personal vibes."
        : "Complementary outlooks! You bring different perspectives that balance each other beautifully."
    },
    {
      id: "activeHours",
      name: "Active Hours",
      score: scores.activeHours,
      icon: Clock,
      activeIcon: Sun,
      color: "text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20",
      description: metadata.scheduleA === metadata.scheduleB
        ? `Both of you are ${metadata.scheduleA}s! You'll be online and ready to chat at the exact same hours.`
        : `One of you is an ${metadata.scheduleA} and the other is an ${metadata.scheduleB}. A perfect blend of daytime energy and late-night thoughts!`
    },
    {
      id: "ageFit",
      name: "Age Fit",
      score: scores.ageFit,
      icon: UserCheck,
      activeIcon: Calendar,
      color: "text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20",
      description: metadata.ageDiff <= 1
        ? "Perfect peer-to-peer alignment! Being almost the same age makes sharing life stages effortless."
        : metadata.ageDiff <= 4
        ? "Highly aligned life stages. Great maturity balance for steady, mature growth."
        : "Diverse life experience! Bringing unique developmental viewpoints to the partnership."
    },
    {
      id: "conversationEnergy",
      name: "Conversation Energy",
      score: scores.conversationEnergy,
      icon: Zap,
      activeIcon: MessageSquare,
      color: "text-emerald-500 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20",
      description: scores.conversationEnergy >= 85
        ? "Vibrant text chemistry! High responsiveness and engaging, warm communication styles."
        : scores.conversationEnergy >= 75
        ? "Steady, comfortable flow. Grounded, balanced exchange of thoughts without feeling rushed."
        : "Thoughtful & measured communication. Taking time to compose deep, meaningful replies."
    }
  ];

  const cx = 120;
  const cy = 120;
  const maxR = 80;

  const angles = [
    -Math.PI / 2,
    -Math.PI / 10,
    (3 * Math.PI) / 10,
    (7 * Math.PI) / 10,
    (11 * Math.PI) / 10
  ];

  const getPentagonPoints = (radius) => {
    return angles
      .map((angle) => {
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        return `${x},${y}`;
      })
      .join(" ");
  };

  const ringPoints = [
    getPentagonPoints(20),
    getPentagonPoints(40),
    getPentagonPoints(60),
    getPentagonPoints(80)
  ];

  const valuePoints = axes
    .map((axis, i) => {
      const radius = maxR * (axis.score / 100);
      const x = cx + radius * Math.cos(angles[i]);
      const y = cy + radius * Math.sin(angles[i]);
      return `${x},${y}`;
    })
    .join(" ");

  const activeAxisObj = axes[activeAxis];
  const ActiveIcon = activeAxisObj.activeIcon;

  return (
    <div className="w-full flex flex-col items-center bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-5 rounded-3xl shadow-sm select-none transition-colors duration-300">
      <div className="flex items-center justify-between w-full mb-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Compatibility Vibe Matrix
        </h4>
        <span className="flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-black bg-pink-500 text-white shadow-sm">
          <Heart size={10} className="fill-current text-white animate-pulse" />
          <span>{metadata.overallScore}% MATCH</span>
        </span>
      </div>

      <div className="relative w-full flex flex-col items-center justify-center my-2 h-[220px]">
        <svg className="w-[240px] h-[240px] drop-shadow-sm pointer-events-auto">
          <defs>
            <linearGradient id="compatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.45" />
            </linearGradient>
          </defs>

          {ringPoints.map((points, idx) => (
            <polygon
              key={idx}
              points={points}
              fill="none"
              stroke={theme === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(244, 63, 94, 0.08)"}
              strokeWidth="1"
            />
          ))}

          {angles.map((angle, i) => {
            const x = cx + maxR * Math.cos(angle);
            const y = cy + maxR * Math.sin(angle);
            return (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={x}
                y2={y}
                stroke={theme === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(244, 63, 94, 0.08)"}
                strokeWidth="1"
                strokeDasharray="2 2"
              />
            );
          })}

          <motion.polygon
            initial={{ scale: 0.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 15, stiffness: 100 }}
            points={valuePoints}
            fill="url(#compatGrad)"
            stroke="#f43f5e"
            strokeWidth="2"
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          />

          {axes.map((axis, i) => {
            const radius = maxR * (axis.score / 100);
            const x = cx + radius * Math.cos(angles[i]);
            const y = cy + radius * Math.sin(angles[i]);
            const isActive = activeAxis === i;

            return (
              <g key={i} className="cursor-pointer" onClick={() => setActiveAxis(i)}>
                <circle
                  cx={x}
                  cy={y}
                  r={isActive ? 8 : 5}
                  className={`transition-all duration-300 ${
                    isActive ? "fill-yellow-400 stroke-white dark:stroke-zinc-900 stroke-2" : "fill-pink-500 hover:fill-pink-600"
                  }`}
                />
                {isActive && (
                  <circle
                    cx={x}
                    cy={y}
                    r={14}
                    fill="none"
                    stroke="#eab308"
                    strokeWidth="1.5"
                    className="animate-ping opacity-75"
                  />
                )}
              </g>
            );
          })}
        </svg>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-[84px] h-[84px] rounded-full bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-md transition-colors duration-300">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">
            Match
          </span>
          <span className="text-2xl font-black bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent mt-0.5 leading-none font-outfit">
            {metadata.overallScore}%
          </span>
        </div>
      </div>

      <div className="flex justify-between w-full px-1 py-2 gap-1.5 overflow-x-auto scrollbar-none shrink-0">
        {axes.map((axis, idx) => {
          const Icon = axis.icon;
          const isActive = activeAxis === idx;
          return (
            <button
              key={axis.id}
              onClick={() => setActiveAxis(idx)}
              className={`flex flex-col items-center justify-center p-2.5 rounded-2xl flex-1 min-w-[50px] transition-all border outline-none ${
                isActive
                  ? "border-pink-500 bg-pink-500/10 text-pink-600 dark:text-pink-400 shadow-sm scale-102 font-bold"
                  : "bg-slate-50 dark:bg-zinc-950/40 border-slate-100 dark:border-zinc-800 hover:bg-slate-100/50 dark:hover:bg-zinc-900/50 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              <Icon size={16} className={isActive ? "animate-bounce text-pink-500" : ""} />
              <span className="text-[9px] font-extrabold tracking-wide mt-1.5 whitespace-nowrap hidden xs:block">
                {axis.name.split(" ")[0]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="w-full mt-3 shrink-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeAxisObj.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="p-3.5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/40 flex items-start space-x-3 text-left transition-colors duration-300"
          >
            <div className={`p-2 rounded-xl border border-slate-100/20 shadow-sm flex items-center justify-center shrink-0 ${activeAxisObj.color}`}>
              <ActiveIcon size={18} className="stroke-[2.5]" />
            </div>
            <div className="flex-grow space-y-0.5">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-wide">
                  {activeAxisObj.name}
                </span>
                <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200">
                  {activeAxisObj.score}%
                </span>
              </div>
              <p className="text-[11px] font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                {activeAxisObj.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
