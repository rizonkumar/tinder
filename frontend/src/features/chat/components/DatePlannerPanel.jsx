import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, CalendarHeart, MapPin, Check, Plus, Clock, Coffee, Utensils, Wine, Compass, Info } from "lucide-react";
import { useDatePlanStore } from "../../../store/useDatePlanStore";
import { useAuthStore } from "../../../store/useAuthStore";
import { IconButton } from "../../../components/ui/IconButton";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { Avatar } from "../../../components/ui/Avatar";
import { FIELD_CLASS } from "../../../components/ui/Field";
import { EmptyState } from "../../../components/ui/EmptyState";
import { Spinner } from "../../../components/ui/Skeleton";
import { cn } from "../../../utils/cn";

const CATEGORIES = [
  { name: "Coffee", icon: Coffee },
  { name: "Dinner", icon: Utensils },
  { name: "Drinks", icon: Wine },
  { name: "Outdoor", icon: Compass },
];

const PLAN_STATUS = { planning: "planning", finalized: "finalized" };

const userRefId = (ref) => (typeof ref === "string" ? ref : ref?.id);

function formatPlanDate(date, options) {
  return new Date(date).toLocaleDateString(undefined, options);
}

function VoterAvatars({ me, partner, hasMyVote, hasPartnerVote }) {
  if (!hasMyVote && !hasPartnerVote) return null;
  return (
    <span className="flex -space-x-1.5" aria-label={`${[hasMyVote && "You", hasPartnerVote && partner.name].filter(Boolean).join(" and ")} voted`}>
      {hasMyVote && <Avatar src={me.image} alt="You" size="xs" className="ring-2 ring-surface" />}
      {hasPartnerVote && <Avatar src={partner.image} alt={partner.name} size="xs" className="ring-2 ring-surface" />}
    </span>
  );
}

function PlannerSection({ step, title, description, children }) {
  return (
    <section className="space-y-3">
      <div className="flex items-start gap-2.5">
        <span className="tabular flex size-5 shrink-0 items-center justify-center rounded-full border border-border text-[11px] text-foreground-secondary">
          {step}
        </span>
        <div>
          <h4 className="heading-14 text-foreground">{title}</h4>
          <p className="copy-13 text-foreground-secondary">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function VoteRow({ primary, secondary, proposedBy, hasMyVote, hasPartnerVote, me, partner, onVote }) {
  const isMutual = hasMyVote && hasPartnerVote;
  return (
    <li
      className={cn(
        "flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors",
        isMutual ? "border-success/40 bg-success-surface" : "border-border bg-surface"
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="label-13 truncate text-foreground">{primary}</p>
        <p className="truncate text-xs text-foreground-secondary">{secondary}</p>
        <p className="mt-0.5 text-[11px] text-foreground-muted">Suggested by {proposedBy}</p>
      </div>
      <VoterAvatars me={me} partner={partner} hasMyVote={hasMyVote} hasPartnerVote={hasPartnerVote} />
      <IconButton
        label={hasMyVote ? "Remove your vote" : "Vote for this"}
        size="sm"
        variant={hasMyVote ? "primary" : "outline"}
        onClick={onVote}
      >
        <Check />
      </IconButton>
    </li>
  );
}

function FinalizedPlan({ plan, me, partner }) {
  return (
    <div className="space-y-5 rounded-xl border border-border bg-background-secondary p-5 text-center">
      <div className="flex items-center justify-center -space-x-3">
        <Avatar src={me.image} alt="You" size="lg" className="ring-4 ring-background-secondary" />
        <Avatar src={partner.image} alt={partner.name} size="lg" className="ring-4 ring-background-secondary" />
      </div>
      <div>
        <p className="heading-16 text-foreground">It’s a date</p>
        <p className="copy-13 text-foreground-secondary">Plan locked in with {partner.name}.</p>
      </div>
      <ul className="space-y-2.5 rounded-lg border border-border bg-surface p-3.5 text-left">
        <li className="flex items-start gap-2.5">
          <MapPin size={15} className="mt-0.5 shrink-0 text-foreground-muted" aria-hidden="true" />
          <div className="min-w-0">
            <p className="label-13 text-foreground">{plan.finalVenue?.title}</p>
            <p className="text-xs text-foreground-secondary">{plan.finalVenue?.location}</p>
          </div>
        </li>
        <li className="flex items-start gap-2.5">
          <Clock size={15} className="mt-0.5 shrink-0 text-foreground-muted" aria-hidden="true" />
          <div>
            <p className="label-13 text-foreground">
              {formatPlanDate(plan.finalDateTime?.date, { weekday: "long", month: "long", day: "numeric" })}
            </p>
            <p className="text-xs text-foreground-secondary">at {plan.finalDateTime?.time}</p>
          </div>
        </li>
      </ul>
    </div>
  );
}

export default function DatePlannerPanel({ onClose, matchUser }) {
  const { authUser, socket } = useAuthStore();
  const {
    activeDatePlan,
    isLoadingPlan,
    getActivePlan,
    voteCategory,
    proposeVenue,
    voteVenue,
    proposeDateTime,
    voteDateTime,
    finalizePlan,
    subscribeToDatePlan,
    unsubscribeFromDatePlan,
  } = useDatePlanStore();

  const [venueTitle, setVenueTitle] = useState("");
  const [venueLocation, setVenueLocation] = useState("");
  const [dateValue, setDateValue] = useState("");
  const [timeValue, setTimeValue] = useState("");
  const [isFinalizing, setIsFinalizing] = useState(false);

  useEffect(() => {
    let subscribedId = null;
    if (matchUser?._id) {
      getActivePlan(matchUser._id).then((plan) => {
        if (plan && socket) {
          subscribeToDatePlan(socket, plan.id);
          subscribedId = plan.id;
        }
      });
    }
    return () => {
      if (subscribedId && socket) unsubscribeFromDatePlan(socket);
    };
  }, [matchUser?._id, socket, getActivePlan, subscribeToDatePlan, unsubscribeFromDatePlan]);

  const belongsToMatch = [activeDatePlan?.userA, activeDatePlan?.userB].map(userRefId).includes(matchUser?._id);
  const plan = belongsToMatch ? activeDatePlan : null;
  const voteState = (votes) => ({
    hasMyVote: votes.includes(authUser._id),
    hasPartnerVote: votes.includes(matchUser._id),
  });
  const proposerName = (id) => (id === authUser._id ? "you" : matchUser.name);

  const myCategory = plan?.categoryVotes.find((vote) => vote.userId === authUser._id)?.category;
  const partnerCategory = plan?.categoryVotes.find((vote) => vote.userId === matchUser._id)?.category;
  const mutualVenue = plan?.venueProposals.find((item) => item.votes.includes(authUser._id) && item.votes.includes(matchUser._id));
  const mutualDateTime = plan?.dateTimeProposals.find((item) => item.votes.includes(authUser._id) && item.votes.includes(matchUser._id));
  const canFinalize = !!(mutualVenue && mutualDateTime && plan?.status === PLAN_STATUS.planning);
  const isFinalized = plan?.status === PLAN_STATUS.finalized;

  const handleVenueSubmit = (event) => {
    event.preventDefault();
    if (!venueTitle.trim() || !venueLocation.trim()) return;
    proposeVenue(plan.id, venueTitle.trim(), venueLocation.trim());
    setVenueTitle("");
    setVenueLocation("");
  };

  const handleDateTimeSubmit = (event) => {
    event.preventDefault();
    if (!dateValue || !timeValue) return;
    proposeDateTime(plan.id, dateValue, timeValue);
    setDateValue("");
    setTimeValue("");
  };

  const handleFinalize = async () => {
    if (!canFinalize || isFinalizing) return;
    setIsFinalizing(true);
    await finalizePlan(plan.id, mutualVenue.id, mutualDateTime.id);
    setIsFinalizing(false);
  };

  const renderPlanning = () => (
    <>
      <PlannerSection step={1} title="Pick a vibe" description="You both vote. A shared pick is highlighted.">
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.map(({ name, icon: Icon }) => {
            const mine = myCategory === name;
            const theirs = partnerCategory === name;
            return (
              <button
                key={name}
                type="button"
                aria-pressed={mine}
                onClick={() => voteCategory(plan.id, name)}
                className={cn(
                  "flex h-[4.5rem] flex-col justify-between rounded-lg border p-3 text-left transition-colors focus-ring",
                  mine && theirs
                    ? "border-success/40 bg-success-surface"
                    : mine
                      ? "border-primary bg-surface"
                      : "border-border bg-surface hover:border-border-strong"
                )}
              >
                <span className="flex w-full items-start justify-between">
                  <Icon size={17} className="text-foreground-secondary" aria-hidden="true" />
                  <VoterAvatars me={authUser} partner={matchUser} hasMyVote={mine} hasPartnerVote={theirs} />
                </span>
                <span className="label-13 text-foreground">{name}</span>
              </button>
            );
          })}
        </div>
      </PlannerSection>

      <PlannerSection step={2} title="Where" description="Suggest places and vote on each other’s ideas.">
        <form onSubmit={handleVenueSubmit} className="space-y-2">
          <input
            type="text"
            placeholder="Place name"
            aria-label="Place name"
            value={venueTitle}
            onChange={(event) => setVenueTitle(event.target.value)}
            className={cn(FIELD_CLASS, "h-9")}
          />
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Area or address"
              aria-label="Area or address"
              value={venueLocation}
              onChange={(event) => setVenueLocation(event.target.value)}
              className={cn(FIELD_CLASS, "h-9 min-w-0 flex-1")}
            />
            <IconButton label="Add place" type="submit" variant="primary" disabled={!venueTitle.trim() || !venueLocation.trim()}>
              <Plus />
            </IconButton>
          </div>
        </form>
        {plan.venueProposals.length > 0 && (
          <ul className="space-y-2">
            {plan.venueProposals.map((venue) => (
              <VoteRow
                key={venue.id}
                primary={venue.title}
                secondary={venue.location}
                proposedBy={proposerName(venue.proposedBy)}
                me={authUser}
                partner={matchUser}
                onVote={() => voteVenue(plan.id, venue.id)}
                {...voteState(venue.votes)}
              />
            ))}
          </ul>
        )}
      </PlannerSection>

      <PlannerSection step={3} title="When" description="Add a few options that work for you.">
        <form onSubmit={handleDateTimeSubmit} className="flex gap-2">
          <input
            type="date"
            aria-label="Date"
            value={dateValue}
            onChange={(event) => setDateValue(event.target.value)}
            className={cn(FIELD_CLASS, "h-9 min-w-0 flex-1")}
          />
          <input
            type="time"
            aria-label="Time"
            value={timeValue}
            onChange={(event) => setTimeValue(event.target.value)}
            className={cn(FIELD_CLASS, "h-9 w-28")}
          />
          <IconButton label="Add time" type="submit" variant="primary" disabled={!dateValue || !timeValue}>
            <Plus />
          </IconButton>
        </form>
        {plan.dateTimeProposals.length > 0 && (
          <ul className="space-y-2">
            {plan.dateTimeProposals.map((slot) => (
              <VoteRow
                key={slot.id}
                primary={slot.time}
                secondary={formatPlanDate(slot.date, { weekday: "short", month: "short", day: "numeric" })}
                proposedBy={proposerName(slot.proposedBy)}
                me={authUser}
                partner={matchUser}
                onVote={() => voteDateTime(plan.id, slot.id)}
                {...voteState(slot.votes)}
              />
            ))}
          </ul>
        )}
      </PlannerSection>
    </>
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[60] bg-overlay lg:hidden"
        aria-hidden="true"
      />
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.22, ease: [0.175, 0.885, 0.32, 1.1] }}
        aria-label="Date planner"
        className="fixed inset-y-0 right-0 z-[70] flex w-full flex-col border-l border-border bg-surface shadow-modal sm:w-[24rem] lg:static lg:z-auto lg:w-[22rem] lg:shrink-0 lg:shadow-none"
      >
        <div className="flex h-header shrink-0 items-center justify-between gap-3 border-b border-border px-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <CalendarHeart size={18} className="shrink-0 text-foreground-secondary" aria-hidden="true" />
            <div className="min-w-0">
              <h3 className="heading-14 text-foreground">Date planner</h3>
              <p className="truncate text-xs text-foreground-secondary">Planning with {matchUser?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {plan && <Badge tone={isFinalized ? "success" : "neutral"}>{isFinalized ? "Locked in" : "Planning"}</Badge>}
            <IconButton label="Close planner" size="sm" onClick={onClose}>
              <X />
            </IconButton>
          </div>
        </div>

        <div className="min-h-0 flex-1 space-y-7 overflow-y-auto p-4">
          {!plan && isLoadingPlan ? (
            <div className="flex h-40 items-center justify-center">
              <Spinner label="Loading plan" />
            </div>
          ) : !plan ? (
            <EmptyState compact icon={CalendarHeart} title="Couldn’t load the plan" description="Close the planner and open it again to retry." />
          ) : isFinalized ? (
            <FinalizedPlan plan={plan} me={authUser} partner={matchUser} />
          ) : (
            renderPlanning()
          )}
        </div>

        {plan && !isFinalized && (
          <div className="safe-bottom shrink-0 border-t border-border bg-background-secondary p-4">
            {canFinalize ? (
              <Button className="w-full" onClick={handleFinalize} loading={isFinalizing}>
                <CalendarHeart aria-hidden="true" />
                Lock in the date
              </Button>
            ) : (
              <p className="flex gap-2 text-xs leading-5 text-foreground-secondary">
                <Info size={14} className="mt-0.5 shrink-0 text-foreground-muted" aria-hidden="true" />
                You can lock in the plan once you and {matchUser?.name} vote for the same place and time.
              </p>
            )}
          </div>
        )}
      </motion.aside>
    </>
  );
}
