import { useEffect, useState } from "react";
import { useDatePlanStore } from "../../store/useDatePlanStore";
import { useAuthStore } from "../../store/useAuthStore";
import Sidebar from "../../components/Sidebar";
import { Header } from "../../components/Header";
import {
  CalendarDays, MapPin, Clock, Coffee, Utensils, Wine, Compass
} from "lucide-react";
import { motion } from "framer-motion";

function CountdownTimer({ targetDateTime }) {
  const [timeLeft, setTimeLeft] = useState(() => {
    const target = new Date(`${targetDateTime.date}T${targetDateTime.time}`);
    const now = new Date();
    const diff = target.getTime() - now.getTime();
    if (diff <= 0) return null;
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60)
    };
  });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(`${targetDateTime.date}T${targetDateTime.time}`);
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      if (diff <= 0) return null;
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60)
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTime());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDateTime]);

  if (!timeLeft) {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-500 text-white text-[10px] font-bold uppercase tracking-wider">
        Happening Now! ❤️
      </span>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-2 text-center max-w-[280px]">
      <div className="bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-2 rounded-xl">
        <span className="block text-sm font-black text-slate-800 dark:text-zinc-100">{timeLeft.days}</span>
        <span className="text-[8px] uppercase font-bold text-slate-400 dark:text-slate-500">Days</span>
      </div>
      <div className="bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-2 rounded-xl">
        <span className="block text-sm font-black text-slate-880 dark:text-zinc-100">{timeLeft.hours}</span>
        <span className="text-[8px] uppercase font-bold text-slate-400 dark:text-slate-500">Hours</span>
      </div>
      <div className="bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-2 rounded-xl">
        <span className="block text-sm font-black text-slate-80 border-slate-100 dark:text-zinc-100">{timeLeft.minutes}</span>
        <span className="text-[8px] uppercase font-bold text-slate-400 dark:text-slate-500">Mins</span>
      </div>
      <div className="bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-2 rounded-xl">
        <span className="block text-sm font-black text-slate-80 border-slate-100 dark:text-zinc-100">{timeLeft.seconds}</span>
        <span className="text-[8px] uppercase font-bold text-slate-400 dark:text-slate-500">Secs</span>
      </div>
    </div>
  );
}

export default function DateDashboard() {
  const { authUser } = useAuthStore();
  const { upcomingDates, getUpcomingDates, isLoadingUpcoming } = useDatePlanStore();

  useEffect(() => {
    getUpcomingDates();
  }, [getUpcomingDates]);

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Coffee": return Coffee;
      case "Dinner": return Utensils;
      case "Drinks": return Wine;
      case "Outdoor": return Compass;
      default: return CalendarDays;
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col lg:flex-row bg-slate-50 dark:bg-zinc-950 transition-colors duration-300 font-sans">
      <Sidebar />
      <div className="flex flex-grow flex-col h-full overflow-hidden">
        <Header />

        <main className="relative flex-grow h-[calc(100vh-72px)] overflow-y-auto p-4 md:p-8 bg-slate-50/50 dark:bg-zinc-950/20 font-outfit">
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <h1 className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-3xl font-black tracking-tight text-transparent uppercase flex items-center gap-2">
                <CalendarDays size={28} className="text-pink-500 stroke-[2.5]" />
                <span>Date Dashboard</span>
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                Keep track of your upcoming collaborative dates and countdowns.
              </p>
            </div>

            {isLoadingUpcoming ? (
              <div className="flex h-64 items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="h-10 w-10 rounded-full border-2 border-pink-500 border-t-transparent"
                />
              </div>
            ) : upcomingDates.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800 rounded-3xl h-64">
                <div className="p-3 rounded-full bg-slate-50 dark:bg-zinc-850 mb-3 text-slate-400">
                  <CalendarDays size={24} />
                </div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200">No Upcoming Dates</h3>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 max-w-[240px]">
                  Use the Date Planner inside any chat room to collaboratively plan a date and lock it in!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingDates.map((d) => {
                  const matchPartner = d.userA.id === authUser._id ? d.userB : d.userA;
                  const votedCategory = d.categoryVotes.find(v => v.userId === authUser._id)?.category || d.categoryVotes[0]?.category;
                  const CategoryIcon = getCategoryIcon(votedCategory);

                  return (
                    <motion.div
                      key={d.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={matchPartner.image || "/avatar.png"}
                            alt={matchPartner.name}
                            className="w-12 h-12 rounded-full border border-slate-100 dark:border-zinc-800 object-cover shadow-sm"
                          />
                          <div>
                            <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1">
                              <span>Date with {matchPartner.name}</span>
                            </h3>
                            {votedCategory && (
                              <span className="inline-flex items-center gap-1 mt-1 text-[9px] uppercase font-bold text-pink-500 bg-pink-50/50 dark:bg-pink-950/20 px-2 py-0.5 rounded-md border border-pink-100/50 dark:border-pink-900/30">
                                <CategoryIcon size={10} />
                                <span>{votedCategory}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="my-4 border-t border-slate-100 dark:border-zinc-900/60 pt-4 space-y-2">
                        <div className="flex items-start gap-2.5">
                          <MapPin size={14} className="text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                              {d.finalVenue?.title}
                            </p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500">
                              {d.finalVenue?.location}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <Clock size={14} className="text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                              {new Date(d.finalDateTime?.date).toLocaleDateString(undefined, {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500">
                              at {d.finalDateTime?.time}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-slate-100 dark:border-zinc-900/60 pt-4 flex flex-col gap-2">
                        <span className="text-[8px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Countdown</span>
                        <CountdownTimer targetDateTime={d.finalDateTime} />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
