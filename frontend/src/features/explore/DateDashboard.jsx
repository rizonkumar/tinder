import { useEffect, useState } from "react";
import { useDatePlanStore } from "../../store/useDatePlanStore";
import { useAuthStore } from "../../store/useAuthStore";
import AppLayout from "../../components/AppLayout";
import { ACTIVITY_OPTIONS, DEFAULT_ACTIVITY } from "../../constants";
import {
  CalendarDays,
  MapPin,
  Clock,
  Coffee,
  Utensils,
  Wine,
  Compass,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

function normalizeTime(time) {
  if (!time) return "00:00";
  const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return time;
  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const period = match[3]?.toUpperCase();
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return `${String(hours).padStart(2, "0")}:${minutes}`;
}

function computeTimeLeft(date, time) {
  const diff = new Date(`${date}T${normalizeTime(time)}`).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function CountdownTimer({ date, time }) {
  const [timeLeft, setTimeLeft] = useState(() => computeTimeLeft(date, time));

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(computeTimeLeft(date, time)), 1000);
    return () => clearInterval(timer);
  }, [date, time]);

  if (!timeLeft) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-700 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
        Happening Now
      </span>
    );
  }

  const cells = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Mins", value: timeLeft.minutes },
    { label: "Secs", value: timeLeft.seconds },
  ];

  return (
    <div className="grid max-w-[280px] grid-cols-4 gap-2 text-center">
      {cells.map((cell) => (
        <div key={cell.label} className="rounded-md border border-border bg-background-secondary p-2">
          <span className="block text-sm font-bold text-foreground">{cell.value}</span>
          <span className="text-[8px] font-bold uppercase text-foreground-muted">{cell.label}</span>
        </div>
      ))}
    </div>
  );
}

function formatLongDate(date) {
  if (!date) return "";
  return new Date(`${date}T00:00`).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function DateCard({ partner, activityLabel, ActivityIcon, surface, date, time, venueTitle, venueLocation, badge }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col justify-between rounded-lg border border-border bg-background p-5 shadow-card transition-colors hover:bg-surface-hover"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={partner.image || "/avatar.png"}
            alt={partner.name}
            className="h-12 w-12 rounded-full border border-border object-cover"
          />
          <div>
            <h3 className="text-sm font-bold text-foreground">{partner.name}</h3>
            <span className={`mt-1 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[9px] font-bold uppercase ${surface}`}>
              <ActivityIcon size={10} />
              <span>{activityLabel}</span>
            </span>
          </div>
        </div>
        {badge && (
          <span className="rounded-full border border-border bg-background-secondary px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-foreground-muted">
            {badge}
          </span>
        )}
      </div>

      <div className="my-4 space-y-2 border-t border-border pt-4">
        <div className="flex items-start gap-2.5">
          <MapPin size={14} className="mt-0.5 shrink-0 text-foreground-muted" />
          <div>
            {venueTitle && <p className="text-xs font-bold text-foreground-secondary">{venueTitle}</p>}
            <p className="text-[10px] text-foreground-muted">{venueLocation}</p>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <Clock size={14} className="mt-0.5 shrink-0 text-foreground-muted" />
          <div>
            <p className="text-xs font-bold text-foreground-secondary">{formatLongDate(date)}</p>
            <p className="text-[10px] text-foreground-muted">at {time}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-border pt-4">
        <span className="text-[8px] font-bold uppercase tracking-wider text-foreground-muted">Countdown</span>
        <CountdownTimer date={date} time={time} />
      </div>
    </motion.div>
  );
}

function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-border bg-background p-8 text-center">
      <div className="mb-3 rounded-full bg-background-secondary p-3 text-foreground-muted">
        <Icon size={24} />
      </div>
      <h3 className="text-sm font-bold text-foreground">{title}</h3>
      <p className="mt-1 max-w-[260px] text-[11px] text-foreground-muted">{description}</p>
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex h-64 items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1 }}
        className="h-10 w-10 rounded-full border-2 border-accent border-t-transparent"
      />
    </div>
  );
}

const PLAN_CATEGORY_ICONS = {
  Coffee,
  Dinner: Utensils,
  Drinks: Wine,
  Outdoor: Compass,
};

export default function DateDashboard() {
  const { authUser } = useAuthStore();
  const {
    upcomingDates,
    getUpcomingDates,
    isLoadingUpcoming,
    socialDates,
    getConfirmedSocialDates,
    isLoadingSocialDates,
  } = useDatePlanStore();

  const [activeTab, setActiveTab] = useState("social");

  useEffect(() => {
    getConfirmedSocialDates();
    getUpcomingDates();
  }, [getConfirmedSocialDates, getUpcomingDates]);

  const tabs = [
    { id: "social", label: "Social Dates", count: socialDates.length },
    { id: "plans", label: "Collaborative Plans", count: upcomingDates.length },
  ];

  return (
    <AppLayout variant="scroll">
      <div className="space-y-6">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold uppercase tracking-tight text-foreground">
            <CalendarDays size={28} className="text-accent" />
            <span>Date Dashboard</span>
          </h1>
          <p className="mt-1.5 text-xs font-medium text-foreground-secondary sm:text-sm">
            Your confirmed social dates and finalized collaborative plans, all in one place.
          </p>
        </div>

        <div className="flex items-center gap-6 border-b border-border">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`-mb-px flex items-center gap-2 border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
                  active
                    ? "border-accent text-accent"
                    : "border-transparent text-foreground-secondary hover:text-foreground"
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-xs font-semibold text-foreground-muted">{tab.count}</span>
              </button>
            );
          })}
        </div>

        {activeTab === "social" &&
          (isLoadingSocialDates ? (
            <Spinner />
          ) : socialDates.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="No Social Dates Yet"
              description="Open a chat and use “Plan a Social Date” to propose one. Confirmed dates show up here."
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {socialDates.map((d) => {
                const activity = ACTIVITY_OPTIONS[d.activity] || DEFAULT_ACTIVITY;
                return (
                  <DateCard
                    key={d.id}
                    partner={d.partner}
                    activityLabel={activity.label}
                    ActivityIcon={activity.icon}
                    surface={activity.surface}
                    date={d.date}
                    time={d.time}
                    venueLocation={d.location}
                    badge={d.proposedByMe ? "Proposed by you" : "Proposed to you"}
                  />
                );
              })}
            </div>
          ))}

        {activeTab === "plans" &&
          (isLoadingUpcoming ? (
            <Spinner />
          ) : upcomingDates.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No Collaborative Plans Yet"
              description="Use the Date Planner inside any chat room to vote on a venue and time, then finalize it together."
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {upcomingDates.map((d) => {
                const matchPartner = d.userA.id === authUser._id ? d.userB : d.userA;
                const category =
                  d.categoryVotes.find((v) => v.userId === authUser._id)?.category ||
                  d.categoryVotes[0]?.category;
                const CategoryIcon = PLAN_CATEGORY_ICONS[category] || CalendarDays;
                return (
                  <DateCard
                    key={d.id}
                    partner={matchPartner}
                    activityLabel={category || "Date"}
                    ActivityIcon={CategoryIcon}
                    surface="bg-background-secondary text-foreground"
                    date={d.finalDateTime?.date}
                    time={d.finalDateTime?.time}
                    venueTitle={d.finalVenue?.title}
                    venueLocation={d.finalVenue?.location}
                  />
                );
              })}
            </div>
          ))}
      </div>
    </AppLayout>
  );
}
