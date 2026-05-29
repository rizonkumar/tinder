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
import { calculateCompatibility } from "../utils/compatibility";
import { useAuthStore } from "../store/useAuthStore";

export default function CompatibilityRadar({ profile }) {
  const { authUser } = useAuthStore();
  const [activeAxis, setActiveAxis] = useState(0);

  const { scores, metadata } = calculateCompatibility(authUser, profile);

  const axes = [
    {
      id: "socialHobbies",
      name: "Social Hobbies",
      score: scores.socialHobbies,
      icon: Gamepad2,
      activeIcon: Sparkles,
      color: "from-pink-500 to-rose-500",
      bgLight: "bg-pink-50 border-pink-100 text-pink-600",
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
      color: "from-purple-500 to-indigo-500",
      bgLight: "bg-purple-50 border-purple-100 text-purple-600",
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
      color: "from-amber-500 to-orange-500",
      bgLight: "bg-amber-50 border-amber-100 text-amber-600",
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
      color: "from-blue-500 to-cyan-500",
      bgLight: "bg-blue-50 border-blue-100 text-blue-600",
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
      color: "from-emerald-500 to-teal-500",
      bgLight: "bg-emerald-50 border-emerald-100 text-emerald-600",
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
    <div className="w-full flex flex-col items-center bg-white/40 backdrop-blur-md border border-gray-100/50 p-5 rounded-3xl shadow-sm select-none">
      <div className="flex items-center justify-between w-full mb-3">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
          Compatibility Vibe Matrix
        </h4>
        <span className="flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-extrabold bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm shadow-pink-100">
          <Heart size={10} className="fill-current text-white animate-pulse" />
          <span>{metadata.overallScore}% MATCH</span>
        </span>
      </div>

      <div className="relative w-full flex flex-col items-center justify-center my-2 h-[220px]">
        <svg className="w-[240px] h-[240px] drop-shadow-sm pointer-events-auto">
          <defs>
            <linearGradient id="compatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="activeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#eab308" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {ringPoints.map((points, idx) => (
            <polygon
              key={idx}
              points={points}
              fill="none"
              stroke="rgba(244, 63, 94, 0.08)"
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
                stroke="rgba(244, 63, 94, 0.08)"
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
                    isActive ? "fill-yellow-400 stroke-white stroke-2" : "fill-pink-500 hover:fill-pink-600"
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

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-[84px] h-[84px] rounded-full bg-white/90 border border-pink-100 shadow-md backdrop-blur-md">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
            Match
          </span>
          <span className="text-2xl font-black bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent mt-0.5 leading-none">
            {metadata.overallScore}%
          </span>
        </div>
      </div>

      <div className="flex justify-between w-full px-1 py-2 gap-1 overflow-x-auto scrollbar-none">
        {axes.map((axis, idx) => {
          const Icon = axis.icon;
          const isActive = activeAxis === idx;
          return (
            <button
              key={axis.id}
              onClick={() => setActiveAxis(idx)}
              className={`flex flex-col items-center justify-center p-2.5 rounded-2xl flex-1 min-w-[50px] transition-all border outline-none ${
                isActive
                  ? "bg-gradient-to-br from-pink-500 to-rose-500 border-pink-500 text-white shadow-md shadow-pink-100 scale-105"
                  : "bg-gray-50 border-gray-100 hover:bg-gray-100/60 text-gray-400 hover:text-gray-600"
              }`}
            >
              <Icon size={16} className={isActive ? "animate-bounce" : ""} />
              <span className="text-[9px] font-extrabold tracking-wide mt-1 whitespace-nowrap hidden xs:block">
                {axis.name.split(" ")[0]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="w-full mt-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeAxisObj.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`p-4 rounded-2xl border flex items-start space-x-3 text-left ${activeAxisObj.bgLight}`}
          >
            <div className="p-2 rounded-xl bg-white border border-inherit/40 shadow-sm flex items-center justify-center shrink-0">
              <ActiveIcon size={18} className="stroke-[2.5]" />
            </div>
            <div className="flex-grow space-y-0.5">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-bold text-gray-800 tracking-wide">
                  {activeAxisObj.name}
                </span>
                <span className="text-xs font-extrabold text-inherit">
                  {activeAxisObj.score}%
                </span>
              </div>
              <p className="text-[11px] font-medium leading-relaxed opacity-90">
                {activeAxisObj.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
