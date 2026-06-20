import { useState, useEffect } from "react";
import { useDatePlanStore } from "../../../store/useDatePlanStore";
import { useAuthStore } from "../../../store/useAuthStore";
import { motion } from "framer-motion";
import {
  X,
  CalendarDays,
  MapPin,
  Check,
  Plus,
  Clock,
  Coffee,
  Utensils,
  Wine,
  Compass,
  AlertCircle,
  Heart,
} from "lucide-react";

export default function DatePlannerPanel({ isOpen, onClose, matchUser }) {
  const { authUser, socket } = useAuthStore();
  const {
    activeDatePlan,
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
  const [dateVal, setDateVal] = useState("");
  const [timeVal, setTimeVal] = useState("");
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
      if (subscribedId && socket) {
        unsubscribeFromDatePlan(socket);
      }
    };
  }, [
    matchUser?._id,
    socket,
    getActivePlan,
    subscribeToDatePlan,
    unsubscribeFromDatePlan,
  ]);

  if (!isOpen || !activeDatePlan) return null;

  const myCategoryVote = activeDatePlan.categoryVotes.find(
    (v) => v.userId === authUser._id,
  )?.category;
  const partnerCategoryVote = activeDatePlan.categoryVotes.find(
    (v) => v.userId === matchUser._id,
  )?.category;

  const categories = [
    {
      name: "Coffee",
      icon: Coffee,
      bg: "bg-background-secondary",
      border: "border-border",
      text: "text-foreground-secondary",
    },
    {
      name: "Dinner",
      icon: Utensils,
      bg: "bg-background-secondary",
      border: "border-border",
      text: "text-foreground-secondary",
    },
    {
      name: "Drinks",
      icon: Wine,
      bg: "bg-background-secondary",
      border: "border-border",
      text: "text-foreground-secondary",
    },
    {
      name: "Outdoor",
      icon: Compass,
      bg: "bg-background-secondary",
      border: "border-border",
      text: "text-foreground-secondary",
    },
  ];

  const mutualVenue = activeDatePlan.venueProposals.find(
    (v) => v.votes.includes(authUser._id) && v.votes.includes(matchUser._id),
  );

  const mutualDateTime = activeDatePlan.dateTimeProposals.find(
    (t) => t.votes.includes(authUser._id) && t.votes.includes(matchUser._id),
  );

  const canFinalize =
    mutualVenue && mutualDateTime && activeDatePlan.status === "planning";

  const handleVenueSubmit = (e) => {
    e.preventDefault();
    if (!venueTitle.trim() || !venueLocation.trim()) return;
    proposeVenue(activeDatePlan.id, venueTitle.trim(), venueLocation.trim());
    setVenueTitle("");
    setVenueLocation("");
  };

  const handleDateTimeSubmit = (e) => {
    e.preventDefault();
    if (!dateVal || !timeVal) return;
    proposeDateTime(activeDatePlan.id, dateVal, timeVal);
    setDateVal("");
    setTimeVal("");
  };

  const handleFinalize = async () => {
    if (!canFinalize || isFinalizing) return;
    setIsFinalizing(true);
    await finalizePlan(activeDatePlan.id, mutualVenue.id, mutualDateTime.id);
    setIsFinalizing(false);
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "tween", duration: 0.3 }}
      className="w-full md:w-[400px] border-l border-border bg-background flex flex-col h-full z-40 shadow-card overflow-hidden font-outfit"
    >
      <div className="p-4 border-b border-border flex items-center justify-between shrink-0">
        <div>
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <CalendarDays size={18} className="text-accent" />
            <span>Date Planner</span>
          </h3>
          <p className="text-[11px] text-foreground-muted font-medium">
            Plan your special day with {matchUser?.name}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-surface-hover text-foreground-muted transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-6 scrollbar-thin">
        {activeDatePlan.status === "finalized" ? (
          <div className="space-y-6">
            <div className="bg-background-secondary border border-border rounded-2xl p-6 text-center space-y-4">
              <div className="flex justify-center items-center gap-3">
                <img
                  src={authUser?.image || "/avatar.png"}
                  alt={authUser?.name}
                  className="w-12 h-12 rounded-full border-2 border-background object-cover shadow-card"
                />
                <Heart
                  size={24}
                  className="text-accent fill-accent animate-pulse"
                />
                <img
                  src={matchUser?.image || "/avatar.png"}
                  alt={matchUser?.name}
                  className="w-12 h-12 rounded-full border-2 border-background object-cover shadow-card"
                />
              </div>

              <div>
                <h4 className="font-bold text-foreground text-lg">
                  It's a Date!
                </h4>
                <p className="text-xs text-accent font-semibold uppercase tracking-wider mt-1">
                  Plan Locked In
                </p>
              </div>

              <div className="border-t border-border pt-4 space-y-3 text-left">
                <div className="flex items-start gap-2.5">
                  <MapPin
                    size={15}
                    className="text-foreground-muted shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-xs font-bold text-foreground-secondary">
                      {activeDatePlan.finalVenue?.title}
                    </p>
                    <p className="text-[10px] text-foreground-muted">
                      {activeDatePlan.finalVenue?.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock
                    size={15}
                    className="text-foreground-muted shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-xs font-bold text-foreground-secondary">
                      {new Date(
                        activeDatePlan.finalDateTime?.date,
                      ).toLocaleDateString(undefined, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-[10px] text-foreground-muted">
                      at {activeDatePlan.finalDateTime?.time}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground-muted uppercase tracking-wider">
                1. Choose a Vibe
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((c) => {
                  const Icon = c.icon;
                  const isSelectedByMe = myCategoryVote === c.name;
                  const isSelectedByPartner = partnerCategoryVote === c.name;
                  const isMutual = isSelectedByMe && isSelectedByPartner;

                  return (
                    <button
                      key={c.name}
                      onClick={() => voteCategory(activeDatePlan.id, c.name)}
                      className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between h-20 ${c.bg} ${
                        isMutual
                          ? "border-border-strong shadow-card ring-1 ring-ring"
                          : isSelectedByMe
                            ? "border-border-strong shadow-card"
                            : "border-border hover:bg-surface-hover"
                      }`}
                    >
                      <div className="flex justify-between items-start w-full">
                        <Icon size={18} className={c.text} />
                        <div className="flex gap-0.5">
                          {isSelectedByMe && (
                            <img
                              src={authUser?.image || "/avatar.png"}
                              alt="Me"
                              className="w-4 h-4 rounded-full border border-background object-cover"
                            />
                          )}
                          {isSelectedByPartner && (
                            <img
                              src={matchUser?.image || "/avatar.png"}
                              alt={matchUser?.name}
                              className="w-4 h-4 rounded-full border border-background object-cover"
                            />
                          )}
                        </div>
                      </div>

                      <div className="mt-2">
                        <span className="text-xs font-bold text-foreground">
                          {c.name}
                        </span>
                        {isMutual && (
                          <span className="block text-[8px] font-bold text-accent uppercase tracking-wide">
                            Mutual match!
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground-muted uppercase tracking-wider">
                2. Venues
              </h4>

              <form
                onSubmit={handleVenueSubmit}
                className="flex flex-col gap-2 bg-background-secondary p-3 rounded-xl border border-border"
              >
                <input
                  type="text"
                  placeholder="Venue name (e.g. Starbucks)"
                  value={venueTitle}
                  onChange={(e) => setVenueTitle(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-border bg-background text-foreground focus-ring transition-colors"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Location/Street"
                    value={venueLocation}
                    onChange={(e) => setVenueLocation(e.target.value)}
                    className="flex-grow px-2.5 py-1.5 text-xs rounded-lg border border-border bg-background text-foreground focus-ring transition-colors"
                  />
                  <button
                    type="submit"
                    className="h-8 w-8 shrink-0 flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </form>

              <div className="space-y-2">
                {activeDatePlan.venueProposals.map((v) => {
                  const hasMyVote = v.votes.includes(authUser._id);
                  const hasPartnerVote = v.votes.includes(matchUser._id);
                  const isMutual = hasMyVote && hasPartnerVote;
                  const isCreatorMe = v.proposedBy === authUser._id;

                  return (
                    <div
                      key={v.id}
                      className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                        isMutual
                          ? "border-border-strong bg-background-secondary shadow-card ring-1 ring-ring"
                          : hasMyVote
                            ? "border-border-strong bg-background"
                            : "border-border bg-background"
                      }`}
                    >
                      <div className="flex-grow mr-2 overflow-hidden">
                        <h5 className="text-xs font-bold text-foreground truncate">
                          {v.title}
                        </h5>
                        <p className="text-[10px] text-foreground-muted truncate flex items-center gap-1">
                          <MapPin size={10} />
                          <span>{v.location}</span>
                        </p>
                        <span className="block text-[8px] text-foreground-muted font-medium mt-1">
                          Proposed by {isCreatorMe ? "You" : matchUser.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {hasMyVote && (
                            <img
                              src={authUser?.image || "/avatar.png"}
                              alt="Me"
                              className="w-4 h-4 rounded-full border border-background object-cover"
                            />
                          )}
                          {hasPartnerVote && (
                            <img
                              src={matchUser?.image || "/avatar.png"}
                              alt={matchUser?.name}
                              className="w-4 h-4 rounded-full border border-background object-cover"
                            />
                          )}
                        </div>

                        <button
                          onClick={() => voteVenue(activeDatePlan.id, v.id)}
                          className={`h-7 w-7 rounded-lg flex items-center justify-center border transition-all ${
                            hasMyVote
                              ? "bg-accent border-accent text-accent-foreground shadow-card"
                              : "border-border text-foreground-muted hover:border-border-strong hover:text-accent"
                          }`}
                        >
                          <Check size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground-muted uppercase tracking-wider">
                3. Date & Time
              </h4>

              <form
                onSubmit={handleDateTimeSubmit}
                className="flex gap-2 bg-background-secondary p-3 rounded-xl border border-border"
              >
                <input
                  type="date"
                  value={dateVal}
                  onChange={(e) => setDateVal(e.target.value)}
                  className="flex-grow px-2 py-1 text-xs rounded-lg border border-border bg-background text-foreground focus-ring transition-colors"
                />
                <input
                  type="time"
                  value={timeVal}
                  onChange={(e) => setTimeVal(e.target.value)}
                  className="px-2 py-1 text-xs rounded-lg border border-border bg-background text-foreground focus-ring transition-colors"
                />
                <button
                  type="submit"
                  className="h-8 w-8 shrink-0 flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover transition-colors"
                >
                  <Plus size={14} />
                </button>
              </form>

              <div className="space-y-2">
                {activeDatePlan.dateTimeProposals.map((t) => {
                  const hasMyVote = t.votes.includes(authUser._id);
                  const hasPartnerVote = t.votes.includes(matchUser._id);
                  const isMutual = hasMyVote && hasPartnerVote;
                  const isCreatorMe = t.proposedBy === authUser._id;

                  return (
                    <div
                      key={t.id}
                      className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                        isMutual
                          ? "border-border-strong bg-background-secondary shadow-card ring-1 ring-ring"
                          : hasMyVote
                            ? "border-border-strong bg-background"
                            : "border-border bg-background"
                      }`}
                    >
                      <div className="flex-grow mr-2 overflow-hidden">
                        <h5 className="text-xs font-bold text-foreground truncate flex items-center gap-1">
                          <Clock
                            size={12}
                            className="text-foreground-muted"
                          />
                          <span>{t.time}</span>
                        </h5>
                        <p className="text-[10px] text-foreground-muted truncate mt-0.5">
                          {new Date(t.date).toLocaleDateString(undefined, {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        <span className="block text-[8px] text-foreground-muted font-medium mt-1">
                          Proposed by {isCreatorMe ? "You" : matchUser.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {hasMyVote && (
                            <img
                              src={authUser?.image || "/avatar.png"}
                              alt="Me"
                              className="w-4 h-4 rounded-full border border-background object-cover"
                            />
                          )}
                          {hasPartnerVote && (
                            <img
                              src={matchUser?.image || "/avatar.png"}
                              alt={matchUser?.name}
                              className="w-4 h-4 rounded-full border border-background object-cover"
                            />
                          )}
                        </div>

                        <button
                          onClick={() => voteDateTime(activeDatePlan.id, t.id)}
                          className={`h-7 w-7 rounded-lg flex items-center justify-center border transition-all ${
                            hasMyVote
                              ? "bg-accent border-accent text-accent-foreground shadow-card"
                              : "border-border text-foreground-muted hover:border-border-strong hover:text-accent"
                          }`}
                        >
                          <Check size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {activeDatePlan.status !== "finalized" && (
        <div className="p-4 border-t border-border bg-background-secondary shrink-0">
          {canFinalize ? (
            <button
              onClick={handleFinalize}
              disabled={isFinalizing}
              className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs shadow-card transition-all flex items-center justify-center gap-2"
            >
              <Heart size={14} className="fill-current" />
              <span>
                {isFinalizing ? "Locking in plan..." : "Lock in Date! ✨"}
              </span>
            </button>
          ) : (
            <div className="flex gap-2 p-2.5 rounded-xl bg-gray-100 text-[10px] text-foreground-secondary font-semibold border border-border">
              <AlertCircle
                size={14}
                className="text-foreground-muted shrink-0 mt-0.5"
              />
              <span>
                To lock in plans, both you and {matchUser?.name} must vote for
                the same venue and date-time proposal.
              </span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
