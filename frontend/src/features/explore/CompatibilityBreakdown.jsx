import { useState } from "react";
import { Gamepad2, Compass, Clock, UserCheck, Zap, ChevronDown } from "lucide-react";
import { calculateCompatibility } from "../../utils/compatibility";
import { useAuthStore } from "../../store/useAuthStore";
import { cn } from "../../utils/cn";

export default function CompatibilityBreakdown({ profile }) {
  const { authUser } = useAuthStore();
  const [openAxis, setOpenAxis] = useState(null);
  const { scores, metadata } = calculateCompatibility(authUser, profile);

  const axes = [
    {
      id: "socialHobbies",
      name: "Social Hobbies",
      score: scores.socialHobbies,
      icon: Gamepad2,
      description: (() => {
        const shared = metadata.sharedInterests;
        if (shared.length >= 3) {
          return `You both love ${shared.slice(0, 3).join(", ")}.`;
        }
        if (shared.length === 2) {
          return `You both enjoy ${shared.join(" and ")}.`;
        }
        if (shared.length === 1) {
          return `You both like ${shared[0]}.`;
        }
        return "No shared hobbies yet, which makes for easy questions to ask.";
      })()
    },
    {
      id: "culturalVibes",
      name: "Cultural Vibes",
      score: scores.culturalVibes,
      icon: Compass,
      description: scores.culturalVibes >= 85
        ? "Your lifestyle and humour signals line up closely."
        : scores.culturalVibes >= 75
        ? "You share similar outlooks and day-to-day vibes."
        : "Different outlooks that could balance each other out."
    },
    {
      id: "activeHours",
      name: "Active Hours",
      score: scores.activeHours,
      icon: Clock,
      description: metadata.scheduleA === metadata.scheduleB
        ? `You are both ${metadata.scheduleA}s, so you are likely online at the same time.`
        : `One ${metadata.scheduleA}, one ${metadata.scheduleB}. Expect replies at different hours.`
    },
    {
      id: "ageFit",
      name: "Age Fit",
      score: scores.ageFit,
      icon: UserCheck,
      description: metadata.ageDiff <= 1
        ? "Almost the same age, likely at a similar life stage."
        : metadata.ageDiff <= 4
        ? "A small age gap with closely aligned life stages."
        : "A wider age gap, with different life experience to share."
    },
    {
      id: "conversationEnergy",
      name: "Conversation Energy",
      score: scores.conversationEnergy,
      icon: Zap,
      description: scores.conversationEnergy >= 85
        ? "Both of you tend to reply quickly and warmly."
        : scores.conversationEnergy >= 75
        ? "A steady, unhurried back-and-forth."
        : "Slower, more considered replies on both sides."
    }
  ];

  return (
    <section aria-label="Compatibility">
      <div className="flex items-baseline justify-between">
        <p className="eyebrow">Compatibility</p>
        <p className="heading-16 tabular text-foreground">{metadata.overallScore}%</p>
      </div>
      <ul className="mt-2 divide-y divide-border rounded-lg border border-border">
        {axes.map((axis) => {
          const Icon = axis.icon;
          const isOpen = openAxis === axis.id;
          return (
            <li key={axis.id}>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenAxis(isOpen ? null : axis.id)}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-surface-hover focus-ring"
              >
                <Icon size={15} className="shrink-0 text-foreground-muted" aria-hidden="true" />
                <span className="label-13 w-32 shrink-0 truncate text-foreground">{axis.name}</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200" aria-hidden="true">
                  <span className="block h-full rounded-full bg-accent" style={{ width: `${axis.score}%` }} />
                </span>
                <span className="tabular w-9 shrink-0 text-right text-xs text-foreground-secondary">{axis.score}%</span>
                <ChevronDown size={14} className={cn("shrink-0 text-foreground-muted transition-transform", isOpen && "rotate-180")} aria-hidden="true" />
              </button>
              {isOpen && <p className="copy-13 px-3 pb-3 pl-[2.375rem] text-foreground-secondary">{axis.description}</p>}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
