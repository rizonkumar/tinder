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
      bg: "bg-amber-50 dark:bg-amber-950/20",
      border: "border-amber-200 dark:border-amber-900/50",
      text: "text-amber-600 dark:text-amber-400",
    },
    {
      name: "Dinner",
      icon: Utensils,
      bg: "bg-emerald-50 dark:bg-emerald-950/20",
      border: "border-emerald-200 dark:border-emerald-900/50",
      text: "text-emerald-600 dark:text-emerald-400",
    },
    {
      name: "Drinks",
      icon: Wine,
      bg: "bg-rose-50 dark:bg-rose-950/20",
      border: "border-rose-200 dark:border-rose-900/50",
      text: "text-rose-600 dark:text-rose-400",
    },
    {
      name: "Outdoor",
      icon: Compass,
      bg: "bg-sky-50 dark:bg-sky-950/20",
      border: "border-sky-200 dark:border-sky-900/50",
      text: "text-sky-600 dark:text-sky-400",
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
      className="w-full md:w-[400px] border-l border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col h-full z-40 shadow-xl overflow-hidden font-outfit"
    >
      <div className="p-4 border-b border-slate-100 dark:border-zinc-900/80 flex items-center justify-between shrink-0">
        <div>
          <h3 className="font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
            <CalendarDays size={18} className="text-pink-500" />
            <span>Date Planner</span>
          </h3>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
            Plan your special day with {matchUser?.name}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-slate-50 dark:hover:bg-zinc-900 text-slate-400 dark:text-slate-500 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-6 scrollbar-thin">
        {activeDatePlan.status === "finalized" ? (
          <div className="space-y-6">
            <div className="bg-pink-50/20 dark:bg-pink-950/10 border border-pink-100 dark:border-pink-900/30 rounded-2xl p-6 text-center space-y-4">
              <div className="flex justify-center items-center gap-3">
                <img
                  src={authUser?.image || "/avatar.png"}
                  alt={authUser?.name}
                  className="w-12 h-12 rounded-full border-2 border-white dark:border-zinc-900 object-cover shadow-sm"
                />
                <Heart
                  size={24}
                  className="text-pink-500 fill-pink-500 animate-pulse"
                />
                <img
                  src={matchUser?.image || "/avatar.png"}
                  alt={matchUser?.name}
                  className="w-12 h-12 rounded-full border-2 border-white dark:border-zinc-900 object-cover shadow-sm"
                />
              </div>

              <div>
                <h4 className="font-bold text-slate-800 dark:text-zinc-100 text-lg">
                  It's a Date!
                </h4>
                <p className="text-xs text-pink-500 font-semibold uppercase tracking-wider mt-1">
                  Plan Locked In
                </p>
              </div>

              <div className="border-t border-slate-100 dark:border-zinc-900/60 pt-4 space-y-3 text-left">
                <div className="flex items-start gap-2.5">
                  <MapPin
                    size={15}
                    className="text-slate-400 dark:text-slate-500 shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                      {activeDatePlan.finalVenue?.title}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">
                      {activeDatePlan.finalVenue?.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock
                    size={15}
                    className="text-slate-400 dark:text-slate-500 shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                      {new Date(
                        activeDatePlan.finalDateTime?.date,
                      ).toLocaleDateString(undefined, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">
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
              <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
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
                          ? "border-pink-500 dark:border-pink-500 shadow-sm shadow-pink-500/10 ring-1 ring-pink-500"
                          : isSelectedByMe
                            ? "border-slate-300 dark:border-zinc-700 shadow-sm"
                            : "border-slate-100 dark:border-zinc-900/60 hover:bg-slate-50 dark:hover:bg-zinc-900/50"
                      }`}
                    >
                      <div className="flex justify-between items-start w-full">
                        <Icon size={18} className={c.text} />
                        <div className="flex gap-0.5">
                          {isSelectedByMe && (
                            <img
                              src={authUser?.image || "/avatar.png"}
                              alt="Me"
                              className="w-4 h-4 rounded-full border border-white dark:border-zinc-900 object-cover"
                            />
                          )}
                          {isSelectedByPartner && (
                            <img
                              src={matchUser?.image || "/avatar.png"}
                              alt={matchUser?.name}
                              className="w-4 h-4 rounded-full border border-white dark:border-zinc-900 object-cover"
                            />
                          )}
                        </div>
                      </div>

                      <div className="mt-2">
                        <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                          {c.name}
                        </span>
                        {isMutual && (
                          <span className="block text-[8px] font-bold text-pink-500 uppercase tracking-wide">
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
              <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                2. Venues
              </h4>

              <form
                onSubmit={handleVenueSubmit}
                className="flex flex-col gap-2 bg-slate-50 dark:bg-zinc-900/40 p-3 rounded-xl border border-slate-100 dark:border-zinc-900/50"
              >
                <input
                  type="text"
                  placeholder="Venue name (e.g. Starbucks)"
                  value={venueTitle}
                  onChange={(e) => setVenueTitle(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 focus:outline-none focus:border-pink-500 transition-colors"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Location/Street"
                    value={venueLocation}
                    onChange={(e) => setVenueLocation(e.target.value)}
                    className="flex-grow px-2.5 py-1.5 text-xs rounded-lg border border-slate-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 focus:outline-none focus:border-pink-500 transition-colors"
                  />
                  <button
                    type="submit"
                    className="h-8 w-8 shrink-0 flex items-center justify-center rounded-lg bg-slate-800 dark:bg-zinc-800 text-white hover:bg-pink-500 dark:hover:bg-pink-500 transition-colors"
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
                          ? "border-pink-500/80 bg-pink-50/10 dark:bg-pink-950/5 shadow-sm"
                          : hasMyVote
                            ? "border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-950"
                            : "border-slate-100 dark:border-zinc-900/60 bg-white dark:bg-zinc-950"
                      }`}
                    >
                      <div className="flex-grow mr-2 overflow-hidden">
                        <h5 className="text-xs font-bold text-slate-800 dark:text-zinc-200 truncate">
                          {v.title}
                        </h5>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate flex items-center gap-1">
                          <MapPin size={10} />
                          <span>{v.location}</span>
                        </p>
                        <span className="block text-[8px] text-slate-400 dark:text-slate-500 font-medium mt-1">
                          Proposed by {isCreatorMe ? "You" : matchUser.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {hasMyVote && (
                            <img
                              src={authUser?.image || "/avatar.png"}
                              alt="Me"
                              className="w-4 h-4 rounded-full border border-white dark:border-zinc-900 object-cover"
                            />
                          )}
                          {hasPartnerVote && (
                            <img
                              src={matchUser?.image || "/avatar.png"}
                              alt={matchUser?.name}
                              className="w-4 h-4 rounded-full border border-white dark:border-zinc-900 object-cover"
                            />
                          )}
                        </div>

                        <button
                          onClick={() => voteVenue(activeDatePlan.id, v.id)}
                          className={`h-7 w-7 rounded-lg flex items-center justify-center border transition-all ${
                            hasMyVote
                              ? "bg-pink-500 border-pink-500 text-white shadow-sm"
                              : "border-slate-200 dark:border-zinc-800 text-slate-400 dark:text-slate-500 hover:border-pink-500 dark:hover:border-pink-500 hover:text-pink-500"
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
              <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                3. Date & Time
              </h4>

              <form
                onSubmit={handleDateTimeSubmit}
                className="flex gap-2 bg-slate-50 dark:bg-zinc-900/40 p-3 rounded-xl border border-slate-100 dark:border-zinc-900/50"
              >
                <input
                  type="date"
                  value={dateVal}
                  onChange={(e) => setDateVal(e.target.value)}
                  className="flex-grow px-2 py-1 text-xs rounded-lg border border-slate-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 focus:outline-none focus:border-pink-500 transition-colors"
                />
                <input
                  type="time"
                  value={timeVal}
                  onChange={(e) => setTimeVal(e.target.value)}
                  className="px-2 py-1 text-xs rounded-lg border border-slate-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 focus:outline-none focus:border-pink-500 transition-colors"
                />
                <button
                  type="submit"
                  className="h-8 w-8 shrink-0 flex items-center justify-center rounded-lg bg-slate-800 dark:bg-zinc-800 text-white hover:bg-pink-500 dark:hover:bg-pink-500 transition-colors"
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
                          ? "border-pink-500/80 bg-pink-50/10 dark:bg-pink-950/5 shadow-sm"
                          : hasMyVote
                            ? "border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-950"
                            : "border-slate-100 dark:border-zinc-900/60 bg-white dark:bg-zinc-950"
                      }`}
                    >
                      <div className="flex-grow mr-2 overflow-hidden">
                        <h5 className="text-xs font-bold text-slate-800 dark:text-zinc-200 truncate flex items-center gap-1">
                          <Clock
                            size={12}
                            className="text-slate-400 dark:text-slate-500"
                          />
                          <span>{t.time}</span>
                        </h5>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                          {new Date(t.date).toLocaleDateString(undefined, {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        <span className="block text-[8px] text-slate-400 dark:text-slate-500 font-medium mt-1">
                          Proposed by {isCreatorMe ? "You" : matchUser.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {hasMyVote && (
                            <img
                              src={authUser?.image || "/avatar.png"}
                              alt="Me"
                              className="w-4 h-4 rounded-full border border-white dark:border-zinc-900 object-cover"
                            />
                          )}
                          {hasPartnerVote && (
                            <img
                              src={matchUser?.image || "/avatar.png"}
                              alt={matchUser?.name}
                              className="w-4 h-4 rounded-full border border-white dark:border-zinc-900 object-cover"
                            />
                          )}
                        </div>

                        <button
                          onClick={() => voteDateTime(activeDatePlan.id, t.id)}
                          className={`h-7 w-7 rounded-lg flex items-center justify-center border transition-all ${
                            hasMyVote
                              ? "bg-pink-500 border-pink-500 text-white shadow-sm"
                              : "border-slate-200 dark:border-zinc-800 text-slate-400 dark:text-slate-500 hover:border-pink-500 dark:hover:border-pink-500 hover:text-pink-500"
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
        <div className="p-4 border-t border-slate-100 dark:border-zinc-900/80 bg-slate-50/50 dark:bg-zinc-900/20 shrink-0">
          {canFinalize ? (
            <button
              onClick={handleFinalize}
              disabled={isFinalizing}
              className="w-full py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs shadow-md shadow-pink-500/20 hover:shadow-pink-500/30 transition-all flex items-center justify-center gap-2"
            >
              <Heart size={14} className="fill-white" />
              <span>
                {isFinalizing ? "Locking in plan..." : "Lock in Date! ✨"}
              </span>
            </button>
          ) : (
            <div className="flex gap-2 p-2.5 rounded-xl bg-slate-100 dark:bg-zinc-900/80 text-[10px] text-slate-500 dark:text-slate-400 font-semibold border border-slate-200/50 dark:border-zinc-800/80">
              <AlertCircle
                size={14}
                className="text-slate-400 dark:text-slate-500 shrink-0 mt-0.5"
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
