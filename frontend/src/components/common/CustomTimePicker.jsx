import { useState, useRef } from "react";
import { Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { parseTime } from "../../utils/dateUtils";
import useClickOutside from "../../hooks/useClickOutside";

export default function CustomTimePicker({
  value,
  onChange,
  placeholder = "Select Time",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const { hour, minute, period } = parseTime(value);

  useClickOutside(containerRef, () => setIsOpen(false));

  const handleSelect = (newHour, newMinute, newPeriod) => {
    const formatted = `${newHour}:${newMinute} ${newPeriod}`;
    onChange(formatted);
  };

  const hours = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0"),
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0"),
  );
  const periods = ["AM", "PM"];

  return (
    <div ref={containerRef} className="relative w-full select-none">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full text-xs rounded-xl border px-3.5 py-3 cursor-pointer transition-all duration-200 font-sans ${
          isOpen
            ? "border-pink-500 bg-white dark:bg-zinc-900 shadow-sm ring-1 ring-pink-500/15"
            : "border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-slate-800 dark:text-zinc-150 hover:border-slate-300 dark:hover:border-zinc-700"
        }`}
      >
        <span
          className={
            value
              ? "text-slate-800 dark:text-zinc-100 font-semibold"
              : "text-slate-400 dark:text-zinc-500 font-medium"
          }
        >
          {value || placeholder}
        </span>
        <Clock
          size={14}
          className={`transition-colors duration-200 ${isOpen ? "text-pink-500" : "text-slate-400 dark:text-zinc-500"}`}
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="absolute top-full mt-2 left-0 right-0 sm:right-auto sm:w-[280px] z-[260] bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-lg rounded-2xl p-4 flex flex-col font-sans h-[240px]"
          >
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500 text-center mb-3 shrink-0 select-none font-outfit">
              Select Time
            </div>

            <div className="relative flex flex-grow overflow-hidden gap-1.5 text-center h-full">
              <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-white dark:from-zinc-900 to-transparent pointer-events-none z-10" />
              <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-white dark:from-zinc-900 to-transparent pointer-events-none z-10" />

              {/* Hours */}
              <div className="flex-1 overflow-y-auto pr-0.5 space-y-0.5 scrollbar-none border-r border-slate-100 dark:border-zinc-800 pb-3 pt-1.5">
                {hours.map((h) => {
                  const isSel = h === hour;
                  return (
                    <button
                      key={h}
                      type="button"
                      onClick={() => handleSelect(h, minute, period)}
                      className={`w-full py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        isSel
                          ? "bg-pink-500 text-white"
                          : "text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-800 dark:hover:text-zinc-200"
                      }`}
                    >
                      {h}
                    </button>
                  );
                })}
              </div>

              {/* Minutes */}
              <div className="flex-1 overflow-y-auto pr-0.5 space-y-0.5 scrollbar-none border-r border-slate-100 dark:border-zinc-800 pb-3 pt-1.5">
                {minutes.map((m) => {
                  const isSel = m === minute;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => handleSelect(hour, m, period)}
                      className={`w-full py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        isSel
                          ? "bg-pink-500 text-white"
                          : "text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-800 dark:hover:text-zinc-200"
                      }`}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>

              {/* AM/PM */}
              <div className="flex-1 overflow-y-auto space-y-0.5 pb-3 pt-1.5 scrollbar-none">
                {periods.map((p) => {
                  const isSel = p === period;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handleSelect(hour, minute, p)}
                      className={`w-full py-2.5 text-xs font-semibold rounded-lg transition-all ${
                        isSel
                          ? "bg-pink-500 text-white"
                          : "text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-800 dark:hover:text-zinc-200"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-2.5 shrink-0 pt-2.5 border-t border-slate-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full py-2 bg-pink-500 hover:bg-pink-600 active:bg-pink-700 text-white text-[10px] font-bold rounded-xl transition-colors uppercase tracking-widest font-outfit"
              >
                Apply Time
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
