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
      color: "text-foreground bg-background-secondary",
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
      color: "text-foreground bg-background-secondary",
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
      color: "text-foreground bg-background-secondary",
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
      color: "text-foreground bg-background-secondary",
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
      color: "text-foreground bg-background-secondary",
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
    <div className="w-full flex flex-col items-center bg-background border border-border p-5 rounded-3xl shadow-card select-none transition-colors duration-300">
      <div className="flex items-center justify-between w-full mb-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground-muted">
          Compatibility Vibe Matrix
        </h4>
        <span className="flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-black bg-primary text-primary-foreground shadow-card">
          <Heart size={10} className="fill-current animate-pulse" />
          <span>{metadata.overallScore}% MATCH</span>
        </span>
      </div>

      <div className="relative w-full flex flex-col items-center justify-center my-2 h-[220px]">
        <svg className="w-[240px] h-[240px] pointer-events-auto">
          {ringPoints.map((points, idx) => (
            <polygon
              key={idx}
              points={points}
              fill="none"
              stroke="var(--border-strong)"
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
                stroke="var(--border-strong)"
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
            fill="#006bff"
            fillOpacity="0.25"
            stroke="#006bff"
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
                    isActive ? "fill-[#006bff] stroke-background stroke-2" : "fill-[#006bff] hover:fill-[#0058d1]"
                  }`}
                />
                {isActive && (
                  <circle
                    cx={x}
                    cy={y}
                    r={14}
                    fill="none"
                    stroke="#006bff"
                    strokeWidth="1.5"
                    className="animate-ping opacity-75"
                  />
                )}
              </g>
            );
          })}
        </svg>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-[84px] h-[84px] rounded-full bg-background border border-border shadow-card transition-colors duration-300">
          <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest leading-none">
            Match
          </span>
          <span className="text-2xl font-black text-foreground mt-0.5 leading-none font-outfit">
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
                  ? "border-accent bg-background-secondary text-accent shadow-card scale-102 font-bold"
                  : "bg-background-secondary border-border hover:bg-surface-hover text-foreground-muted hover:text-foreground"
              }`}
            >
              <Icon size={16} className={isActive ? "animate-bounce text-accent" : ""} />
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
            className="p-3.5 rounded-2xl border border-border bg-background-secondary flex items-start space-x-3 text-left transition-colors duration-300"
          >
            <div className={`p-2 rounded-xl border border-border shadow-card flex items-center justify-center shrink-0 ${activeAxisObj.color}`}>
              <ActiveIcon size={18} className="stroke-[2.5]" />
            </div>
            <div className="flex-grow space-y-0.5">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-bold text-foreground tracking-wide">
                  {activeAxisObj.name}
                </span>
                <span className="text-xs font-extrabold text-foreground-secondary">
                  {activeAxisObj.score}%
                </span>
              </div>
              <p className="text-[11px] font-medium leading-relaxed text-foreground-secondary">
                {activeAxisObj.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
