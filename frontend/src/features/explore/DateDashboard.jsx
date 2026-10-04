import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, MapPin, Clock, Coffee, Utensils, Wine, Compass, Users } from "lucide-react";
import AppLayout from "../../components/AppLayout";
import { useDatePlanStore } from "../../store/useDatePlanStore";
import { useAuthStore } from "../../store/useAuthStore";
import { ACTIVITY_OPTIONS, DEFAULT_ACTIVITY } from "../../constants";
import { PageHeader } from "../../components/ui/PageHeader";
import { Tabs } from "../../components/ui/Tabs";
import { Badge } from "../../components/ui/Badge";
import { Avatar } from "../../components/ui/Avatar";
import { EmptyState } from "../../components/ui/EmptyState";
import { Skeleton } from "../../components/ui/Skeleton";
import { cn } from "../../utils/cn";

const TAB = { social: "social", plans: "plans" };

const PLAN_CATEGORY_ICONS = { Coffee, Dinner: Utensils, Drinks: Wine, Outdoor: Compass };

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

function formatLongDate(date) {
  if (!date) return "";
  return new Date(`${date}T00:00`).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function Countdown({ date, time }) {
  const [timeLeft, setTimeLeft] = useState(() => computeTimeLeft(date, time));

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(computeTimeLeft(date, time)), 1000);
    return () => clearInterval(timer);
  }, [date, time]);

  if (!timeLeft) {
    return <Badge tone="success">Happening now</Badge>;
  }

  const cells = [
    { label: "days", value: timeLeft.days },
    { label: "hrs", value: timeLeft.hours },
    { label: "min", value: timeLeft.minutes },
    { label: "sec", value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-baseline gap-3 tabular" aria-label="Time until the date">
      {cells.map((cell) => (
        <span key={cell.label} className="flex items-baseline gap-1">
          <span className="heading-20 text-foreground">{String(cell.value).padStart(2, "0")}</span>
          <span className="label-12 text-foreground-muted">{cell.label}</span>
        </span>
      ))}
    </div>
  );
}

function DetailRow({ icon: Icon, primary, secondary }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon size={15} className="mt-0.5 shrink-0 text-foreground-muted" aria-hidden="true" />
      <div className="min-w-0">
        {primary && <p className="label-13 truncate text-foreground">{primary}</p>}
        {secondary && <p className="copy-13 truncate text-foreground-secondary">{secondary}</p>}
      </div>
    </div>
  );
}

function DateCard({ partner, activityLabel, ActivityIcon, date, time, venueTitle, venueLocation, badge }) {
  return (
    <article className="flex flex-col rounded-lg border border-border bg-surface shadow-card">
      <div className="flex items-start justify-between gap-3 p-5 pb-4">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar src={partner.image} alt={partner.name} size="lg" />
          <div className="min-w-0">
            <p className="heading-16 truncate text-foreground">{partner.name}</p>
            <Badge icon={ActivityIcon} className="mt-1">{activityLabel}</Badge>
          </div>
        </div>
        {badge && <Badge tone="outline">{badge}</Badge>}
      </div>
      <div className="grid gap-3 border-t border-border px-5 py-4 sm:grid-cols-2">
        <DetailRow icon={MapPin} primary={venueTitle || venueLocation} secondary={venueTitle ? venueLocation : undefined} />
        <DetailRow icon={Clock} primary={formatLongDate(date)} secondary={time ? `at ${time}` : undefined} />
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-border bg-background-secondary px-5 py-3.5">
        <span className="label-12 text-foreground-muted">Starts in</span>
        <Countdown date={date} time={time} />
      </div>
    </article>
  );
}

function CardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {[0, 1].map((item) => (
        <Skeleton key={item} className="h-56" />
      ))}
    </div>
  );
}

export default function DateDashboard() {
  const { authUser } = useAuthStore();
  const { upcomingDates, getUpcomingDates, isLoadingUpcoming, socialDates, getConfirmedSocialDates, isLoadingSocialDates } =
    useDatePlanStore();
  const [activeTab, setActiveTab] = useState(TAB.social);

  useEffect(() => {
    getConfirmedSocialDates();
    getUpcomingDates();
  }, [getConfirmedSocialDates, getUpcomingDates]);

  const tabs = [
    { value: TAB.social, label: "Confirmed dates", count: socialDates.length },
    { value: TAB.plans, label: "Planned together", count: upcomingDates.length },
  ];

  const renderSocial = () => {
    if (isLoadingSocialDates) return <CardsSkeleton />;
    if (socialDates.length === 0) {
      return (
        <div className="rounded-lg border border-border bg-surface">
          <EmptyState
            icon={CalendarDays}
            title="No confirmed dates yet"
            description="Propose a date from any chat. Once your match accepts, it shows up here with a countdown."
          />
        </div>
      );
    }
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {socialDates.map((item) => {
          const activity = ACTIVITY_OPTIONS[item.activity] || DEFAULT_ACTIVITY;
          return (
            <DateCard
              key={item.id}
              partner={item.partner}
              activityLabel={activity.label}
              ActivityIcon={activity.icon}
              date={item.date}
              time={item.time}
              venueLocation={item.location}
              badge={item.proposedByMe ? "You proposed" : "They proposed"}
            />
          );
        })}
      </div>
    );
  };

  const renderPlans = () => {
    if (isLoadingUpcoming) return <CardsSkeleton />;
    if (upcomingDates.length === 0) {
      return (
        <div className="rounded-lg border border-border bg-surface">
          <EmptyState
            icon={Users}
            title="No plans finalised yet"
            description="Open the date planner inside a chat to vote on a venue and time together. Finalised plans land here."
          />
        </div>
      );
    }
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {upcomingDates.map((plan) => {
          const partner = plan.userA.id === authUser._id ? plan.userB : plan.userA;
          const category =
            plan.categoryVotes.find((vote) => vote.userId === authUser._id)?.category || plan.categoryVotes[0]?.category;
          return (
            <DateCard
              key={plan.id}
              partner={partner}
              activityLabel={category || "Date"}
              ActivityIcon={PLAN_CATEGORY_ICONS[category] || CalendarDays}
              date={plan.finalDateTime?.date}
              time={plan.finalDateTime?.time}
              venueTitle={plan.finalVenue?.title}
              venueLocation={plan.finalVenue?.location}
            />
          );
        })}
      </div>
    );
  };

  return (
    <AppLayout variant="scroll">
      <div className={cn("flex flex-col gap-6")}>
        <PageHeader title="Dates" description="Everything you have agreed to, with the time left until you meet." />
        <Tabs tabs={tabs} value={activeTab} onChange={setActiveTab} layoutId="dates-tabs" />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === TAB.social ? renderSocial() : renderPlans()}
          </motion.div>
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
